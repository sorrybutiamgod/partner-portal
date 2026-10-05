'use client';

import React, { useState } from 'react';
import { X, Ruler, Plus } from 'lucide-react';

export default function CustomModuleModal({ isOpen, onClose, onAddCustomModule }) {
  const [name, setName] = useState('Нестандартный модуль кухни');
  const [category, setCategory] = useState('lower');
  const [width, setWidth] = useState(475);
  const [height, setHeight] = useState(820);
  const [depth, setDepth] = useState(560);
  const [description, setDescription] = useState('Индивидуальный размер по эскизу дизайнера');

  if (!isOpen) return null;

  // Non-standard calculation formula
  const areaSqM = ((width / 1000) * (height / 1000));
  const baseCost = Math.round(areaSqM * 11500 + (depth / 1000) * 3500);
  const nonStandardMultiplier = 1.2;
  const calculatedPrice = Math.round(baseCost * nonStandardMultiplier);

  const handleAdd = (e) => {
    e.preventDefault();
    const customMod = {
      id: `custom-${Date.now()}`,
      article: `НЕСТАНД-${width}`,
      name: `${name} (${width}×${height}×${depth})`,
      category,
      categoryName: category === 'upper' ? 'Верхние нестандарт' : 'Нижние нестандарт',
      width: Number(width),
      height: Number(height),
      depth: Number(depth),
      basePrice: calculatedPrice,
      description: `${description} [Применен коэф. нестандарта ×1.2]`,
      image: category === 'upper' ? 'cabinet_upper_single' : 'cabinet_lower_single'
    };

    onAddCustomModule(customMod);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="glass-panel" 
        style={{ 
          maxWidth: '520px', 
          width: '100%', 
          padding: '30px', 
          background: '#ffffff', 
          border: '1px solid #bfdbfe',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.12)'
        }} 
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Ruler size={18} style={{ color: '#2563eb' }} />
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
              Расчёт нестандартного модуля
            </h3>
          </div>
          <button className="btn btn-secondary" onClick={onClose} style={{ padding: '6px 8px' }}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleAdd}>
          <div style={{ marginBottom: '14px' }}>
            <label className="form-label">Тип модуля</label>
            <select
              className="form-select"
              value={category}
              onChange={e => setCategory(e.target.value)}
            >
              <option value="upper">Верхний навесной модуль</option>
              <option value="lower">Нижний напольный модуль</option>
              <option value="tall">Высокая колонна / Пенал</option>
            </select>
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label className="form-label">Наименование</label>
            <input
              type="text"
              required
              className="form-input"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '16px' }}>
            <div>
              <label className="form-label">Ширина (мм)</label>
              <input
                type="number"
                min="150"
                max="1200"
                required
                className="form-input"
                value={width}
                onChange={e => setWidth(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="form-label">Высота (мм)</label>
              <input
                type="number"
                min="200"
                max="2600"
                required
                className="form-input"
                value={height}
                onChange={e => setHeight(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="form-label">Глубина (мм)</label>
              <input
                type="number"
                min="200"
                max="800"
                required
                className="form-input"
                value={depth}
                onChange={e => setDepth(Number(e.target.value))}
              />
            </div>
          </div>

          <div style={{ marginBottom: '18px' }}>
            <label className="form-label">Примечание к чертежу</label>
            <textarea
              rows="2"
              className="form-textarea"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          {/* Real-time Calculation Badge */}
          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px', padding: '14px', marginBottom: '22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '11px', color: '#1e40af', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Расчётная стоимость с нестандартом (+20%):
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                Габариты: {width} × {height} × {depth} мм
              </div>
            </div>
            <div style={{ fontSize: '20px', fontWeight: '800', color: '#1e3a8a' }}>
              {calculatedPrice.toLocaleString('ru-RU')} ₽
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
            <Plus size={16} /> Добавить в бланк заказа
          </button>
        </form>
      </div>
    </div>
  );
}
