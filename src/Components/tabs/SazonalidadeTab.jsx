import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { formatCurrency } from '../../utils/helpers';
import { PrintIcon } from '../AccordionSection';
import TableSection from '../TableSection';

export default function SazonalidadeTab({ salesData, printProps }) {
  const { data, seasonalityData } = salesData;
  const { getPrintClass, handlePrint } = printProps;

  if (data.length === 0) {
    return <div className="card empty-chart"><p>Importe um ficheiro de Vendas para visualizar a análise de sazonalidade.</p></div>;
  }

  const columns = [
    { header: 'Dia da Semana', accessor: 'dayName', style: { fontWeight: 'bold' } },
    { header: 'Faturação Total', render: (row) => formatCurrency(row.revenue), style: { color: '#059669', fontWeight: 'bold' } },
    { header: 'Volume (Unidades)', accessor: 'qty' },
    { header: 'Transações', accessor: 'transactions' }
  ];

  return (
    <>
      <section className={getPrintClass('sazonalidade-kpis')} style={{ marginBottom: '1.5rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div className="card" style={{ flex: 1, backgroundColor: '#fef2f2', border: '1px solid #fca5a5', margin: 0 }}>
          <span className="kpi-label" style={{ color: '#b91c1c' }}>Dia de Maior Pico de Vendas </span>
          <span className="kpi-value" style={{ color: '#dc2626', fontSize: '2.5rem' }}>{seasonalityData?.peakDay || '-'}</span>
          <span className="kpi-subtext" style={{ color: '#b91c1c', fontWeight: 600 }}> Ideal para concentrar campanhas de maior conversão.</span>
        </div>
      </section>

      <section className={`card ${getPrintClass('sazonalidade-grafico')}`} style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h3 className="chart-title" style={{ margin: 0 }}>Distribuição de Faturação por Dia da Semana</h3>
            <p className="kpi-subtext">Comportamento de compra agregado por dia.</p>
          </div>
          <button className="print-btn no-print" onClick={() => handlePrint('sazonalidade-grafico')}><PrintIcon /> Imprimir Gráfico</button>
        </div>

        <div className="chart-container" style={{ height: '350px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={seasonalityData?.chartData || []} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="dayName" tick={{ fill: '#6b7280', fontSize: 12 }} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} tickFormatter={(val) => `R$ ${(val / 1000).toFixed(0)}k`} />
              <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={(val) => formatCurrency(val)} />
              <Bar dataKey="revenue" name="Faturação" fill="#dc2626" radius={[6, 6, 0, 0]} maxBarSize={60} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <TableSection 
        id="sazonalidade-tabela"
        title="Detalhamento Diário"
        data={seasonalityData?.chartData || []}
        columns={columns}
        printProps={printProps}
      />
    </>
  );
}