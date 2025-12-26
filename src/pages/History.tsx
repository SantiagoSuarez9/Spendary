import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Filter } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import ExpenseList from '@/components/expenses/ExpenseList';
import { useExpenses } from '@/context/ExpenseContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatCurrency, categoryConfig } from '@/lib/categoryUtils';
import { ExpenseCategory, Expense } from '@/types/expense';
import { cn } from '@/lib/utils';

// Función para obtener meses disponibles desde los gastos
const getAvailableMonths = (expenses: Expense[]) => {
  const monthsMap = new Map<string, { month: number; year: number; label: string }>();
  
  expenses.forEach(expense => {
    const date = new Date(expense.date);
    const month = date.getMonth();
    const year = date.getFullYear();
    const key = `${year}-${month}`;
    
    if (!monthsMap.has(key)) {
      const monthName = date.toLocaleString('es', { month: 'long' });
      const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);
      monthsMap.set(key, {
        month,
        year,
        label: `${capitalizedMonth} ${year}`,
      });
    }
  });
  
  return Array.from(monthsMap.entries())
    .map(([value, data]) => ({ value, ...data }))
    .sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.month - a.month;
    });
};

// Función para filtrar gastos por mes
const getExpensesByMonth = (expenses: Expense[], month: number, year: number) => {
  return expenses.filter(expense => {
    const date = new Date(expense.date);
    return date.getMonth() === month && date.getFullYear() === year;
  });
};

const History: React.FC = () => {
  const { expenses, deleteExpense } = useExpenses();
  const availableMonths = getAvailableMonths(expenses);
  
  const [selectedMonth, setSelectedMonth] = useState(
    availableMonths.length > 0 ? availableMonths[0].value : ''
  );
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | 'all'>('all');

  const selectedMonthData = availableMonths.find(m => m.value === selectedMonth);

  const filteredExpenses = useMemo(() => {
    if (!selectedMonthData) return [];

    let monthExpenses = getExpensesByMonth(
      expenses,
      selectedMonthData.month,
      selectedMonthData.year
    );

    if (selectedCategory !== 'all') {
      monthExpenses = monthExpenses.filter(e => e.category === selectedCategory);
    }

    return monthExpenses;
  }, [expenses, selectedMonthData, selectedCategory]);

  const totalAmount = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  const categories = [
    { value: 'all', label: 'Todas' },
    { value: 'cards', label: 'Tarjetas' },
    { value: 'services', label: 'Servicios' },
    { value: 'food', label: 'Comida' },
    { value: 'others', label: 'Otros' },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Historial de gastos
          </h1>
          <p className="text-muted-foreground mt-1">
            Revisa y gestiona tus gastos por mes
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-card rounded-2xl shadow-card p-4 md:p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Filtros</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Mes</label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Selecciona un mes" />
                </SelectTrigger>
                <SelectContent>
                  {availableMonths.map(month => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Categoría</label>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value as ExpenseCategory | 'all')}
                    className={cn(
                      'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                      selectedCategory === cat.value
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    )}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="flex items-center justify-between bg-card rounded-xl shadow-card p-4"
        >
          <div>
            <p className="text-sm text-muted-foreground">
              {filteredExpenses.length} gasto{filteredExpenses.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-xl font-bold text-foreground">{formatCurrency(totalAmount)}</p>
          </div>
        </motion.div>

        {/* Expense List */}
        <ExpenseList
          expenses={filteredExpenses}
          onDelete={deleteExpense}
          showDelete
        />
      </div>
    </Layout>
  );
};

export default History;
