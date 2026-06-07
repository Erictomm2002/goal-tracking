"use client";

import { useState, useRef } from "react";
import { theme } from "./styles";
import type { CRMTask } from "@/types/crm";

interface TaskItemProps {
  task: CRMTask;
  contactName?: string;
  dealName?: string;
  onComplete: () => void;
  onUncomplete: () => void;
  onClick: () => void;
}

const TYPE_META: Record<string, { icon: string; label: string }> = {
  call:    { icon: "📞", label: "Cuộc gọi" },
  meeting: { icon: "🤝", label: "Họp" },
  demo:    { icon: "🖥", label: "Demo" },
  email:   { icon: "📧", label: "Email" },
  quote:   { icon: "📄", label: "Báo giá" },
  other:   { icon: "⬡", label: "Khác" },
};

function formatTime(task: CRMTask): string {
  return task.dueTime ? task.dueTime.slice(0, 5) : "";
}

export function TaskItem({ task, contactName, dealName, onComplete, onUncomplete, onClick }: TaskItemProps) {
  const [swiped, setSwiped] = useState(false);
  const startX = useRef(0);
  const offsetX = useRef(0);
  const [translateX, setTranslateX] = useState(0);
  const dragging = useRef(false);

  const handleTouchStart = (e: React.TouchEvent) => { startX.current = e.touches[0].clientX; dragging.current = false; };
  const handleTouchMove = (e: React.TouchEvent) => {
    const diff = e.touches[0].clientX - startX.current;
    if (Math.abs(diff) > 5) dragging.current = true;
    if (diff < 0) { offsetX.current = diff; setTranslateX(Math.max(diff, -80)); }
  };
  const handleTouchEnd = () => {
    if (offsetX.current < -40 && !task.completed) {
      setSwiped(true);
      setTimeout(() => { onComplete(); setTranslateX(0); offsetX.current = 0; }, 200);
    } else {
      setTranslateX(0); offsetX.current = 0;
    }
    if (!dragging.current && offsetX.current > -5) onClick();
    dragging.current = false;
  };

  const today = new Date().toISOString().slice(0, 10);
  const isOverdue = !task.completed && task.dueDate && task.dueDate < today;
  const isUrgent = isOverdue || (!task.completed && task.dueDate === today);
  const typeMeta = TYPE_META[task.type] ?? TYPE_META.other;
  const hasTime = formatTime(task);
  const hasMeta = hasTime || contactName || dealName;
  const borderColor = task.completed
    ? "rgba(34,197,94,0.3)"
    : isUrgent
      ? "#ef4444"
      : "rgba(34,197,94,0.4)";

  return (
    <div style={{ position: "relative", overflow: "hidden", borderRadius: 14 }}>


      <div
        style={{
          background: task.completed
            ? "rgba(255,255,255,0.02)"
            : "rgba(255,255,255,0.04)",
          borderRadius: 14,
          border: `1px solid rgba(255,255,255,${task.completed ? "0.04" : "0.07"})`,
          borderLeft: `3px solid ${borderColor}`,
          opacity: task.completed ? 0.4 : 1,
          transform: swiped ? "translateX(100%)" : `translateX(${translateX}px)`,
          transition: dragging.current ? "none" : "transform 0.2s, opacity 0.25s",
          padding: "16px 16px",
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={() => { if (!dragging.current) onClick(); }}
      >
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                fontSize: 10, fontWeight: 700, color: "#b0b8c4",
                background: "rgba(255,255,255,0.05)",
                padding: "2px 8px 2px 6px", borderRadius: 5,
                letterSpacing: 0.3,
              }}>
                <span style={{ fontSize: 12 }}>{typeMeta.icon}</span>
                {typeMeta.label}
              </span>

              {hasTime && (
                <span style={{
                  fontSize: 10, fontWeight: 700, color: "#7a828e",
                  background: "rgba(255,255,255,0.04)",
                  padding: "2px 7px", borderRadius: 5,
                  fontFamily: theme.font,
                }}>
                  {hasTime}
                </span>
              )}

              {isOverdue && (
                <span style={{
                  fontSize: 9, fontWeight: 800, color: "#ef4444",
                  background: "rgba(239,68,68,0.12)",
                  padding: "2px 7px", borderRadius: 4, letterSpacing: 0.5,
                }}>
                  QUÁ HẠN
                </span>
              )}
            </div>

            <span style={{
              display: "block",
              fontSize: 15,
              fontWeight: 700,
              fontFamily: theme.font,
              color: task.completed ? "#7a828e" : "#e8edf5",
              textDecoration: task.completed ? "line-through" : "none",
              lineHeight: 1.5,
              marginBottom: hasMeta ? 10 : 0,
            }}>
              {task.title}
            </span>

            {hasMeta && (
              <div style={{
                display: "flex",
                gap: 8,
                fontSize: 11,
                color: "#7a828e",
                fontWeight: 500,
                alignItems: "center",
                flexWrap: "wrap",
              }}>
                {contactName && (
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: 3,
                  }}>
                    <span style={{ opacity: 0.5 }}>👤</span> {contactName}
                  </span>
                )}
                {dealName && (
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: 3,
                    color: "#F97316", fontWeight: 600,
                  }}>
                    <span style={{ opacity: 0.6 }}>◆</span> {dealName}
                  </span>
                )}
                {task.priority === "high" && !task.completed && (
                  <span style={{
                    fontSize: 9, fontWeight: 800, color: "#ef4444",
                    background: "rgba(239,68,68,0.12)",
                    padding: "1px 6px", borderRadius: 4, letterSpacing: 0.5,
                    marginLeft: 2,
                  }}>
                    CAO
                  </span>
                )}
              </div>
            )}
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); if (task.completed) onUncomplete(); else onComplete(); }}
            style={{
              width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              marginTop: 2,
              background: task.completed ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.06)",
              border: task.completed ? "2px solid rgba(34,197,94,0.5)" : "2px solid rgba(255,255,255,0.12)",
              color: task.completed ? "#4ade80" : "transparent",
              fontSize: 11, cursor: "pointer", fontFamily: theme.font, fontWeight: 700,
              transition: "all 0.15s",
            }}
          >
            {task.completed ? "✓" : ""}
          </button>
        </div>
      </div>
    </div>
  );
}
