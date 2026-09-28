import React from 'react';
import { formatCurrency } from '../../utils/helpers';
import TableSection from '../TableSection';

export default function MarketingRFMTab({ salesData, printProps }) {
  const { data, rfmAnalysis } = salesData;

  if (data.length === 0) {
    return <div className="card empty-chart"><p>Importe um ficheiro de Vendas para visualizar a segmentação de pedidos.</p></div>;
  }

  const columns = [
    { header: 'Nº do Pedido', accessor: 'orderId', style: { fontWeight: 'bold' } },
    { header: 'Data', accessor: 'dateStr' },
    { header: 'Loja / Canal', accessor: 'store' },
    { 
      header: 'Itens do Pedido', 
      render: (row) => (
        <div style={{ fontSize: '0.8rem', color: '#4b5563', maxWidth: '300px', lineHeight: '1.4' }}>
          {row.itemsList.join(', ')}
        </div>
      ) 
    },
    { header: 'Valor Total', render: (row) => formatCurrency(row.totalRevenue), style: { color: '#059669', fontWeight: 'bold' } },
    { header: 'Perfil', render: (row) => {
        let bg = '#e0f2fe', color = '#0369a1';
        if (row.segment.includes('Premium')) { bg = '#fef08a'; color = '#b45309'; }
        if (row.segment.includes('Entrada')) { bg = '#f3f4f6'; color = '#4b5563'; }
        return <span style={{ padding: '0.25rem 0.75rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, backgroundColor: bg, color }}>{row.segment}</span>;
      }
    }
  ];

  return (
    <>
      <section style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div className="card" style={{ flex: 1, backgroundColor: '#fdf4ff', border: '1px solid #f5d0fe', margin: 0 }}>
          <span className="kpi-label" style={{ color: '#a21caf' }}>Ticket Médio por Pedido</span>
          <span className="kpi-value" style={{ color: '#86198f', fontSize: '2.5rem' }}>{formatCurrency(rfmAnalysis?.kpis?.avgOrderValue || 0)}</span>
          <span className="kpi-subtext" style={{ color: '#a21caf', fontWeight: 600 }}>Base para campanhas de incentivo de aumento de cesto.</span>
        </div>
        <div className="card" style={{ flex: 1, backgroundColor: '#fffbeb', border: '1px solid #fde68a', margin: 0 }}>
          <span className="kpi-label" style={{ color: '#b45309' }}>Pedidos Premium (Alto Valor)</span>
          <span className="kpi-value" style={{ color: '#92400e', fontSize: '2.5rem' }}>{rfmAnalysis?.kpis?.premiumCount || 0}</span>
          <span className="kpi-subtext" style={{ color: '#b45309', fontWeight: 600 }}>Oportunidade para programas de fidelização VIP.</span>
        </div>
      </section>

      <TableSection 
        id="rfm-tabela"
        title="Detalhamento de Pedidos e Conteúdo do Cesto"
        subtitle="Analise transações individuais, os respetivos produtos e o perfil de valor associado."
        data={rfmAnalysis?.ordersSummary || []}
        columns={columns}
        printProps={printProps}
      />
    </>
  );
}