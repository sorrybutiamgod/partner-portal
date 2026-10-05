'use client';

import React from 'react';
import { 
  Building, MapPin, Phone, Mail, Clock, ShieldCheck, 
  FileText, Download, ArrowRight, Award, Cpu, Truck, CheckCircle2
} from 'lucide-react';
import { downloadModulesCatalogPDF } from '@/lib/pdfCatalogGenerator';

export default function HomeSection({ company, modules, materials, onGoToOrder, onGoToModules }) {
  if (!company) return null;

  const handleDownloadCatalog = () => {
    downloadModulesCatalogPDF(company, modules, materials || []);
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '36px 24px 80px 24px' }}>
      {/* Classic Executive Hero Banner */}
      <div className="glass-panel" style={{
        position: 'relative',
        overflow: 'hidden',
        padding: '52px 48px',
        marginBottom: '36px',
        border: '1px solid #bfdbfe',
        background: 'linear-gradient(135deg, #ffffff 0%, #f0f7ff 100%)',
        boxShadow: '0 4px 20px rgba(37, 99, 235, 0.08)'
      }}>
        {/* Soft decorative background tint */}
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          width: '45%',
          backgroundImage: 'radial-gradient(#dbeafe 1.5px, transparent 1.5px)',
          backgroundSize: '20px 20px',
          opacity: 0.6,
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: '780px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#eff6ff', border: '1px solid #bfdbfe', padding: '5px 12px', borderRadius: '6px', marginBottom: '20px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2563eb' }}></span>
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#1d4ed8', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              Серийное производство полного цикла • Точность 0.1 мм
            </span>
          </div>

          <h1 style={{ 
            fontSize: '38px', 
            fontWeight: '800', 
            lineHeight: '1.2', 
            marginBottom: '16px', 
            color: '#0f172a', 
            letterSpacing: '-0.5px'
          }}>
            {company.brandTitle}
          </h1>

          <p style={{ fontSize: '16px', color: '#475569', lineHeight: '1.6', marginBottom: '32px' }}>
            {company.aboutText}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            <button onClick={onGoToOrder} className="btn btn-primary" style={{ padding: '13px 26px', fontSize: '14px' }}>
              <span>Перейти в бланк заказа</span>
              <ArrowRight size={16} />
            </button>
            <button onClick={onGoToModules} className="btn btn-secondary" style={{ padding: '13px 22px', fontSize: '14px' }}>
              Каталог модулей
            </button>
            <button onClick={handleDownloadCatalog} className="btn btn-outline" style={{ padding: '13px 20px', fontSize: '14px' }}>
              <Download size={16} /> Скачать PDF-каталог
            </button>
          </div>
        </div>
      </div>

      {/* Production Telemetry Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        {(company.advantages || []).map((adv, idx) => (
          <div key={idx} className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '10px', borderLeft: '3px solid #2563eb' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#eff6ff', border: '1px solid #dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
              {idx === 0 && <Cpu size={20} />}
              {idx === 1 && <Award size={20} />}
              {idx === 2 && <Truck size={20} />}
              {idx === 3 && <ShieldCheck size={20} />}
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>{adv.title}</h3>
            <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.5' }}>{adv.desc}</p>
          </div>
        ))}
      </div>

      {/* Company Requisites & Contacts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        {/* Contact info card */}
        <div className="glass-panel" style={{ padding: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '22px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#eff6ff', border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
              <Phone size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
                Контакты фабрики
              </h2>
              <div style={{ fontSize: '12px', color: '#64748b' }}>Отдел логистики и приёма заказов</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '14px' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <MapPin size={18} style={{ color: '#2563eb', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ color: '#64748b', fontSize: '12px', fontWeight: '500' }}>Офис продаж:</div>
                <div style={{ fontWeight: '600', color: '#0f172a' }}>{company.address}</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <Building size={18} style={{ color: '#2563eb', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ color: '#64748b', fontSize: '12px', fontWeight: '500' }}>Адрес производства и склада:</div>
                <div style={{ fontWeight: '600', color: '#0f172a' }}>{company.productionAddress}</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <Phone size={18} style={{ color: '#2563eb', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ color: '#64748b', fontSize: '12px', fontWeight: '500' }}>Телефон отдела партнёров:</div>
                <div style={{ fontWeight: '700', color: '#0f172a' }}>{company.phone} / {company.mobilePhone}</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <Mail size={18} style={{ color: '#2563eb', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ color: '#64748b', fontSize: '12px', fontWeight: '500' }}>Электронная почта:</div>
                <div style={{ fontWeight: '600', color: '#2563eb' }}>{company.email}</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <Clock size={18} style={{ color: '#64748b', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ color: '#64748b', fontSize: '12px', fontWeight: '500' }}>Режим работы:</div>
                <div style={{ fontWeight: '600', color: '#0f172a' }}>{company.workHours}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Legal and Bank Requisites Card */}
        <div className="glass-panel" style={{ padding: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '22px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#eff6ff', border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
              <FileText size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
                Реквизиты компании
              </h2>
              <div style={{ fontSize: '12px', color: '#64748b' }}>Для выставления счетов и договоров</div>
            </div>
          </div>

          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px' }}>
              <span style={{ color: '#64748b' }}>Организация:</span>
              <strong style={{ color: '#0f172a' }}>{company.legalName}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px' }}>
              <span style={{ color: '#64748b' }}>ИНН / КПП:</span>
              <span style={{ fontFamily: 'var(--font-mono)', color: '#0f172a', fontWeight: '600' }}>{company.inn} / {company.kpp}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px' }}>
              <span style={{ color: '#64748b' }}>ОГРН:</span>
              <span style={{ fontFamily: 'var(--font-mono)', color: '#0f172a' }}>{company.ogrn}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px' }}>
              <span style={{ color: '#64748b' }}>Банк:</span>
              <span style={{ color: '#0f172a' }}>{company.bank}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px' }}>
              <span style={{ color: '#64748b' }}>БИК:</span>
              <span style={{ fontFamily: 'var(--font-mono)', color: '#0f172a' }}>{company.bik}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px' }}>
              <span style={{ color: '#64748b' }}>Расчётный счёт:</span>
              <span style={{ fontFamily: 'var(--font-mono)', color: '#2563eb', fontWeight: '700' }}>{company.rs}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Корр. счёт:</span>
              <span style={{ fontFamily: 'var(--font-mono)', color: '#64748b' }}>{company.ks}</span>
            </div>
          </div>

          <div style={{ marginTop: '16px', padding: '12px 14px', background: '#eff6ff', borderRadius: '6px', borderLeft: '3px solid #2563eb', fontSize: '12px', color: '#334155' }}>
            Генеральный директор: <strong style={{ color: '#0f172a' }}>{company.director}</strong><br />
            Все счета-фактуры формируются автоматически с подписью и печатью.
          </div>
        </div>
      </div>
    </div>
  );
}
