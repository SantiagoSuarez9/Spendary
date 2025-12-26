import React from 'react';
import { motion } from 'framer-motion';
import { categoryConfig, formatCurrency } from '@/lib/categoryUtils';
import { ExpenseCategory } from '@/types/expense';

interface CategoryBreakdownProps {
  totals: Record<ExpenseCategory, number>;
}

const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({ totals }) => {
  const total = Object.values(totals).reduce((sum, val) => sum + val, 0);

  const categories = (Object.keys(totals) as ExpenseCategory[]).map(category => ({
    category,
    amount: totals[category],
    percentage: total > 0 ? (totals[category] / total) * 100 : 0,
    ...categoryConfig[category],
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="bg-card rounded-2xl shadow-card p-5 md:p-6"
    >
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Distribución
      </h3>
      <div className="space-y-4">
        {categories.map(({ category, amount, percentage, label, gradient }) => (
          <div key={category} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-foreground">{label}</span>
              <span className="text-muted-foreground">
                {formatCurrency(amount)} ({percentage.toFixed(0)}%)
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className={`h-full ${gradient} rounded-full`}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default CategoryBreakdown;
