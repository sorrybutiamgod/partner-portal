'use client';

import React, { useState } from 'react';
import { Ruler, Plus, Trash2, ArrowRight, Layers, RefreshCw, Check, Zap, Info } from 'lucide-react';

export default function KitchenPlannerSection({ modules, onApplyLayoutToOrder }) {
  // Linear kitchen wall rows
  const [upperRow, setUpperRow] = useState([
    modules.find(m => m.id === 'm-u1') || modules[0],
    modules.find(m => m.id === 'm-u2') || modules[1],
    modules.find(m => m.id === 'm-u3') || modules[2]
  ].filter(Boolean));

  const [lowerRow, setLowerRow] = useState([
    modules.find(m => m.id === 'm-l3') || modules[4],
    modules.find(m => m.id === 'm-l1') || modules[3],
    modules.find(m => m.id === 'm-l2') || modules[5]
  ].filter(Boolean));

  // Add module to row
  const handleAddToUpper = (mod) => {
    setUpperRow(prev => [...prev, mod]);
  };

  const handleAddToLower = (mod) => {
    setLowerRow(prev => [...prev, mod]);
  };

  // Remove module
  const handleRemoveUpper = (index) => {
    setUpperRow(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveLower = (index) => {
    setLowerRow(prev => prev.filter((_, i) => i !== index));
  };

  // Clear all
  const handleClearAll = () => {
    setUpperRow([]);
    setLowerRow([]);
  };

  // Transfer layout to Order blank
  const handleTransferToOrder = () => {
    const counts = {};
    upperRow.forEach(m => counts[m.id] = (counts[m.id] || 0) + 1);
    lowerRow.forEach(m => counts[m.id] = (counts[m.id] || 0) + 1);
    onApplyLayoutToOrder(counts);
  };

  // Totals
  const upperTotalWidth = upperRow.reduce((sum, m) => sum + m.width, 0);
  const lowerTotalWidth = lowerRow.reduce((sum, m) => sum + m.width, 0);
  const totalPlanPrice = [...upperRow, ...lowerRow].reduce((sum, m) => sum + m.basePrice, 0);

  // Quick accessory estimate
  const countertopMeters = (lowerTotalWidth / 1000).toFixed(2);
  const plinthMeters = (lowerTotalWidth / 1000).toFixed(2);

  const upperModules = modules.filter(m => m.category === 'upper');
  const lowerModules = modules.filter(m => m.category === 'lower' || m.category === 'tall');

  return (
    <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '36px 24px 80px 24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '28px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#2563eb', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
            <Ruler size={14} /> 2D/CAD КОНСТРУКТОР КОМПОНОВКИ
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px' }}>
            Проектирование ряда кухни
          </h1>
          <p style={{ fontSize: '14px', color: '#64748b', marginTop: '4px' }}>
            Расставьте модули по стене, контролируйте габариты в миллиметрах и перенесите проект в заказ.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleClearAll} className="btn btn-secondary" style={{ fontSize: '13px', padding: '10px 16px' }}>
            <RefreshCw size={14} /> Сбросить проект
          </button>
          <button onClick={handleTransferToOrder} className="btn btn-primary" style={{ fontSize: '13px', padding: '10px 22px' }}>
            <Zap size={15} />
            <span>Перенести в бланк заказа</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>

      {/* Main Grid: Visual Elevation Wall (70%) + Module Palette (30%) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 360px', gap: '28px', alignItems: 'start' }}>
        
        {/* Left: Interactive CAD Elevation Canvas */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Elevation Blueprint Canvas */}
          <div className="glass-panel" style={{
            padding: '30px',
            border: '1px solid #bfdbfe',
            borderRadius: '10px',
            background: '#ffffff',
            boxShadow: '0 4px 20px rgba(37, 99, 235, 0.06)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #e2e8f0', paddingBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="badge badge-blue">СХЕМА ПРИСАДКИ</span>
                <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>
                  МАСШТАБ СТЕНЫ: {Math.max(lowerTotalWidth, upperTotalWidth, 2400)} ММ
                </span>
              </div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
                ИТОГО: {totalPlanPrice.toLocaleString('ru-RU')} ₽
              </div>
            </div>

            {/* UPPER ROW ELEVATION */}
            <div style={{ marginBottom: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  ВЕРХНИЙ РЯД (ШИРИНА: {upperTotalWidth} ММ)
                </span>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  {upperRow.length} шт. модулей
                </span>
              </div>

              <div style={{
                minHeight: '140px',
                background: '#f8fafc',
                border: '1px dashed #cbd5e1',
                borderRadius: '8px',
                padding: '12px',
                display: 'flex',
                gap: '8px',
                alignItems: 'flex-start',
                overflowX: 'auto'
              }}>
                {upperRow.length === 0 ? (
                  <div style={{ width: '100%', height: '110px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '13px' }}>
                    + Добавьте верхние модули из панели справа
                  </div>
                ) : (
                  upperRow.map((mod, idx) => (
                    <div
                      key={idx}
                      style={{
                        width: `${Math.max(mod.width / 5, 80)}px`,
                        height: '120px',
                        background: '#ffffff',
                        border: '1px solid #bfdbfe',
                        borderRadius: '6px',
                        padding: '8px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        position: 'relative',
                        flexShrink: 0,
                        boxShadow: '0 2px 4px rgba(37, 99, 235, 0.05)'
                      }}
                    >
                      <button
                        onClick={() => handleRemoveUpper(idx)}
                        style={{ position: 'absolute', top: '4px', right: '4px', background: '#fee2e2', border: 'none', color: '#dc2626', borderRadius: '50%', width: '18px', height: '18px', cursor: 'pointer', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        ✕
                      </button>
                      <div style={{ fontSize: '11px', fontWeight: '800', color: '#2563eb' }}>
                        {mod.article}
                      </div>
                      <div style={{ fontSize: '11px', color: '#0f172a', fontWeight: '500', lineHeight: '1.2' }}>
                        {mod.width}×{mod.height}
                      </div>
                      <div style={{ fontSize: '11px', fontWeight: '700', color: '#475569' }}>
                        {mod.basePrice.toLocaleString('ru-RU')} ₽
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* WALL APRON (ФАРТУК КУХНИ) */}
            <div style={{ height: '36px', background: '#eff6ff', borderTop: '1px solid #dbeafe', borderBottom: '1px solid #dbeafe', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#1e40af', fontWeight: '700', letterSpacing: '0.8px' }}>
              ЗОНА ФАРТУКА (H = 600 MM)
            </div>

            {/* LOWER ROW ELEVATION */}
            <div style={{ marginTop: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  НИЖНИЙ РЯД (ШИРИНА: {lowerTotalWidth} ММ)
                </span>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  {lowerRow.length} шт. модулей
                </span>
              </div>

              <div style={{
                minHeight: '150px',
                background: '#f8fafc',
                border: '1px dashed #cbd5e1',
                borderRadius: '8px',
                padding: '12px',
                display: 'flex',
                gap: '8px',
                alignItems: 'flex-start',
                overflowX: 'auto'
              }}>
                {lowerRow.length === 0 ? (
                  <div style={{ width: '100%', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '13px' }}>
                    + Добавьте нижние шкафы и пеналы из панели справа
                  </div>
                ) : (
                  lowerRow.map((mod, idx) => (
                    <div
                      key={idx}
                      style={{
                        width: `${Math.max(mod.width / 5, 80)}px`,
                        height: mod.category === 'tall' ? '220px' : '135px',
                        background: '#ffffff',
                        border: '1px solid #bfdbfe',
                        borderRadius: '6px',
                        padding: '8px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        position: 'relative',
                        flexShrink: 0,
                        boxShadow: '0 2px 4px rgba(37, 99, 235, 0.05)'
                      }}
                    >
                      <button
                        onClick={() => handleRemoveLower(idx)}
                        style={{ position: 'absolute', top: '4px', right: '4px', background: '#fee2e2', border: 'none', color: '#dc2626', borderRadius: '50%', width: '18px', height: '18px', cursor: 'pointer', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        ✕
                      </button>
                      <div style={{ fontSize: '11px', fontWeight: '800', color: '#2563eb' }}>
                        {mod.article}
                      </div>
                      <div style={{ fontSize: '11px', color: '#0f172a', fontWeight: '500', lineHeight: '1.2' }}>
                        {mod.width}×{mod.height}
                      </div>
                      <div style={{ fontSize: '11px', fontWeight: '700', color: '#475569' }}>
                        {mod.basePrice.toLocaleString('ru-RU')} ₽
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Quick Metrics & Materials Calculator */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div className="glass-panel" style={{ padding: '20px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
              <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>ДЛИНА СТОЛЕШНИЦЫ:</div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', marginTop: '4px' }}>
                {countertopMeters} м
              </div>
              <div style={{ fontSize: '12px', color: '#2563eb', marginTop: '2px', fontWeight: '500' }}>Глубина 600 мм с каплесборником</div>
            </div>

            <div className="glass-panel" style={{ padding: '20px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
              <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>ДЛИНА ЦОКОЛЯ:</div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', marginTop: '4px' }}>
                {plinthMeters} м
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>Высота 100 мм PVC/Алюминий</div>
            </div>

            <div className="glass-panel" style={{ padding: '20px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
              <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>СИНХРОННОСТЬ РЯДОВ:</div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: lowerTotalWidth === upperTotalWidth ? '#16a34a' : '#2563eb', marginTop: '4px' }}>
                {Math.abs(lowerTotalWidth - upperTotalWidth)} мм {lowerTotalWidth === upperTotalWidth ? '✓ В РОСТ' : 'РАЗНИЦА'}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>Геометрия стыка гарнитура</div>
            </div>
          </div>
        </div>

        {/* Right: Quick Module Palette */}
        <div className="glass-panel" style={{ padding: '24px', maxHeight: '780px', overflowY: 'auto', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a', marginBottom: '16px', letterSpacing: '-0.2px' }}>
            ДОБАВЛЕНИЕ МОДУЛЕЙ
          </h3>

          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '11px', fontWeight: '700', color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
              ВЕРХНИЕ МОДУЛИ:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {upperModules.map(mod => (
                <button
                  key={mod.id}
                  onClick={() => handleAddToUpper(mod)}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '9px 12px',
                    borderRadius: '6px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    color: '#0f172a',
                    cursor: 'pointer',
                    fontSize: '12px',
                    textAlign: 'left',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#2563eb'; e.currentTarget.style.background = '#eff6ff'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#f8fafc'; }}
                >
                  <div>
                    <strong style={{ color: '#2563eb' }}>{mod.article}</strong> — {mod.width}мм
                  </div>
                  <Plus size={14} style={{ color: '#2563eb' }} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '11px', fontWeight: '700', color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
              НИЖНИЕ МОДУЛИ И ПЕНАЛЫ:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {lowerModules.map(mod => (
                <button
                  key={mod.id}
                  onClick={() => handleAddToLower(mod)}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '9px 12px',
                    borderRadius: '6px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    color: '#0f172a',
                    cursor: 'pointer',
                    fontSize: '12px',
                    textAlign: 'left',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#2563eb'; e.currentTarget.style.background = '#eff6ff'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#f8fafc'; }}
                >
                  <div>
                    <strong style={{ color: '#2563eb' }}>{mod.article}</strong> — {mod.width}мм
                  </div>
                  <Plus size={14} style={{ color: '#2563eb' }} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
