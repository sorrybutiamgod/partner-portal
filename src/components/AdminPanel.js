'use client';

import React, { useState } from 'react';
import { 
  Package, Palette, Wrench, ClipboardList, Settings, 
  Plus, Edit2, Trash2, Check, X, Send, Eye, ShieldCheck, 
  Phone, MapPin, Building, Printer, AlertCircle, CheckCircle2, Layers
} from 'lucide-react';
import { printInvoiceDocument } from '@/lib/invoiceGenerator';

export default function AdminPanel({
  company,
  modules,
  materials,
  hardware,
  orders,
  onRefreshData,
  onViewInvoice
}) {
  const [activeTab, setActiveTab] = useState('modules'); // 'modules' | 'materials' | 'hardware' | 'orders' | 'settings'
  
  // Feedback
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Module edit/add modal
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState(null);
  const [moduleForm, setModuleForm] = useState({
    article: '',
    name: '',
    category: 'upper',
    width: 600,
    height: 720,
    depth: 320,
    basePrice: 5000,
    description: '',
    image: 'cabinet_upper_single'
  });

  // Material edit modal
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [materialForm, setMaterialForm] = useState({
    name: '',
    code: '',
    multiplier: 1.0,
    extraCostPerModule: 0,
    badge: 'Новинка',
    colorSample: '#2563eb',
    description: ''
  });

  // Hardware edit modal
  const [isHardwareModalOpen, setIsHardwareModalOpen] = useState(false);
  const [editingHardware, setEditingHardware] = useState(null);
  const [hardwareForm, setHardwareForm] = useState({
    name: '',
    category: 'handles',
    pricePerUnit: 0,
    description: ''
  });

  // Settings state
  const [settingsForm, setSettingsForm] = useState({
    telegramBotToken: '',
    telegramChatId: '',
    telegramEnabled: true,
    adminEmailNotification: 'admin@modulpro-factory.ru',
    invoiceVatRate: 20
  });
  const [companyForm, setCompanyForm] = useState({ ...company });
  const [testStatus, setTestStatus] = useState(null);

  // Open add module modal
  const handleOpenAddModule = () => {
    setEditingModule(null);
    setModuleForm({
      article: 'ВШ-' + Math.floor(Math.random() * 900 + 100),
      name: 'Шкаф навесной новый',
      category: 'upper',
      width: 600,
      height: 720,
      depth: 320,
      basePrice: 5500,
      description: 'Корпусной модуль с присадкой под фурнитуру',
      image: 'cabinet_upper_single'
    });
    setIsModuleModalOpen(true);
  };

  // Open edit module modal
  const handleOpenEditModule = (mod) => {
    setEditingModule(mod);
    setModuleForm({
      article: mod.article,
      name: mod.name,
      category: mod.category,
      width: mod.width,
      height: mod.height,
      depth: mod.depth,
      basePrice: mod.basePrice,
      description: mod.description,
      image: mod.image
    });
    setIsModuleModalOpen(true);
  };

  // Save module (add / update)
  const handleSaveModule = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch('/api/modules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: editingModule ? 'update' : 'add',
          moduleId: editingModule?.id,
          moduleData: moduleForm
        })
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.error || 'Ошибка при сохранении модуля');
      } else {
        setMessage(editingModule ? 'Модуль успешно обновлён' : 'Новый модуль успешно добавлен в каталог');
        setIsModuleModalOpen(false);
        onRefreshData();
      }
    } catch (err) {
      setError('Ошибка соединения');
    } finally {
      setLoading(false);
    }
  };

  // Delete module
  const handleDeleteModule = async (modId, article) => {
    if (!confirm(`Вы действительно хотите удалить модуль ${article}?`)) return;
    setLoading(true);
    try {
      const res = await fetch('/api/modules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', moduleId: modId })
      });
      const data = await res.json();
      if (data.success) {
        setMessage(`Модуль ${article} удалён`);
        onRefreshData();
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Ошибка удаления');
    } finally {
      setLoading(false);
    }
  };

  // Open add material modal
  const handleOpenAddMaterial = () => {
    setEditingMaterial(null);
    setMaterialForm({
      name: '',
      code: 'MDF-' + Date.now().toString().slice(-4),
      multiplier: 1.2,
      extraCostPerModule: 1000,
      badge: 'Новинка',
      colorSample: '#2563eb',
      description: 'Влагостойкая отделка'
    });
    setIsMaterialModalOpen(true);
  };

  // Open edit material modal
  const handleOpenEditMaterial = (mat) => {
    setEditingMaterial(mat);
    setMaterialForm({
      name: mat.name,
      code: mat.code,
      multiplier: mat.multiplier,
      extraCostPerModule: mat.extraCostPerModule || 0,
      badge: mat.badge || 'Декор',
      colorSample: mat.colorSample || '#2563eb',
      description: mat.description || ''
    });
    setIsMaterialModalOpen(true);
  };

  // Save material
  const handleSaveMaterial = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/materials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: editingMaterial ? 'update' : 'add',
          materialId: editingMaterial?.id,
          materialData: materialForm
        })
      });
      const data = await res.json();
      if (data.success) {
        setMessage('Материал успешно сохранён');
        setIsMaterialModalOpen(false);
        onRefreshData();
      }
    } catch (err) {
      setError('Ошибка при сохранении материала');
    } finally {
      setLoading(false);
    }
  };

  // Open edit hardware modal
  const handleOpenEditHardware = (hd) => {
    setEditingHardware(hd);
    setHardwareForm({
      name: hd.name,
      category: hd.category,
      pricePerUnit: hd.pricePerUnit,
      description: hd.description
    });
    setIsHardwareModalOpen(true);
  };

  // Save hardware
  const handleSaveHardware = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/hardware', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update',
          hardwareId: editingHardware?.id,
          hardwareData: hardwareForm
        })
      });
      const data = await res.json();
      if (data.success) {
        setMessage('Цена и параметры фурнитуры обновлены');
        setIsHardwareModalOpen(false);
        onRefreshData();
      }
    } catch (err) {
      setError('Ошибка при сохранении');
    } finally {
      setLoading(false);
    }
  };

  // Update order status
  const handleUpdateOrderStatus = async (orderId, nextStatus) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });
      const data = await res.json();
      if (data.success) {
        setMessage(`Статус заказа #${orderId} изменён`);
        onRefreshData();
      }
    } catch (err) {
      setError('Ошибка при смене статуса');
    } finally {
      setLoading(false);
    }
  };

  // Save factory settings & telegram
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company: companyForm,
          settings: settingsForm
        })
      });
      const data = await res.json();
      if (data.success) {
        setMessage('Настройки фабрики и Telegram успешно сохранены');
        onRefreshData();
      }
    } catch (err) {
      setError('Ошибка сохранения настроек');
    } finally {
      setLoading(false);
    }
  };

  // Test telegram dispatch
  const handleTestTelegram = async () => {
    setTestStatus('sending');
    try {
      const res = await fetch('/api/telegram/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          botToken: settingsForm.telegramBotToken,
          chatId: settingsForm.telegramChatId
        })
      });
      const data = await res.json();
      if (data.success) {
        setTestStatus({ success: true, message: data.message });
      } else {
        setTestStatus({ success: false, error: data.error });
      }
    } catch (err) {
      setTestStatus({ success: false, error: 'Ошибка соединения с сервером' });
    }
  };

  return (
    <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '36px 24px 80px 24px' }}>
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#2563eb', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>
            <ShieldCheck size={14} /> Управление системой
          </div>
          <h1 style={{ fontSize: '30px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.3px' }}>
            Панель администратора
          </h1>
          <p style={{ fontSize: '14px', color: '#64748b' }}>
            Управление каталогом модулей, базовыми ценами, материалами, фурнитурой, заказами и уведомлениями в Telegram.
          </p>
        </div>
      </div>

      {message && (
        <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#047857', padding: '12px 18px', borderRadius: '6px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CheckCircle2 size={18} style={{ color: '#059669' }} />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '12px 18px', borderRadius: '6px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <AlertCircle size={18} style={{ color: '#ef4444' }} />
          <span>{error}</span>
        </div>
      )}

      {/* Admin Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '14px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {[
          { id: 'modules', label: 'Модули каталога', icon: Package, count: modules.length },
          { id: 'materials', label: 'Материалы и наценки', icon: Palette, count: materials.length },
          { id: 'hardware', label: 'Фурнитура и ручки', icon: Wrench, count: hardware.length },
          { id: 'orders', label: 'Все заказы партнёров', icon: ClipboardList, count: orders.length },
          { id: 'settings', label: 'Настройки и Telegram', icon: Settings }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setMessage(''); setError(''); }}
              style={{
                background: isActive ? '#2563eb' : '#ffffff',
                color: isActive ? '#ffffff' : '#475569',
                border: isActive ? '1px solid #1d4ed8' : '1px solid #e2e8f0',
                borderRadius: '6px',
                padding: '9px 16px',
                fontSize: '13px',
                fontWeight: isActive ? '700' : '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.15s ease',
                boxShadow: isActive ? '0 1px 3px rgba(37, 99, 235, 0.2)' : 'none'
              }}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span style={{ background: isActive ? 'rgba(255, 255, 255, 0.25)' : '#f1f5f9', color: isActive ? '#ffffff' : '#64748b', fontSize: '11px', padding: '1px 6px', borderRadius: '6px' }}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: MODULES MANAGEMENT */}
      {activeTab === 'modules' && (
        <div className="glass-panel" style={{ padding: '24px', background: '#ffffff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '17px', fontWeight: '800', color: '#0f172a' }}>
              Каталог модулей и базовые цены ({modules.length})
            </h2>
            <button onClick={handleOpenAddModule} className="btn btn-primary" style={{ fontSize: '12px', padding: '8px 14px' }}>
              <Plus size={15} /> Добавить модуль
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', color: '#64748b', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '10px 12px' }}>АРТИКУЛ</th>
                  <th style={{ padding: '10px 12px' }}>КАТЕГОРИЯ</th>
                  <th style={{ padding: '10px 12px' }}>НАИМЕНОВАНИЕ</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center' }}>В × Ш × Г (ММ)</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>БАЗОВАЯ ЦЕНА</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right', width: '110px' }}>ДЕЙСТВИЯ</th>
                </tr>
              </thead>
              <tbody>
                {modules.map(mod => (
                  <tr key={mod.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px' }}>
                      <span className="badge badge-blue">{mod.article}</span>
                    </td>
                    <td style={{ padding: '12px', color: '#64748b' }}>
                      {mod.categoryName}
                    </td>
                    <td style={{ padding: '12px', fontWeight: '600', color: '#0f172a' }}>
                      {mod.name}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', color: '#475569' }}>
                      {mod.height}×{mod.width}×{mod.depth}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right', fontWeight: '700', color: '#0f172a' }}>
                      {mod.basePrice.toLocaleString('ru-RU')} ₽
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => handleOpenEditModule(mod)}
                          className="btn btn-secondary"
                          style={{ padding: '5px 8px' }}
                          title="Редактировать"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => handleDeleteModule(mod.id, mod.article)}
                          className="btn btn-danger"
                          style={{ padding: '5px 8px' }}
                          title="Удалить"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: MATERIALS MANAGEMENT */}
      {activeTab === 'materials' && (
        <div className="glass-panel" style={{ padding: '24px', background: '#ffffff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '17px', fontWeight: '800', color: '#0f172a' }}>
                Материалы отделки и наценки
              </h2>
              <p style={{ fontSize: '12px', color: '#64748b' }}>
                Коэффициенты применяются к базовой стоимости модулей при заказе.
              </p>
            </div>
            <button onClick={handleOpenAddMaterial} className="btn btn-primary" style={{ fontSize: '12px', padding: '8px 14px' }}>
              <Plus size={15} /> Добавить декор
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '16px' }}>
            {materials.map(mat => (
              <div key={mat.id} className="glass-panel" style={{ padding: '18px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '16px', height: '16px', borderRadius: '50%', background: mat.colorSample, border: '1px solid #cbd5e1' }}></span>
                    <span className="badge badge-blue">{mat.badge}</span>
                  </div>
                  <button onClick={() => handleOpenEditMaterial(mat)} className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '11px' }}>
                    <Edit2 size={12} /> Изменить
                  </button>
                </div>

                <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>{mat.name}</h3>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Код: {mat.code}</div>

                <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: '#64748b' }}>Коэффициент:</span>
                  <strong style={{ color: '#2563eb' }}>
                    ×{mat.multiplier} ({mat.multiplier === 1 ? 'Базовый' : `+${Math.round((mat.multiplier - 1) * 100)}%`})
                  </strong>
                </div>

                <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: '#64748b' }}>Надбавка за модуль:</span>
                  <strong style={{ color: '#0f172a' }}>+{mat.extraCostPerModule} ₽</strong>
                </div>

                <p style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.4' }}>{mat.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: HARDWARE MANAGEMENT */}
      {activeTab === 'hardware' && (
        <div className="glass-panel" style={{ padding: '24px', background: '#ffffff' }}>
          <h2 style={{ fontSize: '17px', fontWeight: '800', color: '#0f172a', marginBottom: '4px' }}>
            Фурнитура, петли и профили
          </h2>
          <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
            Управление ценами на петли, ручки и механизмы.
          </p>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', color: '#64748b', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '10px 12px' }}>КАТЕГОРИЯ</th>
                  <th style={{ padding: '10px 12px' }}>НАИМЕНОВАНИЕ</th>
                  <th style={{ padding: '10px 12px' }}>ОПИСАНИЕ</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>ЦЕНА ЗА МОДУЛЬ</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right', width: '90px' }}>ДЕЙСТВИЯ</th>
                </tr>
              </thead>
              <tbody>
                {hardware.map(hd => (
                  <tr key={hd.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px' }}>
                      <span className={hd.category === 'hinges' ? 'badge badge-blue' : 'badge badge-gray'}>
                        {hd.category === 'hinges' ? 'Петли' : 'Ручки / Профиль'}
                      </span>
                    </td>
                    <td style={{ padding: '12px', fontWeight: '700', color: '#0f172a' }}>
                      {hd.name}
                    </td>
                    <td style={{ padding: '12px', color: '#64748b', fontSize: '12px' }}>
                      {hd.description}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right', fontWeight: '700', color: '#0f172a' }}>
                      {hd.pricePerUnit === 0 ? 'Включено (0 ₽)' : `+${hd.pricePerUnit.toLocaleString('ru-RU')} ₽`}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      <button onClick={() => handleOpenEditHardware(hd)} className="btn btn-secondary" style={{ padding: '6px 10px', fontSize: '12px' }}>
                        <Edit2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: ALL ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="glass-panel" style={{ padding: '24px', background: '#ffffff' }}>
          <h2 style={{ fontSize: '17px', fontWeight: '800', color: '#0f172a', marginBottom: '20px' }}>
            Все поступившие заказы партнёров ({orders.length})
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {orders.map(ord => (
              <div key={ord.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>#{ord.id}</span>
                      <span className="badge badge-blue">{ord.invoiceNumber}</span>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>
                        {new Date(ord.createdAt).toLocaleString('ru-RU')}
                      </span>
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginTop: '4px' }}>
                      {ord.partnerName} • Тел: {ord.partnerPhone}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <select
                      value={ord.status}
                      onChange={e => handleUpdateOrderStatus(ord.id, e.target.value)}
                      className="form-select"
                      style={{ padding: '6px 10px', fontSize: '12px', width: 'auto' }}
                    >
                      <option value="new">Новый заказ</option>
                      <option value="in_production">В производстве</option>
                      <option value="ready">Готов к отгрузке</option>
                      <option value="completed">Отгружен / Выполнен</option>
                      <option value="cancelled">Отменён</option>
                    </select>

                    <button
                      onClick={() => onViewInvoice(ord)}
                      className="btn btn-primary"
                      style={{ fontSize: '12px', padding: '6px 12px' }}
                    >
                      <Printer size={13} /> Счёт-фактура
                    </button>
                  </div>
                </div>

                {/* Items preview */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', fontSize: '13px' }}>
                  <div>
                    <span style={{ color: '#64748b' }}>Состав: </span>
                    <strong style={{ color: '#0f172a' }}>{ord.summary?.totalModulesCount} модулей</strong>
                    <span style={{ color: '#64748b', marginLeft: '8px' }}>
                      ({ord.material?.name || 'Стандарт'} • {ord.hinges?.name || 'Петли'})
                    </span>
                  </div>

                  <div style={{ fontSize: '18px', fontWeight: '800', color: '#1e40af' }}>
                    {ord.summary?.finalTotal.toLocaleString('ru-RU')} ₽
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: SETTINGS & TELEGRAM */}
      {activeTab === 'settings' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '24px' }}>
          {/* Telegram notifications box */}
          <div className="glass-panel" style={{ padding: '24px', background: '#ffffff', border: '1px solid #bfdbfe' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '6px', background: '#eff6ff', border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
                <Send size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#0f172a' }}>
                  Уведомления в Telegram
                </h3>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Оповещение на ваш телефон о новых заказах</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label className="form-label">Telegram Bot Token</label>
                <input
                  type="password"
                  placeholder="123456789:ABCdefGhIJKlmNoPQRstuVWXyz"
                  className="form-input"
                  value={settingsForm.telegramBotToken}
                  onChange={e => setSettingsForm({ ...settingsForm, telegramBotToken: e.target.value })}
                />
                <span style={{ fontSize: '11px', color: '#64748b' }}>Получите у бота @BotFather в Telegram</span>
              </div>

              <div>
                <label className="form-label">Ваш Telegram Chat ID</label>
                <input
                  type="text"
                  placeholder="987654321"
                  className="form-input"
                  value={settingsForm.telegramChatId}
                  onChange={e => setSettingsForm({ ...settingsForm, telegramChatId: e.target.value })}
                />
                <span style={{ fontSize: '11px', color: '#64748b' }}>Узнайте свой ID через бота @userinfobot</span>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                <button onClick={handleSaveSettings} className="btn btn-primary">
                  Сохранить настройки
                </button>
                <button onClick={handleTestTelegram} className="btn btn-secondary">
                  Тестовое сообщение
                </button>
              </div>

              {testStatus && (
                <div style={{ 
                  marginTop: '12px', 
                  padding: '10px 14px', 
                  borderRadius: '6px', 
                  fontSize: '12px',
                  background: testStatus.success ? '#ecfdf5' : '#fef2f2',
                  color: testStatus.success ? '#047857' : '#b91c1c',
                  border: testStatus.success ? '1px solid #a7f3d0' : '1px solid #fecaca'
                }}>
                  {testStatus.success ? testStatus.message : testStatus.error}
                </div>
              )}
            </div>
          </div>

          {/* Company requisites edit */}
          <div className="glass-panel" style={{ padding: '24px', background: '#ffffff' }}>
            <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#0f172a', marginBottom: '16px' }}>
              Контакты и адреса фабрики
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label className="form-label">Телефон фабрики</label>
                <input
                  type="text"
                  className="form-input"
                  value={companyForm.phone || ''}
                  onChange={e => setCompanyForm({ ...companyForm, phone: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">Email отдела заказов</label>
                <input
                  type="email"
                  className="form-input"
                  value={companyForm.email || ''}
                  onChange={e => setCompanyForm({ ...companyForm, email: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">Адрес офиса</label>
                <input
                  type="text"
                  className="form-input"
                  value={companyForm.address || ''}
                  onChange={e => setCompanyForm({ ...companyForm, address: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">Адрес производства</label>
                <input
                  type="text"
                  className="form-input"
                  value={companyForm.productionAddress || ''}
                  onChange={e => setCompanyForm({ ...companyForm, productionAddress: e.target.value })}
                />
              </div>

              <button onClick={handleSaveSettings} className="btn btn-primary" style={{ marginTop: '8px' }}>
                Сохранить контакты
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODULE EDIT / ADD MODAL */}
      {isModuleModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModuleModalOpen(false)}>
          <div className="glass-panel" style={{ maxWidth: '520px', width: '100%', padding: '28px', background: '#ffffff', border: '1px solid #bfdbfe', boxShadow: '0 20px 45px rgba(0,0,0,0.12)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#0f172a' }}>
                {editingModule ? `Редактирование модуля ${editingModule.article}` : 'Добавление нового модуля'}
              </h3>
              <button className="btn btn-secondary" onClick={() => setIsModuleModalOpen(false)} style={{ padding: '6px 8px' }}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveModule}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label className="form-label">Артикул *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={moduleForm.article}
                    onChange={e => setModuleForm({ ...moduleForm, article: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label">Категория</label>
                  <select
                    className="form-select"
                    value={moduleForm.category}
                    onChange={e => setModuleForm({ ...moduleForm, category: e.target.value })}
                  >
                    <option value="upper">Верхние модули</option>
                    <option value="lower">Нижние модули</option>
                    <option value="tall">Пеналы и колонны</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label className="form-label">Наименование модуля *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={moduleForm.name}
                  onChange={e => setModuleForm({ ...moduleForm, name: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                <div>
                  <label className="form-label">Высота (мм)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={moduleForm.height}
                    onChange={e => setModuleForm({ ...moduleForm, height: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="form-label">Ширина (мм)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={moduleForm.width}
                    onChange={e => setModuleForm({ ...moduleForm, width: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="form-label">Глубина (мм)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={moduleForm.depth}
                    onChange={e => setModuleForm({ ...moduleForm, depth: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label className="form-label">Базовая оптовая цена (руб.) *</label>
                <input
                  type="number"
                  required
                  className="form-input"
                  value={moduleForm.basePrice}
                  onChange={e => setModuleForm({ ...moduleForm, basePrice: Number(e.target.value) })}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label className="form-label">Описание комплектации</label>
                <textarea
                  rows="2"
                  className="form-textarea"
                  value={moduleForm.description}
                  onChange={e => setModuleForm({ ...moduleForm, description: e.target.value })}
                />
              </div>

              <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
                {loading ? 'Сохранение...' : 'Сохранить модуль'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MATERIAL EDIT MODAL */}
      {isMaterialModalOpen && (
        <div className="modal-overlay" onClick={() => setIsMaterialModalOpen(false)}>
          <div className="glass-panel" style={{ maxWidth: '480px', width: '100%', padding: '28px', background: '#ffffff', border: '1px solid #bfdbfe', boxShadow: '0 20px 45px rgba(0,0,0,0.12)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#0f172a' }}>
                {editingMaterial ? 'Редактирование декора' : 'Добавление декора'}
              </h3>
              <button className="btn btn-secondary" onClick={() => setIsMaterialModalOpen(false)} style={{ padding: '6px 8px' }}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveMaterial}>
              <div style={{ marginBottom: '12px' }}>
                <label className="form-label">Название материала *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={materialForm.name}
                  onChange={e => setMaterialForm({ ...materialForm, name: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label className="form-label">Коэффициент наценки</label>
                  <input
                    type="number"
                    step="0.05"
                    className="form-input"
                    value={materialForm.multiplier}
                    onChange={e => setMaterialForm({ ...materialForm, multiplier: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="form-label">Надбавка за модуль (₽)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={materialForm.extraCostPerModule}
                    onChange={e => setMaterialForm({ ...materialForm, extraCostPerModule: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label className="form-label">Описание</label>
                <textarea
                  rows="2"
                  className="form-textarea"
                  value={materialForm.description}
                  onChange={e => setMaterialForm({ ...materialForm, description: e.target.value })}
                />
              </div>

              <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
                Сохранить декор
              </button>
            </form>
          </div>
        </div>
      )}

      {/* HARDWARE EDIT MODAL */}
      {isHardwareModalOpen && (
        <div className="modal-overlay" onClick={() => setIsHardwareModalOpen(false)}>
          <div className="glass-panel" style={{ maxWidth: '460px', width: '100%', padding: '28px', background: '#ffffff', border: '1px solid #bfdbfe', boxShadow: '0 20px 45px rgba(0,0,0,0.12)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#0f172a' }}>
                Цена фурнитуры
              </h3>
              <button className="btn btn-secondary" onClick={() => setIsHardwareModalOpen(false)} style={{ padding: '6px 8px' }}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveHardware}>
              <div style={{ marginBottom: '14px' }}>
                <label className="form-label">Наименование</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={hardwareForm.name}
                  onChange={e => setHardwareForm({ ...hardwareForm, name: e.target.value })}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label className="form-label">Цена за комплект (руб.)</label>
                <input
                  type="number"
                  required
                  className="form-input"
                  value={hardwareForm.pricePerUnit}
                  onChange={e => setHardwareForm({ ...hardwareForm, pricePerUnit: Number(e.target.value) })}
                />
              </div>

              <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
                Сохранить цену
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
