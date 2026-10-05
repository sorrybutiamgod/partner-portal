import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';
import { sendTelegramNotification, formatOrderTelegramMessage } from '@/lib/telegram';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const partnerId = searchParams.get('partnerId');
    const role = searchParams.get('role');

    const db = getDb();
    let orders = db.orders || [];

    if (role !== 'admin' && partnerId) {
      orders = orders.filter(o => o.partnerId === partnerId);
    }

    // Sort descending by date
    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      partner,
      cartItems,
      materialId,
      hingesId,
      handleId,
      comment,
      deliveryAddress
    } = body;

    if (!cartItems || Object.keys(cartItems).length === 0) {
      return NextResponse.json({ success: false, error: 'Корзина заказа пуста' }, { status: 400 });
    }

    const db = getDb();
    const modulesMap = new Map(db.modules.map(m => [m.id, m]));
    const materialsMap = new Map(db.materials.map(m => [m.id, m]));
    const hardwareMap = new Map(db.hardware.map(h => [h.id, h]));

    const selectedMaterial = materialsMap.get(materialId) || db.materials[0];
    const selectedHinges = hardwareMap.get(hingesId) || db.hardware.find(h => h.category === 'hinges');
    const selectedHandle = hardwareMap.get(handleId) || db.hardware.find(h => h.category === 'handles');

    // Build items breakdown
    const items = [];
    let totalModulesCount = 0;
    let modulesBaseSum = 0;

    for (const [modId, qty] of Object.entries(cartItems)) {
      const quantity = parseInt(qty, 10);
      if (quantity > 0) {
        const mod = modulesMap.get(modId);
        if (mod) {
          const lineTotal = mod.basePrice * quantity;
          totalModulesCount += quantity;
          modulesBaseSum += lineTotal;
          items.push({
            moduleId: mod.id,
            article: mod.article,
            name: mod.name,
            category: mod.category,
            categoryName: mod.categoryName,
            width: mod.width,
            height: mod.height,
            depth: mod.depth,
            quantity,
            unitBasePrice: mod.basePrice,
            totalBasePrice: lineTotal
          });
        }
      }
    }

    if (items.length === 0) {
      return NextResponse.json({ success: false, error: 'Не выбрано ни одного модуля' }, { status: 400 });
    }

    // Material calculations: multiplier applied or extra per module
    const materialMultiplier = selectedMaterial?.multiplier || 1.0;
    const materialExtraSum = (selectedMaterial?.extraCostPerModule || 0) * totalModulesCount;
    const hingesExtraSum = (selectedHinges?.pricePerUnit || 0) * totalModulesCount;
    const handlesExtraSum = (selectedHandle?.pricePerUnit || 0) * totalModulesCount;

    // Subtotal = (modulesBaseSum * materialMultiplier) + (materialExtraSum + hingesExtraSum + handlesExtraSum)
    const baseWithMaterial = Math.round(modulesBaseSum * materialMultiplier);
    const subtotal = baseWithMaterial + hingesExtraSum + handlesExtraSum;

    // Partner discount
    const discountPercent = partner?.discountPercent || 0;
    const discountSum = Math.round((subtotal * discountPercent) / 100);
    const finalTotal = subtotal - discountSum;
    const vatRate = db.settings?.invoiceVatRate || 20;
    const vatSum = Math.round((finalTotal * vatRate / (100 + vatRate)) * 100) / 100;

    const nextOrderNum = (db.orders?.length || 0) + 39;
    const orderId = `ORD-2026-${String(nextOrderNum).padStart(4, '0')}`;
    const invoiceNumber = `СФ-2026/${String(nextOrderNum).padStart(4, '0')}`;

    const newOrder = {
      id: orderId,
      orderNumber: nextOrderNum,
      createdAt: new Date().toISOString(),
      partnerId: partner?.id || 'usr_guest',
      partnerName: partner?.companyName || partner?.name || 'Партнёр фабрики',
      partnerPhone: partner?.phone || '',
      partnerEmail: partner?.email || '',
      partnerInn: partner?.inn || '',
      deliveryAddress: deliveryAddress || partner?.deliveryAddress || 'Самовывоз со склада',
      status: 'new',
      statusLabel: 'Новый заказ',
      comment: comment || '',
      items,
      material: {
        id: selectedMaterial?.id,
        name: selectedMaterial?.name,
        code: selectedMaterial?.code,
        multiplier: selectedMaterial?.multiplier,
        extraCostPerModule: selectedMaterial?.extraCostPerModule
      },
      hinges: {
        id: selectedHinges?.id,
        name: selectedHinges?.name,
        pricePerUnit: selectedHinges?.pricePerUnit
      },
      handle: {
        id: selectedHandle?.id,
        name: selectedHandle?.name,
        pricePerUnit: selectedHandle?.pricePerUnit
      },
      summary: {
        totalModulesCount,
        modulesBaseSum,
        materialMultiplier,
        materialExtraSum,
        hingesExtraSum,
        handlesExtraSum,
        subtotal,
        discountPercent,
        discountSum,
        finalTotal,
        vatSum
      },
      invoiceNumber
    };

    db.orders = db.orders || [];
    db.orders.unshift(newOrder);
    saveDb(db);

    // Telegram Notification
    let telegramResult = null;
    try {
      const telegramMessage = formatOrderTelegramMessage(newOrder, db.company);
      const botToken = db.settings?.telegramBotToken || process.env.TELEGRAM_BOT_TOKEN;
      const chatId = db.settings?.telegramChatId || process.env.TELEGRAM_CHAT_ID;

      telegramResult = await sendTelegramNotification({
        token: botToken,
        chatId: chatId,
        text: telegramMessage
      });
    } catch (telegramErr) {
      console.warn("Telegram dispatch attempt encountered:", telegramErr);
      telegramResult = { success: false, error: telegramErr.message, simulated: true };
    }

    return NextResponse.json({
      success: true,
      order: newOrder,
      telegram: telegramResult,
      message: `Заказ #${orderId} успешно оформлен! Счёт-фактура ${invoiceNumber} сформирован.`
    });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
