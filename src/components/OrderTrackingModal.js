'use client';

import React from 'react';
import { X, CheckCircle2, Clock, Cpu, Barcode, ShieldCheck, Truck, Factory } from 'lucide-react';

export default function OrderTrackingModal({ order, isOpen, onClose }) {
  if (!isOpen || !order) return null;

  const steps = [
    {
      id: 'step1',
      title: 'Раскрой плитного материала',
      station: 'Форматно-раскроечный ЧПУ центр HOMAG SAWTEQ B-300',
      time: 'День 1, 09:15',
      status: 'completed',
      detail: 'Оптимизация карт раскроя Cut Rite. Точность распила ±0.1 мм.'
    },
    {
      id: 'step2',
      title: 'Кромкооблицовка PUR-клеем',
      station: 'Кромкооблицовочный станок HOMAG EDGETEQ S-500',
      time: 'День 2, 14:20',
      status: 'completed',
      detail: 'Влагостойкий полиуретановый шов нулевой видимости.'
    },
    {
      id: 'step3',
      title: 'Сквозная ЧПУ присадка отверстий 32 мм',
      station: 'Сверлильно-присадочный центр HOMAG DRILLTEQ V-200',
      time: 'День 3, 11:40',
      status: 'active',
      detail: 'Сверление монтажных отверстий под конфирматы, эксцентрики Minifix и петли.'
    },
    {
      id: 'step4',
      title: 'Контроль геометрии ОТК и комплектация фурнитуры',
      station: 'Лазерный стол контроля качества ОТК-1',
      time: 'Ожидается: День 4, 10:00',
      status: 'pending',
      detail: 'Проверка диагоналей корпуса и маркировка каждого щита уникальным QR-кодом.'
    },
    {
      id: 'step5',
      title: 'Защитная упаковка и паллетирование',
      station: 'Упаковочная линия в 5-слойный гофрокартон',
      time: 'Ожидается: День 4, 16:30',
      status: 'pending',
      detail: 'Усиленные уголки и стрейч-пленка повышенной плотности.'
    },
    {
      id: 'step6',
      title: 'Готовность к отгрузке / Доставка',
      station: 'Логистический хаб фабрики',
      time: 'Ожидается: День 5, 12:00',
      status: 'pending',
      detail: `Отгрузка по адресу: ${order.deliveryAddress || 'Склад партнёра'}`
    }
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="glass-panel" 
        style={{
          width: '100%',
          maxWidth: '800px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '32px',
          border: '1px solid #bfdbfe',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.12)',
          background: '#ffffff'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '22px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#2563eb', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              <Cpu size={14} /> Производственный трекинг
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', marginTop: '4px' }}>
              Статус выполнения заказа #{order.id}
            </h2>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
              Счёт: <strong style={{ color: '#0f172a' }}>{order.invoiceNumber}</strong> • Партнёр: {order.partnerName}
            </div>
          </div>

          <button
            onClick={onClose}
            className="btn btn-secondary"
            style={{ padding: '6px 8px' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Digital Barcode Banner */}
        <div style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          padding: '14px 18px',
          borderRadius: '8px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '24px'
        }}>
          <div>
            <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Штрихкод партии на производстве:</div>
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', fontFamily: 'monospace', letterSpacing: '2px', marginTop: '2px' }}>
              MP-{order.id.replace(/[^0-9]/g, '') || '98421'}-HOMAG
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-blue">ЭТАП 3 ИЗ 6 В РАБОТЕ</span>
            <span style={{ fontSize: '13px', color: '#2563eb', fontWeight: '700' }}>
              Готовность: 55%
            </span>
          </div>
        </div>

        {/* Timeline Steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', position: 'relative' }}>
          {steps.map((st) => {
            const isDone = st.status === 'completed';
            const isActive = st.status === 'active';

            return (
              <div key={st.id} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                {/* Status Icon */}
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: isDone ? '#2563eb' : isActive ? '#eff6ff' : '#f1f5f9',
                  color: isDone ? '#ffffff' : isActive ? '#2563eb' : '#94a3b8',
                  border: isDone ? '2px solid #2563eb' : isActive ? '2px solid #2563eb' : '1px solid #cbd5e1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {isDone ? <CheckCircle2 size={16} /> : isActive ? <Factory size={16} /> : <Clock size={14} />}
                </div>

                {/* Content */}
                <div style={{ flexGrow: 1, background: isActive ? '#eff6ff' : '#ffffff', padding: '12px 16px', borderRadius: '6px', border: isActive ? '1px solid #bfdbfe' : '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: isActive ? '#1d4ed8' : '#0f172a' }}>
                      {st.title}
                    </div>
                    <div style={{ fontSize: '11px', color: isActive ? '#2563eb' : '#64748b' }}>
                      {st.time}
                    </div>
                  </div>

                  <div style={{ fontSize: '12px', color: '#334155', marginTop: '2px', fontWeight: '500' }}>
                    {st.station}
                  </div>

                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px', lineHeight: '1.4' }}>
                    {st.detail}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ fontSize: '12px', color: '#64748b' }}>
            Диспетчер производства: +7 (495) 789-44-22
          </div>
          <button onClick={onClose} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '12px' }}>
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}
