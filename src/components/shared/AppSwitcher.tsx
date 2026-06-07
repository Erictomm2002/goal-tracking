"use client";

import { usePathname, useRouter } from "next/navigation";

const APPS = [
  { href: "/habits", label: "CÁ NHÂN", icon: "◈" },
  { href: "/crm", label: "CRM", icon: "◆" },
];

export function AppSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  const current = pathname.startsWith("/crm") ? "CRM" : "CÁ NHÂN";

  return (
    <div
      style={{
        display: "flex",
        gap: 4,
        padding: "6px 16px",
        background: "rgba(255,255,255,0.02)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      {APPS.map((app) => {
        const isActive = app.label === current;
        return (
          <button
            key={app.label}
            onClick={() => router.push(app.href)}
            style={{
              flex: 1,
              padding: "8px 0",
              borderRadius: 8,
              background: isActive
                ? "rgba(249,115,22,0.12)"
                : "transparent",
              border: isActive
                ? "1px solid rgba(249,115,22,0.3)"
                : "1px solid transparent",
              color: isActive ? "#F97316" : "#7a828e",
              fontSize: 11,
              fontWeight: isActive ? 800 : 600,
              fontFamily: "'Courier New', Courier, monospace",
              cursor: "pointer",
              letterSpacing: 1.5,
              transition: "all 0.15s",
            }}
          >
            {app.icon} {app.label}
          </button>
        );
      })}
    </div>
  );
}
