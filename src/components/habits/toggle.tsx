"use client";

export function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} style={{
      width: 48, height: 26, borderRadius: 13, border: "none", cursor: "pointer",
      background: on ? "#F97316" : "rgba(255,255,255,0.1)",
      position: "relative", transition: "background 0.22s", flexShrink: 0,
    }}>
      <div style={{
        position: "absolute", top: 3, left: on ? 25 : 3,
        width: 20, height: 20, borderRadius: "50%", background: "#fff",
        transition: "left 0.22s cubic-bezier(.4,0,.2,1)",
        boxShadow: "0 1px 4px rgba(0,0,0,0.4)",
      }} />
    </button>
  );
}
