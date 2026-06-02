"use client";

import { useState } from "react";
import type { ExpenseCategory } from "@/types/finance";

interface Props {
  initial?: ExpenseCategory;
  onSave: (data: {
    id?: number;
    name: string;
    icon: string;
    budget_amount: number;
    budget_period: "weekly" | "monthly";
  }) => void;
  onClose: () => void;
}

const ICONS = ["🍜", "⛽", "🎮", "☕", "🛒", "🏠", "📱", "🚌", "💊", "🎬", "📚", "🏋️", "✈️", "🎁", "💈", "🐱"];

export function CategoryForm({ initial, onSave, onClose }: Props) {
  const [name, setName] = useState(initial?.name ?? "");
  const [icon, setIcon] = useState(initial?.icon ?? "📦");
  const [amount, setAmount] = useState(
    initial ? String(initial.budget_amount) : "",
  );
  const [period, setPeriod] = useState<"weekly" | "monthly">(
    initial?.budget_period ?? "monthly",
  );

  const handleSave = () => {
    if (!name.trim() || !amount) return;
    onSave({
      id: initial?.id,
      name: name.trim(),
      icon,
      budget_amount: Number(amount.replace(/\D/g, "")),
      budget_period: period,
    });
  };

  const valid = name.trim() && amount;

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
          maxWidth: 420,
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
              {initial ? "SỬA DANH MỤC" : "THÊM DANH MỤC"}
            </div>
          </div>
          <button onClick={onClose} style={ghostBtnStyle}>
            ×
          </button>
        </div>

        <div style={{ marginBottom: 14 }}>
          <div style={labelStyle}>BIỂU TƯỢNG</div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 6,
              marginTop: 6,
            }}
          >
            {ICONS.map((ic) => (
              <button
                key={ic}
                onClick={() => setIcon(ic)}
                style={{
                  fontSize: 22,
                  padding: "6px 8px",
                  background:
                    icon === ic
                      ? "rgba(249,115,22,0.2)"
                      : "rgba(255,255,255,0.04)",
                  border:
                    icon === ic
                      ? "1px solid rgba(249,115,22,0.4)"
                      : "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 10,
                  cursor: "pointer",
                  lineHeight: 1,
                }}
              >
                {ic}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <div style={labelStyle}>TÊN DANH MỤC</div>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="VD: Ăn uống"
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: 14 }}>
          <div style={labelStyle}>HẠN MỨC QUỸ (VNĐ)</div>
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="VD: 500000"
            inputMode="numeric"
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={labelStyle}>CHU KỲ</div>
          <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
            {[
              { value: "weekly" as const, label: "📅 Theo tuần" },
              { value: "monthly" as const, label: "📅 Theo tháng" },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setPeriod(opt.value)}
                style={{
                  flex: 1,
                  padding: "10px",
                  background:
                    period === opt.value
                      ? "rgba(249,115,22,0.15)"
                      : "rgba(255,255,255,0.04)",
                  border:
                    period === opt.value
                      ? "1px solid rgba(249,115,22,0.4)"
                      : "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 10,
                  color: period === opt.value ? "#F97316" : "#94a3b8",
                  fontSize: 12,
                  fontWeight: period === opt.value ? 700 : 400,
                  cursor: "pointer",
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={onClose} style={{ ...btnStyle, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8" }}>
            HUỶ
          </button>
          <button
            onClick={handleSave}
            style={{
              ...btnStyle,
              opacity: valid ? 1 : 0.4,
              cursor: valid ? "pointer" : "not-allowed",
            }}
          >
            {initial ? "CẬP NHẬT" : "THÊM MỚI"}
          </button>
        </div>
        {!valid && (
          <div style={{ fontSize: 10, color: "#ef4444", textAlign: "center", marginTop: 8 }}>
            Vui lòng nhập tên danh mục và hạn mức quỹ
          </div>
        )}
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  fontSize: 9,
  letterSpacing: 2,
  color: "#94a3b8",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.09)",
  borderRadius: 10,
  padding: "11px 13px",
  color: "#e2e8f0",
  fontSize: 16,
  fontFamily: "'Courier New', monospace",
  outline: "none",
  marginTop: 6,
};

const btnStyle: React.CSSProperties = {
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
};

const ghostBtnStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  color: "#94a3b8",
  fontSize: 24,
  cursor: "pointer",
  fontFamily: "inherit",
  lineHeight: 1,
};
