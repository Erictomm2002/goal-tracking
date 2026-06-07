"use client";

import { theme } from "./styles";

interface DealStageBarProps {
  currentStage: string;
  compact?: boolean;
}

const STAGE_ORDER = ["Tiếp cận", "Demo", "Báo giá", "Thương lượng"];

export function DealStageBar({ currentStage, compact }: DealStageBarProps) {
  const idx = STAGE_ORDER.indexOf(currentStage);
  const isWon = currentStage === "Thắng";
  const isLost = currentStage === "Thua";
  const isActive = (i: number) => i <= idx && !isLost;

  return (
    <div style={{ padding: compact ? 0 : "14px 0" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        {STAGE_ORDER.map((stage, i) => {
          const active = isActive(i);
          return (
            <div key={stage} style={{ display: "flex", alignItems: "center", flex: 1 }}>
              <div
                style={{
                  width: compact ? 26 : 30,
                  height: compact ? 26 : 30,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: compact ? 11 : 12,
                  fontWeight: 800,
                  fontFamily: theme.font,
                  background: active
                    ? theme.accentGradient
                    : isLost && i <= idx
                      ? "rgba(239,68,68,0.2)"
                      : "rgba(255,255,255,0.06)",
                  color: active ? "#fff" : isLost && i <= idx ? "#f87171" : "#7a828e",
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </div>
              {!compact && (
                <span
                  style={{
                    marginLeft: 8,
                    fontSize: 11,
                    fontFamily: theme.font,
                    color: i === idx ? theme.accent : "#7a828e",
                    fontWeight: i === idx ? 800 : 600,
                  }}
                >
                  {stage}
                </span>
              )}
              {i < STAGE_ORDER.length - 1 && (
                <div
                  style={{
                    flex: 1,
                    height: 3,
                    margin: "0 6px",
                    borderRadius: 1,
                    background: active && i < idx
                      ? theme.accentGradient
                      : isLost && i < idx
                        ? "rgba(239,68,68,0.3)"
                        : "rgba(255,255,255,0.06)",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {(isWon || isLost) && (
        <div
          style={{
            marginTop: 12,
            padding: "12px 16px",
            borderRadius: 12,
            textAlign: "center",
            fontSize: 13,
            fontWeight: 800,
            fontFamily: theme.font,
            letterSpacing: 1.5,
            background: isWon ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)",
            border: isWon ? "1px solid rgba(34,197,94,0.3)" : "1px solid rgba(239,68,68,0.3)",
            color: isWon ? "#4ade80" : "#f87171",
          }}
        >
          {isWon ? "✓ ĐÃ THẮNG DEAL" : "✗ DEAL ĐÃ THUA"}
        </div>
      )}
    </div>
  );
}
