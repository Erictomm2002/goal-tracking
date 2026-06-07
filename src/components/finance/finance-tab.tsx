"use client";

import { useState } from "react";
import { useCategories } from "@/hooks/use-categories";
import { useExpenses } from "@/hooks/use-expenses";
import { useSavings } from "@/hooks/use-savings";
import { useDeclarations } from "@/hooks/use-declarations";
import { BudgetOverview } from "./budget-overview";
import { CategoryForm } from "./category-form";
import { ExpenseList } from "./expense-list";
import { ExpenseQuickAdd } from "./expense-quickadd";
import { FinanceCharts } from "./finance-charts";
import { BudgetAlert } from "./budget-alert";
import { SavingsCard } from "./savings-card";
import { DeclarationCard } from "./declaration-card";
import type { ExpenseCategory } from "@/types/finance";

export function FinanceTab() {
  const { categories, isLoading: catLoading, saveCategory, removeCategory } = useCategories();
  const { expenses, isLoading: expLoading, addExpense, removeExpense } = useExpenses();
  const { isLoading: savLoading, totalSaved, totalSpent, netSavings, spends, addSpending } = useSavings();
  const { latest, isLoading: decLoading, declare } = useDeclarations();

  const [showForm, setShowForm] = useState(false);
  const [editCat, setEditCat] = useState<ExpenseCategory | undefined>();

  const handleSaveCat = (data: {
    id?: number;
    name: string;
    icon: string;
    budget_amount: number;
    budget_period: "weekly" | "monthly";
  }) => {
    saveCategory(data);
    setShowForm(false);
    setEditCat(undefined);
  };

  const handleEdit = (cat: ExpenseCategory) => {
    setEditCat(cat);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Xoá danh mục này? Các chi tiêu liên quan cũng sẽ bị xoá.")) {
      removeCategory(id);
    }
  };

  if (catLoading || expLoading || savLoading || decLoading) return null;

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <BudgetAlert categories={categories} expenses={expenses} />

        <DeclarationCard latest={latest} onDeclare={declare} />

        <SavingsCard
          totalSaved={totalSaved}
          totalSpent={totalSpent}
          netSavings={netSavings}
          spends={spends}
          onSpend={addSpending}
        />

        <BudgetOverview
          categories={categories}
          expenses={expenses}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <button
          onClick={() => {
            setEditCat(undefined);
            setShowForm(true);
          }}
          style={{
            display: "block",
            width: "100%",
            padding: "12px",
            background: "rgba(249,115,22,0.08)",
            border: "1px dashed rgba(249,115,22,0.3)",
            borderRadius: 12,
            color: "#F97316",
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "'Courier New', monospace",
            letterSpacing: 1,
          }}
        >
          + THÊM DANH MỤC MỚI
        </button>

        <ExpenseList
          expenses={expenses}
          categories={categories}
          onDelete={removeExpense}
        />

        <FinanceCharts expenses={expenses} categories={categories} />
      </div>

      <ExpenseQuickAdd categories={categories} onSave={addExpense} />

      {showForm && (
        <CategoryForm
          initial={editCat}
          onSave={handleSaveCat}
          onClose={() => {
            setShowForm(false);
            setEditCat(undefined);
          }}
        />
      )}
    </>
  );
}
