"use client";

import { useState, useEffect, useRef } from "react";
import { btnPrimary, btnGhost, theme } from "./styles";

interface NoteSheetProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (content: string) => Promise<void>;
  defaultContent?: string;
  placeholder?: string;
}

export function NoteSheet({ open, onClose, onSubmit, defaultContent = "", placeholder = "Ghi lại nội dung cuộc gặp, thông tin khách..." }: NoteSheetProps) {
  const [content, setContent] = useState(defaultContent);
  const [submitting, setSubmitting] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) { setContent(defaultContent); setTimeout(() => ref.current?.focus(), 150); }
  }, [open, defaultContent]);

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setSubmitting(true);
    try { await onSubmit(content.trim()); setContent(""); onClose(); }
    finally { setSubmitting(false); }
  };

  if (!open) return null;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "rgba(0,0,0,0.9)", backdropFilter: "blur(16px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
    }}>
      <div style={{
        width: "100%", maxWidth: 440,
        background: "#0f172a", border: "1px solid rgba(249,115,22,0.3)",
        borderRadius: 20, padding: 28,
      }}>
        <div style={{ fontSize: 11, letterSpacing: 3, color: "#F97316", marginBottom: 14, fontWeight: 700 }}>
          + GHI CHÚ NHANH
        </div>
        <textarea
          ref={ref}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{
            width: "100%", height: 140, resize: "none",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 14, padding: 16,
            color: "#e8edf5", fontSize: 15,
            fontFamily: theme.font, lineHeight: 1.6,
            outline: "none",
          }}
          placeholder={placeholder}
        />
        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          <button onClick={onClose} style={btnGhost}>HUỶ</button>
          <button onClick={handleSubmit} disabled={!content.trim() || submitting} style={btnPrimary}>
            {submitting ? "ĐANG LƯU..." : "LƯU GHI CHÚ"}
          </button>
        </div>
      </div>
    </div>
  );
}
