import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import {
  fetchSavingsSpends,
  insertSavingsSpend,
} from "@/lib/supabase/finance-queries";
import { useLogs } from "./use-logs";
import type { SavingsSpend } from "@/types/finance";

const KEY = ["savings_spends"];

export function useSavings() {
  const qc = useQueryClient();
  const { logs } = useLogs();

  const { data: spends, isLoading } = useQuery<SavingsSpend[]>({
    queryKey: KEY,
    queryFn: fetchSavingsSpends,
    staleTime: Infinity,
  });

  const totalSaved = useMemo(
    () => logs.reduce((a, l) => a + (l.saving || 0), 0),
    [logs],
  );

  const totalSpent = useMemo(
    () => (spends ?? []).reduce((a, s) => a + s.amount, 0),
    [spends],
  );

  const netSavings = totalSaved - totalSpent;

  const addSpending = useMutation({
    mutationFn: insertSavingsSpend,
    onSettled: () => qc.invalidateQueries({ queryKey: KEY }),
    onError: (err) => alert("Lỗi: " + (err as Error).message),
  });

  return {
    spends: spends ?? [],
    isLoading,
    totalSaved,
    totalSpent,
    netSavings,
    addSpending: addSpending.mutate,
  };
}
