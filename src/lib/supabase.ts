import { createClient } from '@supabase/supabase-js';

// Obtener las variables de entorno
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validar que las variables de entorno estén configuradas
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '⚠️  Las credenciales de Supabase no están configuradas. ' +
    'Por favor, crea un archivo .env con VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY'
  );
}

// Crear el cliente de Supabase
export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);

// Tipos para la base de datos
export interface Expense {
  id: string;
  user_id: string;
  amount: number;
  category: 'cards' | 'services' | 'food';
  description: string;
  date: string;
  card_name?: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
}
