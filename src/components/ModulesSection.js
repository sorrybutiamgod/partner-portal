'use client';

import React, { useState } from 'react';
import { Download, Search, Plus, Check, ShoppingBag, Eye, SlidersHorizontal, ArrowRight, Layers } from 'lucide-react';
import ModuleSvg from './ModuleSvg';
import { downloadModulesCatalogPDF } from '@/lib/pdfCatalogGenerator';

export default function ModulesSection({
  modules,
  materials,
  company,
  cartItems,
  onAddToCart,
  onGoToOrder
}) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', name: 'Все модули', count: modules.length },
    { id: 'upper', name: 'Верхние модули', count: modules.filter(m => m.category === 'upper').length },
    { id: 'lower', name: 'Нижние модули', count: modules.filter(m => m.category === 'lower').length },
    { id: 'tall', name: 'Пеналы и колонны', count: modules.filter(m => m.category === 'tall').length }
  ];

  const filteredModules = modules.filter(mod => {
    const matchesCat = activeCategory === 'all' || mod.category === activeCategory;
    const matchesSearch = mod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          mod.article.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (mod.description && mod.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleDownloadPDF = () => {
    downloadModulesCatalogPDF(company, modules, materials || []);
  };

  return (
    <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '36px 24px 80px 24px' }}>
      {/* Header and PDF Download */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '32px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#2563eb', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>
            <Layers size={14} /> Каталог фабричных модулей
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.3px' }}>
            Доступные модульные системы
          </h1>
          <p style={{ fontSize: '14px', color: '#64748b', marginTop: '4px' }}>
            Точная присадка под немецкую и австрийскую фурнитуру. Оптовые цены для партнёров.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button 
            onClick={handleDownloadPDF}
            className="btn btn-outline"
            style={{ padding: '10px 18px', fontSize: '13px' }}
          >
            <Download size={15} />
            <span>Скачать PDF-каталог модулей</span>
          </button>

          <button 
            onClick={onGoToOrder}
            className="btn btn-primary"
            style={{ padding: '10px 20px', fontSize: '13px' }}
          >
            <ShoppingBag size={15} />
            <span>Перейти в бланк заказа</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel" style={{ padding: '14px 18px', marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        {/* Categories */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {categories.map(cat => {
            const isCatActive = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  background: isCatActive ? '#2563eb' : '#ffffff',
                  color: isCatActive ? '#ffffff' : '#475569',
                  border: isCatActive ? '1px solid #1d4ed8' : '1px solid #e2e8f0',
                  borderRadius: '6px',
                  padding: '7px 14px',
                  fontSize: '13px',
                  fontWeight: isCatActive ? '600' : '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.15s ease',
                  boxShadow: isCatActive ? '0 1px 3px rgba(37, 99, 235, 0.2)' : 'none'
                }}
              >
                <span>{cat.name}</span>
                <span style={{
                  background: isCatActive ? 'rgba(255, 255, 255, 0.25)' : '#f1f5f9',
                  color: isCatActive ? '#ffffff' : '#64748b',
                  fontSize: '11px',
                  fontWeight: '600',
                  padding: '1px 6px',
                  borderRadius: '6px'
                }}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative', width: '320px', minWidth: '240px' }}>
          <input
            type="text"
            placeholder="Поиск по названию или артикулу..."
            className="form-input"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '36px', height: '38px', fontSize: '13px' }}
          />
          <Search size={16} style={{ position: 'absolute', left: '11px', top: '11px', color: '#94a3b8' }} />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{ position: 'absolute', right: '10px', top: '10px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '12px' }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Modules Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '22px' }}>
        {filteredModules.map(mod => {
          const qtyInCart = cartItems[mod.id] || 0;

          return (
            <div
              key={mod.id}
              className="glass-panel"
              style={{
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                position: 'relative',
                background: '#ffffff',
                border: qtyInCart > 0 ? '2px solid #2563eb' : '1px solid #e2e8f0',
                boxShadow: qtyInCart > 0 ? '0 4px 14px rgba(37, 99, 235, 0.12)' : '0 1px 3px rgba(0,0,0,0.04)'
              }}
            >
              {/* Header tags */}
              <div style={{ padding: '16px 20px 0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="badge badge-blue" style={{ fontSize: '11px', fontWeight: '700' }}>
                  {mod.article}
                </span>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  {mod.categoryName}
                </span>
              </div>

              {/* Vector Blueprint Drawing */}
              <div style={{ height: '170px', padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', margin: '12px 16px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                <ModuleSvg type={mod.image} />
              </div>

              {/* Details & Specs */}
              <div style={{ padding: '8px 20px 20px 20px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>
                  {mod.name}
                </h3>

                <p style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.5', marginBottom: '16px', flexGrow: 1 }}>
                  {mod.description}
                </p>

                {/* Dimensions bar */}
                <div style={{ display: 'flex', gap: '8px', background: '#f8fafc', border: '1px solid #e2e8f0', padding: '8px 12px', borderRadius: '6px', marginBottom: '16px', fontSize: '12px', color: '#475569', justifyContent: 'space-between' }}>
                  <span>В: <strong style={{ color: '#0f172a' }}>{mod.height} мм</strong></span>
                  <span>Ш: <strong style={{ color: '#0f172a' }}>{mod.width} мм</strong></span>
                  <span>Г: <strong style={{ color: '#0f172a' }}>{mod.depth} мм</strong></span>
                </div>

                {/* Price and Add button */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>Базовая цена:</div>
                    <div style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
                      {mod.basePrice.toLocaleString('ru-RU')} ₽
                    </div>
                  </div>

                  <button
                    onClick={() => onAddToCart(mod.id, (cartItems[mod.id] || 0) + 1)}
                    className={qtyInCart > 0 ? "btn btn-outline" : "btn btn-primary"}
                    style={{ padding: '8px 16px', fontSize: '12px' }}
                  >
                    {qtyInCart > 0 ? (
                      <>
                        <Check size={14} style={{ color: '#2563eb' }} />
                        <span>В бланке ({qtyInCart})</span>
                      </>
                    ) : (
                      <>
                        <Plus size={14} />
                        <span>В заказ</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredModules.length === 0 && (
        <div className="glass-panel" style={{ padding: '60px 20px', textAlign: 'center' }}>
          <p style={{ fontSize: '15px', color: '#64748b', marginBottom: '16px' }}>
            По вашему запросу «{searchQuery}» ничего не найдено
          </p>
          <button onClick={() => { setSearchQuery(''); setActiveCategory('all'); }} className="btn btn-secondary">
            Сбросить фильтры
          </button>
        </div>
      )}
    </div>
  );
}
