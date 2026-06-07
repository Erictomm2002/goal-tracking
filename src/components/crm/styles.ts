import type { CSSProperties } from "react";

export const theme = {
  bg: "#070b14" as const,
  card: "rgba(255,255,255,0.03)" as const,
  cardBorder: "1px solid rgba(255,255,255,0.08)" as const,
  cardRadius: 16,
  cardPadding: 16,
  accent: "#F97316" as const,
  accentGradient: "linear-gradient(90deg,#ea580c,#F97316)" as const,
  accentDim: "rgba(249,115,22,0.15)" as const,
  accentBorder: "1px solid rgba(249,115,22,0.4)" as const,
  text: "#e8edf5" as const,
  textDim: "#b0b8c4" as const,
  textMuted: "#7a828e" as const,
  textBright: "#fff" as const,
  inputBg: "rgba(255,255,255,0.06)" as const,
  inputBorder: "1px solid rgba(255,255,255,0.12)" as const,
  font: "'Courier New', Courier, monospace" as const,
  divider: "1px solid rgba(255,255,255,0.05)" as const,
  danger: "#ef4444" as const,
  success: "#22c55e" as const,
};

export const cardStyle: CSSProperties = {
  background: theme.card,
  border: theme.cardBorder,
  borderRadius: theme.cardRadius,
  padding: theme.cardPadding,
};

export const labelStyle: CSSProperties = {
  fontSize: 11,
  letterSpacing: 1.5,
  color: theme.textDim,
  marginBottom: 8,
  fontWeight: 600,
};

export const inputStyle: CSSProperties = {
  width: "100%",
  background: theme.inputBg,
  border: theme.inputBorder,
  borderRadius: 12,
  padding: "13px 15px",
  color: theme.text,
  fontSize: 15,
  fontFamily: theme.font,
  outline: "none",
};

export const btnPrimary: CSSProperties = {
  flex: 1,
  background: theme.accentGradient,
  border: "none",
  borderRadius: 12,
  padding: "14px",
  color: "#fff",
  fontWeight: 900,
  fontSize: 13,
  fontFamily: theme.font,
  cursor: "pointer",
  letterSpacing: 1,
};

export const btnGhost: CSSProperties = {
  flex: 1,
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 12,
  padding: "14px",
  color: theme.textDim,
  fontWeight: 700,
  fontSize: 12,
  fontFamily: theme.font,
  cursor: "pointer",
  letterSpacing: 0.5,
};

export const sectionTitle: CSSProperties = {
  fontSize: 15,
  letterSpacing: 2,
  color: theme.textDim,
  marginBottom: 12,
  fontWeight: 800,
};

export const pageTitle: CSSProperties = {
  fontSize: 20,
  letterSpacing: 3,
  color: theme.accent,
  fontWeight: 900,
};

export const stageColors: Record<string, CSSProperties> = {
  "Tiếp cận": { background: "rgba(100,116,139,0.25)", color: "#c8d0db" },
  "Demo": { background: "rgba(59,130,246,0.2)", color: "#93c5fd" },
  "Báo giá": { background: "rgba(245,158,11,0.2)", color: "#fcd34d" },
  "Thương lượng": { background: "rgba(168,85,247,0.2)", color: "#d8b4fe" },
  "Thắng": { background: "rgba(34,197,94,0.2)", color: "#86efac" },
  "Thua": { background: "rgba(239,68,68,0.2)", color: "#fca5a5" },
};

export const tagColors: Record<string, CSSProperties> = {
  prospect: { background: "rgba(59,130,246,0.18)", border: "1px solid rgba(59,130,246,0.3)", color: "#93c5fd" },
  warm: { background: "rgba(249,115,22,0.18)", border: "1px solid rgba(249,115,22,0.3)", color: "#fdba74" },
  partner: { background: "rgba(34,197,94,0.18)", border: "1px solid rgba(34,197,94,0.3)", color: "#86efac" },
  churned: { background: "rgba(239,68,68,0.18)", border: "1px solid rgba(239,68,68,0.3)", color: "#fca5a5" },
};

export const taskTypeColors: Record<string, CSSProperties> = {
  call: { background: "rgba(59,130,246,0.18)", color: "#93c5fd" },
  meeting: { background: "rgba(168,85,247,0.18)", color: "#d8b4fe" },
  demo: { background: "rgba(249,115,22,0.18)", color: "#fdba74" },
  email: { background: "rgba(34,197,94,0.18)", color: "#86efac" },
  quote: { background: "rgba(245,158,11,0.18)", color: "#fcd34d" },
  other: { background: "rgba(100,116,139,0.18)", color: "#c8d0db" },
};

export const priorityBorders: Record<string, string> = {
  high: "3px solid #ef4444",
  medium: "3px solid #f59e0b",
  low: "3px solid rgba(255,255,255,0.08)",
};
