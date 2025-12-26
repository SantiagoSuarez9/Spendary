import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftRight } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import ComparisonResult from '@/components/compare/ComparisonResult';
import { useExpenses } from '@/context/ExpenseContext';
import { getAvailableMonths, getExpensesByMonth } from '@/data/mockData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MonthlyTotal } from '@/types/expense';

const Compare: React.FC = () => {
  const { expenses } = useExpenses();
  const availableMonths = getAvailableMonths(expenses);

  const [month1, setMonth1] = useState(
    availableMonths.length > 1 ? availableMonths[1].value : ''
  );
  const [month2, setMonth2] = useState(
    availableMonths.length > 0 ? availableMonths[0].value : ''
  );

  const month1Data = availableMonths.find(m => m.value === month1);
  const month2Data = availableMonths.find(m => m.value === month2);

  const totals1 = useMemo((): MonthlyTotal | null => {
    if (!month1Data) return null;
    const monthExpenses = getExpensesByMonth(expenses, month1Data.month, month1Data.year);
    return {
      month: month1Data.label,
      year: month1Data.year,
      cards: monthExpenses.filter(e => e.category === 'cards').reduce((s, e) => s + e.amount, 0),
      services: monthExpenses.filter(e => e.category === 'services').reduce((s, e) => s + e.amount, 0),
      food: monthExpenses.filter(e => e.category === 'food').reduce((s, e) => s + e.amount, 0),
      total: monthExpenses.reduce((s, e) => s + e.amount, 0),
    };
  }, [expenses, month1Data]);

  const totals2 = useMemo((): MonthlyTotal | null => {
    if (!month2Data) return null;
    const monthExpenses = getExpensesByMonth(expenses, month2Data.month, month2Data.year);
    return {
      month: month2Data.label,
      year: month2Data.year,
      cards: monthExpenses.filter(e => e.category === 'cards').reduce((s, e) => s + e.amount, 0),
      services: monthExpenses.filter(e => e.category === 'services').reduce((s, e) => s + e.amount, 0),
      food: monthExpenses.filter(e => e.category === 'food').reduce((s, e) => s + e.amount, 0),
      total: monthExpenses.reduce((s, e) => s + e.amount, 0),
    };
  }, [expenses, month2Data]);

  const canCompare = totals1 && totals2 && month1 !== month2;

  return (
    <Layout>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Comparar meses
          </h1>
          <p className="text-muted-foreground mt-1">
            Analiza la evolución de tus gastos
          </p>
        </motion.div>

        {/* Month Selection */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-card rounded-2xl shadow-card p-4 md:p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <ArrowLeftRight className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">
              Selecciona los meses a comparar
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Mes base</label>
              <Select value={month1} onValueChange={setMonth1}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Selecciona un mes" />
                </SelectTrigger>
                <SelectContent>
                  {availableMonths.map(month => (
                    <SelectItem
                      key={month.value}
                      value={month.value}
                      disabled={month.value === month2}
                    >
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Mes a comparar</label>
              <Select value={month2} onValueChange={setMonth2}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Selecciona un mes" />
                </SelectTrigger>
                <SelectContent>
                  {availableMonths.map(month => (
                    <SelectItem
                      key={month.value}
                      value={month.value}
                      disabled={month.value === month1}
                    >
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>

        {/* Comparison Result */}
        {canCompare ? (
          <ComparisonResult
            month1={totals1}
            month2={totals2}
            month1Label={month1Data?.label || ''}
            month2Label={month2Data?.label || ''}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 text-muted-foreground"
          >
            <p>Selecciona dos meses diferentes para comparar</p>
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export default Compare;
