"use client";

import type { Expense, ExpenseCategory } from "@/types/finance";
import { fmt } from "@/lib/habit-utils";

interface Props {
  expenses: Expense[];
  categories: ExpenseCategory[];
  onDelete: (id: number) => void;
}

function catIcon(cats: ExpenseCategory[], id: number): string {
  return cats.find((c) => c.id === id)?.icon ?? "📦";
}

export function ExpenseList({ expenses, categories, onDelete }: Props) {
  if (expenses.length === 0) {
    return (
      <div style={cardStyle}>
        <div
          style={{
            fontSize: 9,
            letterSpacing: 2,
            color: "#94a3b8",
            marginBottom: 12,
          }}
        >
          CHI TIÊU GẦN ĐÂY
        </div>
        <div
          style={{
            textAlign: "center",
            color: "#94a3b8",
            fontSize: 12,
            padding: "16px 0",
          }}
        >
          Chưa có chi tiêu nào. Bấm + để thêm!
        </div>
      </div>
    );
  }

  const grouped: Record<string, Expense[]> = {};
  for (const exp of expenses) {
    if (!grouped[exp.date]) grouped[exp.date] = [];
    grouped[exp.date].push(exp);
  }

  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <div style={cardStyle}>
      <div
        style={{
          fontSize: 9,
          letterSpacing: 2,
          color: "#94a3b8",
          marginBottom: 12,
        }}
      >
        CHI TIÊU GẦN ĐÂY ({expenses.length} khoản)
      </div>
      <div
        style={{
          maxHeight: 340,
          overflowY: "auto",
          marginRight: -4,
          paddingRight: 4,
        }}
      >
        {sortedDates.map((date) => {
          const items = grouped[date];
          const dailyTotal = items.reduce((s, e) => s + e.amount, 0);
          return (
            <div key={date} style={{ marginBottom: 10 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 10,
                  color: "#64748b",
                  letterSpacing: 1,
                  padding: "4px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                  marginBottom: 4,
                }}
              >
                <span>{date}</span>
                <span style={{ fontWeight: 700, color: "#F97316" }}>
                  {fmt(dailyTotal)}
                </span>
              </div>
              {items.map((exp) => (
                <div
                  key={exp.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "6px 8px",
                    borderRadius: 6,
                    marginBottom: 2,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <span style={{ fontSize: 14 }}>
                      {catIcon(categories, exp.category_id)}
                    </span>
                    <div>
                      <div style={{ fontSize: 12, color: "#cbd5e1" }}>
                        {fmt(exp.amount)}
                      </div>
                      {exp.note && (
                        <div style={{ fontSize: 10, color: "#64748b" }}>
                          {exp.note}
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => onDelete(exp.id)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#555",
                      fontSize: 12,
                      cursor: "pointer",
                      padding: "2px 6px",
                      borderRadius: 4,
                    }}
                    title="Xoá"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: 16,
  padding: "16px",
};
