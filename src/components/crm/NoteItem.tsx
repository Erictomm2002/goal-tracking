"use client";

import { useState } from "react";
import { ConfirmDialog } from "./ConfirmDialog";
import type { CRMNote } from "@/types/crm";

interface NoteItemProps {
  note: CRMNote;
  onDelete: (id: string) => void;
}

function formatTime(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "Vừa xong";
  if (mins < 60) return `${mins} phút trước`;
  if (hours < 24) return `${hours} giờ trước`;
  if (days < 7) return `${days} ngày trước`;
  return `${d.getDate()}/${d.getMonth() + 1} ${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
}

export function NoteItem({ note, onDelete }: NoteItemProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const isLong = note.content.length > 150;

  return (
    <>
      <div style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 14, padding: "12px 16px",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <span style={{ fontSize: 11, color: "#7a828e", fontFamily: "'Courier New', monospace", fontWeight: 500 }}>
            {formatTime(note.createdAt)}
          </span>
          <button onClick={() => setShowConfirm(true)}
            style={{
              background: "none", border: "none", color: "#7a828e",
              fontSize: 14, cursor: "pointer", padding: "2px 6px",
              fontWeight: 700,
            }}>
            ✕
          </button>
        </div>
        {isLong && !expanded ? (
          <>
            <span style={{ fontSize: 12, color: "#b0b8c4", lineHeight: 1.7, fontWeight: 500 }}>
              {note.content.slice(0, 150)}...
            </span>
            <button onClick={() => setExpanded(true)}
              style={{ background: "none", border: "none", color: "#F97316", fontSize: 11, fontWeight: 700, cursor: "pointer", marginLeft: 4 }}>
              Xem thêm →
</button>
          </>
        ) : (
          <span style={{ fontSize: 12, color: "#b0b8c4", lineHeight: 1.7, whiteSpace: "pre-wrap", fontWeight: 500 }}>
            {note.content}
          </span>
        )}
        {expanded && isLong && (
          <button onClick={() => setExpanded(false)}
            style={{ background: "none", border: "none", color: "#F97316", fontSize: 11, fontWeight: 700, cursor: "pointer", display: "block", marginTop: 6 }}>
            Thu gọn
          </button>
        )}
      </div>

      <ConfirmDialog open={showConfirm} title="Xoá ghi chú?" message="Bạn có chắc muốn xoá ghi chú này?"
        confirmLabel="XOÁ" onConfirm={() => { onDelete(note.id); setShowConfirm(false); }}
        onCancel={() => setShowConfirm(false)} />
    </>
  );
}
