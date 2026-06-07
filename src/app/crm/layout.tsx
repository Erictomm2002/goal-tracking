"use client";

import { usePathname, useRouter } from "next/navigation";
import { AppSwitcher } from "@/components/shared/AppSwitcher";

const NAV_ITEMS = [
  { href: "/crm/today", label: "Hôm nay" },
  { href: "/crm/contacts", label: "Liên hệ" },
  { href: "/crm/deals", label: "Deals" },
  { href: "/crm/tasks", label: "Việc cần" },
];

export default function CRMLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#070b14",
        fontFamily: "'Courier New', Courier, monospace",
        paddingBottom: 32,
      }}
    >
      <AppSwitcher />

      {/* Header */}
      <div
        style={{
          padding: "20px 16px 0",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            fontSize: 20,
            letterSpacing: 5,
            color: "#F97316",
            fontWeight: 900,
            marginBottom: 2,
          }}
        >
          CRM · IPOS SALES
        </div>
        <div
          style={{
            fontSize: 12,
            color: "#7a828e",
            marginBottom: 14,
            fontWeight: 500,
          }}
        >
          Quản lý khách hàng bán hàng
        </div>

        {/* Top nav */}
        <div style={{ display: "flex", gap: 4, paddingBottom: 10 }}>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                style={{
                  flex: 1,
                  padding: "10px 4px",
                  borderRadius: 10,
                  background: isActive
                    ? "rgba(249,115,22,0.15)"
                    : "transparent",
                  border: isActive
                    ? "1px solid rgba(249,115,22,0.35)"
                    : "1px solid transparent",
                  color: isActive ? "#F97316" : "#7a828e",
                  fontSize: 12,
                  fontWeight: isActive ? 800 : 600,
                  fontFamily: "'Courier New', Courier, monospace",
                  cursor: "pointer",
                  letterSpacing: 0.5,
                  transition: "all 0.15s",
                }}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "16px 16px" }}>{children}</div>
    </div>
  );
}
