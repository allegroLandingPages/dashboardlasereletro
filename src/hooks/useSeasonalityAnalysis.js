import { useMemo } from 'react';

export function useSeasonalityAnalysis(dateFilteredData) {
  const seasonalityData = useMemo(() => {
    if (!dateFilteredData.length) return { chartData: [], peakDay: '-' };

    const daysOfWeek = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const map = {};

    daysOfWeek.forEach((day, index) => {
      map[index] = { dayName: day, revenue: 0, qty: 0, transactions: 0 };
    });

    dateFilteredData.forEach(item => {
      if (!item.dateObj || isNaN(item.dateObj)) return;
      const dayIndex = item.dateObj.getDay();
      if (map[dayIndex]) {
        map[dayIndex].revenue += item.totalValue;
        map[dayIndex].qty += item.qty;
        map[dayIndex].transactions += 1;
      }
    });

    const chartData = Object.values(map);
    const peak = [...chartData].sort((a, b) => b.revenue - a.revenue)[0];

    return {
      chartData,
      peakDay: peak ? peak.dayName : '-'
    };
  }, [dateFilteredData]);

  return { seasonalityData };
}