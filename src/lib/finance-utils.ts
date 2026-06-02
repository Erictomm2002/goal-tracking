import type { ExpenseCategory, Expense } from "@/types/finance";

export function startOfWeek(d = new Date()): string {
  const date = new Date(d);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  return date.toISOString().slice(0, 10);
}

export function startOfMonth(d = new Date()): string {
  const date = new Date(d);
  date.setDate(1);
  return date.toISOString().slice(0, 10);
}

export function endOfMonth(d = new Date()): string {
  const date = new Date(d);
  date.setMonth(date.getMonth() + 1, 0);
  return date.toISOString().slice(0, 10);
}

export function periodStart(cat: ExpenseCategory): string {
  if (cat.budget_period === "weekly") return startOfWeek();
  return startOfMonth();
}

export function spentInPeriod(
  expenses: Expense[],
  cat: ExpenseCategory,
): number {
  const from = periodStart(cat);
  return expenses
    .filter((e) => e.category_id === cat.id && e.date >= from)
    .reduce((s, e) => s + e.amount, 0);
}

export function budgetRemaining(
  expenses: Expense[],
  cat: ExpenseCategory,
): number {
  return cat.budget_amount - spentInPeriod(expenses, cat);
}

export function budgetPct(
  expenses: Expense[],
  cat: ExpenseCategory,
): number {
  if (!cat.budget_amount) return 0;
  const s = spentInPeriod(expenses, cat);
  return Math.min(100, Math.round((s / cat.budget_amount) * 100));
}
