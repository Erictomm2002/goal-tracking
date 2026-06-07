import { tagColors } from "./styles";

interface TagChipProps {
  label: string;
  onRemove?: () => void;
}

export function TagChip({ label, onRemove }: TagChipProps) {
  const colors = tagColors[label] ?? {
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "#b0b8c4",
  };

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "3px 10px",
        borderRadius: 6,
        fontSize: 11,
        fontFamily: "'Courier New', Courier, monospace",
        fontWeight: 600,
        letterSpacing: 0.5,
        ...colors,
      }}
    >
      {label}
      {onRemove && (
        <button
          onClick={onRemove}
          style={{
            background: "none",
            border: "none",
            color: "inherit",
            cursor: "pointer",
            fontSize: 14,
            padding: 0,
            lineHeight: 1,
            opacity: 0.7,
          }}
        >
          ×
        </button>
      )}
    </span>
  );
}
