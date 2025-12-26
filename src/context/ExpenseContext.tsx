import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Expense } from '@/types/expense';
import {
  getExpenses,
  createExpense,
  deleteExpense as deleteExpenseService,
} from '@/lib/supabaseService';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ExpenseContextType {
  expenses: Expense[];
  loading: boolean;
  addExpense: (expense: Omit<Expense, 'id'>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  refreshExpenses: () => Promise<void>;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const refreshExpenses = async () => {
    if (!user) {
      setExpenses([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getExpenses();
      setExpenses(data);
    } catch (error) {
      console.error('Error al cargar gastos:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los gastos',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshExpenses();
  }, [user]);

  const addExpense = async (expense: Omit<Expense, 'id'>) => {
    try {
      const newExpense = await createExpense(expense);
      setExpenses(prev => [newExpense, ...prev]);
      toast({
        title: 'Éxito',
        description: 'Gasto agregado correctamente',
      });
    } catch (error) {
      console.error('Error al agregar gasto:', error);
      toast({
        title: 'Error',
        description: 'No se pudo agregar el gasto',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      await deleteExpenseService(id);
      setExpenses(prev => prev.filter(expense => expense.id !== id));
      toast({
        title: 'Éxito',
        description: 'Gasto eliminado correctamente',
      });
    } catch (error) {
      console.error('Error al eliminar gasto:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el gasto',
        variant: 'destructive',
      });
      throw error;
    }
  };

  return (
    <ExpenseContext.Provider value={{ expenses, loading, addExpense, deleteExpense, refreshExpenses }}>
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
};
