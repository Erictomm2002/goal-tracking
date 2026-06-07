"use client";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "destructive";
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open, title, message, confirmLabel = "XÁC NHẬN", cancelLabel = "HUỶ",
  variant = "destructive", onConfirm, onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "rgba(0,0,0,0.9)", backdropFilter: "blur(16px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
    }}>
      <div style={{
        background: "#0f172a", border: "1px solid rgba(249,115,22,0.3)",
        borderRadius: 20, padding: 28, width: "100%", maxWidth: 360,
      }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: "#e8edf5", marginBottom: 10, fontFamily: "'Courier New', monospace" }}>
          {title}
        </div>
        <div style={{ fontSize: 13, color: "#b0b8c4", lineHeight: 1.6, marginBottom: 22, fontWeight: 500 }}>
          {message}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onCancel} style={{
            flex: 1, padding: "14px", borderRadius: 12,
            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
            color: "#b0b8c4", fontWeight: 700, fontSize: 13,
            fontFamily: "'Courier New', monospace", cursor: "pointer", letterSpacing: 0.5,
          }}>
            {cancelLabel}
          </button>
          <button onClick={onConfirm} style={{
            flex: 1, padding: "14px", borderRadius: 12,
            background: variant === "destructive"
              ? "linear-gradient(90deg,#dc2626,#ef4444)"
              : "linear-gradient(90deg,#ea580c,#F97316)",
            border: "none", color: "#fff", fontWeight: 900, fontSize: 13,
            fontFamily: "'Courier New', monospace", cursor: "pointer", letterSpacing: 1,
          }}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
