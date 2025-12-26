import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, ArrowRight } from 'lucide-react';
import { formatCurrency, categoryConfig } from '@/lib/categoryUtils';
import { MonthlyTotal } from '@/types/expense';
import { ExpenseCategory } from '@/types/expense';
import { cn } from '@/lib/utils';

interface ComparisonResultProps {
  month1: MonthlyTotal;
  month2: MonthlyTotal;
  month1Label: string;
  month2Label: string;
}

const ComparisonResult: React.FC<ComparisonResultProps> = ({
  month1,
  month2,
  month1Label,
  month2Label,
}) => {
  const totalDiff = month2.total - month1.total;
  const totalPercentage = month1.total > 0 ? ((totalDiff / month1.total) * 100).toFixed(1) : 0;
  const isIncrease = totalDiff > 0;
  const isDecrease = totalDiff < 0;

  const categories: ExpenseCategory[] = ['cards', 'services', 'food'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Total Comparison */}
      <div className="bg-card rounded-2xl shadow-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">{month1Label}</p>
              <p className="text-lg font-bold text-foreground">
                {formatCurrency(month1.total)}
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground" />
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">{month2Label}</p>
              <p className="text-lg font-bold text-foreground">
                {formatCurrency(month2.total)}
              </p>
            </div>
          </div>
          <div
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold',
              isIncrease && 'bg-danger/10 text-danger',
              isDecrease && 'bg-success/10 text-success',
              !isIncrease && !isDecrease && 'bg-muted text-muted-foreground'
            )}
          >
            {isIncrease && <TrendingUp className="w-4 h-4" />}
            {isDecrease && <TrendingDown className="w-4 h-4" />}
            {!isIncrease && !isDecrease && <Minus className="w-4 h-4" />}
            <span>
              {isDecrease ? '-' : isIncrease ? '+' : ''}
              {Math.abs(Number(totalPercentage))}%
            </span>
          </div>
        </div>

        <div className="text-center py-4 rounded-xl bg-muted/50">
          <p className="text-sm text-muted-foreground mb-1">Diferencia</p>
          <p
            className={cn(
              'text-2xl font-bold',
              isIncrease && 'text-danger',
              isDecrease && 'text-success',
              !isIncrease && !isDecrease && 'text-foreground'
            )}
          >
            {isIncrease ? '+' : ''}
            {formatCurrency(totalDiff)}
          </p>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-card rounded-2xl shadow-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Por categoría
        </h3>
        <div className="space-y-4">
          {categories.map(category => {
            const config = categoryConfig[category];
            const Icon = config.icon;
            const diff = month2[category] - month1[category];
            const percentage = month1[category] > 0 ? ((diff / month1[category]) * 100).toFixed(1) : 0;
            const catIncrease = diff > 0;
            const catDecrease = diff < 0;

            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-muted/30"
              >
                <div className={cn('p-3 rounded-xl', config.iconBgClass)}>
                  <Icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{config.label}</p>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span>{formatCurrency(month1[category])}</span>
                    <ArrowRight className="w-3 h-3" />
                    <span>{formatCurrency(month2[category])}</span>
                  </div>
                </div>
                <div
                  className={cn(
                    'flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium',
                    catIncrease && 'bg-danger/10 text-danger',
                    catDecrease && 'bg-success/10 text-success',
                    !catIncrease && !catDecrease && 'bg-muted text-muted-foreground'
                  )}
                >
                  {catIncrease && <TrendingUp className="w-3 h-3" />}
                  {catDecrease && <TrendingDown className="w-3 h-3" />}
                  {!catIncrease && !catDecrease && <Minus className="w-3 h-3" />}
                  <span>
                    {catDecrease ? '-' : catIncrease ? '+' : ''}
                    {Math.abs(Number(percentage))}%
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default ComparisonResult;
