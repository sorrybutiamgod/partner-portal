'use client';

import React, { useState } from 'react';
import { X, Lock, Mail, Building, Phone, MapPin, User, ArrowRight } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Register fields
  const [regData, setRegData] = useState({
    companyName: '',
    contactPerson: '',
    phone: '',
    email: '',
    password: '',
    inn: '',
    city: 'Москва',
    deliveryAddress: ''
  });

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', email, password })
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error || 'Неверный логин или пароль');
      } else {
        onLoginSuccess(data.user);
        onClose();
      }
    } catch (err) {
      setError('Ошибка соединения с сервером');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'register', partnerData: regData })
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error || 'Ошибка регистрации');
      } else {
        onLoginSuccess(data.user);
        onClose();
      }
    } catch (err) {
      setError('Ошибка соединения с сервером');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="glass-panel" 
        style={{ 
          maxWidth: '500px', 
          width: '100%', 
          padding: '32px',
          background: '#ffffff',
          border: '1px solid #bfdbfe',
          boxShadow: '0 20px 45px rgba(0, 0, 0, 0.12)',
          maxHeight: '92vh',
          overflowY: 'auto'
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
          <div style={{ display: 'flex', gap: '8px', background: '#f1f5f9', padding: '3px', borderRadius: '6px' }}>
            <button
              onClick={() => { setMode('login'); setError(''); }}
              style={{
                background: mode === 'login' ? '#2563eb' : 'transparent',
                color: mode === 'login' ? '#ffffff' : '#64748b',
                border: 'none',
                borderRadius: '4px',
                padding: '6px 14px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              Вход
            </button>
            <button
              onClick={() => { setMode('register'); setError(''); }}
              style={{
                background: mode === 'register' ? '#2563eb' : 'transparent',
                color: mode === 'register' ? '#ffffff' : '#64748b',
                border: 'none',
                borderRadius: '4px',
                padding: '6px 14px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              Регистрация партнёра
            </button>
          </div>

          <button className="btn btn-secondary" onClick={onClose} style={{ padding: '6px 8px', borderRadius: '4px' }}>
            <X size={16} />
          </button>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '10px 14px', borderRadius: '6px', fontSize: '13px', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        {mode === 'login' ? (
          <form onSubmit={handleLogin}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '4px', color: '#0f172a' }}>
              Вход в личный кабинет
            </h3>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '18px' }}>
              Доступ к оптовым ценам и автоматическому формированию спецификаций.
            </p>

            <div style={{ marginBottom: '14px' }}>
              <label className="form-label">Email или логин</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  required
                  placeholder="partner@mebel-art.ru"
                  className="form-input"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{ paddingLeft: '36px' }}
                />
                <Mail size={16} style={{ position: 'absolute', left: '11px', top: '11px', color: '#94a3b8' }} />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label className="form-label">Пароль</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="form-input"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{ paddingLeft: '36px' }}
                />
                <Lock size={16} style={{ position: 'absolute', left: '11px', top: '11px', color: '#94a3b8' }} />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '12px', fontSize: '13px' }}>
              {loading ? 'Проверка...' : 'Войти в кабинет'} <ArrowRight size={15} />
            </button>

            <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '12px', color: '#64748b' }}>
              Вход администратора фабрики: <span style={{ color: '#2563eb', fontWeight: '600' }}>admin@modulpro.ru</span>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '4px', color: '#0f172a' }}>
              Регистрация нового партнёра
            </h3>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '18px' }}>
              Прямой договор поставки и доступ к калькулятору спецификаций.
            </p>

            <div style={{ marginBottom: '12px' }}>
              <label className="form-label">Организация или ИП *</label>
              <input
                type="text"
                required
                placeholder="ИП Смирнов А.В."
                className="form-input"
                value={regData.companyName}
                onChange={e => setRegData({ ...regData, companyName: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
              <div>
                <label className="form-label">Контактное лицо</label>
                <input
                  type="text"
                  placeholder="Алексей"
                  className="form-input"
                  value={regData.contactPerson}
                  onChange={e => setRegData({ ...regData, contactPerson: e.target.value })}
                />
              </div>
              <div>
                <label className="form-label">ИНН</label>
                <input
                  type="text"
                  placeholder="772398451020"
                  className="form-input"
                  value={regData.inn}
                  onChange={e => setRegData({ ...regData, inn: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
              <div>
                <label className="form-label">Телефон *</label>
                <input
                  type="tel"
                  required
                  placeholder="+7 (903) 123-45-67"
                  className="form-input"
                  value={regData.phone}
                  onChange={e => setRegData({ ...regData, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="form-label">Город</label>
                <input
                  type="text"
                  placeholder="Москва"
                  className="form-input"
                  value={regData.city}
                  onChange={e => setRegData({ ...regData, city: e.target.value })}
                />
              </div>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label className="form-label">Адрес доставки</label>
              <input
                type="text"
                placeholder="г. Москва, ул. Складская, 14"
                className="form-input"
                value={regData.deliveryAddress}
                onChange={e => setRegData({ ...regData, deliveryAddress: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
              <div>
                <label className="form-label">Email (Логин) *</label>
                <input
                  type="email"
                  required
                  placeholder="partner@mail.ru"
                  className="form-input"
                  value={regData.email}
                  onChange={e => setRegData({ ...regData, email: e.target.value })}
                />
              </div>
              <div>
                <label className="form-label">Пароль *</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="form-input"
                  value={regData.password}
                  onChange={e => setRegData({ ...regData, password: e.target.value })}
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
              {loading ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
