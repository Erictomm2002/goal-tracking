"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchContacts,
  fetchContact,
  insertContact,
  updateContact,
  deleteContact,
} from "@/lib/supabase/crm-queries";
import type { CRMContact, ContactFormData } from "@/types/crm";

const KEY = ["crm_contacts"];

export function useContacts(query?: string) {
  return useQuery<CRMContact[]>({
    queryKey: [...KEY, query ?? ""],
    queryFn: () => fetchContacts(query),
    staleTime: Infinity,
  });
}

export function useContact(id: string) {
  return useQuery<CRMContact | null>({
    queryKey: [...KEY, id],
    queryFn: () => fetchContact(id),
    staleTime: Infinity,
  });
}

export function useCreateContact() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: insertContact,
    onSettled: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useUpdateContact() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ContactFormData> }) =>
      updateContact(id, data),
    onSettled: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useDeleteContact() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteContact,
    onSettled: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}
