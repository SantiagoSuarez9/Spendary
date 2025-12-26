import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Pencil } from 'lucide-react';
import { formatCurrency, formatDateShort, categoryConfig } from '@/lib/categoryUtils';
import { Expense } from '@/types/expense';
import { cn } from '@/lib/utils';
import EditExpenseDialog from '@/components/expenses/EditExpenseDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface RecentExpensesProps {
  expenses: Expense[];
  onDelete?: (id: string) => void;
  onUpdate?: (expense: Expense) => void;
}

const RecentExpenses: React.FC<RecentExpensesProps> = ({ expenses, onDelete, onUpdate }) => {
  const recentExpenses = expenses.slice(0, 5);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    if (onDelete) {
      onDelete(id);
    }
    setDeletingId(null);
  };

  const handleUpdate = (expense: Expense) => {
    if (onUpdate) {
      onUpdate(expense);
    }
    setEditingExpense(null);
  };

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
                  {expense.cardName && ` · ${expense.cardName}`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-foreground">
                  {formatCurrency(expense.amount)}
                </p>
                {onUpdate && (
                  <button
                    onClick={() => setEditingExpense(expense)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                    title="Editar gasto"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => setDeletingId(expense.id)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    title="Eliminar gasto"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Edit Dialog */}
      <EditExpenseDialog
        expense={editingExpense}
        open={!!editingExpense}
        onClose={() => setEditingExpense(null)}
        onUpdate={handleUpdate}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar gasto?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El gasto será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingId && handleDelete(deletingId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};

export default RecentExpenses;
