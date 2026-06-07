"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useContacts } from "@/hooks/crm/use-contacts";
import { ContactCard } from "@/components/crm/ContactCard";
import { EmptyState } from "@/components/crm/EmptyState";
import { pageTitle, theme } from "@/components/crm/styles";

const TAG_FILTERS = [
  { label: "TẤT CẢ", value: "" },
  { label: "PROSPECT", value: "prospect" },
  { label: "WARM", value: "warm" },
  { label: "PARTNER", value: "partner" },
];

export default function ContactsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const { data: contacts, isLoading } = useContacts(search);
  const filtered = tagFilter ? (contacts ?? []).filter((c) => c.tags?.includes(tagFilter)) : contacts ?? [];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={pageTitle}>DANH SÁCH</div>
          <div style={{ fontSize: 13, color: "#7a828e", marginTop: 4, fontWeight: 500 }}>
            {contacts?.length ?? 0} liên hệ
          </div>
        </div>
        <button onClick={() => router.push("/crm/contacts/new")}
          style={{
            width: 42, height: 42, borderRadius: "50%",
            background: theme.accentGradient, border: "none",
            color: "#fff", fontSize: 22, cursor: "pointer", fontWeight: 700,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 2px 16px rgba(249,115,22,0.35)",
          }}>
          +
        </button>
      </div>

      <div style={{ marginTop: 16, position: "relative" }}>
        <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: "#7a828e" }}>🔍</span>
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%", padding: "12px 14px 12px 40px",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 12, color: "#e8edf5", fontSize: 14,
            fontFamily: theme.font, fontWeight: 500, outline: "none",
          }}
          placeholder="Tìm tên, công ty, SĐT..." />
      </div>

      <div style={{ display: "flex", gap: 6, marginTop: 12, overflowX: "auto" }}>
        {TAG_FILTERS.map((f) => (
          <button key={f.label} onClick={() => setTagFilter(f.value)}
            style={{
              padding: "6px 14px", borderRadius: 8, whiteSpace: "nowrap",
              background: tagFilter === f.value ? theme.accentDim : "rgba(255,255,255,0.04)",
              border: tagFilter === f.value ? theme.accentBorder : "1px solid rgba(255,255,255,0.08)",
              color: tagFilter === f.value ? theme.accent : "#7a828e",
              fontSize: 12, fontFamily: theme.font,
              fontWeight: tagFilter === f.value ? 800 : 600, cursor: "pointer",
            }}>
            {f.label}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 16 }}>
        {isLoading ? (
          [1, 2, 3, 4].map((i) => (
            <div key={i} style={{ height: 64, borderRadius: 16, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }} />
          ))
        ) : filtered.length === 0 ? (
          <EmptyState title={search ? "Không tìm thấy" : "Chưa có liên hệ"}
            description={search ? "Thử từ khoá khác" : "Thêm liên hệ đầu tiên"}
            actionLabel={!search ? "Thêm liên hệ" : undefined}
            onAction={!search ? () => router.push("/crm/contacts/new") : undefined} />
        ) : (
          filtered.map((contact) => (
            <ContactCard key={contact.id} contact={contact}
              onClick={() => router.push(`/crm/contacts/${contact.id}`)} />
          ))
        )}
      </div>
    </div>
  );
}
