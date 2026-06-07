"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { useDeal, useUpdateDealStage, useDeleteDeal } from "@/hooks/crm/use-deals";
import { useContact } from "@/hooks/crm/use-contacts";
import { useTasksByDeal } from "@/hooks/crm/use-tasks";
import { useNotesByDeal, useCreateNote, useDeleteNote } from "@/hooks/crm/use-notes";
import { useCompleteTask, useUncompleteTask } from "@/hooks/crm/use-tasks";
import { DealStageBar } from "@/components/crm/DealStageBar";
import { TaskItem } from "@/components/crm/TaskItem";
import { ActivityTimeline } from "@/components/crm/ActivityTimeline";
import { NoteSheet } from "@/components/crm/NoteSheet";
import { ConfirmDialog } from "@/components/crm/ConfirmDialog";
import { theme, cardStyle, sectionTitle } from "@/components/crm/styles";
import { STAGES, type CRMTask } from "@/types/crm";

export default function DealDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: deal, isLoading } = useDeal(id);
  const { data: contact } = useContact(deal?.contactId ?? "");
  const { data: tasks } = useTasksByDeal(id);
  const { data: notes } = useNotesByDeal(id);
  const updateStage = useUpdateDealStage();
  const deleteDeal = useDeleteDeal();
  const createNote = useCreateNote();
  const deleteNote = useDeleteNote();
  const completeTask = useCompleteTask();
  const uncompleteTask = useUncompleteTask();
  const [noteOpen, setNoteOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const currentIdx = deal ? STAGES.indexOf(deal.stage as typeof STAGES[number]) : -1;
  const nextStage = currentIdx >= 0 && currentIdx < STAGES.length - 2 ? STAGES[currentIdx + 1] : null;
  const isTerminal = deal?.stage === "Thắng" || deal?.stage === "Thua";

  if (isLoading) return <div style={{ height: 180, borderRadius: 16, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }} />;
  if (!deal) return <div style={{ fontSize: 13, color: "#7a828e", textAlign: "center", padding: 24, fontWeight: 500 }}>Không tìm thấy deal</div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <button onClick={() => router.back()}
          style={{ background: "none", border: "none", color: "#F97316", fontSize: 13, fontFamily: theme.font, fontWeight: 700, cursor: "pointer", padding: 0 }}>
          ← Quay lại
        </button>
        <button onClick={() => setConfirmDelete(true)}
          style={{
            padding: "6px 14px", borderRadius: 8,
            background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)",
            color: "#ef4444", fontSize: 11, fontFamily: theme.font, fontWeight: 700, cursor: "pointer",
          }}>
          XOÁ
        </button>
      </div>

      <div style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#e8edf5", fontFamily: theme.font }}>
              {deal.title}
            </div>
            {contact && (
              <button onClick={() => router.push(`/crm/contacts/${contact.id}`)}
                style={{ background: "none", border: "none", color: "#F97316", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: theme.font, marginTop: 3, padding: 0 }}>
                {contact.name}{contact.company && ` - ${contact.company}`} →
              </button>
            )}
          </div>
          <span style={{ fontSize: 20, fontWeight: 900, color: "#F97316", fontFamily: theme.font, whiteSpace: "nowrap" }}>
            {deal.value ? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(deal.value) : ""}
          </span>
        </div>

        {deal.package && (
          <span style={{
            display: "inline-block", marginTop: 8, padding: "3px 10px", borderRadius: 6,
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
            color: "#7a828e", fontSize: 11, fontFamily: theme.font, fontWeight: 600,
          }}>
            {deal.package}
          </span>
        )}

        <DealStageBar currentStage={deal.stage} />

        {!isTerminal ? (
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            {nextStage && (
              <button onClick={() => updateStage.mutate({ id: deal.id, stage: nextStage })}
                style={{
                  flex: 1, padding: "12px", borderRadius: 12,
                  background: theme.accentGradient, border: "none",
                  color: "#fff", fontWeight: 800, fontSize: 12,
                  fontFamily: theme.font, cursor: "pointer", letterSpacing: 0.5,
                }}>
                → {nextStage}
              </button>
            )}
            <button onClick={() => updateStage.mutate({ id: deal.id, stage: "Thắng" })}
              style={{
                flex: 1, padding: "12px", borderRadius: 12,
                background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.3)",
                color: "#4ade80", fontWeight: 800, fontSize: 12,
                fontFamily: theme.font, cursor: "pointer",
              }}>
              ✓ THẮNG
            </button>
            <button onClick={() => updateStage.mutate({ id: deal.id, stage: "Thua" })}
              style={{
                flex: 1, padding: "12px", borderRadius: 12,
                background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)",
                color: "#f87171", fontWeight: 800, fontSize: 12,
                fontFamily: theme.font, cursor: "pointer",
              }}>
              ✗ THUA
            </button>
          </div>
        ) : deal.stage === "Thua" ? (
          <button onClick={() => updateStage.mutate({ id: deal.id, stage: "Thương lượng" })}
            style={{
              width: "100%", marginTop: 10, padding: "12px", borderRadius: 12,
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
              color: "#b0b8c4", fontWeight: 700, fontSize: 12,
              fontFamily: theme.font, cursor: "pointer", letterSpacing: 0.5,
            }}>
            MỞ LẠI DEAL
          </button>
        ) : null}
      </div>

      <section style={{ marginTop: 24 }}>
        <div style={sectionTitle}>TASKS</div>
        {tasks && tasks.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {tasks.map((task: CRMTask) => (
              <TaskItem key={task.id} task={task}
                onComplete={() => completeTask.mutate(task.id)}
                onUncomplete={() => uncompleteTask.mutate(task.id)}
                onClick={() => {}} />
            ))}
          </div>
        ) : (
          <div style={{ fontSize: 13, color: "#7a828e", padding: "16px 0", textAlign: "center", fontWeight: 500 }}>Chưa có task</div>
        )}
      </section>

      <section style={{ marginTop: 24 }}>
        <div style={sectionTitle}>GHI CHÚ & HOẠT ĐỘNG</div>
        <ActivityTimeline notes={notes ?? []} completedTasks={[]} onDeleteNote={(nid) => deleteNote.mutate(nid)} />
      </section>

      <div style={{ height: 80 }} />

      <button onClick={() => setNoteOpen(true)}
        style={{
          position: "fixed", bottom: 28, right: 24,
          width: 56, height: 56, borderRadius: "50%",
          background: theme.accentGradient, border: "none",
          color: "#fff", fontSize: 26, cursor: "pointer", fontWeight: 700,
          boxShadow: "0 4px 24px rgba(249,115,22,0.4)", zIndex: 100,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
        +
      </button>

      <NoteSheet open={noteOpen} onClose={() => setNoteOpen(false)}
        onSubmit={async (content) => { await createNote.mutateAsync({ dealId: deal.id, contactId: deal.contactId, content }); }} />

      <ConfirmDialog open={confirmDelete} title="Xoá deal?"
        message={`Xoá deal "${deal.title}"?`} confirmLabel="XOÁ"
        onConfirm={() => { deleteDeal.mutate(deal.id); router.push("/crm/deals"); }}
        onCancel={() => setConfirmDelete(false)} />
    </div>
  );
}
