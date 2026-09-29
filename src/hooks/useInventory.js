import { useState, useCallback } from 'react';
import Papa from 'papaparse';

export function useInventory() {
  const [inventoryData, setInventoryData] = useState([]);
  const [isInventoryLoading, setIsInventoryLoading] = useState(false);

  // Higienizador de moeda para lidar com R$, pontos e espaços
  const parseCurrency = (value) => {
    if (!value) return 0;
    const cleanString = String(value).replace(/[^0-9,-]+/g, '').replace(',', '.');
    return parseFloat(cleanString) || 0;
  };

  const parseInventoryCSV = (rows) => {
    const headerIndex = rows.findIndex(r => String(r[6] || '').toUpperCase().trim() === 'CÓDIGO');
    const dataRows = headerIndex > -1 ? rows.slice(headerIndex + 1) : rows;

    return dataRows.map(row => {
      const codeStr = String(row[6] || '').trim();
      if (!codeStr) return null;

      const storeQty = parseInt(row[17]) || 0; // Coluna 17: LOJA
      const cdQty = parseInt(row[18]) || 0;    // Coluna 18: DEPÓSITO
      const unitValue = parseCurrency(row[19]);// Coluna 19: VALOR

      return {
        filialCode: String(row[0] || '').trim(),
        filialName: String(row[2] || '').trim(),
        city: String(row[3] || '').trim(),
        state: String(row[4] || '').trim(),
        code: codeStr,
        name: String(row[7] || '').trim(),
        section: String(row[8] || '').trim(),
        brand: String(row[9] || '').trim(),
        category: String(row[10] || '').trim(),
        
        storeQty: storeQty,
        cdQty: cdQty,
        networkQty: storeQty + cdQty,
        unitValue: unitValue,
        totalValue: (storeQty + cdQty) * unitValue
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