"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import type { Habit } from "@/types/habit";

export function TaskList({ habits }: { habits: Habit[] }) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 16, padding: 16,
    }}>
      <div style={{ fontSize: 9, letterSpacing: 2, color: "#555", marginBottom: 10 }}>
        📋 DANH SÁCH CÔNG VIỆC
      </div>
      {habits.length === 0 ? (
        <div style={{ fontSize: 11, color: "#444", padding: "8px 0" }}>Chưa có công việc nào</div>
      ) : (
        habits.map((h, i) => (
          <div key={h.title}>
            <div
              onClick={() => {
                if (!h.description) return;
                setExpanded(p => ({ ...p, [h.title]: !p[h.title] }));
              }}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "8px 10px", borderRadius: 8, cursor: h.description ? "pointer" : "default",
                background: expanded[h.title] ? "rgba(249,115,22,0.04)" : "transparent",
                transition: "background 0.15s",
              }}
            >
              <div style={{
                width: 6, height: 6, borderRadius: "50%", flexShrink: 0,
                background: "#F97316",
              }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#ddd" }}>{h.title}</div>
                {h.subtitle && (
                  <div style={{ fontSize: 9, color: "#666", marginTop: 1 }}>{h.subtitle}</div>
                )}
              </div>
              {h.description && (
                <span style={{
                  fontSize: 10, color: "#555", flexShrink: 0, transition: "transform 0.2s",
                  transform: expanded[h.title] ? "rotate(180deg)" : "rotate(0deg)",
                }}>
                  ▼
                </span>
              )}
            </div>
            {h.description && expanded[h.title] && (
              <div style={{
                margin: "0 0 6px 6px",
                paddingLeft: 14,
                borderLeft: "2px solid rgba(249,115,22,0.2)",
              }}>
                <div style={{
                  padding: "10px 12px",
                  borderRadius: 8,
                  fontSize: 12, color: "#aaa", lineHeight: 1.65,
                }}>
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => <p style={{ margin: "4px 0" }}>{children}</p>,
                      ul: ({ children }) => <ul style={{ margin: "4px 0", paddingLeft: 18 }}>{children}</ul>,
                      ol: ({ children }) => <ol style={{ margin: "4px 0", paddingLeft: 18 }}>{children}</ol>,
                      li: ({ children }) => <li style={{ margin: "2px 0" }}>{children}</li>,
                      strong: ({ children }) => <strong style={{ color: "#F97316" }}>{children}</strong>,
                      code: ({ children }) => <code style={{ background: "rgba(255,255,255,0.06)", padding: "1px 4px", borderRadius: 3, fontSize: 11 }}>{children}</code>,
                    }}
                  >
                    {h.description}
                  </ReactMarkdown>
                </div>
              </div>
            )}
            {i < habits.length - 1 && (
              <div style={{ height: 1, background: "rgba(255,255,255,0.04)", margin: "0 10px" }} />
            )}
          </div>
        ))
      )}
    </div>
  );
}
