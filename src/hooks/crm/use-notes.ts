"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchNotesByContact,
  fetchNotesByDeal,
  insertNote,
  updateNote,
  deleteNote,
} from "@/lib/supabase/crm-queries";
import type { CRMNote } from "@/types/crm";

const KEY = ["crm_notes"];

export function useNotesByContact(contactId: string) {
  return useQuery<CRMNote[]>({
    queryKey: [...KEY, "contact", contactId],
    queryFn: () => fetchNotesByContact(contactId),
    staleTime: Infinity,
  });
}

export function useNotesByDeal(dealId: string) {
  return useQuery<CRMNote[]>({
    queryKey: [...KEY, "deal", dealId],
    queryFn: () => fetchNotesByDeal(dealId),
    staleTime: Infinity,
  });
}

export function useCreateNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: insertNote,
    onSettled: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useUpdateNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, content }: { id: string; content: string }) =>
      updateNote(id, content),
    onSettled: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useDeleteNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteNote,
    onSettled: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}
