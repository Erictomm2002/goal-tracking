"use client";

import { clamp } from "@/lib/habit-utils";

export function ProgressBattery({ percent }: { percent: number }) {
  const pct = clamp(percent, 0, 100);

  // Battery body dimensions
  const bx = 85, by = 45, bw = 250, bh = 100, r = 14;
  const fillW = ((bw - 8) * pct) / 100;
  const terminalW = 30, terminalH = 16;

  // Color transitions
  const color = pct >= 80 ? "#22c55e" : pct >= 40 ? "#F97316" : "#ef4444";
  const gradStart = pct >= 80 ? "#16a34a" : pct >= 40 ? "#ea580c" : "#dc2626";

  return (
    <svg
      viewBox="0 0 420 195"
      width="100%"
      style={{ display: "block", maxWidth: 380, margin: "0 auto" }}
      aria-label={`Battery: ${Math.round(pct)}%`}
    >
      <defs>
        <linearGradient id="battGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={gradStart} />
          <stop offset="100%" stopColor={color} />
        </linearGradient>
        <linearGradient id="shellGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
      </defs>

      {/* ── background glow ── */}
      {pct > 0 && (
        <rect x={bx - 20} y={by - 20} width={bw + 40} height={bh + 40} rx={30}
          fill="none" stroke={color} strokeWidth="0.5" opacity="0.06"
          style={{ transition: "stroke 0.5s" }} />
      )}

      {/* ── battery shell ── */}
      <rect x={bx} y={by} width={bw} height={bh} rx={r}
        fill="url(#shellGrad)" stroke="#374151" strokeWidth="2" />

      {/* ── inner dark area ── */}
      <rect x={bx + 4} y={by + 4} width={bw - 8} height={bh - 8} rx={r - 3}
        fill="#070b14" />

      {/* ── fill bar ── */}
      {pct > 0 && (
        <rect x={bx + 4} y={by + 4} width={fillW} height={bh - 8} rx={r - 3}
          fill="url(#battGrad)" opacity="0.88"
          style={{ transition: "width 1.2s cubic-bezier(.4,0,.2,1), fill 0.5s" }}>
        </rect>
      )}

      {/* ── fill surface shimmer ── */}
      {pct > 2 && (
        <rect x={bx + 4} y={by + 6} width={fillW} height={(bh - 8) / 3} rx={4}
          fill="rgba(255,255,255,0.12)"
          style={{ transition: "width 1.2s cubic-bezier(.4,0,.2,1)" }} />
      )}

      {/* ── segments ── */}
      {[25, 50, 75].map((seg) => {
        const sx = bx + 4 + ((bw - 8) * seg) / 100;
        return (
          <line key={seg} x1={sx} y1={by + 8} x2={sx} y2={by + bh - 8}
            stroke={pct >= seg ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.04)"}
            strokeWidth="1" strokeDasharray="2 2"
            style={{ transition: "stroke 0.5s" }} />
        );
      })}

      {/* ── shell border ── */}
      <rect x={bx} y={by} width={bw} height={bh} rx={r}
        fill="none" stroke="#1f2937" strokeWidth="1.5" />

      {/* ── positive terminal ── */}
      <rect x={bx + bw / 2 - terminalW / 2} y={by - terminalH} width={terminalW} height={terminalH} rx={3}
        fill="url(#shellGrad)" stroke="#374151" strokeWidth="1.5" />
      <rect x={bx + bw / 2 - terminalW / 2 + 2} y={by - terminalH + 2}
        width={terminalW - 4} height={terminalH - 4} rx={2}
        fill={pct > 0 ? "rgba(249,115,22,0.3)" : "#070b14"}
        style={{ transition: "fill 0.5s" }} />

      {/* ── lightning bolt icon ── */}
      {pct > 0 && (
        <g
          transform={`translate(${bx + bw / 2 - 1}, ${by + bh / 2 - 2})`}
          style={{ transition: "opacity 0.5s" }}
        >
          <path
            d="M -2,-18 L 3,-18 L -6,2 L -1,2 L -12,20 L 4,2 L -2,2 L 8,-18 Z"
            fill={pct >= 80 ? "#22c55e" : "#fbbf24"}
            opacity="0.6"
            transform="scale(0.8)"
          />
        </g>
      )}

      {/* ── percentage text ── */}
      <text
        x={bx + bw / 2} y={by + bh / 2 + 8}
        textAnchor="middle" fontSize="42" fontWeight="900"
        fill={pct > 15 ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.12)"}
        fontFamily="'Courier New', monospace"
        style={{ transition: "fill 0.6s" }}
      >
        {Math.round(pct)}%
      </text>

      {/* ── battery level label ── */}
      <text x={bx + bw / 2} y={by + bh - 10}
        textAnchor="middle" fontSize="8" fontWeight="700"
        fill="rgba(255,255,255,0.2)" fontFamily="'Courier New', monospace"
        letterSpacing="3">
        {pct >= 80 ? "ĐẦY" : pct >= 40 ? "ĐANG SẠC" : pct > 0 ? "YẾU" : "CHỜ SẠC"}
      </text>

      {/* ── caption ── */}
      <text x="210" y="188" textAnchor="middle" fontSize="10"
        fill="#6b7280" fontFamily="'Courier New', monospace">
        {Math.round(pct)}% quỹ tích lũy
      </text>
    </svg>
  );
}
