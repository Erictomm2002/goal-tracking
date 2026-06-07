"use client";

import { useState } from "react";
import { todayStr, fmt } from "@/lib/habit-utils";
import type { FinanceDeclaration } from "@/types/finance";

interface Props {
  latest: FinanceDeclaration | null;
  onDeclare: (data: { cash: number; bank: number; date: string }) => void;
}

export function DeclarationCard({ latest, onDeclare }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [cash, setCash] = useState(latest ? String(latest.cash) : "");
  const [bank, setBank] = useState(latest ? String(latest.bank) : "");

  const total = (latest?.cash ?? 0) + (latest?.bank ?? 0);

  const handleOpen = () => {
    setCash(latest ? String(latest.cash) : "");
    setBank(latest ? String(latest.bank) : "");
    setShowModal(true);
  };

  const handleSubmit = () => {
    const cashNum = Number(cash.replace(/\D/g, "")) || 0;
    const bankNum = Number(bank.replace(/\D/g, "")) || 0;
    if (cashNum === 0 && bankNum === 0) return;
    onDeclare({ cash: cashNum, bank: bankNum, date: todayStr() });
    setShowModal(false);
  };

  return (
    <>
      <div style={cardStyle}>
        <div style={headerStyle}>KHAI BÁO TÀI CHÍNH</div>

        {latest ? (
          <>
            <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
              <StatBox label="TIỀN MẶT" value={fmt(latest.cash)} color="#22c55e" />
              <StatBox label="NGÂN HÀNG" value={fmt(latest.bank)} color="#60a5fa" />
              <StatBox label="TỔNG" value={fmt(total)} color="#e2e8f0" />
            </div>
            <div
              style={{
                fontSize: 9,
                color: "#64748b",
                textAlign: "center",
                marginBottom: 10,
              }}
            >
              Cập nhật: {latest.date}
            </div>
          </>
        ) : (
          <div
            style={{
              fontSize: 12,
              color: "#94a3b8",
              textAlign: "center",
              padding: "12px 0",
            }}
          >
            Chưa có dữ liệu. Khai báo ngay!
          </div>
        )}

        <button
          onClick={handleOpen}
          style={{
            display: "block",
            width: "100%",
            padding: "10px",
            background: "rgba(96,165,250,0.1)",
            border: "1px solid rgba(96,165,250,0.25)",
            borderRadius: 10,
            color: "#60a5fa",
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "'Courier New', monospace",
            letterSpacing: 1,
          }}
        >
          {latest ? "📝 CẬP NHẬT TÀI CHÍNH" : "📝 KHAI BÁO LẦN ĐẦU"}
        </button>
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
              border: "1px solid rgba(96,165,250,0.3)",
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
                color: "#60a5fa",
                marginBottom: 16,
              }}
            >
              📝 KHAI BÁO TÀI CHÍNH
            </div>

            <div style={{ marginBottom: 14 }}>
              <div style={labelStyle}>TIỀN MẶT</div>
              <input
                value={cash}
                onChange={(e) => setCash(e.target.value)}
                placeholder="VD: 500000"
                inputMode="numeric"
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={labelStyle}>TIỀN NGÂN HÀNG</div>
              <input
                value={bank}
                onChange={(e) => setBank(e.target.value)}
                placeholder="VD: 2000000"
                inputMode="numeric"
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
                  background: "linear-gradient(90deg,#2563eb,#3b82f6)",
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
                LƯU LẠI
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
      <div
        style={{
          fontSize: 8,
          letterSpacing: 1,
          color: "#64748b",
          marginBottom: 4,
        }}
      >
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
