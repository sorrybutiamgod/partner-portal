import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, moduleData, moduleId } = body;
    const db = getDb();

    if (action === 'add') {
      const newModule = {
        id: `mod-${Date.now()}`,
        article: moduleData.article?.trim() || 'ВШ-NEW',
        category: moduleData.category || 'upper',
        categoryName: getCategoryName(moduleData.category || 'upper'),
        name: moduleData.name?.trim() || 'Новый мебельный модуль',
        width: Number(moduleData.width) || 600,
        height: Number(moduleData.height) || 720,
        depth: Number(moduleData.depth) || 320,
        basePrice: Number(moduleData.basePrice) || 5000,
        description: moduleData.description?.trim() || 'Модуль корпусной мебели с присадкой под фурнитуру',
        image: moduleData.image || 'cabinet_upper_single'
      };

      db.modules.push(newModule);
      saveDb(db);
      return NextResponse.json({ success: true, module: newModule, modules: db.modules });
    }

    if (action === 'update') {
      const idx = db.modules.findIndex(m => m.id === moduleId);
      if (idx === -1) {
        return NextResponse.json({ success: false, error: 'Модуль не найден' }, { status: 404 });
      }

      db.modules[idx] = {
        ...db.modules[idx],
        ...moduleData,
        width: Number(moduleData.width ?? db.modules[idx].width),
        height: Number(moduleData.height ?? db.modules[idx].height),
        depth: Number(moduleData.depth ?? db.modules[idx].depth),
        basePrice: Number(moduleData.basePrice ?? db.modules[idx].basePrice),
        categoryName: getCategoryName(moduleData.category ?? db.modules[idx].category)
      };

      saveDb(db);
      return NextResponse.json({ success: true, module: db.modules[idx], modules: db.modules });
    }

    if (action === 'delete') {
      db.modules = db.modules.filter(m => m.id !== moduleId);
      saveDb(db);
      return NextResponse.json({ success: true, modules: db.modules });
    }

    return NextResponse.json({ success: false, error: 'Неизвестное действие' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

function getCategoryName(cat) {
  const map = {
    'upper': 'Верхние модули',
    'lower': 'Нижние модули',
    'tall': 'Пеналы и колонны'
  };
  return map[cat] || 'Прочие модули';
}
