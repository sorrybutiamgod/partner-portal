import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';

export async function GET() {
  try {
    const db = getDb();
    return NextResponse.json({
      success: true,
      company: db.company,
      settings: db.settings
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { company, settings } = body;
    const db = getDb();

    if (company) {
      db.company = {
        ...db.company,
        ...company
      };
    }

    if (settings) {
      db.settings = {
        ...db.settings,
        ...settings
      };
    }

    saveDb(db);
    return NextResponse.json({
      success: true,
      company: db.company,
      settings: db.settings,
      message: 'Настройки фабрики успешно сохранены'
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
