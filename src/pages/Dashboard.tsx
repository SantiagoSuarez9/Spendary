import React from 'react';
import { motion } from 'framer-motion';
import { useExpenses } from '@/context/ExpenseContext';
import { categoryConfig } from '@/lib/categoryUtils';
import Layout from '@/components/layout/Layout';
import BalanceCard from '@/components/dashboard/BalanceCard';
import CategoryCard from '@/components/dashboard/CategoryCard';
import RecentExpenses from '@/components/dashboard/RecentExpenses';
import CategoryBreakdown from '@/components/dashboard/CategoryBreakdown';

const Dashboard: React.FC = () => {
  const { expenses, loading, deleteExpense, refreshExpenses } = useExpenses();
  
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  // Filtrar gastos del mes actual
  const currentMonthExpenses = expenses.filter(e => {
    const expenseDate = new Date(e.date);
    return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
  });

  // Filtrar gastos del mes anterior
  const previousMonthExpenses = expenses.filter(e => {
    const expenseDate = new Date(e.date);
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    return expenseDate.getMonth() === prevMonth && expenseDate.getFullYear() === prevYear;
  });

  const currentTotals = {
    cards: currentMonthExpenses.filter(e => e.category === 'cards').reduce((sum, e) => sum + e.amount, 0),
    services: currentMonthExpenses.filter(e => e.category === 'services').reduce((sum, e) => sum + e.amount, 0),
    food: currentMonthExpenses.filter(e => e.category === 'food').reduce((sum, e) => sum + e.amount, 0),
  };

  const totalCurrent = currentTotals.cards + currentTotals.services + currentTotals.food;
  const totalPrevious = previousMonthExpenses.reduce((sum, e) => sum + e.amount, 0);

  const currentMonthName = currentDate.toLocaleString('es', { month: 'long' });
  const capitalizedMonth = currentMonthName.charAt(0).toUpperCase() + currentMonthName.slice(1);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-muted-foreground">Cargando gastos...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Bienvenido a Spendary
          </h1>
          <p className="text-muted-foreground mt-1">
            Tu resumen de gastos de {capitalizedMonth}
          </p>
        </motion.div>

        {/* Balance Card */}
        <BalanceCard
          total={totalCurrent}
          previousTotal={totalPrevious}
          month={capitalizedMonth}
        />

        {/* Category Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <CategoryCard
            title="Tarjetas"
            amount={currentTotals.cards}
            icon={categoryConfig.cards.icon}
            gradient={categoryConfig.cards.gradient}
            delay={0.1}
          />
          <CategoryCard
            title="Servicios"
            amount={currentTotals.services}
            icon={categoryConfig.services.icon}
            gradient={categoryConfig.services.gradient}
            delay={0.2}
          />
          <CategoryCard
            title="Comida"
            amount={currentTotals.food}
            icon={categoryConfig.food.icon}
            gradient={categoryConfig.food.gradient}
            delay={0.3}
          />
        </div>

        {/* Recent Expenses and Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentExpenses 
            expenses={currentMonthExpenses} 
            onDelete={deleteExpense}
            onUpdate={() => refreshExpenses()}
          />
          <CategoryBreakdown totals={currentTotals} />
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
