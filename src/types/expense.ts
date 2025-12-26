export type ExpenseCategory = 'cards' | 'services' | 'food' | 'others';

export interface Expense {
  id: string;
  amount: number;
  date: string;
  category: ExpenseCategory;
  description: string;
  cardName?: string;
  serviceName?: string;
}

export interface MonthlyTotal {
  month: string;
  year: number;
  cards: number;
  services: number;
  food: number;
  others: number;
  total: number;
}

export interface MonthOption {
  label: string;
  value: string;
  month: number;
  year: number;
}
