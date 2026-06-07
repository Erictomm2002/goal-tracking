"use client";

import { useState } from "react";
import { todayStr, fmt } from "@/lib/habit-utils";
import type { SavingsSpend } from "@/types/finance";

interface Props {
  totalSaved: number;
  totalSpent: number;
  netSavings: number;
  spends: SavingsSpend[];
  onSpend: (data: { amount: number; note: string; date: string }) => void;
}

export function SavingsCard({
  totalSaved,
  totalSpent,
  netSavings,
  spends,
  onSpend,
}: Props) {
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  const handleSubmit = () => {
    const num = Number(amount.replace(/\D/g, "")) || 0;
    if (!num) return;
    onSpend({ amount: num, note: note.trim(), date: todayStr() });
    setAmount("");
    setNote("");
    setShowModal(false);
  };

  const recent = [...spends].slice(0, 10);

  return (
    <>
      <div style={cardStyle}>
        <div style={headerStyle}>TIẾT KIỆM</div>

        <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
          <StatBox label="ĐÃ TIẾT KIỆM" value={fmt(totalSaved)} color="#22c55e" />
          <StatBox label="ĐÃ TIÊU" value={fmt(totalSpent)} color="#ef4444" />
          <StatBox
            label="CÒN LẠI"
            value={fmt(netSavings)}
            color={netSavings >= 0 ? "#60a5fa" : "#ef4444"}
          />
        </div>

        <button
          onClick={() => setShowModal(true)}
          style={{
            display: "block",
            width: "100%",
            padding: "10px",
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.25)",
            borderRadius: 10,
            color: "#ef4444",
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "'Courier New', monospace",
            letterSpacing: 1,
            marginBottom: spends.length > 0 ? 12 : 0,
          }}
        >
          💸 TIÊU TỪ TIẾT KIỆM
        </button>

        {recent.length > 0 && (
          <div>
            <div
              style={{
                fontSize: 9,
                letterSpacing: 2,
                color: "#64748b",
                marginBottom: 6,
              }}
            >
              LỊCH SỬ TIÊU ({spends.length})
            </div>
            <div style={{ maxHeight: 180, overflowY: "auto" }}>
              {recent.map((s) => (
                <div
                  key={s.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "5px 0",
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                    fontSize: 11,
                  }}
                >
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ color: "#64748b", fontSize: 10 }}>{s.date.slice(5)}</span>
                    <span style={{ color: "#94a3b8" }}>{s.note || "—"}</span>
                  </div>
                  <span style={{ color: "#ef4444", fontWeight: 700 }}>
                    -{fmt(s.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showModal && (
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
              border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: 20,
              padding: 28,
              width: "100%",
              maxWidth: 400,
            }}
          >
            <div
              style={{
                fontSize: 9,
                letterSpacing: 3,
                color: "#ef4444",
                marginBottom: 16,
              }}
            >
              💸 TIÊU TỪ TIẾT KIỆM
            </div>

            <div style={{ marginBottom: 14 }}>
              <div style={labelStyle}>SỐ TIỀN</div>
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="VD: 100000"
                inputMode="numeric"
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={labelStyle}>LÝ DO (tuỳ chọn)</div>
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="VD: Đi chơi cuối tuần"
                style={inputStyle}
              />
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => setShowModal(false)}
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
                onClick={handleSubmit}
                style={{
                  flex: 1,
                  background: "linear-gradient(90deg,#dc2626,#ef4444)",
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
                TIÊU {amount ? fmt(Number(amount.replace(/\D/g, "")) || 0) : ""}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function StatBox({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div
      style={{
        flex: 1,
        textAlign: "center",
        padding: "10px 6px",
        borderRadius: 10,
        background: "rgba(255,255,255,0.03)",
      }}
    >
      <div style={{ fontSize: 8, letterSpacing: 1, color: "#64748b", marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontSize: 14, fontWeight: 900, color }}>{value}</div>
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: 16,
  padding: "16px",
};

const headerStyle: React.CSSProperties = {
  fontSize: 9,
  letterSpacing: 2,
  color: "#94a3b8",
  marginBottom: 12,
};

const labelStyle: React.CSSProperties = {
  fontSize: 9,
  letterSpacing: 2,
  color: "#94a3b8",
  marginBottom: 6,
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
