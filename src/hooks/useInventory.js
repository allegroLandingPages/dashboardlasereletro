import { useState, useCallback } from 'react';
import Papa from 'papaparse';

export function useInventory() {
  const [inventoryData, setInventoryData] = useState([]);
  const [isInventoryLoading, setIsInventoryLoading] = useState(false);

  const parseInventoryCSV = (rows) => {
    // Encontra a linha de cabeçalho baseando-se na coluna 6 (CÓDIGO)
    const headerIndex = rows.findIndex(r => String(r[6] || '').toUpperCase().trim() === 'CÓDIGO');
    const dataRows = headerIndex > -1 ? rows.slice(headerIndex + 1) : rows;

    return dataRows.map(row => {
      const codeStr = String(row[6] || '').trim();
      if (!codeStr) return null;

      const storeQty = parseInt(row[17]) || 0; // Coluna 17: LOJA
      const cdQty = parseInt(row[18]) || 0;    // Coluna 18: DEPÓSITO

      return {
        filialCode: String(row[0] || '').trim(), // Coluna 0: FILIAL
        filialName: String(row[2] || '').trim(), // Coluna 2: NOME
        city: String(row[3] || '').trim(),       // Coluna 3: CIDADE
        state: String(row[4] || '').trim(),      // Coluna 4: UF
        code: codeStr,                           // Coluna 6: CÓDIGO
        name: String(row[7] || '').trim(),       // Coluna 7: DESCRIÇÃO
        section: String(row[8] || '').trim(),    // Coluna 8: SEÇÃO
        brand: String(row[9] || '').trim(),      // Coluna 9: MARCA
        category: String(row[10] || '').trim(),  // Coluna 10: CATEGORIA
        
        storeQty: storeQty,                      // Coluna 17: Qtd Loja
        cdQty: cdQty,                            // Coluna 18: Qtd Depósito
        networkQty: storeQty + cdQty             // Total físico na linha
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