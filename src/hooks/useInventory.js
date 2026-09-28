import { useState, useCallback } from 'react';
import Papa from 'papaparse';

export function useInventory() {
  const [inventoryData, setInventoryData] = useState([]);
  const [isInventoryLoading, setIsInventoryLoading] = useState(false);

  // Função auxiliar para limpar "R$", espaços e formatar de Pt-BR para Float
  const parseCurrency = (value) => {
    if (!value) return 0;
    // Remove tudo o que não for número, vírgula ou sinal de menos
    const cleanString = String(value).replace(/[^0-9,-]+/g, '').replace(',', '.');
    return parseFloat(cleanString) || 0;
  };

  const parseInventoryCSV = (rows) => {
    const headerIndex = rows.findIndex(r => String(r[1] || '').toUpperCase().trim() === 'CÓDIGO');
    const dataRows = headerIndex > -1 ? rows.slice(headerIndex + 1) : rows;

    return dataRows.map(row => {
      const codeStr = String(row[1] || '').trim();
      if (!codeStr) return null;

      return {
        section: String(row[0] || '').trim(), 
        code: codeStr,                        
        name: String(row[2] || '').trim(),    
        brand: String(row[3] || '').trim(),   
        
        // Quantidades e Estoque
        storeQty: parseInt(row[11]) || 0,     
        cdQty: (parseInt(row[12]) || 0) + (parseInt(row[13]) || 0) + (parseInt(row[14]) || 0), 
        networkQty: parseInt(row[15]) || 0,   
        reservedQty: parseInt(row[16]) || 0,  
        
        // Custos e Preços convertidos com a função de limpeza (Colunas V=21 e W=22)
        costPrice: parseCurrency(row[21]),  
        salePrice: parseCurrency(row[22]),  
        
        // Cobertura
        monthsCoverage: parseFloat(String(row[18] || '0').replace(',', '.')) || 0 
      };
    }).filter(item => item !== null);
  };

  const handleInventoryUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsInventoryLoading(true);

    Papa.parse(file, {
      header: false,
      skipEmptyLines: true,
      delimiter: "", 
      complete: (results) => {
        const parsed = parseInventoryCSV(results.data);
        setInventoryData(parsed);
        setIsInventoryLoading(false);
      },
      error: () => {
        setIsInventoryLoading(false);
        alert('Erro ao processar ficheiro de estoque.');
      }
    });
  }, []);

  const clearInventoryData = useCallback(() => {
    setInventoryData([]);
  }, []);

  return {
    inventoryData,
    isInventoryLoading,
    handleInventoryUpload,
    clearInventoryData
  };
}