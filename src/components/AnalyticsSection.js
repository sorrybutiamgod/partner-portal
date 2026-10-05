'use client';

import React, { useState } from 'react';
import { TrendingUp, DollarSign, Award, Percent, Package, ArrowUpRight, CheckCircle2, ChevronRight } from 'lucide-react';

export default function AnalyticsSection({ orders = [], loyaltyTiers = [], currentUser }) {
  const [estimatedOrderBase, setEstimatedOrderBase] = useState(250000);
  const [markupPercent, setMarkupPercent] = useState(45);

  // Compute total spent across completed orders
  const completedOrders = orders.filter(o => o.status === 'completed' || o.status === 'in_production' || o.status === 'ready');
  const totalSpent = completedOrders.reduce((sum, o) => sum + (o.finalPrice || o.totalPrice || 0), 0);
  const totalModulesManufactured = completedOrders.reduce((sum, o) => {
    return sum + Object.values(o.items || {}).reduce((s, q) => s + (Number(q) || 0), 0);
  }, 0);

  // Determine current tier
  let currentTier = loyaltyTiers[0] || { name: 'Базовый', discount: 15, minTurnover: 0, perks: [] };
  for (const tier of loyaltyTiers) {
    if (totalSpent >= tier.minTurnover) {
      currentTier = tier;
    }
  }

  // Next tier
  const currentIndex = loyaltyTiers.findIndex(t => t.name === currentTier.name);
  const nextTier = loyaltyTiers[currentIndex + 1] || currentTier;
  const progressToNext = nextTier === currentTier ? 100 : Math.min(100, Math.round((totalSpent / nextTier.minTurnover) * 100));
  const remainingToNext = Math.max(0, nextTier.minTurnover - totalSpent);

  // Margin calculation
  const currentDiscount = currentUser?.discount || currentTier.discount;
  const wholesaleCost = Math.round(estimatedOrderBase * (1 - currentDiscount / 100));
  const retailPrice = Math.round(estimatedOrderBase * (1 + markupPercent / 100));
  const netMargin = retailPrice - wholesaleCost;

  return (
    <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '36px 24px 80px 24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '32px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#2563eb', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
            <TrendingUp size={14} /> B2B АНАЛИТИКА И ПРОГРАММА РОСТА
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px' }}>
            Показатели и программа лояльности
          </h1>
          <p style={{ fontSize: '14px', color: '#64748b', marginTop: '4px' }}>
            Отслеживайте объёмы закупок, статус скидки и рассчитывайте доходность салона.
          </p>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div className="glass-panel" style={{ padding: '24px', background: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '4px solid #2563eb', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>ОБЪЁМ ЗАКУПОК:</span>
            <DollarSign size={18} style={{ color: '#2563eb' }} />
          </div>
          <div style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a' }}>
            {totalSpent.toLocaleString('ru-RU')} ₽
          </div>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
            Сумма всех завершённых заказов
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px', background: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>СТАТУС СКИДКИ:</span>
            <Percent size={18} style={{ color: '#3b82f6' }} />
          </div>
          <div style={{ fontSize: '26px', fontWeight: '800', color: '#2563eb' }}>
            {currentDiscount}%
          </div>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
            Уровень: <strong>{currentTier.name}</strong>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px', background: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '4px solid #10b981', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>ИЗГОТОВЛЕНО МОДУЛЕЙ:</span>
            <Package size={18} style={{ color: '#10b981' }} />
          </div>
          <div style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a' }}>
            {totalModulesManufactured} шт.
          </div>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
            Корпусов выпущено фабрикой
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px', background: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '4px solid #f59e0b', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>СРЕДНИЙ СРОК ЧПУ:</span>
            <Award size={18} style={{ color: '#f59e0b' }} />
          </div>
          <div style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a' }}>
            4.8 дней
          </div>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
            От заказа до отгрузки
          </div>
        </div>
      </div>

      {/* Main Grid: Loyalty Progress (55%) + Retail Margin Calculator (45%) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '28px', alignItems: 'start' }}>
        
        {/* Loyalty Program Card */}
        <div className="glass-panel" style={{ padding: '28px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Award size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '17px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.2px' }}>
                СТУПЕНИ ПАРТНЁРСКОЙ ПРОГРАММЫ
              </h2>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                Ваш текущий статус: <strong style={{ color: '#2563eb' }}>{currentTier.name} ({currentDiscount}%)</strong>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ marginBottom: '26px', background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
              <span style={{ color: '#475569' }}>Прогресс до уровня «{nextTier.name}»:</span>
              <strong style={{ color: '#2563eb' }}>{progressToNext}%</strong>
            </div>

            <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
              <div style={{
                width: `${progressToNext}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)',
                borderRadius: '4px',
                transition: 'width 0.4s ease'
              }} />
            </div>

            {remainingToNext > 0 && (
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '10px' }}>
                Осталось оформить заказов на <strong style={{ color: '#0f172a' }}>{remainingToNext.toLocaleString('ru-RU')} ₽</strong> для перехода на скидку {nextTier.discount}%.
              </div>
            )}
          </div>

          {/* All Tiers List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {loyaltyTiers.map(t => {
              const isCurrent = t.name === currentTier.name;

              return (
                <div
                  key={t.name}
                  style={{
                    padding: '14px 16px',
                    borderRadius: '8px',
                    background: isCurrent ? '#eff6ff' : '#ffffff',
                    border: isCurrent ? '1.5px solid #2563eb' : '1px solid #e2e8f0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    boxShadow: isCurrent ? '0 2px 8px rgba(37, 99, 235, 0.08)' : 'none'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <strong style={{ fontSize: '14px', color: '#0f172a' }}>{t.name}</strong>
                      <span className={isCurrent ? "badge badge-blue" : "badge"} style={{ background: isCurrent ? '#2563eb' : '#f1f5f9', color: isCurrent ? '#ffffff' : '#475569' }}>
                        СКИДКА {t.discount}%
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                      Оборот: от {t.minTurnover.toLocaleString('ru-RU')} ₽ • {t.perks.join(' • ')}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Retail Margin & Profit Calculator */}
        <div className="glass-panel" style={{ padding: '28px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '17px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.2px' }}>
                КАЛЬКУЛЯТОР МАРЖИ САЛОНА
              </h2>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                Оценка розничной прибыли при продаже клиенту
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '18px' }}>
            <label className="form-label">Базовая стоимость модулей (₽)</label>
            <input
              type="number"
              className="form-input"
              value={estimatedOrderBase}
              onChange={e => setEstimatedOrderBase(Number(e.target.value))}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label className="form-label" style={{ marginBottom: 0 }}>Торговая наценка салона:</label>
              <strong style={{ color: '#2563eb' }}>+{markupPercent}%</strong>
            </div>
            <input
              type="range"
              min="20"
              max="120"
              step="5"
              value={markupPercent}
              onChange={e => setMarkupPercent(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#2563eb' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b' }}>
              <span>20% (Эконом)</span>
              <span>50% (Стандарт)</span>
              <span>100%+ (Премиум)</span>
            </div>
          </div>

          {/* Result Card */}
          <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Закупка на фабрике (со скидкой {currentDiscount}%):</span>
              <strong style={{ color: '#0f172a' }}>{wholesaleCost.toLocaleString('ru-RU')} ₽</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Цена продажи клиенту (+{markupPercent}%):</span>
              <strong style={{ color: '#0f172a' }}>{retailPrice.toLocaleString('ru-RU')} ₽</strong>
            </div>

            <div style={{ height: '1px', background: '#e2e8f0', margin: '4px 0' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#0f172a', fontWeight: '800' }}>ЧИСТАЯ ПРИБЫЛЬ САЛОНА:</span>
              <span style={{ fontSize: '22px', fontWeight: '800', color: '#16a34a' }}>
                +{netMargin.toLocaleString('ru-RU')} ₽
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
