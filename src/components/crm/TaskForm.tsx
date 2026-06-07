"use client";

import { useState } from "react";
import { labelStyle, inputStyle, btnPrimary, btnGhost, theme } from "./styles";
import type { TaskFormData, CRMContact, CRMDeal } from "@/types/crm";

const TASK_TYPES = [
  { value: "call", label: "GỌI ĐIỆN", icon: "📞" },
  { value: "meeting", label: "GẶP MẶT", icon: "🤝" },
  { value: "demo", label: "DEMO", icon: "🖥" },
  { value: "email", label: "EMAIL", icon: "📧" },
  { value: "quote", label: "BÁO GIÁ", icon: "📄" },
  { value: "other", label: "KHÁC", icon: "⬡" },
];

interface TaskFormProps {
  contacts: CRMContact[];
  dealsByContact: Map<string, CRMDeal[]>;
  defaultContactId?: string;
  defaultDealId?: string;
  onSubmit: (data: TaskFormData) => Promise<void>;
  onClose: () => void;
}

export function TaskForm({ contacts, dealsByContact, defaultContactId, defaultDealId, onSubmit, onClose }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("call");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState(new Date().toISOString().slice(0, 10));
  const [dueTime, setDueTime] = useState("");
  const [contactId, setContactId] = useState(defaultContactId ?? "");
  const [dealId, setDealId] = useState(defaultDealId ?? "");
  const [contactSearch, setContactSearch] = useState("");
  const [showContacts, setShowContacts] = useState(false);
  const [error, setError] = useState("");

  const filtered = contacts.filter((c) =>
    c.name.toLowerCase().includes(contactSearch.toLowerCase()) ||
    c.company?.toLowerCase().includes(contactSearch.toLowerCase()));
  const availableDeals = contactId ? dealsByContact.get(contactId) ?? [] : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!title.trim()) { setError("Nhập tiêu đề"); return; }
    try {
      await onSubmit({
        title: title.trim(), type, priority,
        dueDate: dueDate || undefined, dueTime: dueTime || undefined,
        contactId: contactId || undefined, dealId: dealId || undefined,
      });
    } catch { setError("Lỗi xảy ra"); }
  };

  const chipStyle = (active: boolean): React.CSSProperties => ({
    padding: "8px 12px", borderRadius: 8,
    background: active ? theme.accentDim : "rgba(255,255,255,0.04)",
    border: active ? theme.accentBorder : "1px solid rgba(255,255,255,0.08)",
    color: active ? theme.accent : theme.textDim,
    fontSize: 12, fontFamily: theme.font,
    fontWeight: active ? 800 : 600, cursor: "pointer", letterSpacing: 0.5,
  });

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <input value={title} onChange={(e) => setTitle(e.target.value)}
        style={inputStyle} placeholder="Nhập tiêu đề task..." autoFocus />

      <div>
        <div style={labelStyle}>LOẠI</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {TASK_TYPES.map((t) => (
            <button key={t.value} type="button" onClick={() => setType(t.value)}
              style={chipStyle(type === t.value)}>{t.icon} {t.label}</button>
          ))}
        </div>
      </div>

      <div>
        <div style={labelStyle}>ƯU TIÊN</div>
        <div style={{ display: "flex", gap: 8 }}>
          {(["low", "medium", "high"] as const).map((p) => (
            <button key={p} type="button" onClick={() => setPriority(p)}
              style={{
                ...chipStyle(priority === p), flex: 1, textAlign: "center",
                color: priority === p
                  ? p === "high" ? "#ef4444" : p === "medium" ? "#f59e0b" : "#b0b8c4"
                  : "#7a828e",
                background: priority === p
                  ? p === "high" ? "rgba(239,68,68,0.15)" : p === "medium" ? "rgba(245,158,11,0.15)" : "rgba(255,255,255,0.06)"
                  : "rgba(255,255,255,0.03)",
                border: priority === p
                  ? p === "high" ? "1px solid rgba(239,68,68,0.35)" : p === "medium" ? "1px solid rgba(245,158,11,0.35)" : "1px solid rgba(255,255,255,0.12)"
                  : "1px solid rgba(255,255,255,0.06)",
              }}>
              {p === "high" ? "CAO" : p === "medium" ? "TB" : "THẤP"}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ flex: 1 }}>
          <div style={labelStyle}>NGÀY</div>
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
            style={{ ...inputStyle, colorScheme: "dark" }} />
        </div>
        <div style={{ width: 110 }}>
          <div style={labelStyle}>GIỜ</div>
          <input type="time" value={dueTime} onChange={(e) => setDueTime(e.target.value)}
            style={{ ...inputStyle, colorScheme: "dark" }} />
        </div>
      </div>

      <div>
        <div style={labelStyle}>LIÊN KẾT LIÊN HỆ</div>
        <div style={{ position: "relative" }}>
          <input value={contactSearch}
            onChange={(e) => { setContactSearch(e.target.value); setShowContacts(true); if (!e.target.value) { setContactId(""); setDealId(""); } }}
            onFocus={() => setShowContacts(true)}
            style={inputStyle} placeholder="Tìm liên hệ..." />
          {showContacts && contactSearch && (
            <div style={{
              position: "absolute", zIndex: 10, marginTop: 6, width: "100%",
              maxHeight: 180, overflowY: "auto",
              background: "#0f172a", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12,
            }}>
              {filtered.length === 0 ? (
                <div style={{ padding: 14, fontSize: 12, color: "#7a828e" }}>Không tìm thấy</div>
              ) : (
                filtered.map((c) => (
                  <button key={c.id} type="button"
                    onClick={() => { setContactId(c.id); setContactSearch(c.name); setDealId(""); setShowContacts(false); }}
                    style={{
                      width: "100%", padding: "12px 16px", textAlign: "left",
                      background: "none", border: "none", color: "#b0b8c4",
                      fontSize: 12, fontFamily: theme.font, fontWeight: 600,
                      cursor: "pointer", display: "flex", gap: 8,
                    }}>
                    <span style={{ color: "#e8edf5", fontWeight: 700 }}>{c.name}</span>
                    {c.company && <span style={{ color: "#7a828e" }}>- {c.company}</span>}
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {contactId && availableDeals.length > 0 && (
        <div>
          <div style={labelStyle}>LIÊN KẾT DEAL</div>
          <select value={dealId} onChange={(e) => setDealId(e.target.value)}
            style={{
              ...inputStyle, appearance: "none",
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' fill='%23b0b8c4' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10z'/%3E%3C/svg%3E\")",
              backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center",
            }}>
            <option value="" style={{ background: "#0f172a" }}>Không liên kết</option>
            {availableDeals.map((d) => (
              <option key={d.id} value={d.id} style={{ background: "#0f172a" }}>{d.title}</option>
            ))}
          </select>
        </div>
      )}

      {error && <div style={{ fontSize: 12, color: "#ef4444", fontWeight: 600 }}>{error}</div>}

      <div style={{ display: "flex", gap: 10, paddingTop: 4 }}>
        <button type="button" onClick={onClose} style={btnGhost}>HUỶ</button>
        <button type="submit" style={btnPrimary}>THÊM TASK</button>
      </div>
    </form>
  );
}
