"use client";

import { useMemo } from "react";
import type { Expense, ExpenseCategory } from "@/types/finance";
import { fmt } from "@/lib/habit-utils";

const COLORS = ["#F97316", "#22c55e", "#60a5fa", "#a855f7", "#ec4899", "#eab308", "#14b8a6", "#f97316"];

interface Props {
  expenses: Expense[];
  categories: ExpenseCategory[];
}

export function FinanceCharts({ expenses, categories }: Props) {
  const last7 = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const ds = d.toISOString().slice(0, 10);
      const total = expenses
        .filter((e) => e.date === ds)
        .reduce((s, e) => s + e.amount, 0);
      return { ds, total };
    });
  }, [expenses]);

  const byCategory = useMemo(() => {
    const map: Record<number, number> = {};
    for (const e of expenses) {
      map[e.category_id] = (map[e.category_id] || 0) + e.amount;
    }
    return map;
  }, [expenses]);

  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);

  return (
    <div>
      {/* Bar chart - 7 days */}
      <div style={{ ...cardStyle, marginBottom: 14 }}>
        <div
          style={{
            fontSize: 9,
            letterSpacing: 2,
            color: "#94a3b8",
            marginBottom: 12,
          }}
        >
          CHI TIÊU 7 NGÀY
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 6,
            height: 80,
          }}
        >
          {last7.map(({ ds, total }) => {
            const maxTotal = Math.max(...last7.map((d) => d.total), 1);
            const h = maxTotal > 0 ? (total / maxTotal) * 68 : 0;
            return (
              <div
                key={ds}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    height: 68,
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      borderRadius: "3px 3px 0 0",
                      height: `${Math.max(4, h)}px`,
                      background:
                        total > 0 ? "#F97316" : "rgba(255,255,255,0.06)",
                      transition: "height 0.5s ease",
                    }}
                  />
                </div>
                <div style={{ fontSize: 8, color: "#555" }}>
                  {ds.slice(8)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pie chart - category distribution */}
      <div style={cardStyle}>
        <div
          style={{
            fontSize: 9,
            letterSpacing: 2,
            color: "#94a3b8",
            marginBottom: 12,
          }}
        >
          PHÂN BỔ CHI TIÊU
        </div>
        {totalExpenses === 0 ? (
          <div
            style={{
              textAlign: "center",
              color: "#94a3b8",
              fontSize: 12,
              padding: "16px 0",
            }}
          >
            Chưa có dữ liệu
          </div>
        ) : (
          <div>
            <svg viewBox="0 0 200 200" width="100%" style={{ maxWidth: 180, margin: "0 auto", display: "block" }}>
              <PieChart
                data={categories.map((cat) => ({
                  label: cat.name,
                  value: byCategory[cat.id] || 0,
                  color: COLORS[categories.indexOf(cat) % COLORS.length],
                }))}
                total={totalExpenses}
              />
            </svg>
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
              {categories.map((cat, i) => {
                const val = byCategory[cat.id] || 0;
                const pct = totalExpenses > 0 ? Math.round((val / totalExpenses) * 100) : 0;
                if (val === 0) return null;
                return (
                  <div
                    key={cat.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      fontSize: 12,
                    }}
                  >
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 3,
                        background: COLORS[i % COLORS.length],
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ color: "#cbd5e1", flex: 1 }}>
                      {cat.icon} {cat.name}
                    </span>
                    <span style={{ color: "#94a3b8" }}>{pct}%</span>
                    <span style={{ color: "#e2e8f0", fontWeight: 700 }}>
                      {fmt(val)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PieChart({
  data,
  total,
}: {
  data: { value: number; color: string }[];
  total: number;
}) {
  if (total === 0) return null;
  const cx = 100, cy = 100, r = 80;
  let cumulative = 0;
  const slices = data
    .filter((d) => d.value > 0)
    .map((d) => {
      const pct = d.value / total;
      const startAngle = cumulative * 360;
      cumulative += pct;
      const endAngle = cumulative * 360;
      const x1 = cx + r * Math.cos((-90 + startAngle) * (Math.PI / 180));
      const y1 = cy + r * Math.sin((-90 + startAngle) * (Math.PI / 180));
      const x2 = cx + r * Math.cos((-90 + endAngle) * (Math.PI / 180));
      const y2 = cy + r * Math.sin((-90 + endAngle) * (Math.PI / 180));
      const largeArc = pct > 0.5 ? 1 : 0;
      return { d: `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`, color: d.color };
    });

  return (
    <>
      {slices.map((s, i) => (
        <path key={i} d={s.d} fill={s.color} stroke="#070b14" strokeWidth="1" />
      ))}
      <circle cx={cx} cy={cy} r={r * 0.5} fill="#070b14" />
      <text x={cx} y={cy - 6} textAnchor="middle" fill="#e2e8f0" fontSize="16" fontWeight="bold" fontFamily="monospace">
        {fmt(total)}
      </text>
      <text x={cx} y={cy + 10} textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="monospace">
        tổng chi
      </text>
    </>
  );
}

const cardStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: 16,
  padding: "16px",
};
