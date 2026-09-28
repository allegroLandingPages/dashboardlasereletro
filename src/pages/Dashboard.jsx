import React, { useState } from 'react';
import { useSalesData } from '../hooks/useSalesData';
import GlobalFilters from '../Components/GlobalFilters';
import VisaoGeralTab from '../Components/tabs/VisaoGeralTab';
import ProdutosTab from '../Components/tabs/ProdutosTab';
import LojasTab from '../Components/tabs/LojasTab';
import ServicosTab from '../Components/tabs/ServicosTab';
import EstoqueTab from '../Components/tabs/EstoqueTab';
import PrevisibilidadeTab from '../Components/tabs/PrevisibilidadeTab';
import DesempenhoTab from '../Components/tabs/DesempenhoTab';
import PrecificacaoTab from '../Components/tabs/PrecificacaoTab';
import CestaComprasTab from '../Components/tabs/CestaComprasTab';
import MarketingTab from '../Components/tabs/MarketingTab';
import SazonalidadeTab from '../Components/tabs/SazonalidadeTab';
import MarketingRFMTab from '../Components/tabs/MarketingRFMTab';
import './Dashboard.css';

const Icons = {
  Home: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>,
  Box: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>,
  Map: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>,
  Credit: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>,
  Layers: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>,
  Trending: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>,
  Target: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>,
  Tag: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>,
  Cart: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>,
  Megaphone: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>,
  Calendar: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>,
  Users: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
  Menu: () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('visao-geral');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [printSection, setPrintSection] = useState(null);
  
  const isPrinting = printSection !== null;

  const handlePrint = (sectionId) => {
    setPrintSection(sectionId);
    setTimeout(() => { window.print(); setPrintSection(null); }, 400); 
  };
  
  const printProps = {
    printSection, isPrinting, handlePrint,
    getPrintClass: (id) => (isPrinting && printSection === id ? 'print-active' : (isPrinting ? 'no-print' : ''))
  };

  const salesData = useSalesData();

  const menus = [
    { id: 'visao-geral', label: 'Visão Geral', icon: <Icons.Home /> },
    { id: 'produtos', label: 'Produtos & Categorias', icon: <Icons.Box /> },
    { id: 'lojas', label: 'Lojas & Cidades', icon: <Icons.Map /> },
    { id: 'precificacao', label: 'Precificação & Descontos', icon: <Icons.Tag /> },
    { id: 'cesta', label: 'Cesta de Compras', icon: <Icons.Cart /> },
    { id: 'estoque', label: 'Estoque / Inventário', icon: <Icons.Layers /> },
    { id: 'previsibilidade', label: 'Previsibilidade ABC', icon: <Icons.Trending /> },
    { id: 'desempenho', label: 'Gestão & Desempenho', icon: <Icons.Target /> },
    { id: 'marketing', label: 'Campanhas & Regiões', icon: <Icons.Megaphone /> },
    { id: 'sazonalidade', label: 'Sazonalidade Diária', icon: <Icons.Calendar /> },
    { id: 'rfm', label: 'Perfil de Pedidos (RFM)', icon: <Icons.Users /> },
    { id: 'servicos', label: 'Serviços Financeiros', icon: <Icons.Credit /> }
  ];

  const handleTabChange = (id) => {
    setActiveTab(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className={`app-layout ${isPrinting ? 'is-printing' : ''}`}>
      {isMobileMenuOpen && (
        <div className="mobile-overlay no-print" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}

      <aside className={`sidebar no-print ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="logo-container" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 1.5rem', flexDirection: 'column', textAlign: 'center' }}>
          <div className="logo-icon">
           <img src="/logo.png" alt="Logo" style={{ width: '100%', objectFit: 'contain' }} />
          </div>
          <h2 className="logo-text">Laser Metrics</h2>
        </div>
        <nav className="nav-menu">
          {menus.map(menu => (
            <button key={menu.id} className={`nav-item ${activeTab === menu.id ? 'active' : ''}`} onClick={() => handleTabChange(menu.id)}>
              {menu.icon} {menu.label}
            </button>
          ))}
        </nav>
      </aside>

      <div className="main-wrapper">
        <header className="top-bar no-print">
          <div className="top-bar-header">
            <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(true)}>
              <Icons.Menu />
            </button>
            <div className="welcome-text">
              <h1>Olá, Gestor</h1>
              <p>Explore as informações e atividades da rede.</p>
            </div>
          </div>
          <GlobalFilters salesData={salesData} />
        </header>

        <main className="content-scroll">
          {salesData.data.length === 0 && salesData.inventoryData.length === 0 ? (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', textAlign: 'center', padding: '1rem' }}>
              <h2>Importe um arquivo de Vendas ou Estoque no cabeçalho para iniciar.</h2>
            </div>
          ) : (
            <>
              {activeTab === 'visao-geral' && salesData.data.length > 0 && <VisaoGeralTab salesData={salesData} printProps={printProps} />}
              {activeTab === 'produtos' && salesData.data.length > 0 && <ProdutosTab salesData={salesData} printProps={printProps} />}
              {activeTab === 'lojas' && salesData.data.length > 0 && <LojasTab salesData={salesData} printProps={printProps} />}
              {activeTab === 'precificacao' && <PrecificacaoTab salesData={salesData} printProps={printProps} />}
              {activeTab === 'cesta' && <CestaComprasTab salesData={salesData} printProps={printProps} />}
              {activeTab === 'estoque' && <EstoqueTab salesData={salesData} printProps={printProps} />}
              {activeTab === 'previsibilidade' && <PrevisibilidadeTab salesData={salesData} printProps={printProps} />}
              {activeTab === 'desempenho' && <DesempenhoTab salesData={salesData} printProps={printProps} />}
              {activeTab === 'marketing' && salesData.data.length > 0 && <MarketingTab salesData={salesData} printProps={printProps} />}
              {activeTab === 'sazonalidade' && salesData.data.length > 0 && <SazonalidadeTab salesData={salesData} printProps={printProps} />}
              {activeTab === 'rfm' && salesData.data.length > 0 && <MarketingRFMTab salesData={salesData} printProps={printProps} />}
              {activeTab === 'servicos' && salesData.data.length > 0 && <ServicosTab salesData={salesData} printProps={printProps} />}
            </>
          )}
        </main>
      </div>
    </div>
  );
}