"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useContacts } from "@/hooks/crm/use-contacts";
import { useCreateDeal } from "@/hooks/crm/use-deals";
import { DealForm } from "@/components/crm/DealForm";
import { pageTitle } from "@/components/crm/styles";
import type { DealFormData } from "@/types/crm";

function NewDealForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: contacts } = useContacts();
  const createDeal = useCreateDeal();

  return (
    <DealForm contacts={contacts ?? []}
      defaultValues={{
        contactId: searchParams.get("contactId") ?? undefined,
        title: searchParams.get("title") ?? undefined,
      }}
      onSubmit={async (data: DealFormData) => { await createDeal.mutateAsync(data); router.push("/crm/deals"); }}
      isSubmitting={createDeal.isPending} />
  );
}

export default function NewDealPage() {
  return (
    <div>
      <div style={{ ...pageTitle, marginBottom: 20 }}>THÊM DEAL</div>
      <Suspense fallback={<div style={{ height: 240, borderRadius: 16, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }} />}>
        <NewDealForm />
      </Suspense>
    </div>
  );
}
