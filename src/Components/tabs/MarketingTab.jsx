import React from 'react';
import { formatCurrency } from '../../utils/helpers';
import TableSection from '../TableSection';

export default function MarketingTab({ salesData, printProps }) {
  const { data, marketingData } = salesData;

  if (data.length === 0) {
    return <div className="card empty-chart"><p>Importe um ficheiro de Vendas para visualizar as métricas de marketing e geolocalização.</p></div>;
  }

  const cityColumns = [
    { header: 'Cidade / Região', accessor: 'city', style: { fontWeight: 'bold' } },
    { header: 'Faturação Total', render: (row) => formatCurrency(row.revenue), style: { color: '#059669', fontWeight: 'bold' } },
    { header: 'Volume Vendido', accessor: 'qty' },
    { header: 'Ticket Médio', render: (row) => formatCurrency(row.avgTicket) },
    { header: 'Participação na Rede', render: (row) => `${row.share.toFixed(2)}%`, style: { fontWeight: 'bold' } }
  ];

  const storeColumns = [
    { header: 'Loja / Canal', accessor: 'store', style: { fontWeight: 'bold' } },
    { header: 'Faturação', render: (row) => formatCurrency(row.revenue), style: { color: '#059669', fontWeight: 'bold' } },
    { header: 'Volume', accessor: 'qty' },
    { header: 'Share de Vendas', render: (row) => `${row.share.toFixed(2)}%`, style: { fontWeight: 'bold' } }
  ];

  return (
    <>
      <section style={{ marginBottom: '1.5rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div className="card" style={{ flex: 1, backgroundColor: '#fdf2f8', border: '1px solid #fbcfe8', margin: 0 }}>
          <span className="kpi-label" style={{ color: '#be185d' }}>Receita Total Mapeada</span>
          <span className="kpi-value" style={{ color: '#9d174d', fontSize: '2.5rem' }}>{formatCurrency(marketingData?.totalRevenue || 0)}</span>
          <span className="kpi-subtext" style={{ color: '#be185d', fontWeight: 600 }}>Base para alocação de orçamento de campanhas regionais.</span>
        </div>
      </section>

      <div style={{ marginBottom: '2rem' }}>
        <TableSection 
          id="marketing-cidades"
          title="Performance Geográfica (Cidades)"
          subtitle="Identifique quais regiões geram mais conversão para direcionar tráfego pago e campanhas locais."
          data={marketingData?.cityPerformance || []}
          columns={cityColumns}
          printProps={printProps}
        />
      </div>

      <TableSection 
        id="marketing-canais"
        title="Performance por Loja e Canal"
        subtitle="Avalie o retorno comercial de cada ponto de atendimento face ao investimento de marketing."
        data={marketingData?.storeMarketing || []}
        columns={storeColumns}
        printProps={printProps}
      />
    </>
  );
}