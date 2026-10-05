import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, hardwareData, hardwareId } = body;
    const db = getDb();

    if (action === 'add') {
      const newHd = {
        id: `hd-${Date.now()}`,
        category: hardwareData.category || 'handles',
        name: hardwareData.name?.trim() || 'Новая фурнитура',
        pricePerUnit: Number(hardwareData.pricePerUnit) || 0,
        description: hardwareData.description?.trim() || '',
        type: hardwareData.type || 'handle'
      };

      db.hardware.push(newHd);
      saveDb(db);
      return NextResponse.json({ success: true, hardware: newHd, hardwareList: db.hardware });
    }

    if (action === 'update') {
      const idx = db.hardware.findIndex(h => h.id === hardwareId);
      if (idx === -1) {
        return NextResponse.json({ success: false, error: 'Позиция фурнитуры не найдена' }, { status: 404 });
      }

      db.hardware[idx] = {
        ...db.hardware[idx],
        ...hardwareData,
        pricePerUnit: Number(hardwareData.pricePerUnit ?? db.hardware[idx].pricePerUnit)
      };

      saveDb(db);
      return NextResponse.json({ success: true, hardware: db.hardware[idx], hardwareList: db.hardware });
    }

    if (action === 'delete') {
      db.hardware = db.hardware.filter(h => h.id !== hardwareId);
      saveDb(db);
      return NextResponse.json({ success: true, hardwareList: db.hardware });
    }

    return NextResponse.json({ success: false, error: 'Неизвестное действие' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
