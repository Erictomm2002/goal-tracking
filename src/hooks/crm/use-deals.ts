"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchDeals,
  fetchDeal,
  fetchDealsByContact,
  insertDeal,
  updateDeal,
  updateDealStage,
  deleteDeal,
} from "@/lib/supabase/crm-queries";
import type { CRMDeal, DealFormData } from "@/types/crm";

const KEY = ["crm_deals"];

export function useDeals() {
  return useQuery<CRMDeal[]>({
    queryKey: KEY,
    queryFn: fetchDeals,
    staleTime: Infinity,
  });
}

export function useDealsByContact(contactId: string) {
  return useQuery<CRMDeal[]>({
    queryKey: [...KEY, "contact", contactId],
    queryFn: () => fetchDealsByContact(contactId),
    staleTime: Infinity,
  });
}

export function useDeal(id: string) {
  return useQuery<CRMDeal | null>({
    queryKey: [...KEY, id],
    queryFn: () => fetchDeal(id),
    staleTime: Infinity,
  });
}

export function useCreateDeal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: insertDeal,
    onSettled: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useUpdateDeal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<DealFormData>;
    }) => updateDeal(id, data),
    onSettled: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useUpdateDealStage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, stage }: { id: string; stage: string }) =>
      updateDealStage(id, stage),
    onSettled: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useDeleteDeal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteDeal,
    onSettled: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}
