import { supabase } from "./client";
import type { ExpenseCategory, Expense } from "@/types/finance";

/* ── Categories ── */

export async function fetchCategories(): Promise<ExpenseCategory[]> {
  const { data, error } = await supabase
    .from("expense_categories")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error("fetchCategories error:", error);
    throw error;
  }
  if (!data) return [];
  return data.map((d) => ({
    id: d.id,
    name: d.name,
    icon: d.icon,
    budget_amount: Number(d.budget_amount),
    budget_period: d.budget_period as "weekly" | "monthly",
  }));
}

export async function upsertCategory(
  cat: Omit<ExpenseCategory, "id"> & { id?: number },
): Promise<void> {
  const payload: Record<string, unknown> = {
    name: cat.name,
    icon: cat.icon,
    budget_amount: cat.budget_amount,
    budget_period: cat.budget_period,
  };
  if (cat.id) payload.id = cat.id;
  const { error } = await supabase.from("expense_categories").upsert(payload);
  if (error) {
    console.error("upsertCategory error:", error);
    throw error;
  }
}

export async function removeCategory(id: number): Promise<void> {
  const { error } = await supabase.from("expense_categories").delete().eq("id", id);
  if (error) {
    console.error("removeCategory error:", error);
    throw error;
  }
}

/* ── Expenses ── */

export async function fetchExpenses(
  fromDate: string,
  toDate: string,
): Promise<Expense[]> {
  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .gte("date", fromDate)
    .lte("date", toDate)
    .order("date", { ascending: false })
    .order("id", { ascending: false });

  if (error) {
    console.error("fetchExpenses error:", error);
    throw error;
  }
  if (!data) return [];
  return data.map((d) => ({
    id: d.id,
    category_id: d.category_id,
    amount: Number(d.amount),
    note: d.note,
    date: d.date,
  }));
}

export async function insertExpense(
  exp: Omit<Expense, "id">,
): Promise<void> {
  const { error } = await supabase.from("expenses").insert({
    category_id: exp.category_id,
    amount: exp.amount,
    note: exp.note,
    date: exp.date,
  });
  if (error) {
    console.error("insertExpense error:", error);
    throw error;
  }
}

export async function deleteExpense(id: number): Promise<void> {
  const { error } = await supabase.from("expenses").delete().eq("id", id);
  if (error) {
    console.error("deleteExpense error:", error);
    throw error;
  }
}
