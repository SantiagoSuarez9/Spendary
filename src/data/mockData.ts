import { Expense, MonthlyTotal } from '@/types/expense';

export const mockExpenses: Expense[] = [
  // December 2025
  { id: '1', amount: 150.00, date: '2025-12-01', category: 'cards', description: 'Pago tarjeta VISA', cardName: 'VISA Gold' },
  { id: '2', amount: 85.50, date: '2025-12-03', category: 'services', description: 'Netflix y Spotify', serviceName: 'Streaming' },
  { id: '3', amount: 45.00, date: '2025-12-05', category: 'food', description: 'Supermercado semanal' },
  { id: '4', amount: 200.00, date: '2025-12-08', category: 'cards', description: 'Pago tarjeta Mastercard', cardName: 'Mastercard Black' },
  { id: '5', amount: 120.00, date: '2025-12-10', category: 'services', description: 'Gimnasio mensual', serviceName: 'Gimnasio' },
  { id: '6', amount: 35.00, date: '2025-12-12', category: 'food', description: 'Cena restaurante' },
  { id: '7', amount: 60.00, date: '2025-12-15', category: 'food', description: 'Delivery comida' },
  { id: '8', amount: 95.00, date: '2025-12-18', category: 'services', description: 'Internet hogar', serviceName: 'Internet' },
  { id: '9', amount: 180.00, date: '2025-12-20', category: 'cards', description: 'Pago tarjeta Amex', cardName: 'Amex Platinum' },
  { id: '10', amount: 55.00, date: '2025-12-22', category: 'food', description: 'Almuerzo trabajo' },
  
  // November 2025
  { id: '11', amount: 180.00, date: '2025-11-02', category: 'cards', description: 'Pago tarjeta VISA', cardName: 'VISA Gold' },
  { id: '12', amount: 85.50, date: '2025-11-05', category: 'services', description: 'Netflix y Spotify', serviceName: 'Streaming' },
  { id: '13', amount: 65.00, date: '2025-11-08', category: 'food', description: 'Supermercado semanal' },
  { id: '14', amount: 220.00, date: '2025-11-10', category: 'cards', description: 'Pago tarjeta Mastercard', cardName: 'Mastercard Black' },
  { id: '15', amount: 120.00, date: '2025-11-12', category: 'services', description: 'Gimnasio mensual', serviceName: 'Gimnasio' },
  { id: '16', amount: 42.00, date: '2025-11-15', category: 'food', description: 'Cena restaurante' },
  { id: '17', amount: 75.00, date: '2025-11-18', category: 'food', description: 'Delivery comida' },
  { id: '18', amount: 95.00, date: '2025-11-20', category: 'services', description: 'Internet hogar', serviceName: 'Internet' },
  { id: '19', amount: 160.00, date: '2025-11-22', category: 'cards', description: 'Pago tarjeta Amex', cardName: 'Amex Platinum' },
  { id: '20', amount: 38.00, date: '2025-11-25', category: 'food', description: 'Almuerzo trabajo' },

  // October 2025
  { id: '21', amount: 200.00, date: '2025-10-01', category: 'cards', description: 'Pago tarjeta VISA', cardName: 'VISA Gold' },
  { id: '22', amount: 85.50, date: '2025-10-03', category: 'services', description: 'Netflix y Spotify', serviceName: 'Streaming' },
  { id: '23', amount: 72.00, date: '2025-10-05', category: 'food', description: 'Supermercado semanal' },
  { id: '24', amount: 190.00, date: '2025-10-08', category: 'cards', description: 'Pago tarjeta Mastercard', cardName: 'Mastercard Black' },
  { id: '25', amount: 120.00, date: '2025-10-10', category: 'services', description: 'Gimnasio mensual', serviceName: 'Gimnasio' },
  { id: '26', amount: 55.00, date: '2025-10-12', category: 'food', description: 'Cena restaurante' },
  { id: '27', amount: 48.00, date: '2025-10-15', category: 'food', description: 'Delivery comida' },
  { id: '28', amount: 95.00, date: '2025-10-18', category: 'services', description: 'Internet hogar', serviceName: 'Internet' },
  { id: '29', amount: 175.00, date: '2025-10-20', category: 'cards', description: 'Pago tarjeta Amex', cardName: 'Amex Platinum' },
  { id: '30', amount: 62.00, date: '2025-10-22', category: 'food', description: 'Almuerzo trabajo' },
];

export const getMonthlyTotals = (expenses: Expense[]): MonthlyTotal[] => {
  const monthlyMap = new Map<string, MonthlyTotal>();

  expenses.forEach(expense => {
    const date = new Date(expense.date);
    const month = date.toLocaleString('es', { month: 'long' });
    const year = date.getFullYear();
    const key = `${year}-${date.getMonth()}`;

    if (!monthlyMap.has(key)) {
      monthlyMap.set(key, {
        month,
        year,
        cards: 0,
        services: 0,
        food: 0,
        total: 0,
      });
    }

    const totals = monthlyMap.get(key)!;
    totals[expense.category] += expense.amount;
    totals.total += expense.amount;
  });

  return Array.from(monthlyMap.values()).sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return new Date(`${b.month} 1, ${b.year}`).getMonth() - new Date(`${a.month} 1, ${a.year}`).getMonth();
  });
};

export const getExpensesByMonth = (expenses: Expense[], month: number, year: number): Expense[] => {
  return expenses.filter(expense => {
    const date = new Date(expense.date);
    return date.getMonth() === month && date.getFullYear() === year;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const cardOptions = [
  { value: 'visa-gold', label: 'VISA Gold' },
  { value: 'mastercard-black', label: 'Mastercard Black' },
  { value: 'amex-platinum', label: 'Amex Platinum' },
  { value: 'visa-classic', label: 'VISA Classic' },
];

export const serviceOptions = [
  { value: 'streaming', label: 'Streaming' },
  { value: 'gimnasio', label: 'Gimnasio' },
  { value: 'internet', label: 'Internet' },
  { value: 'telefono', label: 'Teléfono' },
  { value: 'electricidad', label: 'Electricidad' },
  { value: 'gas', label: 'Gas' },
];

export const getAvailableMonths = (expenses: Expense[]): { label: string; value: string; month: number; year: number }[] => {
  const monthsSet = new Set<string>();
  const months: { label: string; value: string; month: number; year: number }[] = [];

  expenses.forEach(expense => {
    const date = new Date(expense.date);
    const monthNum = date.getMonth();
    const year = date.getFullYear();
    const key = `${year}-${monthNum}`;

    if (!monthsSet.has(key)) {
      monthsSet.add(key);
      const monthName = date.toLocaleString('es', { month: 'long' });
      months.push({
        label: `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${year}`,
        value: key,
        month: monthNum,
        year,
      });
    }
  });

  return months.sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return b.month - a.month;
  });
};
