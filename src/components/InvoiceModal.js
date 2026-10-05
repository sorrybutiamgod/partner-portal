'use client';

import React from 'react';
import { X, Printer, Download, CheckCircle2, Building, Phone, Mail, FileText, Send } from 'lucide-react';
import { printInvoiceDocument, numberToWordsRu } from '@/lib/invoiceGenerator';

export default function InvoiceModal({ order, company, isOpen, onClose }) {
  if (!isOpen || !order) return null;

  const orderDate = new Date(order.createdAt).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const handlePrint = () => {
    printInvoiceDocument(order, company);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="glass-panel" 
        style={{ 
          maxWidth: '850px', 
          width: '100%', 
          maxHeight: '92vh', 
          overflowY: 'auto',
          padding: '32px',
          background: '#ffffff',
          border: '1px solid #bfdbfe',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.15)'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header with actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="badge badge-green" style={{ fontSize: '11px' }}>
                <CheckCircle2 size={13} /> Заказ успешно зафиксирован
              </span>
              <span className="badge badge-blue">
                {order.invoiceNumber}
              </span>
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: '800', marginTop: '6px', color: '#0f172a' }}>
              Счёт-фактура и спецификация к заказу #{order.id}
            </h2>
            <p style={{ fontSize: '13px', color: '#64748b' }}>
              Дата оформления: {orderDate}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-primary" onClick={handlePrint} title="Распечатать или сохранить в PDF">
              <Printer size={15} /> Печать / PDF
            </button>
            <button className="btn btn-secondary" onClick={onClose} style={{ padding: '8px 10px' }}>
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Telegram dispatch notice */}
        <div style={{ 
          background: '#eff6ff', 
          border: '1px solid #bfdbfe', 
          borderRadius: '6px', 
          padding: '12px 16px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px',
          marginBottom: '20px'
        }}>
          <div style={{ background: '#2563eb', borderRadius: '4px', padding: '6px', color: 'white', display: 'flex' }}>
            <Send size={15} />
          </div>
          <div style={{ fontSize: '13px', color: '#1e3a8a' }}>
            <strong>Уведомление отправлено диспетчеру фабрики:</strong>
            <span style={{ color: '#475569', marginLeft: '6px' }}>
              Спецификация заказа и контакты партнёра поступили в систему обработки.
            </span>
          </div>
        </div>

        {/* Requisites preview */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '20px' }}>
          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '12px', lineHeight: '1.6' }}>
            <div style={{ fontWeight: '700', color: '#2563eb', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Поставщик (Фабрика)
            </div>
            <div><strong style={{ color: '#0f172a' }}>{company.legalName}</strong></div>
            <div style={{ color: '#475569' }}>ИНН {company.inn} / КПП {company.kpp}</div>
            <div style={{ color: '#475569' }}>р/с {company.rs}</div>
            <div style={{ color: '#475569' }}>Банк: {company.bank} (БИК {company.bik})</div>
            <div style={{ color: '#475569' }}>Тел.: {company.phone}</div>
          </div>

          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '12px', lineHeight: '1.6' }}>
            <div style={{ fontWeight: '700', color: '#0f172a', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Плательщик (Партнёр)
            </div>
            <div><strong style={{ color: '#0f172a' }}>{order.partnerName}</strong></div>
            <div style={{ color: '#475569' }}>{order.partnerInn ? `ИНН ${order.partnerInn}` : 'Индивидуальный предприниматель'}</div>
            <div style={{ color: '#475569' }}>Телефон: {order.partnerPhone || 'Не указан'}</div>
            <div style={{ color: '#475569' }}>Email: {order.partnerEmail || '—'}</div>
            <div style={{ color: '#475569' }}>Адрес: {order.deliveryAddress}</div>
          </div>
        </div>

        {/* Selected options tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '20px', padding: '10px 14px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '12px' }}>
            <span style={{ color: '#64748b' }}>Материал фасадов: </span>
            <strong style={{ color: '#0f172a' }}>{order.material?.name || 'Стандарт'}</strong>
          </div>
          <div style={{ fontSize: '12px' }}>
            <span style={{ color: '#64748b' }}>Петли: </span>
            <strong style={{ color: '#0f172a' }}>{order.hinges?.name || 'Стандарт'}</strong>
          </div>
          <div style={{ fontSize: '12px' }}>
            <span style={{ color: '#64748b' }}>Ручки/профиль: </span>
            <strong style={{ color: '#0f172a' }}>{order.handle?.name || 'Без ручек'}</strong>
          </div>
        </div>

        {/* Items Table */}
        <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#f8fafc', color: '#475569', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '8px 10px', width: '35px' }}>№</th>
                <th style={{ padding: '8px 10px' }}>АРТИКУЛ / МОДУЛЬ</th>
                <th style={{ padding: '8px 10px', textAlign: 'center', width: '120px' }}>В×Ш×Г (ММ)</th>
                <th style={{ padding: '8px 10px', textAlign: 'center', width: '60px' }}>КОЛ-ВО</th>
                <th style={{ padding: '8px 10px', textAlign: 'right', width: '100px' }}>ЦЕНА</th>
                <th style={{ padding: '8px 10px', textAlign: 'right', width: '110px' }}>СУММА</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '9px 10px', color: '#64748b' }}>{idx + 1}</td>
                  <td style={{ padding: '9px 10px' }}>
                    <span style={{ fontWeight: '700', color: '#2563eb', marginRight: '6px' }}>{item.article}</span>
                    <span style={{ color: '#0f172a', fontWeight: '600' }}>{item.name}</span>
                  </td>
                  <td style={{ padding: '9px 10px', textAlign: 'center', color: '#475569', fontSize: '12px' }}>
                    {item.height}×{item.width}×{item.depth}
                  </td>
                  <td style={{ padding: '9px 10px', textAlign: 'center', fontWeight: '700', color: '#0f172a' }}>
                    {item.quantity} шт.
                  </td>
                  <td style={{ padding: '9px 10px', textAlign: 'right', color: '#64748b' }}>
                    {item.unitBasePrice.toLocaleString('ru-RU')} ₽
                  </td>
                  <td style={{ padding: '9px 10px', textAlign: 'right', fontWeight: '700', color: '#0f172a' }}>
                    {item.totalBasePrice.toLocaleString('ru-RU')} ₽
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Calculation summary */}
        <div style={{ background: '#f8fafc', padding: '16px 20px', borderRadius: '6px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
            <span style={{ color: '#64748b' }}>Базовая стоимость модулей:</span>
            <span style={{ fontWeight: '600', color: '#0f172a' }}>{order.summary.modulesBaseSum.toLocaleString('ru-RU')} ₽</span>
          </div>
          {order.summary.materialMultiplier > 1 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
              <span style={{ color: '#64748b' }}>Наценка за материал ({order.material?.name}):</span>
              <span style={{ color: '#2563eb', fontWeight: '600' }}>
                +{Math.round((order.summary.modulesBaseSum * (order.summary.materialMultiplier - 1)) + (order.summary.materialExtraSum || 0)).toLocaleString('ru-RU')} ₽
              </span>
            </div>
          )}
          {order.summary.hingesExtraSum > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
              <span style={{ color: '#64748b' }}>Фурнитура ({order.hinges?.name}):</span>
              <span style={{ color: '#2563eb', fontWeight: '600' }}>+{order.summary.hingesExtraSum.toLocaleString('ru-RU')} ₽</span>
            </div>
          )}
          {order.summary.handlesExtraSum > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
              <span style={{ color: '#64748b' }}>Ручки ({order.handle?.name}):</span>
              <span style={{ color: '#2563eb', fontWeight: '600' }}>+{order.summary.handlesExtraSum.toLocaleString('ru-RU')} ₽</span>
            </div>
          )}
          {order.summary.discountPercent > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
              <span style={{ color: '#059669', fontWeight: '600' }}>Скидка партнёра ({order.summary.discountPercent}%):</span>
              <span style={{ color: '#059669', fontWeight: '700' }}>-{order.summary.discountSum.toLocaleString('ru-RU')} ₽</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: '12px', marginTop: '10px', fontSize: '15px', fontWeight: '800' }}>
            <span style={{ color: '#0f172a' }}>ИТОГО К ОПЛАТЕ (в т. ч. НДС 20%):</span>
            <span style={{ color: '#1e3a8a', fontSize: '22px' }}>
              {order.summary.finalTotal.toLocaleString('ru-RU')} ₽
            </span>
          </div>
        </div>

        {/* Footer actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: '#64748b' }}>
            Счёт действителен в течение 5 банковских дней.
          </span>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-secondary" onClick={onClose}>
              Закрыть
            </button>
            <button className="btn btn-primary" onClick={handlePrint}>
              <Printer size={15} /> Распечатать / Сохранить в PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
