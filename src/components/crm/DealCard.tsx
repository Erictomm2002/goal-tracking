"use client";

import { cardStyle, stageColors, theme } from "./styles";
import type { CRMDeal } from "@/types/crm";

interface DealCardProps {
  deal: CRMDeal;
  contactName?: string;
  onClick: () => void;
  taskCount?: number;
}

function formatValue(value: number | null): string {
  if (!value) return "";
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) {
    const t = value / 1_000_000;
    return t >= 10 ? `${Math.round(t)}tr` : `${t.toFixed(1)}tr`;
  }
  return `${(value / 1000).toFixed(0)}k`;
}

function isOverdue(date: string | null): boolean {
  if (!date) return false;
  return new Date(date) < new Date(new Date().toDateString());
}

export function DealCard({ deal, contactName, onClick, taskCount }: DealCardProps) {
  const overdue = isOverdue(deal.expectedCloseDate);
  const stageStyle = stageColors[deal.stage] ?? { background: "rgba(100,116,139,0.2)", color: "#c8d0db" };

  return (
    <button
      onClick={onClick}
      style={{
        ...cardStyle,
        width: "100%",
        cursor: "pointer",
        textAlign: "left",
        transition: "background 0.15s",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#e8edf5", fontFamily: theme.font }}>
            {deal.title}
          </div>
          {contactName && (
            <div style={{ fontSize: 12, color: "#7a828e", marginTop: 3, fontWeight: 500 }}>{contactName}</div>
          )}
        </div>
        <span style={{
          padding: "4px 10px", borderRadius: 6, fontSize: 11,
          fontFamily: theme.font, fontWeight: 700, letterSpacing: 0.5,
          ...stageStyle,
        }}>
          {deal.stage}
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {deal.value && (
          <span style={{ fontSize: 17, fontWeight: 800, color: "#F97316", fontFamily: theme.font }}>
            {formatValue(deal.value)}
          </span>
        )}
        {deal.package && (
          <span style={{
            padding: "3px 8px", borderRadius: 6, fontSize: 10,
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#7a828e", fontWeight: 600,
            fontFamily: theme.font,
          }}>
            {deal.package}
          </span>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 11, color: "#7a828e", fontWeight: 500 }}>
        {deal.expectedCloseDate && (
          <span style={{ color: overdue ? "#ef4444" : "#7a828e" }}>
            {overdue ? "⚠ " : "📅 "}
            {new Date(deal.expectedCloseDate).toLocaleDateString("vi-VN")}
            {overdue && <span style={{ color: "#ef4444", marginLeft: 4, fontWeight: 700 }}>Quá hạn</span>}
          </span>
        )}
        {taskCount !== undefined && taskCount > 0 && (
          <span style={{
            padding: "2px 8px", borderRadius: 6,
            background: "rgba(249,115,22,0.12)", color: "#fdba74", fontWeight: 700,
            fontFamily: theme.font,
          }}>
            {taskCount} việc
          </span>
        )}
      </div>
    </button>
  );
}
