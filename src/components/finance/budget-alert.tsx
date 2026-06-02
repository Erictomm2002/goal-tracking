"use client";

import { useEffect, useState } from "react";
import type { ExpenseCategory, Expense } from "@/types/finance";
import { budgetPct, budgetRemaining } from "@/lib/finance-utils";
import { fmt } from "@/lib/habit-utils";

interface Props {
  categories: ExpenseCategory[];
  expenses: Expense[];
}

export function BudgetAlert({ categories, expenses }: Props) {
  const [dismissed, setDismissed] = useState(false);

  const alerts = categories
    .map((cat) => {
      const pct = budgetPct(expenses, cat);
      const remaining = budgetRemaining(expenses, cat);
      if (pct >= 90 || remaining <= 0) {
        return { ...cat, level: "danger" as const, remaining };
      }
      if (pct >= 80) {
        return { ...cat, level: "warning" as const, remaining };
      }
      return null;
    })
    .filter(Boolean);

  useEffect(() => {
    setDismissed(false);
  }, [expenses.length]);

  if (alerts.length === 0 || dismissed) return null;

  return (
    <div
      style={{
        ...cardStyle,
        marginBottom: 14,
        border: `1px solid ${alerts.some((a) => a?.level === "danger") ? "rgba(239,68,68,0.3)" : "rgba(249,115,22,0.3)"}`,
        background: alerts.some((a) => a?.level === "danger")
          ? "rgba(239,68,68,0.1)"
          : "rgba(249,115,22,0.08)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <div
          style={{
            fontSize: 9,
            letterSpacing: 2,
            color: alerts.some((a) => a?.level === "danger")
              ? "#ef4444"
              : "#F97316",
            fontWeight: 700,
          }}
        >
          {alerts.some((a) => a?.level === "danger")
            ? "🚨 CẢNH BÁO QUỸ"
            : "⚠️ SẮP HẾT QUỸ"}
        </div>
        <button
          onClick={() => setDismissed(true)}
          style={{
            background: "none",
            border: "none",
            color: "#94a3b8",
            cursor: "pointer",
            fontSize: 14,
            lineHeight: 1,
          }}
        >
          ×
        </button>
      </div>
      {alerts.map((a) =>
        !a ? null : (
          <div
            key={a.id}
            style={{
              fontSize: 12,
              color: "#cbd5e1",
              padding: "4px 0",
            }}
          >
            {a.icon} {a.name}:{" "}
            {a.level === "danger"
              ? `Đã vượt quỹ ${fmt(Math.abs(a.remaining))}`
              : `Còn ${fmt(a.remaining)} (${budgetPct(expenses, a)}%)`}
          </div>
        ),
      )}
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: 16,
  padding: "16px",
};
