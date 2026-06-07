"use client";

import { useRouter } from "next/navigation";
import { ContactForm } from "@/components/crm/ContactForm";
import { useCreateContact } from "@/hooks/crm/use-contacts";
import { pageTitle } from "@/components/crm/styles";

export default function NewContactPage() {
  const router = useRouter();
  const createContact = useCreateContact();

  return (
    <div>
      <div style={{ ...pageTitle, marginBottom: 20 }}>THÊM LIÊN HỆ</div>
      <ContactForm
        onSubmit={async (data) => { await createContact.mutateAsync(data); router.push("/crm/contacts"); }}
        isSubmitting={createContact.isPending} />
    </div>
  );
}
