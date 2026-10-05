'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import HomeSection from '@/components/HomeSection';
import ModulesSection from '@/components/ModulesSection';
import OrderCalculator from '@/components/OrderCalculator';
import AdminPanel from '@/components/AdminPanel';
import PartnerOrders from '@/components/PartnerOrders';
import InvoiceModal from '@/components/InvoiceModal';
import AuthModal from '@/components/AuthModal';

// 5 Brand New High-Tech Sections
import ReadySetsSection from '@/components/ReadySetsSection';
import KitchenPlannerSection from '@/components/KitchenPlannerSection';
import DecorsSection from '@/components/DecorsSection';
import AnalyticsSection from '@/components/AnalyticsSection';
import TechDocsSection from '@/components/TechDocsSection';

import { CheckCircle2, Shield, User, Sparkles, Flame } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home'); 
  // 'home' | 'modules' | 'order' | 'sets' | 'planner' | 'decors' | 'analytics' | 'docs' | 'admin' | 'history'
  
  const [data, setData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cart state: { [moduleId]: quantity }
  const [cartItems, setCartItems] = useState({});

  // Current session user (null by default in normal mode, restored from localStorage)
  const [currentUser, setCurrentUser] = useState(null);

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [activeInvoiceOrder, setActiveInvoiceOrder] = useState(null);
  const [orderAlert, setOrderAlert] = useState(null);

  // Restore saved session from localStorage on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('partner_portal_user');
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }
    } catch (e) {
      console.warn('Could not read user from localStorage', e);
    }
  }, []);

  // Fetch initial data
  const loadData = async () => {
    try {
      const [resData, resOrders] = await Promise.all([
        fetch('/api/data'),
        fetch('/api/orders')
      ]);
      const dataJson = await resData.json();
      const ordersJson = await resOrders.json();

      if (dataJson.success) {
        setData(dataJson);
      }
      if (ordersJson.success) {
        setOrders(ordersJson.orders || []);
      }
    } catch (err) {
      console.error('Failed to load initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Cart total calculations for Navbar pill
  const modulesList = data?.modules || [];
  let cartCount = 0;
  let cartTotal = 0;
  for (const [id, qty] of Object.entries(cartItems)) {
    const q = Number(qty) || 0;
    if (q > 0) {
      cartCount += q;
      const mod = modulesList.find(m => m.id === id);
      if (mod) cartTotal += mod.basePrice * q;
    }
  }

  // Update cart item quantity
  const handleUpdateCart = (moduleId, quantity) => {
    setCartItems(prev => {
      const next = { ...prev };
      if (quantity <= 0) {
        delete next[moduleId];
      } else {
        next[moduleId] = quantity;
      }
      return next;
    });
  };

  // Add to cart from modules catalog
  const handleAddToCart = (moduleId, quantity) => {
    handleUpdateCart(moduleId, quantity);
  };

  // Apply ready-made kitchen set
  const handleApplyReadySet = ({ items, materialId, hingesId, handleId }) => {
    setCartItems(items);
    setActiveTab('order');
    setOrderAlert('Комплект успешно перенесен в бланк заказа! Проверьте спецификацию.');
    setTimeout(() => setOrderAlert(null), 7000);
  };

  // Apply planner layout to order
  const handleApplyLayoutToOrder = (counts) => {
    setCartItems(prev => {
      const next = { ...prev };
      for (const [modId, q] of Object.entries(counts)) {
        next[modId] = (next[modId] || 0) + q;
      }
      return next;
    });
    setActiveTab('order');
    setOrderAlert('Компоновка из 2D Конструктора успешно перенесена в бланк заказа!');
    setTimeout(() => setOrderAlert(null), 7000);
  };

  // Handle successful order creation
  const handleOrderSuccess = (createdOrder) => {
    setCartItems({});
    loadData();
    setActiveInvoiceOrder(createdOrder);
    setOrderAlert(`Заказ #${createdOrder.id} зафиксирован! Счёт-фактура ${createdOrder.invoiceNumber} сформирован.`);
    setTimeout(() => setOrderAlert(null), 8000);
  };

  if (loading || !data) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', color: '#2563eb' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid #dbeafe', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px auto' }} />
          <div style={{ fontWeight: '700', fontSize: '14px', letterSpacing: '0.5px', color: '#0f172a' }}>
            Загрузка данных фабрики...
          </div>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div className="app-wrapper">
      {/* Main Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cartCount}
        cartTotal={cartTotal}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={() => {
          setCurrentUser(null);
          try {
            localStorage.removeItem('partner_portal_user');
          } catch (e) {}
          if (activeTab === 'admin' || activeTab === 'history') {
            setActiveTab('home');
          }
        }}
        company={data.company}
        modules={data.modules}
        materials={data.materials}
      />

      {/* Order Alert Banner */}
      {orderAlert && (
        <div style={{
          background: '#eff6ff',
          borderBottom: '1px solid #bfdbfe',
          color: '#1e40af',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          fontSize: '14px',
          fontWeight: '600',
          position: 'sticky',
          top: '72px',
          zIndex: 90,
          boxShadow: '0 2px 8px rgba(37, 99, 235, 0.08)'
        }}>
          <CheckCircle2 size={18} style={{ color: '#2563eb' }} />
          <span>{orderAlert}</span>
        </div>
      )}

      {/* Active Section Content */}
      <main style={{ flexGrow: 1 }}>
        {activeTab === 'home' && (
          <HomeSection
            company={data.company}
            modules={data.modules}
            materials={data.materials}
            onGoToOrder={() => setActiveTab('order')}
            onGoToModules={() => setActiveTab('modules')}
          />
        )}

        {activeTab === 'modules' && (
          <ModulesSection
            modules={data.modules}
            materials={data.materials}
            company={data.company}
            cartItems={cartItems}
            onAddToCart={handleAddToCart}
            onGoToOrder={() => setActiveTab('order')}
          />
        )}

        {activeTab === 'order' && (
          <OrderCalculator
            modules={data.modules}
            materials={data.materials}
            hardware={data.hardware}
            cartItems={cartItems}
            onUpdateCart={handleUpdateCart}
            currentUser={currentUser}
            onOpenAuth={() => setIsAuthOpen(true)}
            onOrderSuccess={handleOrderSuccess}
            company={data.company}
          />
        )}

        {/* 1. Готовые комплекты */}
        {activeTab === 'sets' && (
          <ReadySetsSection
            readySets={data.readySets || []}
            modules={data.modules}
            materials={data.materials}
            hardware={data.hardware}
            onApplySet={handleApplyReadySet}
          />
        )}

        {/* 2. 2D/CAD Конструктор */}
        {activeTab === 'planner' && (
          <KitchenPlannerSection
            modules={data.modules}
            onApplyLayoutToOrder={handleApplyLayoutToOrder}
          />
        )}

        {/* 3. Библиотека декоров */}
        {activeTab === 'decors' && (
          <DecorsSection
            decors={data.decors || []}
            currentUser={currentUser}
            company={data.company}
          />
        )}

        {/* 4. B2B Аналитика */}
        {activeTab === 'analytics' && (
          <AnalyticsSection
            orders={orders}
            loyaltyTiers={data.loyaltyTiers || []}
            currentUser={currentUser}
          />
        )}

        {/* 5. Техническая база и Download Center */}
        {activeTab === 'docs' && (
          <TechDocsSection
            docs={data.docs || []}
            company={data.company}
          />
        )}

        {/* Админ-панель */}
        {activeTab === 'admin' && (
          currentUser?.role === 'admin' ? (
            <AdminPanel
              company={data.company}
              modules={data.modules}
              materials={data.materials}
              hardware={data.hardware}
              orders={orders}
              onRefreshData={loadData}
              onViewInvoice={(ord) => setActiveInvoiceOrder(ord)}
            />
          ) : (
            <div style={{ maxWidth: '500px', margin: '80px auto', padding: '40px 24px', textAlign: 'center', background: '#ffffff', borderRadius: '10px', border: '1px solid #bfdbfe', boxShadow: '0 4px 16px rgba(37, 99, 235, 0.08)' }}>
              <Shield size={48} style={{ color: '#2563eb', margin: '0 auto 16px auto' }} />
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>
                Доступ ограничен
              </h2>
              <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>
                Панель управления доступна только авторизованным администраторам фабрики.
              </p>
              <button onClick={() => setIsAuthOpen(true)} className="btn btn-primary" style={{ padding: '10px 24px', fontSize: '13px' }}>
                Войти как администратор
              </button>
            </div>
          )
        )}

        {/* История заказов */}
        {activeTab === 'history' && (
          currentUser ? (
            <PartnerOrders
              orders={orders}
              currentUser={currentUser}
              onViewInvoice={(ord) => setActiveInvoiceOrder(ord)}
              onGoToOrder={() => setActiveTab('order')}
            />
          ) : (
            <div style={{ maxWidth: '500px', margin: '80px auto', padding: '40px 24px', textAlign: 'center', background: '#ffffff', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)' }}>
              <User size={48} style={{ color: '#2563eb', margin: '0 auto 16px auto' }} />
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>
                Личный кабинет партнёра
              </h2>
              <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>
                Войдите или зарегистрируйтесь, чтобы отслеживать статус ваших заказов и скачивать счета-фактуры.
              </p>
              <button onClick={() => setIsAuthOpen(true)} className="btn btn-primary" style={{ padding: '10px 24px', fontSize: '13px' }}>
                Войти / Регистрация
              </button>
            </div>
          )
        )}
      </main>

      {/* Clean Corporate Footer */}
      <footer style={{
        background: '#ffffff',
        borderTop: '1px solid #e2e8f0',
        padding: '28px 24px',
        fontSize: '13px',
        color: '#64748b',
        marginTop: 'auto'
      }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '14px' }}>
              {data.company?.legalName}
            </div>
            <div style={{ fontSize: '12px', marginTop: '2px', color: '#64748b' }}>
              ИНН {data.company?.inn} • Производство: {data.company?.productionAddress || data.company?.address} • Тел.: {data.company?.phone}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap', fontSize: '13px' }}>
            <span style={{ cursor: 'pointer', color: activeTab === 'home' ? '#2563eb' : '#475569', fontWeight: activeTab === 'home' ? '600' : '400' }} onClick={() => setActiveTab('home')}>Главная</span>
            <span style={{ cursor: 'pointer', color: activeTab === 'modules' ? '#2563eb' : '#475569', fontWeight: activeTab === 'modules' ? '600' : '400' }} onClick={() => setActiveTab('modules')}>Модули</span>
            <span style={{ cursor: 'pointer', color: activeTab === 'order' ? '#2563eb' : '#475569', fontWeight: activeTab === 'order' ? '600' : '400' }} onClick={() => setActiveTab('order')}>Бланк заказа</span>
          </div>

          <div style={{ fontSize: '12px', color: '#94a3b8' }}>
            © {new Date().getFullYear()} МодульПро. Фабричный портал для партнёров.
          </div>
        </div>
      </footer>

      {/* Invoice Modal */}
      <InvoiceModal
        order={activeInvoiceOrder}
        company={data.company}
        isOpen={Boolean(activeInvoiceOrder)}
        onClose={() => setActiveInvoiceOrder(null)}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          try {
            localStorage.setItem('partner_portal_user', JSON.stringify(user));
          } catch (e) {}
          if (user.role === 'admin') setActiveTab('admin');
        }}
      />
    </div>
  );
}
