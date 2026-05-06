import { useMemo, useState } from 'react';
import { Transaction, Category, Account } from '../types/finance';

// Mock data for demonstration purposes
const mockTransactions: Transaction[] = [
  { id: '1', amount: 1500, date: '2026-05-01', description: 'Salary', categoryId: 'salary', type: 'income' },
  { id: '2', amount: 75, date: '2026-05-01', description: 'Groceries', categoryId: 'food', type: 'expense' },
  { id: '3', amount: 200, date: '2026-05-02', description: 'New shoes', categoryId: 'clothing', type: 'expense' },
  { id: '4', amount: 50, date: '2026-05-03', description: 'Gas', categoryId: 'transport', type: 'expense' },
  { id: '5', amount: 120, date: '2026-05-04', description: 'Dinner with friends', categoryId: 'food', type: 'expense' },
  { id: '6', amount: 500, date: '2026-05-05', description: 'Freelance project', categoryId: 'freelance', type: 'income' },
];

const mockCategories: Category[] = [
    { id: 'salary', name: 'Salary', icon: 'cash', budgetLimit: null },
    { id: 'freelance', name: 'Freelance', icon: 'briefcase', budgetLimit: null },
    { id: 'food', name: 'Food', icon: 'utensils', budgetLimit: 400 },
    { id: 'clothing', name: 'Clothing', icon: 'shirt', budgetLimit: 250 },
    { id: 'transport', name: 'Transport', icon: 'bus', budgetLimit: 100 },
    { id: 'others', name: 'Others', icon: 'ellipsis', budgetLimit: 150 },
];

const mockAccounts: Account[] = [
    { id: 'acc1', name: 'Main Bank Account', balance: 5250 },
    { id: 'acc2', name: 'Savings', balance: 15000 },
];

export const useFinance = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [accounts, setAccounts] = useState<Account[]>(mockAccounts);

  const totalIncomes = useMemo(() => {
    return transactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);
  }, [transactions]);

  const totalExpenses = useMemo(() => {
    return transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);
  }, [transactions]);

  const totalBalance = useMemo(() => {
    return totalIncomes - totalExpenses;
  }, [totalIncomes, totalExpenses]);

  const expensesByCategory = useMemo(() => {
    const categoryMap: { [key: string]: number } = {};
    transactions
      .filter(t => t.type === 'expense')
      .forEach(transaction => {
        if (categoryMap[transaction.categoryId]) {
          categoryMap[transaction.categoryId] += transaction.amount;
        } else {
          categoryMap[transaction.categoryId] = transaction.amount;
        }
      });
    return categoryMap;
  }, [transactions]);

  return {
    transactions,
    categories,
    accounts,
    setTransactions,
    setCategories,
    setAccounts,
    totalIncomes,
    totalExpenses,
    totalBalance,
    expensesByCategory,
  };
};
