"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { useContact, useDeleteContact } from "@/hooks/crm/use-contacts";
import { useDealsByContact } from "@/hooks/crm/use-deals";
import { useTasksByContact } from "@/hooks/crm/use-tasks";
import { useNotesByContact, useCreateNote, useDeleteNote } from "@/hooks/crm/use-notes";
import { useCompleteTask, useUncompleteTask } from "@/hooks/crm/use-tasks";
import { TagChip } from "@/components/crm/TagChip";
import { DealCard } from "@/components/crm/DealCard";
import { TaskItem } from "@/components/crm/TaskItem";
import { ActivityTimeline } from "@/components/crm/ActivityTimeline";
import { NoteSheet } from "@/components/crm/NoteSheet";
import { ConfirmDialog } from "@/components/crm/ConfirmDialog";
import { theme, cardStyle, sectionTitle } from "@/components/crm/styles";
import type { CRMDeal, CRMTask } from "@/types/crm";

export default function ContactDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: contact, isLoading } = useContact(id);
  const { data: deals } = useDealsByContact(id);
  const { data: tasks } = useTasksByContact(id);
  const { data: notes } = useNotesByContact(id);
  const deleteContact = useDeleteContact();
  const createNote = useCreateNote();
  const deleteNote = useDeleteNote();
  const completeTask = useCompleteTask();
  const uncompleteTask = useUncompleteTask();
  const [noteOpen, setNoteOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (isLoading) return <div style={{ height: 140, borderRadius: 16, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }} />;
  if (!contact) return <div style={{ fontSize: 13, color: "#7a828e", textAlign: "center", padding: 24, fontWeight: 500 }}>Không tìm thấy liên hệ</div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <button onClick={() => router.back()}
          style={{ background: "none", border: "none", color: "#F97316", fontSize: 13, fontFamily: theme.font, fontWeight: 700, cursor: "pointer", padding: 0 }}>
          ← Quay lại
        </button>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => router.push(`/crm/contacts/${id}/edit`)}
            style={{
              padding: "6px 14px", borderRadius: 8,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#b0b8c4", fontSize: 11, fontFamily: theme.font, fontWeight: 700, cursor: "pointer",
            }}>
            SỬA
          </button>
          <button onClick={() => setConfirmDelete(true)}
            style={{
              padding: "6px 14px", borderRadius: 8,
              background: "rgba(239,68,68,0.12)",
              border: "1px solid rgba(239,68,68,0.25)",
              color: "#ef4444", fontSize: 11, fontFamily: theme.font, fontWeight: 700, cursor: "pointer",
            }}>
            XOÁ
          </button>
        </div>
      </div>

      <div style={cardStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{
            width: 54, height: 54, borderRadius: "50%",
            background: theme.accentDim, border: theme.accentBorder,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, fontWeight: 800, color: theme.accent, flexShrink: 0,
            fontFamily: theme.font,
          }}>
            {contact.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#e8edf5", fontFamily: theme.font }}>
              {contact.name}
            </div>
            {contact.company && <div style={{ fontSize: 15, color: "#7a828e", marginTop: 4, fontWeight: 600 }}>{contact.company}</div>}
            <div style={{ display: "flex", gap: 4, marginTop: 6, flexWrap: "wrap" }}>
              {contact.tags?.map((tag: string) => <TagChip key={tag} label={tag} />)}
            </div>
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", marginTop: 14, paddingTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
          {contact.phone && (
            <a href={`tel:${contact.phone}`} style={{ fontSize: 13, color: "#b0b8c4", textDecoration: "none", display: "flex", gap: 10, fontWeight: 500 }}>
              <span style={{ color: "#4ade80", fontWeight: 700 }}>☏</span> {contact.phone}
            </a>
          )}
          {contact.email && (
            <div style={{ fontSize: 13, color: "#b0b8c4", display: "flex", gap: 10, fontWeight: 500 }}>
              <span style={{ color: theme.accent }}>✉</span> {contact.email}
            </div>
          )}
          {contact.address && (
            <div style={{ fontSize: 13, color: "#b0b8c4", display: "flex", gap: 10, fontWeight: 500 }}>
              <span style={{ color: "#b0b8c4" }}>◉</span> {contact.address}
            </div>
          )}
          {contact.type && (
            <div style={{ fontSize: 12, color: "#7a828e", display: "flex", gap: 10, fontWeight: 500 }}>
              <span>▪</span> {contact.type}{contact.scale && ` · ${contact.scale}`}
            </div>
          )}
          {contact.currentSoftware && (
            <div style={{ fontSize: 12, color: "#7a828e", display: "flex", gap: 10, fontWeight: 500 }}>
              <span>▪</span> Đang dùng: {contact.currentSoftware}
            </div>
          )}
        </div>
      </div>

      <section style={{ marginTop: 24 }}>
        <div style={{ ...sectionTitle, display: "flex", justifyContent: "space-between" }}>
          <span>DEALS</span>
          <button onClick={() => router.push(`/crm/deals/new?contactId=${contact.id}&title=${contact.company ?? contact.name}`)}
            style={{ background: "none", border: "none", color: "#F97316", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: theme.font }}>
            + Thêm deal
          </button>
        </div>
        {deals && deals.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {deals.map((deal: CRMDeal) => (
              <DealCard key={deal.id} deal={deal} onClick={() => router.push(`/crm/deals/${deal.id}`)} />
            ))}
          </div>
        ) : (
          <div style={{ fontSize: 13, color: "#7a828e", padding: "16px 0", textAlign: "center", fontWeight: 500 }}>Chưa có deal</div>
        )}
      </section>

      <section style={{ marginTop: 24 }}>
        <div style={sectionTitle}>TASK CHƯA HOÀN THÀNH</div>
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
          <div style={{ fontSize: 13, color: "#7a828e", padding: "16px 0", textAlign: "center", fontWeight: 500 }}>Không có task</div>
        )}
      </section>

      <section style={{ marginTop: 24 }}>
        <div style={sectionTitle}>HOẠT ĐỘNG</div>
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
        onSubmit={async (content) => { await createNote.mutateAsync({ contactId: contact.id, content }); }} />

      <ConfirmDialog open={confirmDelete} title="Xoá liên hệ?"
        message={`Xoá "${contact.name}"? Deals và notes liên quan cũng bị xoá.`} confirmLabel="XOÁ"
        onConfirm={() => { deleteContact.mutate(contact.id); router.push("/crm/contacts"); }}
        onCancel={() => setConfirmDelete(false)} />
    </div>
  );
}
