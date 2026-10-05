import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, email, password, partnerData, role } = body;
    const db = getDb();

    if (action === 'login') {
      const user = db.users.find(u => u.email.toLowerCase() === (email || '').toLowerCase().trim());
      if (!user || user.password !== password) {
        return NextResponse.json({ success: false, error: 'Неверный email или пароль' }, { status: 401 });
      }
      const safeUser = { ...user };
      delete safeUser.password;
      return NextResponse.json({ success: true, user: safeUser });
    }

    if (action === 'demo') {
      const targetRole = role === 'admin' ? 'admin' : 'partner';
      const user = db.users.find(u => u.role === targetRole) || db.users[0];
      const safeUser = { ...user };
      delete safeUser.password;
      return NextResponse.json({ success: true, user: safeUser });
    }

    if (action === 'register') {
      const {
        companyName,
        contactPerson,
        phone,
        email: regEmail,
        password: regPassword,
        inn,
        city,
        deliveryAddress
      } = partnerData || {};

      if (!companyName || !phone || !regEmail || !regPassword) {
        return NextResponse.json({ success: false, error: 'Пожалуйста, заполните все обязательные поля' }, { status: 400 });
      }

      const existing = db.users.find(u => u.email.toLowerCase() === regEmail.toLowerCase().trim());
      if (existing) {
        return NextResponse.json({ success: false, error: 'Пользователь с таким email уже зарегистрирован' }, { status: 400 });
      }

      const newPartner = {
        id: `usr_partner_${Date.now()}`,
        role: 'partner',
        email: regEmail.trim(),
        password: regPassword,
        companyName: companyName.trim(),
        contactPerson: (contactPerson || '').trim(),
        phone: phone.trim(),
        inn: (inn || '').trim(),
        city: (city || 'Москва').trim(),
        deliveryAddress: (deliveryAddress || '').trim(),
        discountPercent: 5 // Default welcome partner discount
      };

      db.users.push(newPartner);
      saveDb(db);

      const safeUser = { ...newPartner };
      delete safeUser.password;

      return NextResponse.json({
        success: true,
        user: safeUser,
        message: 'Регистрация успешно завершена! Добро пожаловать в партнёрский кабинет.'
      });
    }

    return NextResponse.json({ success: false, error: 'Неизвестное действие' }, { status: 400 });
  } catch (error) {
    console.error('Auth API error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
