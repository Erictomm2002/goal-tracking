import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchLogs, upsertLog, clearAllLogs } from "@/lib/supabase/queries";
import type { CheckInLog } from "@/types/habit";

const KEY = ["logs"];

export function useLogs() {
  const qc = useQueryClient();

  const { data, isLoading } = useQuery<CheckInLog[]>({
    queryKey: KEY,
    queryFn: fetchLogs,
    staleTime: Infinity,
  });

  const addMutation = useMutation({
    mutationFn: upsertLog,
    onMutate: async (newLog) => {
      await qc.cancelQueries({ queryKey: KEY });
      const prev = qc.getQueryData<CheckInLog[]>(KEY) ?? [];
      const idx = prev.findIndex((l) => l.date === newLog.date);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = newLog;
        qc.setQueryData(KEY, next);
      } else {
        qc.setQueryData(KEY, [...prev, newLog]);
      }
    },
    onSettled: () => qc.invalidateQueries({ queryKey: KEY }),
  });

  const clearMutation = useMutation({
    mutationFn: clearAllLogs,
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: KEY });
      qc.setQueryData(KEY, []);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: KEY }),
  });

  return {
    logs: data ?? [],
    isLoading,
    addLog: addMutation.mutate,
    clearLogs: clearMutation.mutate,
  };
}
