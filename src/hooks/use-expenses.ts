import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchExpenses,
  insertExpense,
  deleteExpense,
} from "@/lib/supabase/finance-queries";
import type { Expense } from "@/types/finance";

const KEY = ["expenses"];

export function useExpenses() {
  const qc = useQueryClient();

  const { data, isLoading } = useQuery<Expense[]>({
    queryKey: KEY,
    queryFn: fetchExpenses,
    staleTime: Infinity,
  });

  const addMutation = useMutation({
    mutationFn: insertExpense,
    onSettled: () => qc.invalidateQueries({ queryKey: KEY }),
    onError: (err) => alert("Lỗi: " + (err as Error).message),
  });

  const removeMutation = useMutation({
    mutationFn: deleteExpense,
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: KEY });
      const prev = qc.getQueryData<Expense[]>(KEY);
      if (prev) {
        qc.setQueryData(KEY, prev.filter((e) => e.id !== id));
      }
    },
    onSettled: () => qc.invalidateQueries({ queryKey: KEY }),
    onError: (err) => alert("Lỗi: " + (err as Error).message),
  });

  return {
    expenses: data ?? [],
    isLoading,
    addExpense: addMutation.mutate,
    removeExpense: removeMutation.mutate,
  };
}
