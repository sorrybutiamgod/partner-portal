'use client';

import React from 'react';
import { User, Shield, LogOut, Download, Building2, Layers } from 'lucide-react';
import { downloadModulesCatalogPDF } from '@/lib/pdfCatalogGenerator';

export default function Navbar({
  activeTab,
  setActiveTab,
  cartCount,
  cartTotal,
  currentUser,
  onOpenAuth,
  onLogout,
  company,
  modules,
  materials
}) {
  const handleDownloadCatalog = () => {
    if (company && modules) {
      downloadModulesCatalogPDF(company, modules, materials || []);
    }
  };

  const navItems = [
    { id: 'home', label: 'Главная' },
    { id: 'modules', label: 'Модули' },
    { id: 'order', label: 'Бланк заказа', badge: cartCount > 0 ? cartCount : null }
  ];

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)'
    }}>
      <div style={{
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '0 24px',
        height: '72px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px'
      }}>
        {/* Brand / Logo */}
        <div 
          onClick={() => setActiveTab('home')}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', userSelect: 'none', flexShrink: 0 }}
        >
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)'
          }}>
            <Layers size={22} />
          </div>
          <div>
            <div style={{ 
              fontSize: '19px', 
              fontWeight: '800', 
              letterSpacing: '-0.3px', 
              color: '#0f172a', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '2px',
              lineHeight: '1.2'
            }}>
              МОДУЛЬ<span style={{ color: '#2563eb' }}>ПРО</span>
            </div>
            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '500' }}>
              Фабричный портал B2B
            </div>
          </div>
        </div>

        {/* Clean Corporate Navigation Menu */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: '#f8fafc',
          padding: '4px 6px',
          borderRadius: '8px',
          border: '1px solid #e2e8f0'
        }}>
          {navItems.map(item => {
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  background: isActive ? '#ffffff' : 'transparent',
                  color: isActive ? '#2563eb' : '#475569',
                  border: isActive ? '1px solid #dbeafe' : '1px solid transparent',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: isActive ? '700' : '500',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: isActive ? '0 1px 3px rgba(0, 0, 0, 0.06)' : 'none',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span style={{
                    background: '#2563eb',
                    color: '#ffffff',
                    fontSize: '11px',
                    fontWeight: '700',
                    padding: '1px 6px',
                    borderRadius: '10px'
                  }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {currentUser && currentUser.role !== 'admin' && (
            <button
              onClick={() => setActiveTab('history')}
              style={{
                background: activeTab === 'history' ? '#ffffff' : 'transparent',
                color: activeTab === 'history' ? '#2563eb' : '#475569',
                border: activeTab === 'history' ? '1px solid #dbeafe' : '1px solid transparent',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: activeTab === 'history' ? '700' : '500',
                cursor: 'pointer',
                boxShadow: activeTab === 'history' ? '0 1px 3px rgba(0, 0, 0, 0.06)' : 'none',
                whiteSpace: 'nowrap'
              }}
            >
              Мои заказы
            </button>
          )}

          {currentUser?.role === 'admin' && (
            <button
              onClick={() => setActiveTab('admin')}
              style={{
                background: activeTab === 'admin' ? '#2563eb' : '#eff6ff',
                color: activeTab === 'admin' ? '#ffffff' : '#1d4ed8',
                border: '1px solid #bfdbfe',
                padding: '8px 14px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: activeTab === 'admin' ? '0 1px 3px rgba(37, 99, 235, 0.2)' : 'none'
              }}
            >
              <Shield size={14} /> Админ-панель
            </button>
          )}
        </nav>

        {/* Right Actions: PDF Catalog & User Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <button 
            onClick={handleDownloadCatalog}
            className="btn btn-outline"
            style={{ fontSize: '12px', padding: '8px 14px' }}
            title="Скачать PDF-каталог модулей"
          >
            <Download size={14} /> PDF-каталог
          </button>

          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div 
                onClick={() => currentUser.role === 'admin' ? setActiveTab('admin') : setActiveTab('history')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#f8fafc',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0',
                  cursor: 'pointer'
                }}
              >
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: currentUser.role === 'admin' ? '#1e3a8a' : '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff'
                }}>
                  {currentUser.role === 'admin' ? <Shield size={12} /> : <User size={12} />}
                </div>
                <div style={{ textAlign: 'left', lineHeight: '1.2' }}>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: '#0f172a', maxWidth: '140px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {currentUser.companyName || currentUser.email}
                  </div>
                </div>
              </div>

              <button
                onClick={onLogout}
                className="btn btn-secondary"
                style={{ padding: '8px 10px', color: '#64748b' }}
                title="Выйти из кабинета"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="btn btn-primary"
              style={{ fontSize: '12px', padding: '8px 16px' }}
            >
              <User size={14} /> Вход для партнёров
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
