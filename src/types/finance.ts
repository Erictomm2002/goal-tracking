export interface ExpenseCategory {
  id: number;
  name: string;
  icon: string;
  budget_amount: number;
  budget_period: "weekly" | "monthly";
}

export interface Expense {
  id: number;
  category_id: number;
  amount: number;
  note: string;
  date: string;
}

export interface CategoryFormData {
  name: string;
  icon: string;
  budget_amount: number;
  budget_period: "weekly" | "monthly";
}

export interface SavingsSpend {
  id: number;
  amount: number;
  note: string;
  date: string;
}

export interface FinanceDeclaration {
  id: number;
  cash: number;
  bank: number;
  date: string;
}
