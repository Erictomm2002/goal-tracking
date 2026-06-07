"use client";

import { AppSwitcher } from "@/components/shared/AppSwitcher";

export default function HabitsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#070b14",
        fontFamily: "'Courier New', Courier, monospace",
      }}
    >
      <AppSwitcher />
      {children}
    </div>
  );
}
