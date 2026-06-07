interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 20px",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 28, letterSpacing: 2, color: "rgba(255,255,255,0.06)", marginBottom: 8, fontWeight: 800 }}>
        ⬡
      </div>
      <div
        style={{
          fontSize: 15,
          color: "#b0b8c4",
          fontWeight: 700,
          lineHeight: 1.5,
        }}
      >
        {title}
      </div>
      {description && (
        <div
          style={{
            marginTop: 6,
            fontSize: 13,
            color: "#7a828e",
            lineHeight: 1.5,
            fontWeight: 500,
          }}
        >
          {description}
        </div>
      )}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          style={{
            marginTop: 20,
            background: "linear-gradient(90deg,#ea580c,#F97316)",
            border: "none",
            borderRadius: 12,
            padding: "12px 24px",
            color: "#fff",
            fontWeight: 800,
            fontSize: 13,
            fontFamily: "'Courier New', Courier, monospace",
            cursor: "pointer",
            letterSpacing: 1.5,
          }}
        >
          + {actionLabel.toUpperCase()}
        </button>
      )}
    </div>
  );
}
