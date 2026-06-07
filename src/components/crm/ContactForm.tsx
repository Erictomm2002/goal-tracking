"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { TagChip } from "./TagChip";
import { labelStyle, inputStyle, btnPrimary, btnGhost, theme } from "./styles";
import {
  CONTACT_TYPES, CONTACT_SCALES, TAG_CHIPS,
  type ContactFormData,
} from "@/types/crm";

interface ContactFormProps {
  defaultValues?: ContactFormData;
  onSubmit: (data: ContactFormData) => Promise<void>;
  isSubmitting?: boolean;
}

export function ContactForm({ defaultValues, onSubmit, isSubmitting }: ContactFormProps) {
  const router = useRouter();
  const [name, setName] = useState(defaultValues?.name ?? "");
  const [phone, setPhone] = useState(defaultValues?.phone ?? "");
  const [company, setCompany] = useState(defaultValues?.company ?? "");
  const [email, setEmail] = useState(defaultValues?.email ?? "");
  const [address, setAddress] = useState(defaultValues?.address ?? "");
  const [type, setType] = useState(defaultValues?.type ?? "");
  const [scale, setScale] = useState(defaultValues?.scale ?? "");
  const [currentSoftware, setCurrentSoftware] = useState(defaultValues?.currentSoftware ?? "");
  const [tags, setTags] = useState<string[]>(defaultValues?.tags ?? []);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) { setError("Nhập tên liên hệ"); return; }
    if (!phone.trim()) { setError("Nhập số điện thoại"); return; }
    try {
      await onSubmit({
        name: name.trim(), phone: phone.trim(),
        company: company.trim() || undefined, email: email.trim() || undefined,
        address: address.trim() || undefined, type: type || undefined,
        scale: scale || undefined, currentSoftware: currentSoftware.trim() || undefined, tags,
      });
    } catch { setError("Lỗi xảy ra"); }
  };

  const toggleTag = (tag: string) => setTags((p) => p.includes(tag) ? p.filter((t) => t !== tag) : [...p, tag]);

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
        THÔNG TIN LIÊN HỆ
      </div>

      <div>
        <div style={labelStyle}>TÊN LIÊN HỆ *</div>
        <input value={name} onChange={(e) => setName(e.target.value)}
          style={inputStyle} placeholder="Nguyễn Văn A" autoComplete="name" />
      </div>
      <div>
        <div style={labelStyle}>SỐ ĐIỆN THOẠI *</div>
        <input value={phone} onChange={(e) => setPhone(e.target.value)}
          style={inputStyle} placeholder="0901234567" inputMode="tel" type="tel" />
      </div>
      <div>
        <div style={labelStyle}>TÊN QUÁN / CÔNG TY</div>
        <input value={company} onChange={(e) => setCompany(e.target.value)}
          style={inputStyle} placeholder="Nhà hàng Hương Việt" />
      </div>
      <div>
        <div style={labelStyle}>EMAIL</div>
        <input value={email} onChange={(e) => setEmail(e.target.value)}
          style={inputStyle} placeholder="a@example.com" inputMode="email" />
      </div>
      <div>
        <div style={labelStyle}>ĐỊA CHỈ</div>
        <input value={address} onChange={(e) => setAddress(e.target.value)}
          style={inputStyle} placeholder="Địa chỉ quán" />
      </div>

      <div>
        <div style={labelStyle}>LOẠI HÌNH</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {CONTACT_TYPES.map((t) => (
            <button key={t} type="button" onClick={() => setType(type === t ? "" : t)}
              style={chipStyle(type === t)}>{t}</button>
          ))}
        </div>
      </div>

      <div>
        <div style={labelStyle}>QUY MÔ</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {CONTACT_SCALES.map((s) => (
            <button key={s} type="button" onClick={() => setScale(scale === s ? "" : s)}
              style={chipStyle(scale === s)}>{s}</button>
          ))}
        </div>
      </div>

      <div>
        <div style={labelStyle}>PHẦN MỀM HIỆN DÙNG</div>
        <input value={currentSoftware} onChange={(e) => setCurrentSoftware(e.target.value)}
          style={inputStyle} placeholder="KiotViet, MISA, Không dùng..." />
      </div>

      <div>
        <div style={labelStyle}>TAGS</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {TAG_CHIPS.map((tag) => (
            <div key={tag} onClick={() => toggleTag(tag)}
              style={{ cursor: "pointer", opacity: tags.includes(tag) ? 1 : 0.5 }}>
              <TagChip label={tag} onRemove={tags.includes(tag) ? () => toggleTag(tag) : undefined} />
            </div>
          ))}
        </div>
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
