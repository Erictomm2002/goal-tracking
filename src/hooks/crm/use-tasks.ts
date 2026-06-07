"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchTasks,
  fetchTasksByContact,
  fetchTasksByDeal,
  insertTask,
  completeTask,
  uncompleteTask,
  updateTask,
  deleteTask,
} from "@/lib/supabase/crm-queries";
import type { CRMTask, TaskFormData } from "@/types/crm";

const KEY = ["crm_tasks"];

export function useTasks(filter?: "today" | "upcoming" | "done") {
  return useQuery<CRMTask[]>({
    queryKey: [...KEY, filter ?? "all"],
    queryFn: () => fetchTasks(filter),
    staleTime: Infinity,
  });
}

export function useTasksByContact(contactId: string) {
  return useQuery<CRMTask[]>({
    queryKey: [...KEY, "contact", contactId],
    queryFn: () => fetchTasksByContact(contactId),
    staleTime: Infinity,
  });
}

export function useTasksByDeal(dealId: string) {
  return useQuery<CRMTask[]>({
    queryKey: [...KEY, "deal", dealId],
    queryFn: () => fetchTasksByDeal(dealId),
    staleTime: Infinity,
  });
}

export function useCreateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: insertTask,
    onSettled: () => {
      qc.invalidateQueries({ queryKey: KEY });
      qc.invalidateQueries({ queryKey: ["crm_dashboard"] });
    },
  });
}

export function useCompleteTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: completeTask,
    onSettled: () => {
      qc.invalidateQueries({ queryKey: KEY });
      qc.invalidateQueries({ queryKey: ["crm_dashboard"] });
    },
  });
}

export function useUncompleteTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: uncompleteTask,
    onSettled: () => {
      qc.invalidateQueries({ queryKey: KEY });
      qc.invalidateQueries({ queryKey: ["crm_dashboard"] });
    },
  });
}

export function useUpdateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<TaskFormData>;
    }) => updateTask(id, data),
    onSettled: () => {
      qc.invalidateQueries({ queryKey: KEY });
      qc.invalidateQueries({ queryKey: ["crm_dashboard"] });
    },
  });
}

export function useDeleteTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteTask,
    onSettled: () => {
      qc.invalidateQueries({ queryKey: KEY });
      qc.invalidateQueries({ queryKey: ["crm_dashboard"] });
    },
  });
}
