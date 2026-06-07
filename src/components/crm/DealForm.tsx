"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { labelStyle, inputStyle, btnPrimary, btnGhost, theme } from "./styles";
import { PACKAGES, STAGES, type DealFormData, type CRMContact } from "@/types/crm";

interface DealFormProps {
  contacts: CRMContact[];
  defaultValues?: Partial<DealFormData>;
  onSubmit: (data: DealFormData) => Promise<void>;
  isSubmitting?: boolean;
}

export function DealForm({ contacts, defaultValues, onSubmit, isSubmitting }: DealFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(defaultValues?.title ?? "");
  const [contactId, setContactId] = useState(defaultValues?.contactId ?? "");
  const [value, setValue] = useState(defaultValues?.value?.toString() ?? "");
  const [stage, setStage] = useState(defaultValues?.stage ?? "Tiếp cận");
  const [pkg, setPkg] = useState(defaultValues?.package ?? "");
  const [probability, setProbability] = useState(defaultValues?.probability?.toString() ?? "");
  const [expectedCloseDate, setExpectedCloseDate] = useState(defaultValues?.expectedCloseDate ?? "");
  const [contactSearch, setContactSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState("");

  const filtered = contacts.filter((c) =>
    c.name.toLowerCase().includes(contactSearch.toLowerCase()) ||
    c.company?.toLowerCase().includes(contactSearch.toLowerCase()));
  const selected = contacts.find((c) => c.id === contactId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!title.trim()) { setError("Nhập tiêu đề deal"); return; }
    if (!contactId) { setError("Chọn liên hệ"); return; }
    try {
      await onSubmit({
        title: title.trim(), contactId, value: value ? Number(value) : undefined,
        stage, package: pkg || undefined, probability: probability ? Number(probability) : undefined,
        expectedCloseDate: expectedCloseDate || undefined,
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
    <form onSubmit={handleSubmit} style={{
      background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 16, padding: 20, display: "flex", flexDirection: "column", gap: 18,
    }}>
      <div style={{ fontSize: 11, letterSpacing: 2, color: "#F97316", fontWeight: 700 }}>
        THÔNG TIN DEAL
      </div>

      <div>
        <div style={labelStyle}>LIÊN HỆ *</div>
        <div style={{ position: "relative" }}>
          <input value={contactSearch}
            onChange={(e) => { setContactSearch(e.target.value); setShowDropdown(true); if (!e.target.value) setContactId(""); }}
            onFocus={() => setShowDropdown(true)}
            style={inputStyle} placeholder="Tìm liên hệ..." />
          {showDropdown && contactSearch && (
            <div style={{
              position: "absolute", zIndex: 10, marginTop: 6, width: "100%",
              maxHeight: 240, overflowY: "auto",
              background: "#0f172a", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12,
            }}>
              {filtered.length === 0 ? (
                <div style={{ padding: 14, fontSize: 12, color: "#7a828e" }}>Không tìm thấy</div>
              ) : (
                filtered.map((c) => (
                  <button key={c.id} type="button"
                    onClick={() => { setContactId(c.id); setContactSearch(c.name); setShowDropdown(false); if (!title && c.company) setTitle(c.company); }}
                    style={{
                      width: "100%", padding: "12px 16px", display: "flex", gap: 8,
                      background: "none", border: "none", color: "#b0b8c4",
                      fontSize: 12, fontFamily: theme.font, fontWeight: 600,
                      cursor: "pointer", textAlign: "left",
                    }}>
                    <span style={{ color: "#e8edf5", fontWeight: 700 }}>{c.name}</span>
                    {c.company && <span style={{ color: "#7a828e" }}>- {c.company}</span>}
                  </button>
                ))
              )}
            </div>
          )}
          {selected && !showDropdown && (
            <div style={{ fontSize: 11, color: "#4ade80", marginTop: 4, fontWeight: 600 }}>
              ✓ {selected.name}{selected.company && ` - ${selected.company}`}
            </div>
          )}
        </div>
      </div>

      <div>
        <div style={labelStyle}>TIÊU ĐỀ DEAL *</div>
        <input value={title} onChange={(e) => setTitle(e.target.value)}
          style={inputStyle} placeholder="VD: Nhà hàng Hương Việt" />
      </div>

      <div>
        <div style={labelStyle}>GÓI IPOS</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {PACKAGES.map((p) => (
            <button key={p} type="button" onClick={() => setPkg(pkg === p ? "" : p)}
              style={chipStyle(pkg === p)}>{p}</button>
          ))}
        </div>
      </div>

      <div>
        <div style={labelStyle}>GIÁ TRỊ (VNĐ)</div>
        <input value={value} onChange={(e) => setValue(e.target.value.replace(/\D/g, ""))}
          style={inputStyle} placeholder="15000000" inputMode="numeric" />
      </div>

      <div>
        <div style={labelStyle}>GIAI ĐOẠN</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {STAGES.map((s) => (
            <button key={s} type="button" onClick={() => setStage(s)}
              style={chipStyle(stage === s)}>{s}</button>
          ))}
        </div>
      </div>

      <div>
        <div style={labelStyle}>XÁC SUẤT % (0–100)</div>
        <input value={probability} onChange={(e) => setProbability(e.target.value.replace(/\D/g, "").slice(0, 3))}
          style={inputStyle} placeholder="60" inputMode="numeric" />
      </div>

      <div>
        <div style={labelStyle}>NGÀY DỰ KIẾN CHỐT</div>
        <input type="date" value={expectedCloseDate} onChange={(e) => setExpectedCloseDate(e.target.value)}
          style={{ ...inputStyle, colorScheme: "dark" }} />
      </div>

      {error && <div style={{ fontSize: 12, color: "#ef4444", fontWeight: 600 }}>{error}</div>}

      <div style={{ display: "flex", gap: 10 }}>
        <button type="button" onClick={() => router.back()} style={btnGhost}>HUỶ</button>
        <button type="submit" disabled={isSubmitting} style={btnPrimary}>
          {isSubmitting ? "ĐANG LƯU..." : "LƯU"}
        </button>
      </div>
    </form>
  );
}
