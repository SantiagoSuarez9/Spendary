import { ExpenseCategory } from '@/types/expense';
import { CreditCard, Zap, UtensilsCrossed, LucideIcon } from 'lucide-react';

interface CategoryConfig {
  label: string;
  icon: LucideIcon;
  gradient: string;
  bgClass: string;
  iconBgClass: string;
}

export const categoryConfig: Record<ExpenseCategory, CategoryConfig> = {
  cards: {
    label: 'Tarjetas',
    icon: CreditCard,
    gradient: 'gradient-cards',
    bgClass: 'bg-category-cards/10',
    iconBgClass: 'bg-category-cards',
  },
  services: {
    label: 'Servicios',
    icon: Zap,
    gradient: 'gradient-services',
    bgClass: 'bg-category-services/10',
    iconBgClass: 'bg-category-services',
  },
  food: {
    label: 'Comida',
    icon: UtensilsCrossed,
    gradient: 'gradient-food',
    bgClass: 'bg-category-food/10',
    iconBgClass: 'bg-category-food',
  },
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

export const formatDateShort = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: 'short',
  }).format(date);
};
