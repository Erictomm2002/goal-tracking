"use client";

import { useState, useEffect } from "react";
import type { ExpenseCategory } from "@/types/finance";
import { todayStr } from "@/lib/habit-utils";

interface Props {
  categories: ExpenseCategory[];
  onSave: (data: {
    category_id: number;
    amount: number;
    note: string;
    date: string;
  }) => void;
}

const QUICK_AMOUNTS = [20000, 50000, 100000, 200000, 500000];

export function ExpenseQuickAdd({ categories, onSave }: Props) {
  const [open, setOpen] = useState(false);
  const [catId, setCatId] = useState(categories[0]?.id ?? 0);

  useEffect(() => {
    const valid = categories.some((c) => c.id === catId);
    if (!valid && categories.length > 0) {
      setCatId(categories[0].id);
    }
  }, [categories, catId]);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(todayStr());

  const handleSave = () => {
    const num = Number(amount.replace(/\D/g, "")) || 0;
    const validCat = categories.some((c) => c.id === catId);
    if (!catId || !num || !validCat) return;
    onSave({ category_id: catId, amount: num, note: note.trim(), date });
    setAmount("");
    setNote("");
    setDate(todayStr());
    setOpen(false);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "linear-gradient(135deg,#ea580c,#F97316)",
          border: "none",
          color: "#fff",
          fontSize: 28,
          cursor: "pointer",
          boxShadow: "0 4px 20px rgba(249,115,22,0.4)",
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          lineHeight: 1,
        }}
      >
        +
      </button>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(0,0,0,0.88)",
        backdropFilter: "blur(16px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        style={{
          background: "#0f172a",
          border: "1px solid rgba(249,115,22,0.3)",
          borderRadius: 20,
          padding: 28,
          width: "100%",
          maxWidth: 400,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 18,
          }}
        >
          <div>
            <div style={{ fontSize: 9, letterSpacing: 3, color: "#F97316" }}>
              THÊM CHI TIÊU
            </div>
            <div style={{ fontSize: 11, color: "#94a3b8" }}>{date}</div>
          </div>
          <button
            onClick={() => setOpen(false)}
            style={{
              background: "none",
              border: "none",
              color: "#94a3b8",
              fontSize: 24,
              cursor: "pointer",
              fontFamily: "inherit",
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        {/* Category selection */}
        <div style={{ marginBottom: 14 }}>
          <div
            style={{
              fontSize: 9,
              letterSpacing: 2,
              color: "#94a3b8",
              marginBottom: 6,
            }}
          >
            DANH MỤC
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCatId(cat.id)}
                style={{
                  padding: "8px 12px",
                  borderRadius: 10,
                  background:
                    catId === cat.id
                      ? "rgba(249,115,22,0.15)"
                      : "rgba(255,255,255,0.04)",
                  border:
                    catId === cat.id
                      ? "1px solid rgba(249,115,22,0.4)"
                      : "1px solid rgba(255,255,255,0.08)",
                  color: catId === cat.id ? "#F97316" : "#94a3b8",
                  fontSize: 13,
                  fontWeight: catId === cat.id ? 700 : 400,
                  cursor: "pointer",
                }}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Amount */}
        <div style={{ marginBottom: 14 }}>
          <div
            style={{
              fontSize: 9,
              letterSpacing: 2,
              color: "#94a3b8",
              marginBottom: 6,
            }}
          >
            SỐ TIỀN
          </div>
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="VD: 50000"
            inputMode="numeric"
            style={{
              width: "100%",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.09)",
              borderRadius: 10,
              padding: "11px 13px",
              color: "#e2e8f0",
              fontSize: 20,
              fontWeight: 700,
              fontFamily: "'Courier New', monospace",
              outline: "none",
              textAlign: "center",
            }}
          />
          <div
            style={{
              display: "flex",
              gap: 6,
              marginTop: 8,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {QUICK_AMOUNTS.map((a) => (
              <button
                key={a}
                onClick={() => setAmount(String(a))}
                style={{
                  padding: "6px 12px",
                  borderRadius: 8,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#94a3b8",
                  fontSize: 11,
                  cursor: "pointer",
                }}
              >
                {(a / 1000).toFixed(0)}k
              </button>
            ))}
          </div>
        </div>

        {/* Note */}
        <div style={{ marginBottom: 14 }}>
          <div
            style={{
              fontSize: 9,
              letterSpacing: 2,
              color: "#94a3b8",
              marginBottom: 6,
            }}
          >
            GHI CHÚ (tuỳ chọn)
          </div>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="VD: Phở sáng"
            style={{
              width: "100%",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.09)",
              borderRadius: 10,
              padding: "11px 13px",
              color: "#e2e8f0",
              fontSize: 16,
              fontFamily: "'Courier New', monospace",
              outline: "none",
            }}
          />
        </div>

        {/* Date */}
        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              fontSize: 9,
              letterSpacing: 2,
              color: "#94a3b8",
              marginBottom: 6,
            }}
          >
            NGÀY
          </div>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{
              width: "100%",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.09)",
              borderRadius: 10,
              padding: "11px 13px",
              color: "#e2e8f0",
              fontSize: 16,
              fontFamily: "'Courier New', monospace",
              outline: "none",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => setOpen(false)}
            style={{
              flex: 1,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 12,
              padding: "13px",
              color: "#94a3b8",
              fontWeight: 700,
              fontSize: 12,
              fontFamily: "'Courier New', monospace",
              cursor: "pointer",
            }}
          >
            HUỶ
          </button>
          <button
            onClick={handleSave}
            style={{
              flex: 1,
              background: "linear-gradient(90deg,#ea580c,#F97316)",
              border: "none",
              borderRadius: 12,
              padding: "13px",
              color: "#fff",
              fontWeight: 900,
              fontSize: 13,
              fontFamily: "'Courier New', monospace",
              cursor: "pointer",
            }}
          >
            THÊM CHI TIÊU
          </button>
        </div>
      </div>
    </div>
  );
}
