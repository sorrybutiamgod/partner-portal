import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, materialData, materialId } = body;
    const db = getDb();

    if (action === 'add') {
      const newMat = {
        id: `mat-${Date.now()}`,
        name: materialData.name?.trim() || 'Новый материал',
        code: materialData.code?.trim() || 'MAT-CUSTOM',
        multiplier: Number(materialData.multiplier) || 1.0,
        extraCostPerModule: Number(materialData.extraCostPerModule) || 0,
        description: materialData.description?.trim() || '',
        badge: materialData.badge?.trim() || 'Новинка',
        colorSample: materialData.colorSample || '#64748b'
      };

      db.materials.push(newMat);
      saveDb(db);
      return NextResponse.json({ success: true, material: newMat, materials: db.materials });
    }

    if (action === 'update') {
      const idx = db.materials.findIndex(m => m.id === materialId);
      if (idx === -1) {
        return NextResponse.json({ success: false, error: 'Материал не найден' }, { status: 404 });
      }

      db.materials[idx] = {
        ...db.materials[idx],
        ...materialData,
        multiplier: Number(materialData.multiplier ?? db.materials[idx].multiplier),
        extraCostPerModule: Number(materialData.extraCostPerModule ?? db.materials[idx].extraCostPerModule)
      };

      saveDb(db);
      return NextResponse.json({ success: true, material: db.materials[idx], materials: db.materials });
    }

    if (action === 'delete') {
      db.materials = db.materials.filter(m => m.id !== materialId);
      saveDb(db);
      return NextResponse.json({ success: true, materials: db.materials });
    }

    return NextResponse.json({ success: false, error: 'Неизвестное действие' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
