"use client";

import { useState, useMemo } from "react";
import { useTasks, useCreateTask, useCompleteTask, useUncompleteTask } from "@/hooks/crm/use-tasks";
import { useContacts } from "@/hooks/crm/use-contacts";
import { useDeals } from "@/hooks/crm/use-deals";
import { TaskItem } from "@/components/crm/TaskItem";
import { TaskForm } from "@/components/crm/TaskForm";
import { EmptyState } from "@/components/crm/EmptyState";
import { pageTitle, sectionTitle, theme } from "@/components/crm/styles";
import type { CRMTask, CRMContact, CRMDeal, TaskFormData } from "@/types/crm";

type Tab = "today" | "upcoming" | "done";
const TABS: { key: Tab; label: string }[] = [
  { key: "today", label: "HÔM NAY" },
  { key: "upcoming", label: "SẮP TỚI" },
  { key: "done", label: "ĐÃ XONG" },
];

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const today = new Date();
  const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
  const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
  const dayNames = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
  if (d.toDateString() === today.toDateString()) return "HÔM NAY";
  if (d.toDateString() === tomorrow.toDateString()) return "NGÀY MAI";
  if (d.toDateString() === yesterday.toDateString()) return "HÔM QUA";
  return `${dayNames[d.getDay()]}, ${d.getDate()}/${d.getMonth() + 1}`;
}

function groupByDate(tasks: CRMTask[]): Map<string, CRMTask[]> {
  const groups = new Map<string, CRMTask[]>();
  const sorted = [...tasks].sort((a, b) => {
    const c = (a.dueDate ?? "9999-12-31").localeCompare(b.dueDate ?? "9999-12-31");
    if (c !== 0) return c;
    return (a.dueTime ?? "99:99").localeCompare(b.dueTime ?? "99:99");
  });
  for (const t of sorted) {
    const key = t.dueDate ?? "KHÔNG CÓ NGÀY";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(t);
  }
  return groups;
}

export default function TasksPage() {
  const [tab, setTab] = useState<Tab>("today");
  const [formOpen, setFormOpen] = useState(false);

  const { data: tasks, isLoading } = useTasks(tab);
  const { data: todayTasks } = useTasks("today");
  const { data: contacts } = useContacts();
  const { data: deals } = useDeals();
  const createTask = useCreateTask();
  const completeTask = useCompleteTask();
  const uncompleteTask = useUncompleteTask();

  const contactsMap = useMemo(() => new Map(contacts?.map((c: CRMContact) => [c.id, c]) ?? []), [contacts]);
  const dealsMap = useMemo(() => new Map(deals?.map((d: CRMDeal) => [d.id, d]) ?? []), [deals]);
  const dealsByContact = useMemo(() => {
    const m = new Map<string, CRMDeal[]>();
    for (const d of deals ?? []) { if (!m.has(d.contactId)) m.set(d.contactId, []); m.get(d.contactId)!.push(d); }
    return m;
  }, [deals]);

  const grouped = useMemo(() => (tab === "today" || tab === "upcoming") ? groupByDate(tasks ?? []) : null, [tasks, tab]);
  const todayCount = todayTasks?.length ?? 0;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={pageTitle}>VIỆC CẦN LÀM</div>
          {todayCount > 0 && (
            <div style={{ fontSize: 13, color: "#7a828e", marginTop: 4, fontWeight: 500 }}>
              {todayCount} task hôm nay
            </div>
          )}
        </div>
        <button onClick={() => setFormOpen(true)}
          style={{
            width: 42, height: 42, borderRadius: "50%",
            background: theme.accentGradient, border: "none",
            color: "#fff", fontSize: 22, cursor: "pointer", fontWeight: 700,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 2px 16px rgba(249,115,22,0.35)",
          }}>
          +
        </button>
      </div>

      <div style={{ display: "flex", gap: 4, marginTop: 16, background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: 4 }}>
        {TABS.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            style={{
              flex: 1, padding: "10px 0", borderRadius: 10, textAlign: "center",
              background: tab === t.key ? "rgba(249,115,22,0.15)" : "transparent",
              border: "none",
              color: tab === t.key ? "#F97316" : "#7a828e",
              fontSize: 13, fontWeight: tab === t.key ? 800 : 600,
              fontFamily: theme.font, cursor: "pointer", letterSpacing: 0.5,
            }}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ marginTop: 18 }}>
        {isLoading ? (
          [1, 2, 3].map((i) => (
            <div key={i} style={{ height: 64, borderRadius: 12, marginBottom: 8, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }} />
          ))
        ) : !tasks || tasks.length === 0 ? (
          <EmptyState
            title={tab === "today" ? "Không có task hôm nay" : tab === "upcoming" ? "Không có task sắp tới" : "Chưa có task hoàn thành"}
            description={tab !== "done" ? "Thêm task mới để bắt đầu" : "Hoàn thành task để xem ở đây"}
            actionLabel={tab !== "done" ? "Thêm task" : undefined}
            onAction={tab !== "done" ? () => setFormOpen(true) : undefined} />
        ) : grouped ? (
          Array.from(grouped.entries()).map(([dateKey, dateTasks]) => (
            <div key={dateKey} style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 14, letterSpacing: 1.5, color: "#7a828e", marginBottom: 8, fontWeight: 700, paddingLeft: 2 }}>
                {dateKey === "KHÔNG CÓ NGÀY" ? "Không có ngày" : formatDate(dateKey)}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {dateTasks.map((task: CRMTask) => (
                  <TaskItem key={task.id} task={task}
                    contactName={task.contactId ? contactsMap.get(task.contactId)?.name : undefined}
                    dealName={task.dealId ? dealsMap.get(task.dealId)?.title : undefined}
                    onComplete={() => completeTask.mutate(task.id)}
                    onUncomplete={() => uncompleteTask.mutate(task.id)}
                    onClick={() => {}} />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {tasks.map((task: CRMTask) => (
              <TaskItem key={task.id} task={task}
                contactName={task.contactId ? contactsMap.get(task.contactId)?.name : undefined}
                dealName={task.dealId ? dealsMap.get(task.dealId)?.title : undefined}
                onComplete={() => completeTask.mutate(task.id)}
                onUncomplete={() => uncompleteTask.mutate(task.id)}
                onClick={() => {}} />
            ))}
          </div>
        )}
      </div>

      {formOpen && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 200,
          background: "rgba(0,0,0,0.9)", backdropFilter: "blur(16px)",
          display: "flex", alignItems: "flex-end",
        }}>
          <div style={{
            width: "100%", maxHeight: "88vh", overflowY: "auto",
            background: "#0f172a",
            border: "1px solid rgba(249,115,22,0.2)",
            borderRadius: "24px 24px 0 0", padding: "24px 20px 32px",
          }}>
            <div style={{ width: 40, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.15)", margin: "0 auto 18px" }} />
            <div style={{ fontSize: 16, letterSpacing: 3, color: "#F97316", marginBottom: 18, fontWeight: 800 }}>
              THÊM TASK MỚI
            </div>
            <TaskForm contacts={contacts ?? []} dealsByContact={dealsByContact}
              onSubmit={async (data: TaskFormData) => { await createTask.mutateAsync(data); setFormOpen(false); }}
              onClose={() => setFormOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
