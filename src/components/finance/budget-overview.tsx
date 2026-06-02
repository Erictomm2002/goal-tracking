"use client";

import type { ExpenseCategory, Expense } from "@/types/finance";
import { budgetPct, budgetRemaining, spentInPeriod } from "@/lib/finance-utils";
import { fmt } from "@/lib/habit-utils";

interface Props {
  categories: ExpenseCategory[];
  expenses: Expense[];
  onEdit: (cat: ExpenseCategory) => void;
  onDelete: (id: number) => void;
}

export function BudgetOverview({
  categories,
  expenses,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div style={cardStyle}>
      <div
        style={{
          fontSize: 9,
          letterSpacing: 2,
          color: "#94a3b8",
          marginBottom: 14,
        }}
      >
        QUỸ THEO DANH MỤC
      </div>

      {categories.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            color: "#94a3b8",
            fontSize: 12,
            padding: "16px 0",
          }}
        >
          Chưa có danh mục nào. Hãy thêm danh mục chi tiêu!
        </div>
      ) : (
        categories.map((cat) => {
          const pct = budgetPct(expenses, cat);
          const remaining = budgetRemaining(expenses, cat);
          const isOver = remaining < 0;
          const isWarning = !isOver && pct >= 80;
          const barColor = isOver
            ? "#ef4444"
            : isWarning
              ? "#F97316"
              : "#22c55e";

          return (
            <div
              key={cat.id}
              style={{
                marginBottom: 12,
                padding: 12,
                borderRadius: 10,
                background: "rgba(255,255,255,0.03)",
                border: `1px solid ${isOver ? "rgba(239,68,68,0.2)" : isWarning ? "rgba(249,115,22,0.2)" : "rgba(255,255,255,0.06)"}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 6,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 16 }}>{cat.icon}</span>
                  <span style={{ fontSize: 13, color: "#e2e8f0" }}>
                    {cat.name}
                  </span>
                  <span
                    style={{
                      fontSize: 9,
                      color: "#64748b",
                      letterSpacing: 1,
                    }}
                  >
                    {cat.budget_period === "weekly" ? "/tuần" : "/tháng"}
                  </span>
                </div>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <button
                    onClick={() => onEdit(cat)}
                    style={ghostBtn}
                    title="Sửa"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => onDelete(cat.id)}
                    style={ghostBtn}
                    title="Xoá"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              <div
                style={{
                  height: 6,
                  background: "rgba(255,255,255,0.06)",
                  borderRadius: 4,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${Math.min(100, pct)}%`,
                    background: barColor,
                    borderRadius: 4,
                    transition: "width 0.5s ease",
                  }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 5,
                }}
              >
                <div style={{ fontSize: 11, color: "#94a3b8" }}>
                  {isOver ? (
                    <span style={{ color: "#ef4444", fontWeight: 700 }}>
                      🚨 Vượt {fmt(Math.abs(remaining))}
                    </span>
                  ) : isWarning ? (
                    <span style={{ color: "#F97316", fontWeight: 700 }}>
                      ⚠️ Còn {fmt(remaining)}
                    </span>
                  ) : (
                    <span>Còn {fmt(remaining)}</span>
                  )}
                </div>
                <div style={{ fontSize: 11, color: "#94a3b8" }}>
                  {fmt(spentInPeriod(expenses, cat))} / {fmt(cat.budget_amount)}
                </div>
              </div>
            </div>
          );
        })
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

const ghostBtn: React.CSSProperties = {
  background: "none",
  border: "none",
  cursor: "pointer",
  fontSize: 13,
  padding: "2px 4px",
  lineHeight: 1,
};
