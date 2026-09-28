import { useMemo } from 'react';

export function useMarketingRFM(dateFilteredData) {
  const rfmAnalysis = useMemo(() => {
    if (!dateFilteredData.length) return { ordersSummary: [], kpis: null };

    const orderMap = {};

    dateFilteredData.forEach(item => {
      const orderId = item.orderId || 'Desconhecido';
      if (!orderMap[orderId]) {
        orderMap[orderId] = { 
          orderId, 
          totalRevenue: 0, 
          totalQty: 0, 
          itemsCount: 0, 
          store: item.store, 
          dateStr: item.dateStr,
          itemsList: [] // <--- ARRAY PARA GUARDAR OS PRODUTOS DO PEDIDO
        };
      }
      orderMap[orderId].totalRevenue += item.totalValue;
      orderMap[orderId].totalQty += item.qty;
      orderMap[orderId].itemsCount += 1;
      orderMap[orderId].itemsList.push(`${item.qty}x ${item.name}`);
    });

    const orders = Object.values(orderMap);
    let totalRevenueGlobal = 0;
    orders.forEach(o => totalRevenueGlobal += o.totalRevenue);

    const avgOrderValue = orders.length > 0 ? totalRevenueGlobal / orders.length : 0;

    let premiumCount = 0;
    let standardCount = 0;
    let basicCount = 0;

    const classifiedOrders = orders.map(order => {
      let segment = 'Padrão (Standard)';
      if (order.totalRevenue >= avgOrderValue * 1.5) {
        segment = 'Premium (Alto Valor)';
        premiumCount++;
      } else if (order.totalRevenue < avgOrderValue * 0.5) {
        segment = 'Entrada (Baixo Valor)';
        basicCount++;
      } else {
        standardCount++;
      }
      return { ...order, segment };
    }).sort((a, b) => b.totalRevenue - a.totalRevenue);

    return {
      ordersSummary: classifiedOrders.slice(0, 50),
      kpis: {
        totalOrders: orders.length,
        avgOrderValue,
        premiumCount,
        standardCount,
        basicCount
      }
    };
  }, [dateFilteredData]);

  return { rfmAnalysis };
}