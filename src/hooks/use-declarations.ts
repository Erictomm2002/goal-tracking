import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import {
  fetchDeclarations,
  upsertDeclaration,
} from "@/lib/supabase/finance-queries";
import type { FinanceDeclaration } from "@/types/finance";

const KEY = ["finance_declarations"];

export function useDeclarations() {
  const qc = useQueryClient();

  const { data, isLoading } = useQuery<FinanceDeclaration[]>({
    queryKey: KEY,
    queryFn: fetchDeclarations,
    staleTime: Infinity,
  });

  const latest = useMemo(() => {
    if (!data || data.length === 0) return null;
    return data.reduce((a, b) =>
      a.date > b.date || (a.date === b.date && a.id > b.id) ? a : b,
    );
  }, [data]);

  const addMutation = useMutation({
    mutationFn: upsertDeclaration,
    onSettled: () => qc.invalidateQueries({ queryKey: KEY }),
    onError: (err) => alert("Lỗi: " + (err as Error).message),
  });

  return {
    declarations: data ?? [],
    latest,
    isLoading,
    declare: addMutation.mutate,
  };
}
