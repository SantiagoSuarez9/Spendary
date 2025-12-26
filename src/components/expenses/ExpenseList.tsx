import React from 'react';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { formatCurrency, formatDate, categoryConfig } from '@/lib/categoryUtils';
import { Expense } from '@/types/expense';
import { cn } from '@/lib/utils';

interface ExpenseListProps {
  expenses: Expense[];
  onDelete?: (id: string) => void;
  showDelete?: boolean;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onDelete, showDelete = false }) => {
  if (expenses.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No hay gastos registrados</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {expenses.map((expense, index) => {
        const config = categoryConfig[expense.category];
        const Icon = config.icon;

        return (
          <motion.div
            key={expense.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-card rounded-xl shadow-card p-4 hover:shadow-card-hover transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className={cn('p-3 rounded-xl', config.iconBgClass)}>
                <Icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">
                  {expense.description}
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{formatDate(expense.date)}</span>
                  <span>·</span>
                  <span>{config.label}</span>
                  {expense.cardName && (
                    <>
                      <span>·</span>
                      <span>{expense.cardName}</span>
                    </>
                  )}
                  {expense.serviceName && (
                    <>
                      <span>·</span>
                      <span>{expense.serviceName}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-lg font-semibold text-foreground">
                  {formatCurrency(expense.amount)}
                </p>
                {showDelete && onDelete && (
                  <button
                    onClick={() => onDelete(expense.id)}
                    className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ExpenseList;
