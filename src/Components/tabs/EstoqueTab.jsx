import React, { useState, useMemo } from 'react';
import { formatCurrency } from '../../utils/helpers';
import TableSection from '../TableSection';

export default function EstoqueTab({ salesData, printProps }) {
  const inventoryData = salesData?.inventoryData || [];

  const [filterCode, setFilterCode] = useState('');
  const [filterDesc, setFilterDesc] = useState('');
  const [filterBrand, setFilterBrand] = useState('');

  // 1. Extrair marcas únicas para preencher o dropdown automaticamente
  const uniqueBrands = useMemo(() => {
    const brands = new Set();
    inventoryData.forEach(item => {
      if (item.brand) brands.add(item.brand);
    });
    return Array.from(brands).sort();
  }, [inventoryData]);

  // 2. Lógica de filtragem e ordenação descendente (Maior Estoque Total primeiro)
  const filteredInventory = useMemo(() => {
    return inventoryData
      .filter(item => {
        const matchCode = !filterCode || item.code.toLowerCase().includes(filterCode.toLowerCase());
        const matchDesc = !filterDesc || item.name.toLowerCase().includes(filterDesc.toLowerCase());
        const matchBrand = !filterBrand || item.brand === filterBrand; // Correspondência exata com o dropdown
        
        return matchCode && matchDesc && matchBrand;
      })
      .sort((a, b) => (b.networkQty || 0) - (a.networkQty || 0));
  }, [inventoryData, filterCode, filterDesc, filterBrand]);

  // 3. Função para limpar todos os filtros
  const clearFilters = () => {
    setFilterCode('');
    setFilterDesc('');
    setFilterBrand('');
  };

  if (inventoryData.length === 0) {
    return (
      <div className="card empty-chart">
        <p>Importe o ficheiro de Estoque para visualizar a análise de inventário.</p>
      </div>
    );
  }

  const columns = [
    { header: 'Código', accessor: 'code', style: { fontWeight: 'bold' } },
    { header: 'Descrição', accessor: 'name' },
    { header: 'Marca', accessor: 'brand' },
    { header: 'Seção', accessor: 'section' },
    { header: 'Qtd Loja', accessor: 'storeQty' },
    { header: 'Qtd CD', accessor: 'cdQty' },
    { header: 'Estoque Total', accessor: 'networkQty', style: { fontWeight: 'bold', color: '#0369a1' } },
    { header: 'Custo Unitário', render: (row) => formatCurrency(row.costPrice) },
    { header: 'Preço Venda', render: (row) => formatCurrency(row.salePrice) }
  ];

  return (
    <>
      <section className="card no-print" style={{ marginBottom: '1.5rem', borderTop: '4px solid #0369a1' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 className="chart-title" style={{ margin: 0 }}>Filtros de Inventário</h3>
          
          {/* Botão de Limpar Filtros renderizado se algum filtro estiver ativo */}
          {(filterCode || filterDesc || filterBrand) && (
            <button 
              onClick={clearFilters} 
              className="print-btn" 
              style={{ color: '#dc2626', borderColor: '#fca5a5', backgroundColor: '#fef2f2', margin: 0, padding: '0.4rem 0.8rem' }}
            >
              Limpar Filtros
            </button>
          )}
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div className="input-group" style={{ flex: '1 1 200px' }}>
            <label>Filtrar por Código</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Ex: 1057" 
              value={filterCode}
              onChange={(e) => setFilterCode(e.target.value)}
            />
          </div>
          <div className="input-group" style={{ flex: '2 1 300px' }}>
            <label>Filtrar por Descrição</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Ex: Fogão 4 Bocas..." 
              value={filterDesc}
              onChange={(e) => setFilterDesc(e.target.value)}
            />
          </div>
          <div className="input-group" style={{ flex: '1 1 200px' }}>
            <label>Filtrar por Marca</label>
            {/* Dropdown de Marcas */}
            <select 
              className="input-field" 
              value={filterBrand}
              onChange={(e) => setFilterBrand(e.target.value)}
              style={{ backgroundColor: '#fff', cursor: 'pointer' }}
            >
              <option value="">Todas as Marcas</option>
              {uniqueBrands.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <TableSection 
        id="estoque-tabela"
        title="Posição de Estoque (SKU)"
        subtitle={`Exibindo ${filteredInventory.length} resultados baseados nos filtros aplicados.`}
        data={filteredInventory}
        columns={columns}
        printProps={printProps}
      />
    </>
  );
}