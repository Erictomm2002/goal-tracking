import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchCategories,
  upsertCategory,
  removeCategory,
} from "@/lib/supabase/finance-queries";
import type { ExpenseCategory } from "@/types/finance";

const KEY = ["expense_categories"];

export function useCategories() {
  const qc = useQueryClient();

  const { data, isLoading } = useQuery<ExpenseCategory[]>({
    queryKey: KEY,
    queryFn: fetchCategories,
    staleTime: Infinity,
  });

  const saveMutation = useMutation({
    mutationFn: upsertCategory,
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: KEY });
    },
    onSettled: () => qc.invalidateQueries({ queryKey: KEY }),
    onError: (err) => alert("Lỗi: " + (err as Error).message),
  });

  const removeMutation = useMutation({
    mutationFn: removeCategory,
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: KEY });
    },
    onSettled: () => qc.invalidateQueries({ queryKey: KEY }),
    onError: (err) => alert("Lỗi: " + (err as Error).message),
  });

  return {
    categories: data ?? [],
    isLoading,
    saveCategory: saveMutation.mutate,
    removeCategory: removeMutation.mutate,
  };
}
