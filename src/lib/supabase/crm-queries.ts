import { supabase } from "./client";
import type {
  CRMContact,
  CRMDeal,
  CRMTask,
  CRMNote,
  ContactFormData,
  DealFormData,
  TaskFormData,
  NoteFormData,
  TodayDashboard,
} from "@/types/crm";

function mapContact(d: Record<string, unknown>): CRMContact {
  return {
    id: d.id as string,
    name: d.name as string,
    company: (d.company as string) ?? null,
    phone: (d.phone as string) ?? null,
    email: (d.email as string) ?? null,
    address: (d.address as string) ?? null,
    type: (d.type as string) ?? null,
    scale: (d.scale as string) ?? null,
    currentSoftware: (d.current_software as string) ?? null,
    tags: (d.tags as string[]) ?? [],
    createdAt: d.created_at as string,
    updatedAt: d.updated_at as string,
  };
}

function mapDeal(d: Record<string, unknown>): CRMDeal {
  return {
    id: d.id as string,
    contactId: d.contact_id as string,
    title: d.title as string,
    value: d.value ? Number(d.value) : null,
    stage: d.stage as string,
    package: (d.package as string) ?? null,
    probability: d.probability ? Number(d.probability) : null,
    expectedCloseDate: (d.expected_close_date as string) ?? null,
    lostReason: (d.lost_reason as string) ?? null,
    createdAt: d.created_at as string,
    updatedAt: d.updated_at as string,
  };
}

function mapTask(d: Record<string, unknown>): CRMTask {
  return {
    id: d.id as string,
    contactId: (d.contact_id as string) ?? null,
    dealId: (d.deal_id as string) ?? null,
    title: d.title as string,
    type: d.type as string,
    priority: d.priority as string,
    dueDate: (d.due_date as string) ?? null,
    dueTime: (d.due_time as string) ?? null,
    completed: d.completed as boolean,
    completedAt: (d.completed_at as string) ?? null,
    createdAt: d.created_at as string,
  };
}

function mapNote(d: Record<string, unknown>): CRMNote {
  return {
    id: d.id as string,
    contactId: (d.contact_id as string) ?? null,
    dealId: (d.deal_id as string) ?? null,
    content: d.content as string,
    createdAt: d.created_at as string,
  };
}

/* ── Contacts ── */

export async function fetchContacts(query?: string): Promise<CRMContact[]> {
  let q = supabase
    .from("crm_contacts")
    .select("*")
    .order("updated_at", { ascending: false });

  if (query) {
    q = q.or(
      `name.ilike.%${query}%,company.ilike.%${query}%,phone.ilike.%${query}%`,
    );
  }

  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []).map(mapContact);
}

export async function fetchContact(id: string): Promise<CRMContact | null> {
  const { data, error } = await supabase
    .from("crm_contacts")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ? mapContact(data) : null;
}

export async function insertContact(data: ContactFormData): Promise<CRMContact> {
  const { data: result, error } = await supabase
    .from("crm_contacts")
    .insert({
      name: data.name,
      phone: data.phone,
      company: data.company ?? null,
      email: data.email ?? null,
      address: data.address ?? null,
      type: data.type ?? null,
      scale: data.scale ?? null,
      current_software: data.currentSoftware ?? null,
      tags: data.tags ?? [],
    })
    .select()
    .single();
  if (error) throw error;
  return mapContact(result);
}

export async function updateContact(
  id: string,
  data: Partial<ContactFormData>,
): Promise<void> {
  const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (data.name !== undefined) payload.name = data.name;
  if (data.phone !== undefined) payload.phone = data.phone;
  if (data.company !== undefined) payload.company = data.company ?? null;
  if (data.email !== undefined) payload.email = data.email ?? null;
  if (data.address !== undefined) payload.address = data.address ?? null;
  if (data.type !== undefined) payload.type = data.type ?? null;
  if (data.scale !== undefined) payload.scale = data.scale ?? null;
  if (data.currentSoftware !== undefined)
    payload.current_software = data.currentSoftware ?? null;
  if (data.tags !== undefined) payload.tags = data.tags ?? [];

  const { error } = await supabase
    .from("crm_contacts")
    .update(payload)
    .eq("id", id);
  if (error) throw error;
}

