import React from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import ExpenseForm from '@/components/expenses/ExpenseForm';

const AddExpense: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Agregar gasto
          </h1>
          <p className="text-muted-foreground mt-1">
            Registra un nuevo gasto en tu historial
          </p>
        </motion.div>

        <ExpenseForm />
      </div>
    </Layout>
  );
};

export default AddExpense;
