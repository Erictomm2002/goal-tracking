"use client";

import { useState, useEffect, useMemo } from "react";
import { fmt, todayStr } from "@/lib/habit-utils";
import { useMobile } from "@/hooks/use-mobile";
import { useReward } from "@/hooks/use-reward";
import { useLogs } from "@/hooks/use-logs";
import { ProgressBattery } from "@/components/habits/progress-battery";
import { Toggle } from "@/components/habits/toggle";
import { HabitBreakdown } from "@/components/habits/charts";
import { TaskList } from "@/components/habits/task-list";
import { SetupOverlay } from "@/components/habits/setup-overlay";
import type { Reward, CheckInLog, Toast } from "@/types/habit";

export default function HabitsPage() {
  const { reward, isLoading: rewardLoading, saveReward, deleteReward } = useReward();
  const { logs, isLoading: logsLoading, addLog, clearLogs } = useLogs();
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState("");
  const [note, setNote] = useState("");
  const [toast, setToast] = useState<Toast | null>(null);
  const [showReset, setShowReset] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [showCheckin, setShowCheckin] = useState(false);
  const [showMotivation, setShowMotivation] = useState(false);
  const isMobile = useMobile();

  const isLoading = rewardLoading || logsLoading;

  const activeHabits = useMemo(() => reward?.habits ?? [], [reward]);

  const totalFund = logs.reduce((a, l) => a + (l.saving || 0), 0);
  const fundPct = reward
    ? Math.min(100, Math.max(0, (totalFund / reward.price) * 100))
    : 0;
  const kpiPct =
    logs.length > 0
      ? Math.round(logs.reduce((a, l) => a + (l.donePct || 0), 0) / logs.length)
      : 0;
  const unlocked = !!(reward && kpiPct >= 80 && totalFund >= reward.price);
  const daysLeft = reward
    ? Math.max(
        0,
        Math.ceil((new Date(reward.deadline).getTime() - Date.now()) / 86400000)
      )
    : 0;
  const todayDone = logs.some((l) => l.date === todayStr());
  const savingNum = Number(saving.replace(/\D/g, "")) || 0;
  const habitsChecked = activeHabits.filter((h) => checks[h.title]).length;
  const donePct =
    activeHabits.length > 0
      ? Math.round((habitsChecked / activeHabits.length) * 100)
      : 0;
  const goodDays = logs.filter((l) => l.donePct >= 80).length;

  const showToast = (msg: string, type: "ok" | "info" = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2200);
  };

  useEffect(() => {
    if (isLoading) return;
    setShowMotivation(true);
  }, [isLoading]);

  useEffect(() => {
    if (isLoading) return;
    const todayLog = logs.find((l) => l.date === todayStr());
    if (todayLog) {
      const cleaned: Record<string, boolean> = {};
      activeHabits.forEach((h) => {
        if (todayLog.checks[h.title]) cleaned[h.title] = true;
      });
      setChecks(cleaned);
      setSaving(String(todayLog.saving));
      setNote(todayLog.note);
    } else {
      setChecks({});
      setSaving("");
      setNote("");
    }
  }, [logs, isLoading, activeHabits]);

  const handleCheckin = () => {
    const log: CheckInLog = {
      date: todayStr(),
      checks: { ...checks },
      saving: savingNum,
      note,
      donePct,
    };
    addLog(log);
    showToast("✓ Đã cập nhật hôm nay!", "ok");
  };

  const handleReset = () => {
    deleteReward();
    clearLogs();
    setShowReset(false);
  };

  const handleSetupDone = (r: Reward) => {
    saveReward(r);
    setShowSetup(false);
  };

  const col: React.CSSProperties = isMobile
    ? { display: "flex", flexDirection: "column", gap: 14 }
    : {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 14,
        alignItems: "start",
      };

  if (isLoading) return null;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#070b14",
        fontFamily: "'Courier New', Courier, monospace",
        color: "#e2e8f0",
      }}
    >
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeSlide { from{opacity:0;transform:translateX(-50%) translateY(-10px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
        input::placeholder { color: #64748b; }
        input[type=date]::-webkit-calendar-picker-indicator { filter: invert(0.4); }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-thumb { background: #1f2937; border-radius: 4px; }
        @media (max-width: 767px) {
          [style*="font-size: 13px"] { font-size: 15px !important; }
          [style*="font-size: 12px"] { font-size: 14px !important; }
          [style*="font-size: 11px"] { font-size: 13px !important; }
          [style*="font-size: 10px"] { font-size: 12px !important; }
          [style*="font-size: 9px"] { font-size: 11px !important; }
          [style*="font-size: 8px"] { font-size: 10px !important; }
        }
      `}</style>

      {/* ── Setup overlay ── */}
      {(!reward || showSetup) && (
        <SetupOverlay onDone={handleSetupDone} initial={reward ?? undefined} />
      )}

      {toast && (
        <div
          style={{
            position: "fixed",
            top: 20,
            left: "50%",
            zIndex: 300,
            transform: "translateX(-50%)",
            background: toast.type === "ok" ? "#14532d" : "#1e3a5f",
            border: `1px solid ${toast.type === "ok" ? "#22c55e" : "#3b82f6"}`,
            color: toast.type === "ok" ? "#86efac" : "#93c5fd",
            borderRadius: 30,
            padding: "9px 22px",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1,
            animation: "fadeSlide 0.3s ease",
            whiteSpace: "nowrap",
          }}
        >
          {toast.msg}
        </div>
      )}

      {/* ── Check-in modal ── */}
      {showCheckin && (
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
            fontFamily: "'Courier New', Courier, monospace",
          }}
        >
          <div
            style={{
              background: "#0f172a",
              border: "1px solid rgba(249,115,22,0.3)",
              borderRadius: 20,
              padding: 28,
              width: "100%",
              maxWidth: 440,
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <div>
                <div
                  style={{ fontSize: 9, letterSpacing: 3, color: "#F97316" }}
                >
                  CHECK-IN HÔM NAY
                </div>
                <div style={{ fontSize: 11, color: "#64748b" }}>{todayStr()}</div>
              </div>
              <button
                onClick={() => setShowCheckin(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#64748b",
                  fontSize: 20,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                ×
              </button>
            </div>

            {activeHabits.map((h, i) => (
              <div
                key={h.title}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingTop: i > 0 ? 13 : 0,
                  marginTop: i > 0 ? 13 : 0,
                  borderTop:
                    i > 0 ? "1px solid rgba(255,255,255,0.05)" : "none",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: checks[h.title] ? 700 : 400,
                      color: checks[h.title] ? "#fff" : "#888",
                      transition: "color 0.2s",
                    }}
                  >
                    {h.title}
                  </div>
                  {h.subtitle && (
                    <div
                      style={{
                        fontSize: 9,
                        color: "#64748b",
                        letterSpacing: 1,
                      }}
                    >
                      {h.subtitle}
                    </div>
                  )}
                </div>
                <Toggle
                  on={!!checks[h.title]}
                  onToggle={() =>
                    setChecks((c) => ({ ...c, [h.title]: !c[h.title] }))
                  }
                />
              </div>
            ))}

            <div
              style={{
                marginTop: 14,
                padding: "9px 12px",
                borderRadius: 10,
                background:
                  donePct >= 80
                    ? "rgba(34,197,94,0.08)"
                    : "rgba(255,255,255,0.03)",
                border: `1px solid ${donePct >= 80 ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.06)"}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ fontSize: 12, color: "#cbd5e1" }}>
                {habitsChecked}/{activeHabits.length} hôm nay
              </div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  color: donePct >= 80 ? "#22c55e" : "#F97316",
                }}
              >
                {donePct >= 80 ? "✅ Ngày đạt KPI" : `${donePct}%`}
              </div>
            </div>

            <div style={{ marginTop: 14 }}>
              <div
                style={{
                  fontSize: 9,
                  letterSpacing: 2,
                  color: "#64748b",
                  marginBottom: 6,
                }}
              >
                TIẾT KIỆM HÔM NAY (tuỳ chọn)
              </div>
              <input
                value={saving}
                onChange={(e) => setSaving(e.target.value)}
                placeholder="VD: 50000"
                inputMode="numeric"
                style={inputStyle}
              />
              {savingNum > 0 && reward && (
                <div style={{ fontSize: 11, color: "#60a5fa", marginTop: 5 }}>
                  💰 +{fmt(savingNum)} →{" "}
                  {Math.round((savingNum / reward.price) * 100)}% mục tiêu
                </div>
              )}
            </div>

            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ghi chú…"
              style={{
                ...inputStyle,
                marginTop: 10,
                color: "#94a3b8",
              }}
            />

            <button
              onClick={() => {
                handleCheckin();
                setShowCheckin(false);
              }}
              style={{ ...btnOrangeStyle, marginTop: 14 }}
            >
              {todayDone ? "CẬP NHẬT HÔM NAY →" : "GHI NHẬN HÔM NAY →"}
            </button>
          </div>
        </div>
      )}

      {/* ── Motivation modal ── */}
      {showMotivation && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 250,
          background: "rgba(0,0,0,0.88)", backdropFilter: "blur(16px)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
          fontFamily: "'Courier New', Courier, monospace",
        }}>
          <div style={{
            background: "#0f172a", border: "1px solid rgba(249,115,22,0.3)",
            borderRadius: 20, padding: 32, width: "100%", maxWidth: 420,
            textAlign: "center",
          }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>🔥</div>
            <div style={{ fontSize: 9, letterSpacing: 3, color: "#F97316", marginBottom: 12 }}>ĐỘNG LỰC HÔM NAY</div>
            <div style={{ fontSize: 13, color: "#bbb", lineHeight: 1.8, fontStyle: "italic" }}>
              &ldquo;Tiết kiệm thông minh, chạy số máu lửa, cạnh tranh hết sức. Để được như vậy thì hãy biết cách chi tiêu, thể thao, sinh hoạt để chăm sóc bản thân, dành thời gian để tìm các phương án kiếm tiền mới, tích lũy năng lượng từ những hành động nhỏ hàng ngày để tạo ra giá trị, tài sản.&rdquo;
            </div>
            <button onClick={() => setShowMotivation(false)}
              style={{ ...btnOrangeStyle, marginTop: 16, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#cbd5e1" }}>
              BẮT ĐẦU NGAY →
            </button>
          </div>
        </div>
      )}

      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: isMobile ? "20px 14px 60px" : "28px 32px 60px",
        }}
      >
        {/* ── HEADER ── */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 14,
            flexWrap: "wrap",
            gap: 10,
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            paddingBottom: 14,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              {reward?.image && (
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 12,
                  overflow: "hidden",
                  flexShrink: 0,
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  boxShadow: "0 0 20px rgba(249,115,22,0.08)",
                }}
              >
                <img
                  src={reward.image}
                  alt={reward.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            )}
            <div>
              <div style={{ fontSize: 9, letterSpacing: 3, color: "#F97316" }}>
                RELATION CIRCLE
              </div>
              <div
                style={{
                  fontSize: isMobile ? 18 : 24,
                  fontWeight: 900,
                  color: "#fff",
                }}
              >
                {reward?.name || "—"}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button
              onClick={() => setShowCheckin(true)}
              style={{
                background: "linear-gradient(90deg,#ea580c,#F97316)",
                border: "none", borderRadius: 12, padding: "10px 16px",
                color: "#fff", fontWeight: 800, fontSize: 12,
                fontFamily: "'Courier New', monospace", cursor: "pointer",
                letterSpacing: 2, whiteSpace: "nowrap",
              }}
            >
              {todayDone ? "📋 CẬP NHẬT HÔM NAY" : "📋 CHECK-IN HÔM NAY"}
            </button>
            <button
              onClick={() => setShowReset((v) => !v)}
              style={{
                width: 42, height: 42,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 12, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: 20, lineHeight: 1 }}>⚙</span>
            </button>
          </div>
        </div>

          {/* ── Settings dropdown ── */}
        {showReset && (
          <div
            style={{
              ...cardStyle,
              border: "1px solid rgba(255,255,255,0.1)",
              marginBottom: 16,
            }}
          >
            <div style={{ fontSize: 13, color: "#cbd5e1", marginBottom: 12 }}>
              CÀI ĐẶT
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <button
                onClick={() => {
                  setShowSetup(true);
                  setShowReset(false);
                }}
                style={{ ...btnOrangeStyle, padding: "10px", fontSize: 12 }}
              >
                ✏️ CHỈNH SỬA MỤC TIÊU & THÓI QUEN
              </button>
              <button
                onClick={handleReset}
                style={{
                  ...btnOrangeStyle,
                  padding: "10px",
                  fontSize: 12,
                  background: "#dc2626",
                }}
              >
                🗑️ XOÁ & RESET TOÀN BỘ
              </button>
              <button
                onClick={() => setShowReset(false)}
                style={{
                  ...ghostBtnStyle,
                  padding: "10px",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 10,
                }}
              >
                Đóng
              </button>
            </div>
          </div>
        )}

        {/* ── Unlock banner ── */}
        {unlocked && (
          <div
            style={{
              ...cardStyle,
              marginBottom: 18,
              background: "rgba(21,128,61,0.2)",
              border: "1px solid rgba(34,197,94,0.4)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 28 }}>🎉</div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 900,
                color: "#22c55e",
                marginTop: 4,
              }}
            >
              ĐỦ ĐIỀU KIỆN MUA RỒI!
            </div>
            <div style={{ fontSize: 12, color: "#86efac", marginTop: 4 }}>
              KPI ≥ 80% và đủ tiền. Xứng đáng!
            </div>
            <a
              href={`https://www.google.com/search?q=${encodeURIComponent(reward?.name || "")}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                ...btnOrangeStyle,
                maxWidth: 280,
                margin: "12px auto 0",
                background: "#22c55e",
                textDecoration: "none",
                display: "block",
              }}
            >
              ĐẶT HÀNG NGAY 🛒
            </a>
          </div>
        )}

        <div style={col}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={cardStyle}>
              <div
                style={{
                  fontSize: 9,
                  letterSpacing: 2,
                  color: "#64748b",
                  marginBottom: 14,
                }}
              >
                TIẾN ĐỘ CHINH PHỤC
              </div>
              <ProgressBattery percent={fundPct} />
              <div style={{ display: "flex", gap: 16, marginTop: 14 }}>
                <div style={{ flex: 1, textAlign: "center" }}>
                  <div style={{ fontSize: 8, letterSpacing: 2, color: "#64748b", marginBottom: 2 }}>
                    TIỀN TIẾT KIỆM
                  </div>
                  <div style={{ fontSize: 13, color: "#F97316", fontWeight: 800 }}>
                    {fmt(totalFund)}
                  </div>
                  <div style={{ fontSize: 10, color: "#64748b" }}>
                    / {reward ? fmt(reward.price) : "—"}
                  </div>
                </div>
                <div style={{ flex: 1, textAlign: "center" }}>
                  <div style={{ fontSize: 8, letterSpacing: 2, color: "#64748b", marginBottom: 2 }}>
                    DEADLINE
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#60a5fa" }}>
                    {daysLeft} ngày
                  </div>
                  <div style={{ fontSize: 10, color: "#64748b" }}>
                    {reward?.deadline?.slice(0, 10) || "—"}
                  </div>
                </div>
              </div>
              <div
                style={{
                  marginTop: 12,
                  textAlign: "center",
                  fontSize: 10,
                  color: "#64748b",
                  background: "rgba(249,115,22,0.06)",
                  borderRadius: 30,
                  padding: "5px 10px",
                }}
              >
                💡 1 bữa ngoài (~120k) ={" "}
                {reward ? Math.round((120000 / reward.price) * 100) : "—"}% mục
                tiêu
              </div>
            </div>

            <div style={cardStyle}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  marginBottom: 10,
                }}
              >
                <div style={{ fontSize: 9, letterSpacing: 2, color: "#64748b" }}>
                  KPI THÓI QUEN THÁNG NÀY
                </div>
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 900,
                    color: kpiPct >= 80 ? "#22c55e" : "#F97316",
                  }}
                >
                  {kpiPct}%
                </div>
              </div>
              <div
                style={{
                  height: 7,
                  background: "rgba(255,255,255,0.06)",
                  borderRadius: 6,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${kpiPct}%`,
                    background:
                      kpiPct >= 80
                        ? "linear-gradient(90deg,#16a34a,#22c55e)"
                        : "linear-gradient(90deg,#ea580c,#F97316)",
                    borderRadius: 6,
                    transition: "width 0.7s cubic-bezier(.4,0,.2,1)",
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 8,
                }}
              >
                <div style={{ fontSize: 10, color: "#64748b" }}>
                  {goodDays}/{logs.length} ngày đạt KPI
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: kpiPct >= 80 ? "#22c55e" : "#666",
                  }}
                >
                  {kpiPct >= 80
                    ? "✅ Đạt ngưỡng 80%"
                    : `Cần thêm ${80 - kpiPct}%`}
                </div>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 14,
              }}
            >
              {[
                { label: "NGÀY LOG", val: logs.length, color: "#F97316" },
                { label: "NGÀY ĐẠT", val: goodDays, color: "#22c55e" },
                { label: "CÒN LẠI", val: `${daysLeft}d`, color: "#60a5fa" },
              ].map(({ label, val, color }) => (
                <div
                  key={label}
                  style={{
                    ...cardStyle,
                    textAlign: "center",
                    padding: "12px 8px",
                  }}
                >
                  <div style={{ fontSize: 8, letterSpacing: 1, color: "#64748b" }}>
                    {label}
                  </div>
                  <div
                    style={{
                      fontSize: 20,
                      fontWeight: 900,
                      color,
                      marginTop: 4,
                    }}
                  >
                    {val}
                  </div>
                </div>
              ))}
            </div>

            <div style={cardStyle}>
              <HabitBreakdown logs={logs} habits={activeHabits} />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <TaskList habits={activeHabits} />
            <div style={cardStyle}>
              <div
                style={{
                  fontSize: 9,
                  letterSpacing: 2,
                  color: "#64748b",
                  marginBottom: 12,
                }}
              >
                NHẬT KÝ {logs.length > 0 ? `(${logs.length} ngày)` : ""}
              </div>
              {logs.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    color: "#64748b",
                    fontSize: 12,
                    padding: "16px 0",
                  }}
                >
                  Chưa có check-in nào. Bắt đầu hôm nay!
                </div>
              ) : (
                <div
                  style={{
                    maxHeight: 340,
                    overflowY: "auto",
                    marginRight: -4,
                    paddingRight: 4,
                  }}
                >
                  {[...logs].reverse().map((log, i) => (
                    <div
                      key={log.date}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        padding: "9px 10px",
                        borderRadius: 8,
                        marginBottom: 3,
                        background:
                          i % 2 === 0
                            ? "rgba(255,255,255,0.02)"
                            : "transparent",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 7,
                          }}
                        >
                          <div
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              flexShrink: 0,
                              background:
                                log.donePct >= 80
                                  ? "#22c55e"
                                  : log.donePct >= 60
                                    ? "#F97316"
                                    : "#ef4444",
                            }}
                          />
                          <div style={{ fontSize: 11, color: "#94a3b8" }}>
                            {log.date}
                          </div>
                          <div
                            style={{
                              fontSize: 11,
                              fontWeight: 700,
                              color: log.donePct >= 80 ? "#22c55e" : "#F97316",
                            }}
                          >
                            {log.donePct}%
                          </div>
                        </div>
                        {log.note && (
                          <div
                            style={{
                              fontSize: 10,
                              color: "#64748b",
                              marginTop: 3,
                              paddingLeft: 13,
                            }}
                          >
                            {log.note}
                          </div>
                        )}
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        {log.saving > 0 ? (
                          <div
                            style={{
                              fontSize: 12,
                              fontWeight: 700,
                              color: "#60a5fa",
                            }}
                          >
                            +{fmt(log.saving)}
                          </div>
                        ) : (
                          <div style={{ fontSize: 11, color: "#475569" }}>—</div>
                        )}
                        {log.saving > 0 && reward && (
                          <div style={{ fontSize: 9, color: "#64748b" }}>
                            {Math.round((log.saving / reward.price) * 100)}% mục
                            tiêu
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div
              style={{
                ...cardStyle,
                background: unlocked
                  ? "rgba(21,128,61,0.12)"
                  : "rgba(255,255,255,0.02)",
                border: `1px solid ${unlocked ? "rgba(34,197,94,0.3)" : "rgba(255,255,255,0.07)"}`,
              }}
            >
              <div
                style={{
                  fontSize: 9,
                  letterSpacing: 2,
                  color: "#64748b",
                  marginBottom: 12,
                }}
              >
                REWARD GATE
              </div>
              {[
                { label: "KPI ≥ 80%", ok: kpiPct >= 80, val: `${kpiPct}%` },
                {
                  label: "Đủ tiền mua",
                  ok: totalFund >= (reward?.price || 0),
                  val: `${fmt(totalFund)} / ${fmt(reward?.price || 0)}`,
                },
              ].map(({ label, ok, val }) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 10px",
                    borderRadius: 8,
                    marginBottom: 6,
                    background: ok
                      ? "rgba(34,197,94,0.08)"
                      : "rgba(255,255,255,0.03)",
                    border: `1px solid ${ok ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.05)"}`,
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <span style={{ fontSize: 14 }}>{ok ? "✅" : "🔒"}</span>
                    <div style={{ fontSize: 12, color: "#cbd5e1" }}>{label}</div>
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: ok ? "#22c55e" : "#555",
                    }}
                  >
                    {val}
                  </div>
                </div>
              ))}
              {!unlocked && (
                <div
                  style={{
                    fontSize: 10,
                    color: "#64748b",
                    marginTop: 6,
                    textAlign: "center",
                  }}
                >
                  Cần đủ cả hai điều kiện để mở khoá
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: 16,
  padding: "16px",
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
};

const btnOrangeStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  background: "linear-gradient(90deg,#ea580c,#F97316)",
  border: "none",
  borderRadius: 12,
  padding: "13px",
  color: "#fff",
  fontWeight: 900,
  fontSize: 13,
  fontFamily: "'Courier New', monospace",
  letterSpacing: 0.5,
  cursor: "pointer",
};

const ghostBtnStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  color: "#64748b",
  fontSize: 11,
  cursor: "pointer",
  fontFamily: "'Courier New', monospace",
  padding: "8px 16px",
};
