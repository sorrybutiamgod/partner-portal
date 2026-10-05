'use client';

import React, { useState } from 'react';
import { FileText, Download, Check, Search, ShieldCheck, Box, HelpCircle, ExternalLink } from 'lucide-react';

export default function TechDocsSection({ docs, company }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchDoc, setSearchDoc] = useState('');
  const [downloadedId, setDownloadedId] = useState(null);

  const categories = [
    { id: 'all', name: 'Все материалы' },
    { id: 'tech', name: 'Присадочные карты' },
    { id: 'cad', name: '3D-модели (Базис / Max)' },
    { id: 'manual', name: 'Регламенты монтажа' },
    { id: 'legal', name: 'Сертификаты и ГОСТ' }
  ];

  const filteredDocs = docs.filter(d => {
    const matchesCat = activeCategory === 'all' || d.category === activeCategory;
    const matchesSearch = d.title.toLowerCase().includes(searchDoc.toLowerCase()) ||
                          d.desc.toLowerCase().includes(searchDoc.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleDownload = (doc) => {
    setDownloadedId(doc.id);
    setTimeout(() => setDownloadedId(null), 3000);
  };

  return (
    <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '36px 24px 80px 24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '32px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#2563eb', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
            <FileText size={14} /> ТЕХНИЧЕСКАЯ БАЗА И DOWNLOAD CENTER
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px' }}>
            Документация и 3D-библиотеки
          </h1>
          <p style={{ fontSize: '14px', color: '#64748b', marginTop: '4px' }}>
            Сквозные чертежи присадки 32 мм, параметрические модели для Базис-Мебельщик и сертификаты ГОСТ.
          </p>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', width: '280px' }}>
          <input
            type="text"
            placeholder="Поиск по документам..."
            className="form-input"
            value={searchDoc}
            onChange={e => setSearchDoc(e.target.value)}
            style={{ paddingLeft: '36px', height: '42px', fontSize: '13px' }}
          />
          <Search size={15} style={{ position: 'absolute', left: '12px', top: '13px', color: '#94a3b8' }} />
        </div>
      </div>

      {/* Categories */}
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

      {/* Docs Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px', marginBottom: '45px' }}>
        {filteredDocs.map(doc => {
          const isDownloaded = downloadedId === doc.id;

          return (
            <div
              key={doc.id}
              className="glass-panel"
              style={{
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span className="badge badge-blue">{doc.format}</span>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>{doc.size}</span>
                </div>

                <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', marginBottom: '8px', lineHeight: '1.3' }}>
                  {doc.title}
                </h3>

                <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.5' }}>
                  {doc.desc}
                </p>
              </div>

              <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
                <button
                  onClick={() => handleDownload(doc)}
                  className={isDownloaded ? "btn btn-secondary" : "btn btn-outline"}
                  style={{
                    width: '100%',
                    padding: '10px',
                    fontSize: '13px',
                    background: isDownloaded ? '#ecfdf5' : '#ffffff',
                    color: isDownloaded ? '#059669' : '#2563eb',
                    borderColor: isDownloaded ? '#a7f3d0' : '#bfdbfe'
                  }}
                >
                  {isDownloaded ? (
                    <>
                      <Check size={15} style={{ color: '#059669' }} />
                      <span>Файл загружен</span>
                    </>
                  ) : (
                    <>
                      <Download size={15} />
                      <span>Скачать архив ({doc.format})</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* FAQ Section */}
      <div className="glass-panel" style={{ padding: '32px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <HelpCircle size={22} style={{ color: '#2563eb' }} />
          <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.3px' }}>
            ТЕХНИЧЕСКИЙ РЕГЛАМЕНТ И ЧАСТЫЕ ВОПРОСЫ
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', fontSize: '13px', lineHeight: '1.6' }}>
          <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>Какая толщина кромки используется?</h4>
            <p style={{ color: '#64748b' }}>
              Все видимые торцы фасадов и корпусов обрабатываются влагостойкой ударопрочной кромкой 1.0 мм ABS на полиуретановом PUR-клее. Невидимые задние торцы — 0.4 мм.
            </p>
          </div>

          <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>Возможно ли изготовление нестандартных размеров?</h4>
            <p style={{ color: '#64748b' }}>
              Да. ЧПУ центры HOMAG фрезеруют модули с шагом до 1 мм. Для нестандартных модулей применяется коэффициент +20% к базовой стоимости.
            </p>
          </div>

          <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>Как упаковываются готовые модули?</h4>
            <p style={{ color: '#64748b' }}>
              В трехслойный гофрокартон с защитными пенопластовыми уголками и стретч-пленкой. На каждую пачку наносится термоэтикетка со штрихкодом и номером заказа.
            </p>
          </div>

          <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>Какая гарантия предоставляется партнёрам?</h4>
            <p style={{ color: '#64748b' }}>
              Гарантия на корпусные элементы составляет 3 года (36 месяцев). На фурнитуру Blum действует расширенная гарантия производителя 200 000 циклов.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
