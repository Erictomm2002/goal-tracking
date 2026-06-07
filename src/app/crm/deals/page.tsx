"use client";

import { useRouter } from "next/navigation";
import { useDeals } from "@/hooks/crm/use-deals";
import { useContacts } from "@/hooks/crm/use-contacts";
import { DealKanban } from "@/components/crm/DealKanban";
import { EmptyState } from "@/components/crm/EmptyState";
import { pageTitle, theme } from "@/components/crm/styles";
import type { CRMContact } from "@/types/crm";

export default function DealsPage() {
  const router = useRouter();
  const { data: deals, isLoading } = useDeals();
  const { data: contacts } = useContacts();
  const contactsMap = new Map<string, CRMContact>();
  contacts?.forEach((c) => contactsMap.set(c.id, c));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <div style={pageTitle}>PIPELINE</div>
          <div style={{ fontSize: 13, color: "#7a828e", marginTop: 4, fontWeight: 500 }}>
            {deals?.length ?? 0} deals
          </div>
        </div>
        <button onClick={() => router.push("/crm/deals/new")}
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

      {isLoading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ height: 100, borderRadius: 16, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }} />
          ))}
        </div>
      ) : deals && deals.length > 0 ? (
        <DealKanban deals={deals} contacts={contactsMap}
          onDealClick={(deal) => router.push(`/crm/deals/${deal.id}`)} />
      ) : (
        <EmptyState title="Chưa có deal nào" description="Thêm deal đầu tiên vào pipeline"
          actionLabel="Thêm deal" onAction={() => router.push("/crm/deals/new")} />
      )}
    </div>
  );
}
