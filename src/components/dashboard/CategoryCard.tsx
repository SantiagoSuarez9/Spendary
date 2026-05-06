import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { formatCurrency } from '@/lib/categoryUtils';
import { getBudgetStatus } from '@/lib/budgetUtils';

interface CategoryCardProps {
  title: string;
  amount: number;
  icon: React.FC<{ className?: string }>;
  gradient: string;
  delay?: number;
  budgetLimit: number | null;
  currentSpending: number;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  title,
  amount,
  icon: Icon,
  gradient,
  delay = 0,
  budgetLimit,
  currentSpending,
}) => {
  const budgetStatus = budgetLimit ? getBudgetStatus({ budgetLimit } as any, currentSpending) : null;

  return (
    <motion.div /* ... */ >
      <div className="relative p-5 md:p-6">
        <div className="flex items-start justify-between">
          {/* ... (título y monto) */}
        </div>
        {budgetStatus && (
          <div className="mt-4">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="text-muted-foreground">Presupuesto</span>
              <span className={`font-medium ${budgetStatus.isOverBudget ? 'text-destructive' : 'text-muted-foreground'}`}>
                {formatCurrency(currentSpending)} / {formatCurrency(budgetLimit!)}
              </span>
            </div>
            <Progress value={budgetStatus.percentage} className="h-2" />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CategoryCard;
