"use client";

import type { CheckInLog, Habit } from "@/types/habit";
import { localDateStr } from "@/lib/habit-utils";

function MiniBarChart({ logs }: { logs: CheckInLog[] }) {
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    const ds = localDateStr(d);
    const log = logs.find(l => l.date === ds);
    return { ds, pct: log ? log.donePct : null };
  });

  return (
    <div>
      <div style={{ fontSize: 9, letterSpacing: 2, color: "#555", marginBottom: 10 }}>KPI 7 NGÀY GẦN ĐÂY</div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 64 }}>
        {last7.map(({ ds, pct: p }) => (
          <div key={ds} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{ width: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", height: 52 }}>
              <div style={{
                width: "100%", borderRadius: "3px 3px 0 0",
                height: p !== null ? `${Math.max(4, p * 0.52)}px` : "4px",
                background: p === null ? "rgba(255,255,255,0.06)"
                  : p >= 80 ? "#22c55e"
                  : p >= 60 ? "#F97316"
                  : "#ef4444",
                transition: "height 0.5s ease",
              }} />
            </div>
            <div style={{ fontSize: 8, color: "#444" }}>{ds.slice(8)}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
        {[["#22c55e", "≥80%"], ["#F97316", "60–79%"], ["#ef4444", "<60%"], ["rgba(255,255,255,0.15)", "Chưa log"]].map(([c, l]) => (
          <div key={l} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 7, height: 7, borderRadius: 1, background: c }} />
            <div style={{ fontSize: 9, color: "#555" }}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HabitBreakdown({ logs, habits }: { logs: CheckInLog[]; habits: Habit[] }) {
  const stats = habits.map(h => {
    const done = logs.filter(l => l.checks?.[h.title]).length;
    return { ...h, done, pct: logs.length > 0 ? Math.round((done / logs.length) * 100) : 0 };
  });

  return (
    <div>
      <div style={{ fontSize: 9, letterSpacing: 2, color: "#555", marginBottom: 10 }}>THÓI QUEN THEO %</div>
      {stats.length === 0 ? (
        <div style={{ fontSize: 11, color: "#444", textAlign: "center", padding: "12px 0" }}>Chưa có thói quen</div>
      ) : (
        stats.map((h, i) => (
          <div key={h.title} style={{ marginBottom: i < stats.length - 1 ? 10 : 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <div style={{ fontSize: 12, color: "#ccc" }}>{h.title}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: h.pct >= 80 ? "#22c55e" : "#F97316" }}>{h.pct}%</div>
            </div>
            <div style={{ height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 5, overflow: "hidden" }}>
              <div style={{
                height: "100%", width: `${h.pct}%`,
                background: h.pct >= 80
                  ? "linear-gradient(90deg,#16a34a,#22c55e)"
                  : "linear-gradient(90deg,#ea580c,#F97316)",
                borderRadius: 5, transition: "width 0.7s cubic-bezier(.4,0,.2,1)",
              }} />
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function FundSparkline({ logs, rewardPrice }: { logs: CheckInLog[]; rewardPrice: number }) {
  if (logs.length < 2) return (
    <div style={{ fontSize: 11, color: "#444", textAlign: "center", padding: "20px 0" }}>
      Cần ít nhất 2 ngày để hiện biểu đồ
    </div>
  );

  const sorted = [...logs].sort((a, b) => a.date.localeCompare(b.date));
  let cum = 0;
  const points = sorted.map(l => { cum += (l.saving || 0); return cum; });
  const maxVal = Math.max(rewardPrice, ...points);
  const W = 300, H = 80;
  const xs = points.map((_, i) => i === 0 ? 8 : Math.round(8 + (i / (points.length - 1)) * (W - 16)));
  const ys = points.map(v => Math.round(H - 8 - ((v / maxVal) * (H - 16))));
  const polyline = xs.map((x, i) => `${x},${ys[i]}`).join(" ");
  const goalY = Math.round(H - 8 - ((rewardPrice / maxVal) * (H - 16)));

  return (
    <div>
      <div style={{ fontSize: 9, letterSpacing: 2, color: "#555", marginBottom: 10 }}>TÍCH LŨY QUỸ THEO NGÀY</div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block" }}>
        <line x1="0" y1={goalY} x2={W} y2={goalY}
          stroke="rgba(249,115,22,0.35)" strokeWidth="1" strokeDasharray="4 3" />
        <text x="4" y={goalY - 3} fontSize="8" fill="#F97316" fontFamily="monospace">Mục tiêu</text>
        <polygon points={`8,${H} ${polyline} ${xs[xs.length-1]},${H}`} fill="rgba(249,115,22,0.12)" />
        <polyline points={polyline} fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {xs.map((x, i) => <circle key={i} cx={x} cy={ys[i]} r="3" fill="#F97316" />)}
      </svg>
    </div>
  );
}

export { MiniBarChart, HabitBreakdown, FundSparkline };
