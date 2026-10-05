/**
 * Telegram Notification Dispatcher
 * Sends instant notifications to manager / factory administrator
 */

export async function sendTelegramNotification({ token, chatId, text }) {
  if (!token || !chatId) {
    return {
      success: false,
      simulated: true,
      reason: "Telegram Bot Token или Chat ID не настроены. Уведомление смоделировано в системе."
    };
  }

  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML'
      })
    });

    const data = await response.json();
    if (!data.ok) {
      console.warn("Telegram API error response:", data);
      return {
        success: false,
        simulated: true,
        error: data.description || "Ошибка отправки в Telegram API"
      };
    }

    return {
      success: true,
      simulated: false,
      messageId: data.result?.message_id
    };
  } catch (error) {
    console.error("Telegram network dispatch error:", error);
    return {
      success: false,
      simulated: true,
      error: error.message
    };
  }
}

export function formatOrderTelegramMessage(order, company) {
  const itemsList = order.items
    .map((item, idx) => `  ${idx + 1}. <b>${item.article}</b> — ${item.name} (${item.quantity} шт. × ${item.unitBasePrice.toLocaleString('ru-RU')} ₽)`)
    .join('\n');

  return `🔥 <b>НОВЫЙ ЗАКАЗ: #${order.id}</b>
📅 <i>${new Date(order.createdAt).toLocaleString('ru-RU')}</i>

🏢 <b>Партнёр:</b> ${order.partnerName}
👤 <b>Контакт:</b> ${order.partnerPhone || 'Не указан'} (${order.partnerEmail || ''})
📍 <b>Адрес доставки:</b> ${order.deliveryAddress || 'Самовывоз с производства'}
${order.comment ? `💬 <b>Комментарий:</b> ${order.comment}\n` : ''}
📦 <b>Состав модулей (${order.summary.totalModulesCount} шт.):</b>
${itemsList}

🎨 <b>Материал фасадов:</b> ${order.material?.name || 'Стандарт'}
🔩 <b>Петли:</b> ${order.hinges?.name || 'Стандарт'}
🔲 <b>Ручки / Профиль:</b> ${order.handle?.name || 'Без ручек'}

💰 <b>ИТОГОВАЯ СУММА: ${order.summary.finalTotal.toLocaleString('ru-RU')} ₽</b>
${order.summary.discountPercent > 0 ? `🎁 Партнёрская скидка: ${order.summary.discountPercent}% (-${order.summary.discountSum.toLocaleString('ru-RU')} ₽)\n` : ''}
📄 <b>Счёт-фактура:</b> ${order.invoiceNumber} сформирован в личном кабинете.`;
}
