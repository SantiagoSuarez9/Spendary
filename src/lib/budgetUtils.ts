import { Transaction, Category } from "@/types/finance";

/**
 * Calculates the total spending for a specific category within the current month.
 * @param transactions - Array of all transactions.
 * @param categoryId - The ID of the category to calculate spending for.
 * @returns The total amount spent in the category this month.
 */
export const calculateCategorySpending = (
  transactions: Transaction[],
  categoryId: string
): number => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  return transactions
    .filter(t => {
      const transactionDate = new Date(t.date);
      return (
        t.type === 'expense' &&
        t.categoryId === categoryId &&
        transactionDate.getMonth() === currentMonth &&
        transactionDate.getFullYear() === currentYear
      );
    })
    .reduce((acc, t) => acc + t.amount, 0);
};

/**
 * Determines the budget status for a given category.
 * @param category - The category object with its budgetLimit.
 * @param currentSpending - The current spending for that category.
 * @returns An object with budget status details.
 */
export const getBudgetStatus = (
  category: Category,
  currentSpending: number
) => {
  const { budgetLimit } = category;

  if (budgetLimit === null || budgetLimit === 0) {
    return {
      percentage: 0,
      isOverBudget: false,
      remaining: null,
    };
  }

  const percentage = (currentSpending / budgetLimit) * 100;
  const isOverBudget = currentSpending > budgetLimit;
  const remaining = budgetLimit - currentSpending;

  return {
    percentage: Math.min(percentage, 100), // Cap at 100% for UI
    isOverBudget,
    remaining,
  };
};
