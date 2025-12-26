-- =============================================
-- SCRIPT DE CONFIGURACIÓN PARA SUPABASE
-- Aplicación: Spendary
-- Descripción: Gestión de gastos personales
-- =============================================

-- =============================================
-- TABLAS
-- =============================================

-- Tabla de perfiles de usuario (extiende auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de gastos
CREATE TABLE IF NOT EXISTS public.expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL CHECK (amount >= 0),
  category TEXT NOT NULL CHECK (category IN ('cards', 'services', 'food', 'others')),
  description TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  card_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ÍNDICES
-- =============================================

-- Índice para búsquedas por usuario
CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON public.expenses(user_id);

-- Índice para búsquedas por fecha
CREATE INDEX IF NOT EXISTS idx_expenses_date ON public.expenses(date);

-- Índice compuesto para búsquedas por usuario y fecha
CREATE INDEX IF NOT EXISTS idx_expenses_user_date ON public.expenses(user_id, date DESC);

-- Índice para búsquedas por categoría
CREATE INDEX IF NOT EXISTS idx_expenses_category ON public.expenses(category);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Habilitar RLS en las tablas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- ===== POLÍTICAS PARA PROFILES =====

-- Los usuarios pueden ver su propio perfil
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Los usuarios pueden actualizar su propio perfil
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Los usuarios pueden insertar su propio perfil
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ===== POLÍTICAS PARA EXPENSES =====

-- Los usuarios pueden ver sus propios gastos
CREATE POLICY "Users can view own expenses"
  ON public.expenses FOR SELECT
  USING (auth.uid() = user_id);

-- Los usuarios pueden crear sus propios gastos
CREATE POLICY "Users can create own expenses"
  ON public.expenses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Los usuarios pueden actualizar sus propios gastos
CREATE POLICY "Users can update own expenses"
  ON public.expenses FOR UPDATE
  USING (auth.uid() = user_id);

-- Los usuarios pueden eliminar sus propios gastos
CREATE POLICY "Users can delete own expenses"
  ON public.expenses FOR DELETE
  USING (auth.uid() = user_id);

-- =============================================
-- TRIGGERS
-- =============================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para profiles
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para expenses
DROP TRIGGER IF EXISTS update_expenses_updated_at ON public.expenses;
CREATE TRIGGER update_expenses_updated_at
  BEFORE UPDATE ON public.expenses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Función para crear perfil automáticamente cuando se registra un usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para crear perfil automáticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- VISTAS ÚTILES (OPCIONAL)
-- =============================================

-- Vista para ver gastos con información agregada
CREATE OR REPLACE VIEW public.expenses_summary AS
SELECT 
  user_id,
  DATE_TRUNC('month', date) AS month,
  category,
  COUNT(*) AS total_expenses,
  SUM(amount) AS total_amount,
  AVG(amount) AS avg_amount,
  MIN(amount) AS min_amount,
  MAX(amount) AS max_amount
FROM public.expenses
GROUP BY user_id, DATE_TRUNC('month', date), category;

-- =============================================
-- FUNCIONES ÚTILES
-- =============================================

-- Función para obtener resumen mensual por categoría
CREATE OR REPLACE FUNCTION get_monthly_summary(
  p_user_id UUID,
  p_month DATE
)
RETURNS TABLE (
  category TEXT,
  total_amount DECIMAL,
  expense_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    e.category,
    SUM(e.amount) AS total_amount,
    COUNT(*) AS expense_count
  FROM public.expenses e
  WHERE e.user_id = p_user_id
    AND DATE_TRUNC('month', e.date) = DATE_TRUNC('month', p_month)
  GROUP BY e.category;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para obtener gastos totales por mes
CREATE OR REPLACE FUNCTION get_total_by_month(
  p_user_id UUID,
  p_year INTEGER
)
RETURNS TABLE (
  month INTEGER,
  total_amount DECIMAL,
  expense_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    EXTRACT(MONTH FROM e.date)::INTEGER AS month,
    SUM(e.amount) AS total_amount,
    COUNT(*) AS expense_count
  FROM public.expenses e
  WHERE e.user_id = p_user_id
    AND EXTRACT(YEAR FROM e.date) = p_year
  GROUP BY EXTRACT(MONTH FROM e.date)
  ORDER BY month;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- COMENTARIOS EN LAS TABLAS
-- =============================================

COMMENT ON TABLE public.profiles IS 'Perfiles de usuario extendidos desde auth.users';
COMMENT ON TABLE public.expenses IS 'Gastos registrados por los usuarios';

COMMENT ON COLUMN public.expenses.category IS 'Categoría del gasto: cards (tarjetas), services (servicios), food (comida), others (otros gastos misceláneos)';
COMMENT ON COLUMN public.expenses.amount IS 'Monto del gasto en la moneda local';
COMMENT ON COLUMN public.expenses.description IS 'Descripción detallada del gasto';
COMMENT ON COLUMN public.expenses.card_name IS 'Nombre de la tarjeta cuando la categoría es "cards"';

-- =============================================
-- FIN DEL SCRIPT
-- =============================================

-- Mensaje de éxito
DO $$ 
BEGIN 
  RAISE NOTICE '✅ Base de datos configurada correctamente para Spendary';
END $$;
