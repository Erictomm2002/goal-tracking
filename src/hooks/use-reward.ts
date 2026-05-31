import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchReward, upsertReward, removeReward } from "@/lib/supabase/queries";
import type { Reward } from "@/types/habit";

const KEY = ["reward"];

export function useReward() {
  const qc = useQueryClient();

  const { data, isLoading } = useQuery<Reward | null>({
    queryKey: KEY,
    queryFn: fetchReward,
    staleTime: Infinity,
  });

  const saveMutation = useMutation({
    mutationFn: upsertReward,
    onMutate: async (newReward) => {
      await qc.cancelQueries({ queryKey: KEY });
      qc.setQueryData(KEY, newReward);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: KEY }),
  });

  const removeMutation = useMutation({
    mutationFn: removeReward,
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: KEY });
      qc.setQueryData(KEY, null);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: KEY }),
  });

  return {
    reward: data ?? null,
    isLoading,
    saveReward: saveMutation.mutate,
    deleteReward: removeMutation.mutate,
  };
}
