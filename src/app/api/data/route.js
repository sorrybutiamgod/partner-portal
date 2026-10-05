import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const db = getDb();
    return NextResponse.json({
      success: true,
      company: db.company,
      modules: db.modules,
      materials: db.materials,
      hardware: db.hardware,
      readySets: db.readySets || [],
      decors: db.decors || [],
      docs: db.docs || [],
      loyaltyTiers: db.loyaltyTiers || [],
      settings: {
        telegramConfigured: Boolean(db.settings?.telegramBotToken && db.settings?.telegramChatId),
        telegramEnabled: db.settings?.telegramEnabled ?? true,
        invoiceVatRate: db.settings?.invoiceVatRate || 20
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
