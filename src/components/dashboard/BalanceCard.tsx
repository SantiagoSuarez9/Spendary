import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency } from '@/lib/categoryUtils';
import { cn } from '@/lib/utils';

interface BalanceCardProps {
  total: number;
  previousTotal?: number;
  month: string;
}

const BalanceCard: React.FC<BalanceCardProps> = ({ total, previousTotal, month }) => {
  const difference = previousTotal ? total - previousTotal : 0;
  const percentChange = previousTotal ? ((difference / previousTotal) * 100).toFixed(1) : 0;
  const isIncrease = difference > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-2xl gradient-primary text-primary-foreground shadow-lg"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
      <div className="relative p-6 md:p-8">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-primary-foreground/80">
              Balance total · {month}
            </p>
            <p className="text-3xl md:text-4xl font-bold">
              {formatCurrency(total)}
            </p>
            {previousTotal !== undefined && previousTotal > 0 && (
              <div className="flex items-center gap-2 mt-3">
                <div
                  className={cn(
                    'flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
                    isIncrease
                      ? 'bg-danger/20 text-danger-foreground'
                      : 'bg-success/20 text-success-foreground'
                  )}
                >
                  {isIncrease ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span>{Math.abs(Number(percentChange))}%</span>
                </div>
                <span className="text-xs text-primary-foreground/70">
                  vs. mes anterior
                </span>
              </div>
            )}
          </div>
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm">
            <Wallet className="w-7 h-7 md:w-8 md:h-8" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BalanceCard;
