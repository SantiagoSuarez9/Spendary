import { supabase } from './supabase';
import type { Expense as DbExpense } from './supabase';
import type { Expense } from '@/types/expense';

/**
 * Servicio para interactuar con Supabase
 */

// ============= AUTENTICACIÓN =============

/**
 * Registrar un nuevo usuario
 */
export const signUp = async (email: string, password: string, fullName?: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) throw error;
  return data;
};

/**
 * Iniciar sesión
 */
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
};

/**
 * Cerrar sesión
 */
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

/**
 * Solicitar reseteo de contraseña
 */
export const resetPassword = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  if (error) throw error;
};

/**
 * Actualizar contraseña
 */
export const updatePassword = async (newPassword: string) => {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  if (error) throw error;
};

/**
 * Obtener el usuario actual
 */
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
};

/**
 * Obtener la sesión actual
 */
export const getSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
};

// ============= GASTOS =============

/**
 * Crear un nuevo gasto
 */
export const createExpense = async (expense: Omit<Expense, 'id'>) => {
  const user = await getCurrentUser();
  if (!user) throw new Error('Usuario no autenticado');

  const { data, error } = await supabase
    .from('expenses')
    .insert({
      user_id: user.id,
      amount: expense.amount,
      category: expense.category,
      description: expense.description,
      date: expense.date,
      card_name: expense.cardName,
    })
    .select()
    .single();

  if (error) throw error;
  return mapDbExpenseToExpense(data);
};

/**
 * Obtener todos los gastos del usuario actual
 */
export const getExpenses = async (): Promise<Expense[]> => {
  const user = await getCurrentUser();
  if (!user) throw new Error('Usuario no autenticado');

  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false });

  if (error) throw error;
  return data.map(mapDbExpenseToExpense);
};

/**
 * Actualizar un gasto
 */
export const updateExpense = async (id: string, updates: Partial<Expense>) => {
  const { data, error } = await supabase
    .from('expenses')
    .update({
      amount: updates.amount,
      category: updates.category,
      description: updates.description,
      date: updates.date,
      card_name: updates.cardName,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return mapDbExpenseToExpense(data);
};

/**
 * Eliminar un gasto
 */
export const deleteExpense = async (id: string) => {
  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

/**
 * Obtener gastos por rango de fechas
 */
export const getExpensesByDateRange = async (startDate: string, endDate: string): Promise<Expense[]> => {
  const user = await getCurrentUser();
  if (!user) throw new Error('Usuario no autenticado');

  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('user_id', user.id)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: false });

  if (error) throw error;
  return data.map(mapDbExpenseToExpense);
};

// ============= UTILIDADES =============

/**
 * Mapear expense de la base de datos al tipo de la aplicación
 */
const mapDbExpenseToExpense = (dbExpense: DbExpense): Expense => {
  return {
    id: dbExpense.id,
    amount: dbExpense.amount,
    category: dbExpense.category,
    description: dbExpense.description,
    date: dbExpense.date,
    cardName: dbExpense.card_name,
  };
};

/**
 * Suscribirse a cambios en tiempo real de los gastos
 */
export const subscribeToExpenses = (callback: (payload: any) => void) => {
  return supabase
    .channel('expenses-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'expenses',
      },
      callback
    )
    .subscribe();
};
