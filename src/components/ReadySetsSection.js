'use client';

import React, { useState } from 'react';
import { Package, ArrowRight, Zap, Check, Clock, Layers, Sparkles, SlidersHorizontal, CheckCircle2 } from 'lucide-react';
import ModuleSvg from './ModuleSvg';

export default function ReadySetsSection({ readySets, modules, materials, hardware, onApplySet }) {
  const [filter, setFilter] = useState('all');
  const [appliedSetId, setAppliedSetId] = useState(null);

  const filteredSets = readySets.filter(s => {
    if (filter === 'straight') return s.title.toLowerCase().includes('прямая') || s.title.toLowerCase().includes('линейная');
    if (filter === 'corner') return s.title.toLowerCase().includes('углов');
    if (filter === 'tall') return s.title.toLowerCase().includes('пенал') || s.title.toLowerCase().includes('hi-tech');
    return true;
  });

  const handleSelectSet = (set) => {
    onApplySet({
      items: set.items,
      materialId: set.recommendedMaterialId,
      hingesId: set.recommendedHingesId,
      handleId: set.recommendedHandleId
    });
    setAppliedSetId(set.id);
  };

  return (
    <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '36px 24px 80px 24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '32px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#2563eb', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
            <Sparkles size={14} /> ГОТОВЫЕ ТИПОВЫЕ РЕШЕНИЯ
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px' }}>
            Комплекты кухонных систем
          </h1>
          <p style={{ fontSize: '14px', color: '#64748b', marginTop: '4px' }}>
            Проверенные эргономичные компоновки. Загрузите готовый комплект в бланк заказа в один клик.
          </p>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'Все комплекты' },
            { id: 'straight', label: 'Прямые (Линейные)' },
            { id: 'corner', label: 'Угловые' },
            { id: 'tall', label: 'С пеналами (High-Tech)' }
          ].map(f => {
            const isActive = filter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                style={{
                  background: isActive ? '#2563eb' : '#ffffff',
                  color: isActive ? '#ffffff' : '#475569',
                  border: isActive ? '1px solid #2563eb' : '1px solid #e2e8f0',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  fontSize: '13px',
                  fontWeight: isActive ? '700' : '500',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: isActive ? '0 2px 6px rgba(37, 99, 235, 0.2)' : '0 1px 2px rgba(0, 0, 0, 0.03)'
                }}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Sets */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '28px' }}>
        {filteredSets.map(set => {
          const mat = materials.find(m => m.id === set.recommendedMaterialId);
          const hdHinges = hardware.find(h => h.id === set.recommendedHingesId);
          const hdHandle = hardware.find(h => h.id === set.recommendedHandleId);

          return (
            <div
              key={set.id}
              className="glass-panel"
              style={{
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                transition: 'all 0.2s ease'
              }}
            >
              {/* Badges */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span className="badge badge-blue">{set.badge}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748b' }}>
                  <Clock size={13} style={{ color: '#2563eb' }} />
                  <span>Срок: {set.readyTimeDays} дн.</span>
                </div>
              </div>

              <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', marginBottom: '4px' }}>
                {set.title}
              </h2>
              <div style={{ fontSize: '12px', color: '#2563eb', fontWeight: '700', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {set.subtitle}
              </div>

              <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.5', marginBottom: '20px' }}>
                {set.description}
              </p>

              {/* Specs pill */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', background: '#f8fafc', border: '1px solid #e2e8f0', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '12px' }}>
                <div>
                  <div style={{ color: '#64748b', fontSize: '11px', textTransform: 'uppercase', fontWeight: '600' }}>ДЛИНА ГАРНИТУРА:</div>
                  <strong style={{ color: '#0f172a', fontSize: '15px' }}>{set.lengthMm} мм</strong>
                </div>
                <div>
                  <div style={{ color: '#64748b', fontSize: '11px', textTransform: 'uppercase', fontWeight: '600' }}>КОЛ-ВО МОДУЛЕЙ:</div>
                  <strong style={{ color: '#2563eb', fontSize: '15px' }}>{set.modulesCount} шт.</strong>
                </div>
              </div>

              {/* Composition tags */}
              <div style={{ marginBottom: '20px', flexGrow: 1 }}>
                <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', fontWeight: '700' }}>
                  Состав комплекта:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {Object.entries(set.items).map(([modId, qty]) => {
                    const mod = modules.find(m => m.id === modId);
                    if (!mod) return null;
                    return (
                      <span key={modId} style={{ background: '#eff6ff', border: '1px solid #dbeafe', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', color: '#1e40af' }}>
                        <strong style={{ color: '#2563eb' }}>{mod.article}</strong> × {qty}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Recommendations */}
              <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '20px', fontSize: '12px', color: '#475569', lineHeight: '1.6' }}>
                <div>Материал: <strong style={{ color: '#0f172a' }}>{mat?.name}</strong></div>
                <div>Петли: <strong style={{ color: '#0f172a' }}>{hdHinges?.name}</strong></div>
                <div>Ручки: <strong style={{ color: '#0f172a' }}>{hdHandle?.name}</strong></div>
              </div>

              {/* Pricing & CTA */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600' }}>Базовый комплект:</div>
                  <div style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a' }}>
                    {set.basePrice.toLocaleString('ru-RU')} ₽
                  </div>
                </div>

                <button
                  onClick={() => handleSelectSet(set)}
                  className="btn btn-primary"
                  style={{ padding: '10px 18px', fontSize: '13px' }}
                >
                  <Zap size={14} />
                  <span>В бланк заказа</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
