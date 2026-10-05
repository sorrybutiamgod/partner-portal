import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, statusLabel } = body;

    const db = getDb();
    const order = (db.orders || []).find(o => o.id === id);

    if (!order) {
      return NextResponse.json({ success: false, error: 'Заказ не найден' }, { status: 404 });
    }

    order.status = status;
    order.statusLabel = statusLabel || getStatusLabel(status);
    order.updatedAt = new Date().toISOString();

    saveDb(db);
    return NextResponse.json({ success: true, order });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

function getStatusLabel(status) {
  const map = {
    'new': 'Новый заказ',
    'in_production': 'В производстве',
    'ready': 'Готов к отгрузке',
    'completed': 'Отгружен / Выполнен',
    'cancelled': 'Отменён'
  };
  return map[status] || status;
}
