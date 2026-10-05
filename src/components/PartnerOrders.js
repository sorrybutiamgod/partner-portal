'use client';

import React, { useState } from 'react';
import { ClipboardList, Printer, CheckCircle2, Clock, Truck, Package, ArrowRight, Cpu, FileText } from 'lucide-react';
import OrderTrackingModal from './OrderTrackingModal';

export default function PartnerOrders({ orders, currentUser, onViewInvoice, onGoToOrder }) {
  const [trackingOrder, setTrackingOrder] = useState(null);
  const partnerOrders = orders.filter(o => !currentUser || o.partnerId === currentUser.id || currentUser.role === 'admin');

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '36px 24px 80px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#2563eb', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>
            <FileText size={14} /> Личный кабинет партнёра
          </div>
          <h1 style={{ fontSize: '30px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.3px' }}>
            История заказов и счета
          </h1>
          <p style={{ fontSize: '14px', color: '#64748b' }}>
            Здесь хранятся все ваши заказы. Вы можете в любой момент просмотреть спецификацию и распечатать официальный счёт-фактуру.
          </p>
        </div>

        <button onClick={onGoToOrder} className="btn btn-primary" style={{ padding: '10px 18px' }}>
          <span>Новый заказ</span>
          <ArrowRight size={15} />
        </button>
      </div>

      {partnerOrders.length === 0 ? (
        <div className="glass-panel" style={{ padding: '60px 24px', textAlign: 'center', background: '#ffffff' }}>
          <ClipboardList size={48} style={{ color: '#2563eb', margin: '0 auto 16px auto', display: 'block' }} />
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>
            У вас пока нет оформленных заказов
          </h3>
          <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '20px' }}>
            Перейдите в бланк заказа, чтобы выбрать модули и сформировать первый заказ со счётом-фактурой.
          </p>
          <button onClick={onGoToOrder} className="btn btn-primary">
            Перейти в бланк заказа
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {partnerOrders.map(order => (
            <div key={order.id} className="glass-panel" style={{ padding: '22px 24px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px', marginBottom: '14px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>
                      #{order.id}
                    </span>
                    <span className="badge badge-blue">
                      {order.invoiceNumber}
                    </span>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: '600',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: '#eff6ff',
                      color: '#1d4ed8',
                      border: '1px solid #bfdbfe'
                    }}>
                      {order.statusLabel || 'В обработке'}
                    </span>
                  </div>

                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                    Оформлен: {new Date(order.createdAt).toLocaleString('ru-RU')} • Доставка: {order.deliveryAddress}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ textAlign: 'right', marginRight: '8px' }}>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>Сумма по счёту:</div>
                    <div style={{ fontSize: '19px', fontWeight: '800', color: '#1e40af' }}>
                      {order.summary?.finalTotal.toLocaleString('ru-RU')} ₽
                    </div>
                  </div>

                  <button
                    onClick={() => setTrackingOrder(order)}
                    className="btn btn-secondary"
                    style={{ padding: '8px 12px', fontSize: '12px' }}
                    title="Статус производства"
                  >
                    <Cpu size={14} style={{ color: '#2563eb' }} />
                    <span>Трекинг</span>
                  </button>

                  <button
                    onClick={() => onViewInvoice(order)}
                    className="btn btn-primary"
                    style={{ padding: '8px 14px', fontSize: '12px' }}
                  >
                    <Printer size={14} />
                    <span>Счёт-фактура</span>
                  </button>
                </div>
              </div>

              {/* Modules breakdown in this order */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Позиции:</span>
                {order.items?.map((it, i) => (
                  <span key={i} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '3px 8px', fontSize: '12px', color: '#0f172a' }}>
                    <strong style={{ color: '#2563eb' }}>{it.article}</strong> × {it.quantity} шт.
                  </span>
                ))}
                <span style={{ fontSize: '12px', color: '#64748b', marginLeft: 'auto' }}>
                  Фасады: {order.material?.name || 'Стандарт'} • {order.hinges?.name || 'Петли'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CNC Tracking Modal */}
      <OrderTrackingModal
        order={trackingOrder}
        isOpen={Boolean(trackingOrder)}
        onClose={() => setTrackingOrder(null)}
      />
    </div>
  );
}
