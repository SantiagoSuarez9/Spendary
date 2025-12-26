import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CalendarIcon, CreditCard, Zap, UtensilsCrossed, Check } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Expense, ExpenseCategory } from '@/types/expense';
import { updateExpense as updateExpenseService } from '@/lib/supabaseService';
import { useToast } from '@/hooks/use-toast';

const expenseSchema = z.object({
  amount: z.string().min(1, 'El monto es requerido').refine(
    val => !isNaN(Number(val)) && Number(val) > 0,
    'Ingresa un monto válido'
  ),
  description: z.string().min(1, 'La descripción es requerida').max(100, 'Máximo 100 caracteres'),
  cardName: z.string().optional(),
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

const categories: { value: ExpenseCategory; label: string; icon: React.ElementType }[] = [
  { value: 'cards', label: 'Tarjetas', icon: CreditCard },
  { value: 'services', label: 'Servicios', icon: Zap },
  { value: 'food', label: 'Comida', icon: UtensilsCrossed },
];

interface EditExpenseDialogProps {
  expense: Expense | null;
  open: boolean;
  onClose: () => void;
  onUpdate: (expense: Expense) => void;
}

const EditExpenseDialog: React.FC<EditExpenseDialogProps> = ({
  expense,
  open,
  onClose,
  onUpdate,
}) => {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory>('food');
  const [date, setDate] = useState<Date>(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
  });

  useEffect(() => {
    if (expense) {
      setSelectedCategory(expense.category);
      setDate(new Date(expense.date));
      setValue('amount', expense.amount.toString());
      setValue('description', expense.description);
      setValue('cardName', expense.cardName || '');
    }
  }, [expense, setValue]);

  const onSubmit = async (data: ExpenseFormData) => {
    if (!expense) return;
    
    setIsSubmitting(true);
    
    try {
      const updatedExpense = await updateExpenseService(expense.id, {
        amount: Number(data.amount),
        date: format(date, 'yyyy-MM-dd'),
        category: selectedCategory,
        description: data.description,
        cardName: selectedCategory === 'cards' ? data.cardName : undefined,
      });

      onUpdate(updatedExpense);
      toast({
        title: 'Éxito',
        description: 'Gasto actualizado correctamente',
      });
      onClose();
      reset();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el gasto',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar gasto</DialogTitle>
          <DialogDescription>
            Modifica los detalles del gasto
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Category Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-foreground">Categoría</Label>
            <div className="grid grid-cols-3 gap-3">
              {categories.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setSelectedCategory(value)}
                  className={cn(
                    'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200',
                    selectedCategory === value
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-muted-foreground/30'
                  )}
                >
                  <Icon
                    className={cn(
                      'w-5 h-5',
                      selectedCategory === value ? 'text-primary' : 'text-muted-foreground'
                    )}
                  />
                  <span
                    className={cn(
                      'text-xs font-medium',
                      selectedCategory === value ? 'text-primary' : 'text-muted-foreground'
                    )}
                  >
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-medium text-foreground">
              Monto
            </Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                $
              </span>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                className="pl-8 h-12 text-lg"
                {...register('amount')}
              />
            </div>
            {errors.amount && (
              <p className="text-sm text-destructive">{errors.amount.message}</p>
            )}
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">Fecha</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full h-12 justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                  {format(date, 'PPP', { locale: es })}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => d && setDate(d)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Card Name (only for cards category) */}
          {selectedCategory === 'cards' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2"
            >
              <Label htmlFor="cardName" className="text-sm font-medium text-foreground">
                Nombre de la tarjeta
              </Label>
              <Input
                id="cardName"
                type="text"
                placeholder="Ej: Visa Gold, Mastercard, etc."
                className="h-12"
                {...register('cardName')}
              />
            </motion.div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-foreground">
              Descripción
            </Label>
            <Textarea
              id="description"
              placeholder="Describe el gasto..."
              className="min-h-[80px] resize-none"
              {...register('description')}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 gradient-accent hover:opacity-90"
            >
              {isSubmitting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full"
                />
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Guardar cambios
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditExpenseDialog;
