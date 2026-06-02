"use client";

import { useCategories } from "@/hooks/use-categories";
import { useExpenses } from "@/hooks/use-expenses";
import { todayStr, fmt } from "@/lib/habit-utils";
import { startOfMonth, endOfMonth, budgetPct, budgetRemaining } from "@/lib/finance-utils";

export function ExpenseSummaryCard() {
  const today = todayStr();
  const from = startOfMonth();
  const to = endOfMonth();
  const { categories } = useCategories();
  const { expenses } = useExpenses(from, to);

  const todayExpenses = expenses.filter((e) => e.date === today);
  const todayTotal = todayExpenses.reduce((s, e) => s + e.amount, 0);

  const alerts = categories
    .map((cat) => {
      const pct = budgetPct(expenses, cat);
      const remaining = budgetRemaining(expenses, cat);
      if (pct >= 80) return { ...cat, remaining, pct };
      return null;
    })
    .filter(Boolean);

  if (categories.length === 0) return null;

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 16,
        padding: "16px",
      }}
    >
      <div
        style={{
          fontSize: 9,
          letterSpacing: 2,
          color: "#94a3b8",
          marginBottom: 10,
        }}
      >
        CHI TIÊU HÔM NAY
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 8,
        }}
      >
        <div style={{ fontSize: 12, color: "#94a3b8" }}>Đã chi</div>
        <div
          style={{
            fontSize: 22,
            fontWeight: 900,
            color: todayTotal > 0 ? "#F97316" : "#64748b",
          }}
        >
          {todayTotal > 0 ? fmt(todayTotal) : "—"}
        </div>
      </div>

      {todayExpenses.length > 0 && (
        <div style={{ marginTop: 4, marginBottom: 8 }}>
          {todayExpenses.map((e) => {
            const cat = categories.find((c) => c.id === e.category_id);
            return (
              <div
                key={e.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 11,
                  color: "#94a3b8",
                  padding: "2px 0",
                }}
              >
                <span>
                  {cat?.icon ?? "📦"} {cat?.name ?? "—"}
                </span>
                <span>{fmt(e.amount)}</span>
              </div>
            );
          })}
        </div>
      )}

      {alerts.length > 0 && (
        <div
          style={{
            marginTop: 8,
            paddingTop: 8,
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {alerts.map(
            (a) =>
              a && (
                <div
                  key={a.id}
                  style={{
                    fontSize: 10,
                    color: a.pct >= 90 ? "#ef4444" : "#F97316",
                    padding: "2px 0",
                  }}
                >
                  {a.pct >= 90 ? "🚨" : "⚠️"} {a.icon} {a.name}: còn{" "}
                  {fmt(a.remaining)} ({a.pct}%)
                </div>
              ),
          )}
        </div>
      )}
    </div>
  );
}
