"use client";

import { cardStyle, theme } from "./styles";
import { TagChip } from "./TagChip";
import type { CRMContact } from "@/types/crm";

interface ContactCardProps {
  contact: CRMContact;
  onClick: () => void;
}

export function ContactCard({ contact, onClick }: ContactCardProps) {
  return (
    <button
      onClick={onClick}
      style={{
        ...cardStyle,
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 14,
        cursor: "pointer",
        textAlign: "left",
        transition: "background 0.15s",
        minHeight: 56,
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <span
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "#e8edf5",
              fontFamily: theme.font,
            }}
          >
            {contact.name}
          </span>
          {contact.tags?.slice(0, 2).map((tag) => (
            <TagChip key={tag} label={tag} />
          ))}
        </div>
        <div
          style={{
            marginTop: 3,
            fontSize: 12,
            color: "#7a828e",
            display: "flex",
            gap: 8,
            fontWeight: 500,
          }}
        >
          {contact.company && <span>{contact.company}</span>}
          {contact.phone && <span>· {contact.phone}</span>}
        </div>
      </div>

      {contact.phone && (
        <a
          href={`tel:${contact.phone}`}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "rgba(34,197,94,0.12)",
            border: "1px solid rgba(34,197,94,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            color: "#4ade80",
            textDecoration: "none",
            flexShrink: 0,
            fontWeight: 700,
          }}
        >
          ☏
        </a>
      )}
    </button>
  );
}
