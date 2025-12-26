import React from 'react';
import { motion } from 'framer-motion';
import { formatCurrency, formatDateShort, categoryConfig } from '@/lib/categoryUtils';
import { Expense } from '@/types/expense';
import { cn } from '@/lib/utils';

interface RecentExpensesProps {
  expenses: Expense[];
}

const RecentExpenses: React.FC<RecentExpensesProps> = ({ expenses }) => {
  const recentExpenses = expenses.slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="bg-card rounded-2xl shadow-card p-5 md:p-6"
    >
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Gastos recientes
      </h3>
      <div className="space-y-3">
        {recentExpenses.map((expense, index) => {
          const config = categoryConfig[expense.category];
          const Icon = config.icon;

          return (
            <motion.div
              key={expense.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
              className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors"
            >
              <div className={cn('p-2.5 rounded-xl', config.iconBgClass)}>
                <Icon className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {expense.description}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDateShort(expense.date)} · {config.label}
                </p>
              </div>
              <p className="text-sm font-semibold text-foreground">
                {formatCurrency(expense.amount)}
              </p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default RecentExpenses;
