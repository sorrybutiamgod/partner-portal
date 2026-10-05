'use client';

import React, { useState } from 'react';
import { 
  ShoppingBag, Trash2, Plus, Minus, Check, ArrowRight, 
  Send, AlertCircle, CheckCircle2, Ruler, Building, Phone, MapPin, 
  FileText, Sparkles, Layers, Box
} from 'lucide-react';
import confetti from 'canvas-confetti';
import ModuleSvg from './ModuleSvg';
import CustomModuleModal from './CustomModuleModal';

export default function OrderCalculator({
  modules,
  materials,
  hardware,
  cartItems,
  onUpdateCart,
  currentUser,
  onOrderSuccess,
  onOpenAuth
}) {
  const [selectedMaterialId, setSelectedMaterialId] = useState(materials[0]?.id || 'mat-1');
  const [selectedHingesId, setSelectedHingesId] = useState(hardware.find(h => h.category === 'hinges')?.id || 'hd-1');
  const [selectedHandleId, setSelectedHandleId] = useState(hardware.find(h => h.category === 'handles')?.id || 'hd-4');

  const [deliveryAddress, setDeliveryAddress] = useState(currentUser?.deliveryAddress || '');
  const [comment, setComment] = useState('');
  
  // Guest checkout fields
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestInn, setGuestInn] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [orderError, setOrderError] = useState('');

  // Category filter inside Order Blank
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchMod, setSearchMod] = useState('');

  // Non-standard custom modules created on the fly
  const [customList, setCustomList] = useState([]);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);

  // Combine default modules + custom items
  const allAvailableModules = [...modules, ...customList];

  // Pricing calculations
  const selectedMaterial = materials.find(m => m.id === selectedMaterialId) || materials[0];
  const selectedHinges = hardware.find(h => h.id === selectedHingesId);
  const selectedHandle = hardware.find(h => h.id === selectedHandleId);

  let totalModulesCount = 0;
  let modulesBaseSum = 0;

  for (const [modId, qty] of Object.entries(cartItems)) {
    const q = parseInt(qty, 10);
    if (q > 0) {
      const mod = allAvailableModules.find(m => m.id === modId);
      if (mod) {
        totalModulesCount += q;
        modulesBaseSum += mod.basePrice * q;
      }
    }
  }

  const materialMultiplier = selectedMaterial?.multiplier || 1.0;
  const materialExtraSum = (selectedMaterial?.extraCostPerModule || 0) * totalModulesCount;
  const hingesExtraSum = (selectedHinges?.pricePerUnit || 0) * totalModulesCount;
  const handlesExtraSum = (selectedHandle?.pricePerUnit || 0) * totalModulesCount;

  const baseWithMaterial = Math.round(modulesBaseSum * materialMultiplier);
  const subtotal = baseWithMaterial + hingesExtraSum + handlesExtraSum;

  const discountPercent = currentUser?.discountPercent || 0;
  const discountSum = Math.round((subtotal * discountPercent) / 100);
  const finalTotal = subtotal - discountSum;

  const handleQtyChange = (modId, nextQty) => {
    const q = Math.max(0, parseInt(nextQty, 10) || 0);
    onUpdateCart(modId, q);
  };

  const handleClearCart = () => {
    if (confirm('Очистить выбранные модули?')) {
      for (const id of Object.keys(cartItems)) {
        onUpdateCart(id, 0);
      }
    }
  };

  const handleSubmitOrder = async () => {
    if (totalModulesCount === 0) {
      setOrderError('Пожалуйста, выберите хотя бы один модуль в бланк заказа.');
      return;
    }

    let partnerInfo = currentUser;
    if (!currentUser) {
      if (!guestName.trim() || !guestPhone.trim()) {
        setOrderError('Пожалуйста, укажите имя/организацию и контактный телефон для оформления счёта.');
        return;
      }
      partnerInfo = {
        id: 'usr_guest',
        name: guestName.trim(),
        companyName: guestName.trim(),
        phone: guestPhone.trim(),
        email: guestEmail.trim(),
        inn: guestInn.trim(),
        deliveryAddress: deliveryAddress.trim(),
        discountPercent: 0
      };
    }

    setSubmitting(true);
    setOrderError('');

    try {
      const payload = {
        partner: partnerInfo,
        cartItems,
        materialId: selectedMaterialId,
        hingesId: selectedHingesId,
        handleId: selectedHandleId,
        deliveryAddress: deliveryAddress.trim(),
        comment: comment.trim()
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!data.success) {
        setOrderError(data.error || 'Ошибка при оформлении заказа');
      } else {
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#2563eb', '#3b82f6', '#93c5fd']
          });
        } catch (e) {
          // Ignore
        }
        onOrderSuccess(data.order);
      }
    } catch (err) {
      setOrderError('Ошибка соединения с сервером при отправке заказа');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredList = allAvailableModules.filter(m => {
    const matchesCat = filterCategory === 'all' || m.category === filterCategory;
    const matchesSearch = m.name.toLowerCase().includes(searchMod.toLowerCase()) ||
                          m.article.toLowerCase().includes(searchMod.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '36px 24px 80px 24px' }}>
      {/* Title */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#2563eb', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>
          <Layers size={14} /> Конфигуратор спецификации
        </div>
        <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.3px' }}>
          Онлайн-бланк заказа
        </h1>
        <p style={{ fontSize: '14px', color: '#64748b', marginTop: '4px' }}>
          Мгновенный автоматический расчет стоимости модулей, материалов отделки и фурнитуры.
        </p>
      </div>

      {orderError && (
        <div style={{ 
          background: '#fef2f2', 
          border: '1px solid #fecaca', 
          color: '#991b1b', 
          padding: '14px 18px', 
          borderRadius: '8px', 
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '14px'
        }}>
          <AlertCircle size={20} style={{ color: '#ef4444', flexShrink: 0 }} />
          <span>{orderError}</span>
        </div>
      )}

      {/* Main Grid: Left Steps (70%) + Right Summary (30%) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 390px', gap: '28px', alignItems: 'start' }}>
        {/* Left Column: Steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* STEP 1: MODULES SELECTOR */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: '#2563eb', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '13px' }}>
                  01
                </div>
                <div>
                  <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>Выбор модулей и количества</h2>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Укажите требуемые позиции для производства</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setIsCustomModalOpen(true)}
                  className="btn btn-outline"
                  style={{ fontSize: '12px', padding: '6px 12px' }}
                >
                  <Ruler size={13} /> + Нестандартный размер
                </button>

                {totalModulesCount > 0 && (
                  <button onClick={handleClearCart} className="btn btn-secondary" style={{ fontSize: '12px', padding: '6px 12px', color: '#ef4444' }}>
                    <Trash2 size={13} /> Очистить
                  </button>
                )}
              </div>
            </div>

            {/* Sub-filter tabs & search */}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                {[
                  { id: 'all', label: 'Все модули' },
                  { id: 'upper', label: 'Верхние' },
                  { id: 'lower', label: 'Нижние' },
                  { id: 'tall', label: 'Пеналы' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setFilterCategory(tab.id)}
                    style={{
                      background: filterCategory === tab.id ? '#2563eb' : '#ffffff',
                      color: filterCategory === tab.id ? '#ffffff' : '#475569',
                      border: filterCategory === tab.id ? '1px solid #1d4ed8' : '1px solid #e2e8f0',
                      borderRadius: '6px',
                      padding: '6px 14px',
                      fontSize: '12px',
                      fontWeight: filterCategory === tab.id ? '600' : '500',
                      cursor: 'pointer'
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <input
                type="text"
                placeholder="Поиск по артикулу..."
                className="form-input"
                value={searchMod}
                onChange={e => setSearchMod(e.target.value)}
                style={{ width: '220px', padding: '6px 12px', fontSize: '12px' }}
              />
            </div>

            {/* Modules Table in Order Blank */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {filteredList.map(mod => {
                const qty = cartItems[mod.id] || 0;
                const isSelected = qty > 0;

                return (
                  <div
                    key={mod.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: '6px',
                      background: isSelected ? '#eff6ff' : '#ffffff',
                      border: isSelected ? '1px solid #bfdbfe' : '1px solid #f1f5f9',
                      transition: 'all 0.15s ease',
                      gap: '12px'
                    }}
                  >
                    {/* Small blueprint icon */}
                    <div style={{ width: '42px', height: '42px', flexShrink: 0, background: '#f8fafc', borderRadius: '4px', padding: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ModuleSvg type={mod.image} />
                    </div>

                    {/* Article & Name */}
                    <div style={{ flexGrow: 1, minWidth: '160px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: '#2563eb' }}>{mod.article}</span>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a' }}>{mod.name}</span>
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                        {mod.height}×{mod.width}×{mod.depth} мм • {mod.categoryName}
                      </div>
                    </div>

                    {/* Unit Price */}
                    <div style={{ textAlign: 'right', minWidth: '95px' }}>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>
                        {mod.basePrice.toLocaleString('ru-RU')} ₽
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>за шт.</div>
                    </div>

                    {/* Quantity controls (+ / -) */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <button
                        onClick={() => handleQtyChange(mod.id, qty - 1)}
                        disabled={qty === 0}
                        style={{
                          width: '30px',
                          height: '30px',
                          borderRadius: '4px',
                          background: qty > 0 ? '#ffffff' : '#f8fafc',
                          color: qty > 0 ? '#0f172a' : '#cbd5e1',
                          border: '1px solid #cbd5e1',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: qty > 0 ? 'pointer' : 'default'
                        }}
                      >
                        <Minus size={13} />
                      </button>

                      <input
                        type="number"
                        min="0"
                        value={qty || 0}
                        onChange={e => handleQtyChange(mod.id, e.target.value)}
                        style={{
                          width: '44px',
                          height: '30px',
                          textAlign: 'center',
                          background: '#ffffff',
                          border: isSelected ? '1px solid #2563eb' : '1px solid #cbd5e1',
                          color: '#0f172a',
                          borderRadius: '4px',
                          fontWeight: '700',
                          fontSize: '13px'
                        }}
                      />

                      <button
                        onClick={() => handleQtyChange(mod.id, qty + 1)}
                        style={{
                          width: '30px',
                          height: '30px',
                          borderRadius: '4px',
                          background: '#2563eb',
                          color: '#ffffff',
                          border: '1px solid #1d4ed8',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    {/* Line total */}
                    <div style={{ textAlign: 'right', minWidth: '95px' }}>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: isSelected ? '#1e40af' : '#94a3b8' }}>
                        {(mod.basePrice * qty).toLocaleString('ru-RU')} ₽
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 2: MATERIAL SELECTOR */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: '#2563eb', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '13px' }}>
                02
              </div>
              <div>
                <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>Материал фасадов и отделки</h2>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Выберите категорию материала для всего заказа</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '12px' }}>
              {materials.map(mat => {
                const isSelected = selectedMaterialId === mat.id;
                const multiplierPct = Math.round((mat.multiplier - 1) * 100);

                return (
                  <div
                    key={mat.id}
                    onClick={() => setSelectedMaterialId(mat.id)}
                    style={{
                      padding: '14px',
                      borderRadius: '8px',
                      background: isSelected ? '#eff6ff' : '#ffffff',
                      border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      boxShadow: isSelected ? '0 2px 8px rgba(37, 99, 235, 0.1)' : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '14px', height: '14px', borderRadius: '50%', background: mat.colorSample, border: '1px solid #cbd5e1' }}></span>
                        <span style={{ fontSize: '11px', background: isSelected ? '#dbeafe' : '#f1f5f9', padding: '2px 6px', borderRadius: '4px', color: isSelected ? '#1e40af' : '#475569', fontWeight: '600' }}>
                          {mat.badge}
                        </span>
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: '700', color: mat.multiplier > 1 ? '#2563eb' : '#64748b' }}>
                        {mat.multiplier === 1 ? 'Базовая' : `+${multiplierPct}%`}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>
                      {mat.name}
                    </h4>

                    <p style={{ fontSize: '11px', color: '#64748b', lineHeight: '1.4' }}>
                      {mat.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 3: HARDWARE & HANDLES SELECTOR */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: '#2563eb', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '13px' }}>
                03
              </div>
              <div>
                <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>Фурнитура и ручки</h2>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Европейские петли с доводчиками и типы лицевой фурнитуры</div>
              </div>
            </div>

            {/* Hinges */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#0f172a', marginBottom: '10px' }}>
                Петли и доводчики:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
                {hardware.filter(h => h.category === 'hinges').map(hd => {
                  const isSelected = selectedHingesId === hd.id;

                  return (
                    <div
                      key={hd.id}
                      onClick={() => setSelectedHingesId(hd.id)}
                      style={{
                        padding: '12px 14px',
                        borderRadius: '6px',
                        background: isSelected ? '#eff6ff' : '#ffffff',
                        border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a' }}>{hd.name}</span>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: hd.pricePerUnit === 0 ? '#059669' : '#2563eb' }}>
                          {hd.pricePerUnit === 0 ? 'Включено' : `+${hd.pricePerUnit} ₽`}
                        </span>
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{hd.description}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Handles & Gola Profile */}
            <div>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#0f172a', marginBottom: '10px' }}>
                Ручки и профильные системы:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
                {hardware.filter(h => h.category === 'handles').map(hd => {
                  const isSelected = selectedHandleId === hd.id;

                  return (
                    <div
                      key={hd.id}
                      onClick={() => setSelectedHandleId(hd.id)}
                      style={{
                        padding: '12px 14px',
                        borderRadius: '6px',
                        background: isSelected ? '#eff6ff' : '#ffffff',
                        border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a' }}>{hd.name}</span>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: '#2563eb' }}>
                          +{hd.pricePerUnit} ₽
                        </span>
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{hd.description}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* STEP 4: DELIVERY & COMMENTS */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: '#2563eb', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '13px' }}>
                04
              </div>
              <div>
                <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>Реквизиты и адрес доставки</h2>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Данные плательщика и адрес отгрузки со склада</div>
              </div>
            </div>

            {!currentUser && (
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', marginBottom: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>Данные для выставления счёта:</span>
                  <button onClick={onOpenAuth} className="btn btn-secondary" style={{ fontSize: '12px', padding: '4px 10px' }}>
                    Войти в аккаунт
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label className="form-label">Организация / ИП *</label>
                    <input
                      type="text"
                      placeholder="ИП Смирнов А.В."
                      className="form-input"
                      value={guestName}
                      onChange={e => setGuestName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="form-label">Телефон *</label>
                    <input
                      type="tel"
                      placeholder="+7 (903) 123-45-67"
                      className="form-input"
                      value={guestPhone}
                      onChange={e => setGuestPhone(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            <div style={{ marginBottom: '14px' }}>
              <label className="form-label">Адрес доставки</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="г. Москва, ул. Складская 14 / Самовывоз"
                  className="form-input"
                  value={deliveryAddress}
                  onChange={e => setDeliveryAddress(e.target.value)}
                  style={{ paddingLeft: '36px' }}
                />
                <MapPin size={16} style={{ position: 'absolute', left: '12px', top: '11px', color: '#2563eb' }} />
              </div>
            </div>

            <div>
              <label className="form-label">Комментарий к спецификации</label>
              <textarea
                rows="2"
                placeholder="Цвет эмали RAL, высота цоколя, особенности монтажа..."
                className="form-textarea"
                value={comment}
                onChange={e => setComment(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Summary & Instant Recalculation */}
        <div style={{ position: 'sticky', top: '92px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-panel" style={{
            padding: '24px',
            border: '1px solid #bfdbfe',
            boxShadow: '0 4px 16px rgba(37, 99, 235, 0.08)',
            background: '#ffffff'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
              <Box size={20} style={{ color: '#2563eb' }} />
              <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#0f172a' }}>
                Итоговый расчёт
              </h3>
            </div>

            {/* Modules count */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '13px' }}>
              <span style={{ color: '#64748b' }}>Всего модулей:</span>
              <strong style={{ color: totalModulesCount > 0 ? '#0f172a' : '#94a3b8' }}>
                {totalModulesCount} шт.
              </strong>
            </div>

            {/* Base modules sum */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '13px' }}>
              <span style={{ color: '#64748b' }}>Базовая стоимость:</span>
              <span style={{ fontWeight: '600', color: '#0f172a' }}>{modulesBaseSum.toLocaleString('ru-RU')} ₽</span>
            </div>

            {/* Material factor */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '13px' }}>
              <span style={{ color: '#64748b', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                Материал ({selectedMaterial?.badge}):
              </span>
              <span style={{ color: materialMultiplier > 1 ? '#2563eb' : '#64748b', fontWeight: '600' }}>
                {materialMultiplier > 1 ? `+${Math.round((baseWithMaterial - modulesBaseSum) + materialExtraSum).toLocaleString('ru-RU')} ₽` : '0 ₽'}
              </span>
            </div>

            {/* Hinges */}
            {hingesExtraSum > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '13px' }}>
                <span style={{ color: '#64748b' }}>Петли:</span>
                <span style={{ color: '#2563eb', fontWeight: '600' }}>+{hingesExtraSum.toLocaleString('ru-RU')} ₽</span>
              </div>
            )}

            {/* Handles */}
            {handlesExtraSum > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '13px' }}>
                <span style={{ color: '#64748b' }}>Ручки:</span>
                <span style={{ color: '#2563eb', fontWeight: '600' }}>+{handlesExtraSum.toLocaleString('ru-RU')} ₽</span>
              </div>
            )}

            {/* Partner discount */}
            {discountPercent > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '13px' }}>
                <span style={{ color: '#059669', fontWeight: '600' }}>Скидка партнёра ({discountPercent}%):</span>
                <span style={{ color: '#059669', fontWeight: '700' }}>-{discountSum.toLocaleString('ru-RU')} ₽</span>
              </div>
            )}

            {/* Divider */}
            <div style={{ height: '1px', background: '#e2e8f0', margin: '16px 0' }} />

            {/* Final Total */}
            <div style={{ marginBottom: '8px' }}>
              <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Сумма к оплате по счёту:
              </div>
              <div style={{ fontSize: '30px', fontWeight: '900', color: '#1e3a8a', letterSpacing: '-0.5px' }}>
                {finalTotal.toLocaleString('ru-RU')} ₽
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                в т. ч. НДС 20%: {Math.round((finalTotal * 20 / 120)).toLocaleString('ru-RU')} ₽
              </div>
            </div>

            {/* Main Submit Order Button */}
            <button
              onClick={handleSubmitOrder}
              disabled={submitting || totalModulesCount === 0}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '14px',
                fontWeight: '700',
                marginTop: '16px',
                opacity: totalModulesCount === 0 ? 0.45 : 1,
                cursor: totalModulesCount === 0 ? 'not-allowed' : 'pointer'
              }}
            >
              {submitting ? (
                <span>Оформление заказа...</span>
              ) : (
                <>
                  <Send size={16} />
                  <span>Оформить заказ</span>
                </>
              )}
            </button>

            {/* Notice */}
            <div style={{ marginTop: '16px', fontSize: '12px', color: '#64748b', lineHeight: '1.5', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <CheckCircle2 size={14} style={{ color: '#2563eb', flexShrink: 0 }} />
                <span>Автоматический счёт-фактура с печатью</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <CheckCircle2 size={14} style={{ color: '#2563eb', flexShrink: 0 }} />
                <span>Мгновенное уведомление диспетчеру в Telegram</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Non-standard dimensions calculator modal */}
      <CustomModuleModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onAddCustomModule={(customMod) => {
          setCustomList(prev => [...prev, customMod]);
          handleQtyChange(customMod.id, 1);
        }}
      />
    </div>
  );
}
