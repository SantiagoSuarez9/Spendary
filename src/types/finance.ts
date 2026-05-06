export interface Transaction {
  id: string;
  amount: number;
  date: string;
  description: string;
  categoryId: string;
  type: 'income' | 'expense';
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  budgetLimit: number | null;
}

export interface Account {
  id: string;
  name: string;
  balance: number;
}
