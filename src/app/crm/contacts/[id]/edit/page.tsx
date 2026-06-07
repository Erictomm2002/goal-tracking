"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useContact, useUpdateContact } from "@/hooks/crm/use-contacts";
import { ContactForm } from "@/components/crm/ContactForm";
import { pageTitle } from "@/components/crm/styles";
import type { ContactFormData } from "@/types/crm";

export default function EditContactPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: contact, isLoading } = useContact(id);
  const updateContact = useUpdateContact();
  const [defaults, setDefaults] = useState<ContactFormData | undefined>();

  useEffect(() => {
    if (contact) {
      setDefaults({
        name: contact.name, phone: contact.phone ?? "",
        company: contact.company ?? "", email: contact.email ?? "",
        address: contact.address ?? "", type: contact.type ?? "",
        scale: contact.scale ?? "", currentSoftware: contact.currentSoftware ?? "",
        tags: contact.tags ?? [],
      });
    }
  }, [contact]);

  if (isLoading) return <div style={{ height: 40, borderRadius: 8, background: "rgba(255,255,255,0.03)" }} />;
  if (!contact) return <div style={{ fontSize: 13, color: "#7a828e", textAlign: "center", padding: 24, fontWeight: 500 }}>Không tìm thấy</div>;

  return (
    <div>
      <div style={{ ...pageTitle, marginBottom: 20 }}>SỬA LIÊN HỆ</div>
      <ContactForm defaultValues={defaults}
        onSubmit={async (data) => { await updateContact.mutateAsync({ id, data }); router.push(`/crm/contacts/${id}`); }}
        isSubmitting={updateContact.isPending} />
    </div>
  );
}
