import { supabase } from "./client";
import type { Reward, CheckInLog } from "@/types/habit";

export async function fetchReward(): Promise<Reward | null> {
  const { data } = await supabase
    .from("rewards")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  if (!data) return null;

  return {
    name: data.name,
    price: Number(data.price),
    deadline: data.deadline,
    image: data.image ?? undefined,
    habits: data.habits as Reward["habits"],
  };
}

export async function upsertReward(reward: Reward): Promise<void> {
  await supabase.from("rewards").upsert({
    id: 1,
    name: reward.name,
    price: reward.price,
    deadline: reward.deadline,
    image: reward.image ?? null,
    habits: reward.habits,
  });
}

export async function removeReward(): Promise<void> {
  await supabase.from("rewards").delete().eq("id", 1);
}

export async function fetchLogs(): Promise<CheckInLog[]> {
  const { data } = await supabase
    .from("check_in_logs")
    .select("*")
    .order("date", { ascending: true });

  if (!data) return [];

  return data.map((d) => ({
    date: d.date,
    checks: d.checks as Record<string, boolean>,
    saving: Number(d.saving),
    note: d.note,
    donePct: Number(d.done_pct),
  }));
}

export async function upsertLog(log: CheckInLog): Promise<void> {
  await supabase.from("check_in_logs").upsert(
    {
      date: log.date,
      checks: log.checks,
      saving: log.saving,
      note: log.note,
      done_pct: log.donePct,
    },
    { onConflict: "date" },
  );
}

export async function clearAllLogs(): Promise<void> {
  await supabase.from("check_in_logs").delete().neq("date", "");
}
