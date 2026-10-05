import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { sendTelegramNotification } from '@/lib/telegram';

export async function POST(request) {
  try {
    const body = await request.json();
    const db = getDb();

    const botToken = body.botToken || db.settings?.telegramBotToken;
    const chatId = body.chatId || db.settings?.telegramChatId;

    if (!botToken || !chatId) {
      return NextResponse.json({
        success: false,
        error: 'Укажите Telegram Bot Token и Chat ID для отправки теста'
      }, { status: 400 });
    }

    const testMessage = `🤖 <b>ТЕСТОВОЕ УВЕДОМЛЕНИЕ: ЛИЧНЫЙ КАБИНЕТ МОДУЛЬПРО</b>
✅ <i>Связь с сервером фабрики успешно установлена!</i>

При оформлении каждого нового заказа партнёром сюда мгновенно будут поступать:
• Номер заказа и дата
• Название партнёра и контактный телефон
• Адрес доставки
• Список модулей с размерами и количеством
• Выбранный материал фасадов и фурнитура
• Итоговая стоимость и номер счёта-фактуры.

Время проверки: ${new Date().toLocaleTimeString('ru-RU')}`;

    const res = await sendTelegramNotification({
      token: botToken,
      chatId: chatId,
      text: testMessage
    });

    if (res.success) {
      return NextResponse.json({
        success: true,
        message: 'Тестовое сообщение успешно отправлено в Telegram!'
      });
    } else {
      return NextResponse.json({
        success: false,
        error: res.error || 'Не удалось отправить сообщение в Telegram. Проверьте Bot Token и Chat ID.'
      }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
