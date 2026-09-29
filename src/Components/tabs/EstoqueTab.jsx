import React, { useState, useMemo, useEffect } from 'react';
import { formatCurrency } from '../../utils/helpers';
import TableSection from '../TableSection';

export default function EstoqueTab({ salesData, printProps }) {
  const inventoryData = salesData?.inventoryData || [];

  const [filterCode, setFilterCode] = useState('');
  const [filterDesc, setFilterDesc] = useState('');
  const [filterBrand, setFilterBrand] = useState('');
  const [filterFilial, setFilterFilial] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 100;

  const uniqueBrands = useMemo(() => Array.from(new Set(inventoryData.map(i => i.brand).filter(Boolean))).sort(), [inventoryData]);
  const uniqueFiliais = useMemo(() => Array.from(new Set(inventoryData.map(i => i.filialName).filter(Boolean))).sort(), [inventoryData]);

  const filteredInventory = useMemo(() => {
    return inventoryData
      .filter(item => {
        const matchCode = !filterCode || item.code.toLowerCase().includes(filterCode.toLowerCase());
        const matchDesc = !filterDesc || item.name.toLowerCase().includes(filterDesc.toLowerCase());
        const matchBrand = !filterBrand || item.brand === filterBrand;
        const matchFilial = !filterFilial || item.filialName === filterFilial;
        
        return matchCode && matchDesc && matchBrand && matchFilial;
      })
      .sort((a, b) => (b.networkQty || 0) - (a.networkQty || 0));
  }, [inventoryData, filterCode, filterDesc, filterBrand, filterFilial]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterCode, filterDesc, filterBrand, filterFilial]);

  const clearFilters = () => {
    setFilterCode(''); setFilterDesc(''); setFilterBrand(''); setFilterFilial('');
  };

  if (inventoryData.length === 0) {
    return <div className="card empty-chart"><p>Importe o ficheiro de Estoque para visualizar a análise de inventário.</p></div>;
  }

  // KPIs
  const totalStore = filteredInventory.reduce((acc, curr) => acc + (curr.storeQty || 0), 0);
  const totalCD = filteredInventory.reduce((acc, curr) => acc + (curr.cdQty || 0), 0);
  const totalItems = totalStore + totalCD;
  const totalCapital = filteredInventory.reduce((acc, curr) => acc + (curr.totalValue || 0), 0);

  const columns = [
    { header: 'Filial', accessor: 'filialName', style: { fontWeight: 'bold' } },
    { header: 'Código', accessor: 'code', style: { fontWeight: 'bold' } },
    { header: 'Descrição', accessor: 'name' },
    { header: 'Marca', accessor: 'brand' },
    { header: 'Qtd Loja', accessor: 'storeQty' },
    { header: 'Qtd Depósito', accessor: 'cdQty' },
    { header: 'Qtd Total', accessor: 'networkQty', style: { fontWeight: 'bold', color: '#0369a1' } },
    { header: 'Valor de Venda', render: (row) => formatCurrency(row.unitValue) }
  ];

  const totalPages = Math.ceil(filteredInventory.length / ITEMS_PER_PAGE);
  const paginatedData = filteredInventory.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <>
      <section className="card no-print" style={{ marginBottom: '1.5rem', borderTop: '4px solid #0369a1' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 className="chart-title" style={{ margin: 0 }}>Filtros de Inventário</h3>
          {(filterCode || filterDesc || filterBrand || filterFilial) && (
            <button onClick={clearFilters} className="print-btn" style={{ color: '#dc2626', borderColor: '#fca5a5', backgroundColor: '#fef2f2', margin: 0, padding: '0.4rem 0.8rem' }}>
              Limpar Filtros
            </button>
          )}
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div className="input-group" style={{ flex: '1 1 250px' }}>
            <label>Nome da Filial</label>
            <select className="input-field" value={filterFilial} onChange={(e) => setFilterFilial(e.target.value)} style={{ backgroundColor: '#fff', cursor: 'pointer' }}>
              <option value="">Todas as Filiais</option>
              {uniqueFiliais.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div className="input-group" style={{ flex: '1 1 150px' }}>
            <label>Código</label>
            <input type="text" className="input-field" placeholder="Ex: 1057" value={filterCode} onChange={(e) => setFilterCode(e.target.value)} />
          </div>
          <div className="input-group" style={{ flex: '2 1 250px' }}>
            <label>Descrição</label>
            <input type="text" className="input-field" placeholder="Ex: Fogão..." value={filterDesc} onChange={(e) => setFilterDesc(e.target.value)} />
          </div>
          <div className="input-group" style={{ flex: '1 1 150px' }}>
            <label>Marca</label>
            <select className="input-field" value={filterBrand} onChange={(e) => setFilterBrand(e.target.value)} style={{ backgroundColor: '#fff', cursor: 'pointer' }}>
              <option value="">Todas</option>
              {uniqueBrands.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
        </div>
      </section>

      

      <TableSection 
        id="estoque-tabela"
        title="Posição de Estoque"
        subtitle={`Exibindo ${paginatedData.length} resultados (Total: ${filteredInventory.length}).`}
        data={paginatedData}
        columns={columns}
        printProps={printProps}
      />

      {totalPages > 1 && (
        <div className="no-print" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '1rem', paddingBottom: '2rem' }}>
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
            style={{ padding: '0.5rem 1rem', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', border: '1px solid #d1d5db', backgroundColor: currentPage === 1 ? '#f3f4f6' : '#fff', borderRadius: '6px' }}
          >
            Anterior
          </button>
          <span style={{ fontSize: '0.9rem', color: '#4b5563', fontWeight: 600 }}>
            Página {currentPage} de {totalPages}
          </span>
          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
            style={{ padding: '0.5rem 1rem', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', border: '1px solid #d1d5db', backgroundColor: currentPage === totalPages ? '#f3f4f6' : '#fff', borderRadius: '6px' }}
          >
            Próxima
          </button>
        </div>
      )}
    </>
  );
}