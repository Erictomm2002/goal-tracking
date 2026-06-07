"use client";

import { useRouter } from "next/navigation";
import { useDashboard } from "@/hooks/crm/use-dashboard";
import { StatCard } from "@/components/crm/StatCard";
import { TaskItem } from "@/components/crm/TaskItem";
import { DealCard } from "@/components/crm/DealCard";
import { ContactCard } from "@/components/crm/ContactCard";
import { EmptyState } from "@/components/crm/EmptyState";
import { useCompleteTask, useUncompleteTask } from "@/hooks/crm/use-tasks";
import { theme, sectionTitle, pageTitle } from "@/components/crm/styles";
import type { CRMDeal, CRMContact, CRMTask } from "@/types/crm";

function formatDate() {
  const d = new Date();
  const dayNames = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
  return `${dayNames[d.getDay()]}, ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

export default function TodayPage() {
  const router = useRouter();
  const { data: dash, isLoading } = useDashboard();
  const completeTask = useCompleteTask();
  const uncompleteTask = useUncompleteTask();

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={pageTitle}>HÔM NAY</div>
          <div style={{ fontSize: 13, color: "#7a828e", marginTop: 4, fontWeight: 500 }}>
            {formatDate()}
          </div>
        </div>
        <button onClick={() => router.push("/crm/tasks")}
          style={{
            padding: "8px 16px", borderRadius: 10,
            background: "rgba(249,115,22,0.12)",
            border: "1px solid rgba(249,115,22,0.25)",
            color: "#fdba74", fontSize: 12,
            fontFamily: theme.font, fontWeight: 700,
            cursor: "pointer", letterSpacing: 0.5,
          }}>
          📋 TASKS
        </button>
      </div>

      {isLoading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 20 }}>
          <div style={{ display: "flex", gap: 12 }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ flex: 1, height: 88, borderRadius: 16, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }} />
            ))}
          </div>
          <div style={{ height: 120, borderRadius: 16, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }} />
        </div>
      ) : (
        <>
          <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
            <StatCard label="Deals mở" value={dash?.pipelineStats.openDeals ?? 0}
              sub={`Tổng ${(dash?.pipelineStats.totalValue ?? 0) >= 1_000_000
                ? `${((dash?.pipelineStats.totalValue ?? 0) / 1_000_000).toFixed(0)}tr`
                : "0"}`} />
            <StatCard label="Task hôm nay" value={dash?.pipelineStats.todayTasksCount ?? 0} />
          </div>

          <section style={{ marginTop: 28 }}>
            <div style={{
              ...sectionTitle,
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <span>TASK HÔM NAY</span>
              <button onClick={() => router.push("/crm/tasks")}
                style={{ background: "none", border: "none", color: "#F97316", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: theme.font }}>
                Xem tất cả →
              </button>
            </div>
            {dash?.todayTasks && dash.todayTasks.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {[...dash.todayTasks].sort((a: CRMTask, b: CRMTask) => {
                  const ts = new Date().toISOString().slice(0, 10);
                  const urgent = (t: CRMTask) => !t.completed && t.dueDate && t.dueDate <= ts;
                  return (urgent(b) ? 1 : 0) - (urgent(a) ? 1 : 0);
                }).map((task: CRMTask) => (
                  <TaskItem key={task.id} task={task}
                    onComplete={() => completeTask.mutate(task.id)}
                    onUncomplete={() => uncompleteTask.mutate(task.id)}
                    onClick={() => {}} />
                ))}
              </div>
            ) : (
              <EmptyState title="Không có task hôm nay" description="Đã hoàn thành hết hoặc chưa có task." />
            )}
          </section>

          <section style={{ marginTop: 28 }}>
            <div style={sectionTitle}>DEALS CẦN CHÚ Ý</div>
            {dash?.urgentDeals && dash.urgentDeals.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {dash.urgentDeals.map((deal: CRMDeal) => (
                  <DealCard key={deal.id} deal={deal}
                    onClick={() => router.push(`/crm/deals/${deal.id}`)} />
                ))}
              </div>
            ) : (
              <div style={{ fontSize: 13, color: "#7a828e", padding: "16px 0", textAlign: "center", fontWeight: 500 }}>
                Không có deal cần chú ý
              </div>
            )}
          </section>

          <section style={{ marginTop: 28 }}>
            <div style={sectionTitle}>GẦN ĐÂY</div>
            {dash?.recentContacts && dash.recentContacts.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {dash.recentContacts.map((contact: CRMContact) => (
                  <ContactCard key={contact.id} contact={contact}
                    onClick={() => router.push(`/crm/contacts/${contact.id}`)} />
                ))}
              </div>
            ) : (
              <div style={{ fontSize: 13, color: "#7a828e", padding: "16px 0", textAlign: "center", fontWeight: 500 }}>
                Chưa có liên hệ
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
