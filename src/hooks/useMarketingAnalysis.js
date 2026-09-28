import { useMemo } from 'react';

export function useMarketingAnalysis(dateFilteredData, regularData) {
  const marketingData = useMemo(() => {
    if (!dateFilteredData.length) return { cityPerformance: [], storeMarketing: [], totalRevenue: 0 };

    let totalRevenue = 0;
    const cityMap = {};
    const storeMap = {};

    dateFilteredData.forEach(item => {
      totalRevenue += item.totalValue;

      // 1. Agrupamento por Cidade (Geomarketing)
      const city = item.city || 'Não Definida';
      if (!cityMap[city]) {
        cityMap[city] = { city, revenue: 0, qty: 0, orders: new Set() };
      }
      cityMap[city].revenue += item.totalValue;
      cityMap[city].qty += item.qty;
      if (item.orderId) cityMap[city].orders.add(item.orderId);

      // 2. Agrupamento por Loja / Canal de Atendimento
      const store = item.store || 'Não Definida';
      if (!storeMap[store]) {
        storeMap[store] = { store, revenue: 0, qty: 0 };
      }
      storeMap[store].revenue += item.totalValue;
      storeMap[store].qty += item.qty;
    });

    const cityPerformance = Object.values(cityMap).map(c => ({
      ...c,
      ordersCount: c.orders.size,
      avgTicket: c.orders.size > 0 ? c.revenue / c.orders.size : 0,
      share: totalRevenue > 0 ? (c.revenue / totalRevenue) * 100 : 0
    })).sort((a, b) => b.revenue - a.revenue);

    const storeMarketing = Object.values(storeMap).map(s => ({
      ...s,
      share: totalRevenue > 0 ? (s.revenue / totalRevenue) * 100 : 0
    })).sort((a, b) => b.revenue - a.revenue);

    return { cityPerformance, storeMarketing, totalRevenue };
  }, [dateFilteredData]);

  return { marketingData };
}