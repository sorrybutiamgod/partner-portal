'use client';

import React, { useState } from 'react';
import { Palette, Box, Check, ExternalLink, Sparkles, Filter } from 'lucide-react';

export default function DecorsSection({ decors, currentUser, company }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [isSampleBoxOpen, setIsSampleBoxOpen] = useState(false);
  const [sampleSalonName, setSampleSalonName] = useState(currentUser?.company || '');
  const [sampleAddress, setSampleAddress] = useState('');
  const [samplePhone, setSamplePhone] = useState(currentUser?.phone || '');
  const [sampleBoxStatus, setSampleBoxStatus] = useState(null); // 'idle' | 'success'

  const categories = [
    { id: 'all', name: 'Все материалы' },
    { id: 'mdf_matte', name: 'МДФ Эмаль Матовая' },
    { id: 'mdf_gloss', name: 'МДФ Эмаль Глянец' },
    { id: 'egger_wood', name: 'ЛДСП Egger Древесные' },
    { id: 'egger_solid', name: 'ЛДСП Egger Однотонные' },
    { id: 'fenix', name: 'Fenix NTM Нанопластик' },
    { id: 'veneer', name: 'Шпон натурального дуба' }
  ];

  const filteredDecors = activeCategory === 'all'
    ? decors
    : decors.filter(d => d.category === activeCategory);

  const handleOrderSampleBox = (e) => {
    e.preventDefault();
    setSampleBoxStatus('success');
    setTimeout(() => {
      setSampleBoxStatus(null);
      setIsSampleBoxOpen(false);
    }, 3500);
  };

  return (
    <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '36px 24px 80px 24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '32px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#2563eb', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
            <Palette size={14} /> КАТАЛОГ МАТЕРИАЛОВ И ФИНИШНОЙ ОТДЕЛКИ
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px' }}>
            Библиотека декоров и образцов
          </h1>
          <p style={{ fontSize: '14px', color: '#64748b', marginTop: '4px' }}>
            Европейские декоры Egger, нанопластики Fenix NTM и колеровка эмали по веерам RAL/NCS в 2000+ оттенков.
          </p>
        </div>

        <button 
          onClick={() => setIsSampleBoxOpen(true)}
          className="btn btn-primary"
          style={{ padding: '12px 24px', fontSize: '13px' }}
        >
          <Box size={16} />
          <span>Заказать сэмпл-бокс для салона</span>
        </button>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '28px' }}>
        {categories.map(cat => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                background: isActive ? '#2563eb' : '#ffffff',
                color: isActive ? '#ffffff' : '#475569',
                border: isActive ? '1px solid #2563eb' : '1px solid #e2e8f0',
                borderRadius: '6px',
                padding: '8px 18px',
                fontSize: '12px',
                fontWeight: isActive ? '700' : '500',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                boxShadow: isActive ? '0 2px 6px rgba(37, 99, 235, 0.2)' : '0 1px 2px rgba(0, 0, 0, 0.03)'
              }}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Decors Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
        {filteredDecors.map(dec => (
          <div
            key={dec.id}
            className="glass-panel"
            style={{
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
              transition: 'all 0.2s ease'
            }}
          >
            {/* Color preview swatch box */}
            <div style={{
              height: '140px',
              background: dec.hex,
              position: 'relative',
              boxShadow: 'inset 0 -10px 20px rgba(0, 0, 0, 0.08)',
              borderBottom: '1px solid #e2e8f0'
            }}>
              {dec.popular && (
                <span style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: 'rgba(255, 255, 255, 0.95)',
                  color: '#2563eb',
                  border: '1px solid #bfdbfe',
                  fontSize: '11px',
                  fontWeight: '700',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)'
                }}>
                  ХИТ
                </span>
              )}
            </div>

            {/* Info */}
            <div style={{ padding: '18px', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '11px', color: '#2563eb', fontWeight: '700', marginBottom: '4px' }}>
                  {dec.ral || dec.code}
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', marginBottom: '6px' }}>
                  {dec.name}
                </h3>
                <div style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.4' }}>
                  {dec.texture}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: '12px', color: '#64748b' }}>На складе: <strong style={{ color: '#16a34a' }}>В наличии</strong></span>
                <span style={{ fontSize: '11px', color: '#2563eb', fontWeight: '700', background: '#eff6ff', padding: '2px 8px', borderRadius: '4px' }}>PUR-кромка 1мм</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* SAMPLE BOX MODAL */}
      {isSampleBoxOpen && (
        <div className="modal-overlay" onClick={() => setIsSampleBoxOpen(false)}>
          <div className="glass-panel" style={{ maxWidth: '520px', width: '100%', padding: '32px', background: '#ffffff', border: '1px solid #bfdbfe', borderRadius: '12px', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.12)' }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', marginBottom: '6px' }}>
              ЗАКАЗ КЕЙСА ОБРАЗЦОВ (SAMPLE BOX)
            </h2>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
              Фабрика бесплатно комплектует и отправляет брендированный чемодан с реальными выкрасами фасадов, кромками и образцами фрезеровок для вашего салона.
            </p>

            {sampleBoxStatus === 'success' ? (
              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1e40af', padding: '16px', borderRadius: '8px', textAlign: 'center', fontSize: '14px' }}>
                <Check size={28} style={{ color: '#2563eb', margin: '0 auto 8px auto', display: 'block' }} />
                <strong>Заявка на сэмпл-бокс принята!</strong>
                <p style={{ fontSize: '12px', color: '#3b82f6', marginTop: '4px' }}>
                  Курьерская доставка образцов будет направлена по указанному адресу в течение 2 рабочих дней.
                </p>
              </div>
            ) : (
              <form onSubmit={handleOrderSampleBox}>
                <div style={{ marginBottom: '14px' }}>
                  <label className="form-label">Название мебельного салона / компании *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={sampleSalonName}
                    onChange={e => setSampleSalonName(e.target.value)}
                  />
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label className="form-label">Адрес доставки шоурума *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={sampleAddress}
                    onChange={e => setSampleAddress(e.target.value)}
                  />
                </div>

                <div style={{ marginBottom: '22px' }}>
                  <label className="form-label">Контактный телефон *</label>
                  <input
                    type="tel"
                    required
                    className="form-input"
                    value={samplePhone}
                    onChange={e => setSamplePhone(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="button" onClick={() => setIsSampleBoxOpen(false)} className="btn btn-secondary" style={{ flexGrow: 1 }}>
                    Отмена
                  </button>
                  <button type="submit" className="btn btn-primary" style={{ flexGrow: 1 }}>
                    Отправить заявку
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
