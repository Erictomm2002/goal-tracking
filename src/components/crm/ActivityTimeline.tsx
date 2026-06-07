"use client";

import { NoteItem } from "./NoteItem";
import type { CRMNote, CRMTask } from "@/types/crm";

interface ActivityTimelineProps {
  notes: CRMNote[];
  completedTasks: CRMTask[];
  onDeleteNote: (id: string) => void;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "HÔM NAY";
  if (d.toDateString() === yesterday.toDateString()) return "HÔM QUA";
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`.toUpperCase();
}

export function ActivityTimeline({ notes, completedTasks, onDeleteNote }: ActivityTimelineProps) {
  const all: Array<{ type: "note" | "task"; date: string; data: CRMNote | CRMTask }> = [
    ...notes.map((n) => ({ type: "note" as const, date: n.createdAt, data: n })),
    ...completedTasks.map((t) => ({ type: "task" as const, date: t.completedAt ?? t.createdAt, data: t })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (all.length === 0) {
    return <div style={{ padding: "24px 0", textAlign: "center", fontSize: 13, color: "#7a828e", fontWeight: 500 }}>Chưa có hoạt động</div>;
  }

  const groups: Record<string, typeof all> = {};
  for (const a of all) {
    const day = formatDate(a.date);
    if (!groups[day]) groups[day] = [];
    groups[day].push(a);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {Object.entries(groups).map(([day, activities]) => (
        <div key={day}>
          <div style={{ fontSize: 11, letterSpacing: 1.5, color: "#7a828e", marginBottom: 8, fontWeight: 700 }}>
            {day}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {activities.map((act) =>
              act.type === "note" ? (
                <NoteItem key={act.data.id} note={act.data as CRMNote} onDelete={onDeleteNote} />
              ) : (
                <div key={act.data.id} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 14px", borderRadius: 12,
                  background: "rgba(34,197,94,0.07)",
                  border: "1px solid rgba(34,197,94,0.15)",
                }}>
                  <span style={{ color: "#4ade80", fontSize: 14, fontWeight: 700 }}>✓</span>
                  <span style={{ fontSize: 12, color: "#7a828e", fontFamily: "'Courier New', monospace", fontWeight: 500, textDecoration: "line-through" }}>
                    {(act.data as CRMTask).title}
                  </span>
                </div>
              ),
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
