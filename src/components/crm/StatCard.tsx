import { cardStyle } from "./styles";

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
}

export function StatCard({ label, value, sub }: StatCardProps) {
  return (
    <div
      style={{
        ...cardStyle,
        flex: 1,
        display: "flex",
        flexDirection: "column",
        padding: "14px 16px",
      }}
    >
      <span
        style={{
          fontSize: 12,
          letterSpacing: 2,
          color: "#7a828e",
          fontWeight: 700,
        }}
      >
        {label.toUpperCase()}
      </span>
      <span
        style={{
          marginTop: 4,
          fontSize: 30,
          fontWeight: 900,
          color: "#F97316",
          fontFamily: "'Courier New', monospace",
        }}
      >
        {value}
      </span>
      {sub && (
        <span
          style={{
            marginTop: 2,
            fontSize: 13,
            color: "#7a828e",
            fontWeight: 600,
          }}
        >
          {sub}
        </span>
      )}
    </div>
  );
}
