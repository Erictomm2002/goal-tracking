"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchTodayDashboard } from "@/lib/supabase/crm-queries";
import type { TodayDashboard } from "@/types/crm";

export function useDashboard() {
  return useQuery<TodayDashboard>({
    queryKey: ["crm_dashboard"],
    queryFn: fetchTodayDashboard,
    staleTime: Infinity,
  });
}