export async function deleteContact(id: string): Promise<void> {
  const { error } = await supabase.from("crm_contacts").delete().eq("id", id);
  if (error) throw error;
}

/* ── Deals ── */

export async function fetchDeals(): Promise<CRMDeal[]> {
  const { data, error } = await supabase
    .from("crm_deals")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapDeal);
}

export async function fetchDealsByContact(
  contactId: string,
): Promise<CRMDeal[]> {
  const { data, error } = await supabase
    .from("crm_deals")
    .select("*")
    .eq("contact_id", contactId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapDeal);
}

export async function fetchDeal(id: string): Promise<CRMDeal | null> {
  const { data, error } = await supabase
    .from("crm_deals")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ? mapDeal(data) : null;
}

export async function insertDeal(data: DealFormData): Promise<CRMDeal> {
  const { data: result, error } = await supabase
    .from("crm_deals")
    .insert({
      contact_id: data.contactId,
      title: data.title,
      value: data.value ?? null,
      stage: data.stage,
      package: data.package ?? null,
      probability: data.probability ?? null,
      expected_close_date: data.expectedCloseDate ?? null,
    })
    .select()
    .single();
  if (error) throw error;
  return mapDeal(result);
}

export async function updateDeal(
  id: string,
  data: Partial<DealFormData>,
): Promise<void> {
  const payload: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };
  if (data.title !== undefined) payload.title = data.title;
  if (data.value !== undefined) payload.value = data.value ?? null;
  if (data.stage !== undefined) payload.stage = data.stage;
  if (data.package !== undefined) payload.package = data.package ?? null;
  if (data.probability !== undefined)
    payload.probability = data.probability ?? null;
  if (data.expectedCloseDate !== undefined)
    payload.expected_close_date = data.expectedCloseDate ?? null;

  const { error } = await supabase
    .from("crm_deals")
    .update(payload)
    .eq("id", id);
  if (error) throw error;
}

export async function updateDealStage(
  id: string,
  stage: string,
): Promise<void> {
  const payload: Record<string, unknown> = {
    stage,
    updated_at: new Date().toISOString(),
  };
  if (stage === "Thua") {
    payload.probability = 0;
  }
  if (stage === "Thắng") {
    payload.probability = 100;
  }
  const { error } = await supabase
    .from("crm_deals")
    .update(payload)
    .eq("id", id);
  if (error) throw error;
}

export async function deleteDeal(id: string): Promise<void> {
  const { error } = await supabase.from("crm_deals").delete().eq("id", id);
  if (error) throw error;
}

/* ── Tasks ── */

export async function fetchTasks(
  filter?: "today" | "upcoming" | "done",
): Promise<CRMTask[]> {
  let q = supabase.from("crm_tasks").select("*");

  const today = new Date().toISOString().slice(0, 10);

  if (filter === "today") {
    q = q
      .eq("completed", false)
      .eq("due_date", today)
      .order("due_time", { ascending: true });
  } else if (filter === "upcoming") {
    q = q
      .eq("completed", false)
      .or(`due_date.gte.${today},due_date.is.null`)
      .order("due_date", { ascending: true });
  } else if (filter === "done") {
    q = q
      .eq("completed", true)
      .order("completed_at", { ascending: false });
  } else {
    q = q.order("created_at", { ascending: false });
  }

  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []).map(mapTask);
}

