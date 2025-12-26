import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/categoryUtils';

interface CategoryCardProps {
  title: string;
  amount: number;
  icon: LucideIcon;
  gradient: string;
  delay?: number;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  title,
  amount,
  icon: Icon,
  gradient,
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="relative overflow-hidden rounded-2xl bg-card shadow-card hover:shadow-card-hover transition-shadow duration-300"
    >
      <div className={cn('absolute inset-0 opacity-5', gradient)} />
      <div className="relative p-5 md:p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl md:text-3xl font-bold text-foreground">
              {formatCurrency(amount)}
            </p>
          </div>
          <div className={cn('p-3 rounded-xl', gradient)}>
            <Icon className="w-5 h-5 md:w-6 md:h-6 text-primary-foreground" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CategoryCard;