export async function fetchTasksByContact(
  contactId: string,
): Promise<CRMTask[]> {
  const { data, error } = await supabase
    .from("crm_tasks")
    .select("*")
    .eq("contact_id", contactId)
    .eq("completed", false)
    .order("due_date", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(mapTask);
}

export async function fetchTasksByDeal(dealId: string): Promise<CRMTask[]> {
  const { data, error } = await supabase
    .from("crm_tasks")
    .select("*")
    .eq("deal_id", dealId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapTask);
}

export async function insertTask(data: TaskFormData): Promise<CRMTask> {
  const { data: result, error } = await supabase
    .from("crm_tasks")
    .insert({
      title: data.title,
      type: data.type,
      contact_id: data.contactId ?? null,
      deal_id: data.dealId ?? null,
      due_date: data.dueDate ?? null,
      due_time: data.dueTime ?? null,
      priority: data.priority,
    })
    .select()
    .single();
  if (error) throw error;
  return mapTask(result);
}

export async function completeTask(id: string): Promise<void> {
  const { error } = await supabase
    .from("crm_tasks")
    .update({
      completed: true,
      completed_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) throw error;
}

export async function uncompleteTask(id: string): Promise<void> {
  const { error } = await supabase
    .from("crm_tasks")
    .update({
      completed: false,
      completed_at: null,
    })
    .eq("id", id);
  if (error) throw error;
}

export async function updateTask(
  id: string,
  data: Partial<TaskFormData>,
): Promise<void> {
  const payload: Record<string, unknown> = {};
  if (data.title !== undefined) payload.title = data.title;
  if (data.type !== undefined) payload.type = data.type;
  if (data.contactId !== undefined)
    payload.contact_id = data.contactId ?? null;
  if (data.dealId !== undefined) payload.deal_id = data.dealId ?? null;
  if (data.dueDate !== undefined) payload.due_date = data.dueDate ?? null;
  if (data.dueTime !== undefined) payload.due_time = data.dueTime ?? null;
  if (data.priority !== undefined) payload.priority = data.priority;

  const { error } = await supabase
    .from("crm_tasks")
    .update(payload)
    .eq("id", id);
  if (error) throw error;
}

export async function deleteTask(id: string): Promise<void> {
  const { error } = await supabase.from("crm_tasks").delete().eq("id", id);
  if (error) throw error;
}

/* ── Notes ── */

export async function fetchNotesByContact(
  contactId: string,
): Promise<CRMNote[]> {
  const { data, error } = await supabase
    .from("crm_notes")
    .select("*")
    .eq("contact_id", contactId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapNote);
}

export async function fetchNotesByDeal(dealId: string): Promise<CRMNote[]> {
  const { data, error } = await supabase
    .from("crm_notes")
    .select("*")
    .eq("deal_id", dealId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapNote);
}

export async function insertNote(data: NoteFormData): Promise<CRMNote> {
  const { data: result, error } = await supabase
    .from("crm_notes")
    .insert({
      contact_id: data.contactId ?? null,
      deal_id: data.dealId ?? null,
      content: data.content,
    })
    .select()
    .single();
  if (error) throw error;
  return mapNote(result);
}

export async function updateNote(
  id: string,
  content: string,
): Promise<void> {
  const { error } = await supabase
    .from("crm_notes")
    .update({ content })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteNote(id: string): Promise<void> {
  const { error } = await supabase.from("crm_notes").delete().eq("id", id);
  if (error) throw error;
}

/* ── Dashboard ── */

export async function fetchTodayDashboard(): Promise<TodayDashboard> {
  const today = new Date().toISOString().slice(0, 10);
  const threeDaysFromNow = new Date(Date.now() + 3 * 86400000)
    .toISOString()
    .slice(0, 10);

  const [tasksRes, dealsRes, contactsRes, statsRes] = await Promise.all([
    supabase
      .from("crm_tasks")
      .select("*")
      .eq("completed", false)
      .eq("due_date", today)
      .order("due_time", { ascending: true }),
    supabase
      .from("crm_deals")
      .select("*")
      .not("stage", "in", `("Thắng","Thua")`)
      .or(
        `expected_close_date.lte.${threeDaysFromNow},id.gt.00000000-0000-0000-0000-000000000000`,
      )
      .order("expected_close_date", { ascending: true }),
    supabase
      .from("crm_contacts")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(3),
    supabase
      .from("crm_deals")
      .select("id,value,stage", { count: "exact", head: false })
      .not("stage", "in", `("Thắng","Thua")`),
  ]);

  const todayTasks = (tasksRes.data ?? []).map(mapTask);
  const urgentDeals = (dealsRes.data ?? []).map(mapDeal);
  const recentContacts = (contactsRes.data ?? []).map(mapContact);

  const openDeals = statsRes.data ?? [];
  const totalValue = openDeals.reduce(
    (sum, d) => sum + (Number(d.value) || 0),
    0,
  );

  return {
    todayTasks,
    urgentDeals,
    recentContacts,
    pipelineStats: {
      openDeals: openDeals.length,
      totalValue,
      todayTasksCount: todayTasks.length,
    },
  };
}
