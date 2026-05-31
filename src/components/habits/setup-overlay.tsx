"use client";

import { useState } from "react";
import type { Habit } from "@/types/habit";

interface Props {
  onDone: (r: { name: string; price: number; deadline: string; image?: string; habits: Habit[] }) => void;
  initial?: { name: string; price: number; deadline: string; image?: string; habits: Habit[] };
}

export function SetupOverlay({ onDone, initial }: Props) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState(initial?.name ?? "Victor P9200 NTD");
  const [price, setPrice] = useState(String(initial?.price ?? "1500000"));
  const [deadline, setDeadline] = useState(initial?.deadline ?? "2026-06-30");
  const [image, setImage] = useState(initial?.image ?? "");
  const [habits, setHabits] = useState<Habit[]>(initial?.habits ?? []);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");

  const addHabit = () => {
    const t = title.trim();
    const s = subtitle.trim();
    const d = description.trim();
    if (!t) return;
    if (habits.some(h => h.title === t)) return;
    setHabits(prev => [...prev, { title: t, subtitle: s, ...(d ? { description: d } : {}) }]);
    setTitle("");
    setSubtitle("");
    setDescription("");
  };

  const removeHabit = (h: string) => {
    setHabits(prev => prev.filter(x => x.title !== h));
  };

  const submit = () => {
    const p = Number(price.replace(/\D/g, ""));
    if (!name || !p || habits.length === 0) return;
    onDone({ name, price: p, deadline, image: image || undefined, habits });
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "rgba(0,0,0,0.88)", backdropFilter: "blur(16px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
    }}>
      <div style={{
        background: "#0f172a", border: "1px solid rgba(249,115,22,0.3)",
        borderRadius: 20, padding: 32, width: "100%", maxWidth: 440,
        maxHeight: "90vh", overflowY: "auto",
      }}>
        <div style={{ fontSize: 9, letterSpacing: 3, color: "#F97316", marginBottom: 6 }}>
          RELATION CIRCLE • BƯỚC {step}/2
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {[1, 2].map(s => (
            <div key={s} style={{
              flex: 1, height: 3, borderRadius: 2,
              background: s <= step ? "#F97316" : "rgba(255,255,255,0.08)",
              transition: "background 0.3s",
            }} />
          ))}
        </div>

        {step === 1 && (
          <>
            <div style={{ fontSize: 22, fontWeight: 900, color: "#fff", marginBottom: 4 }}>
              Mục tiêu của bạn?
            </div>
            <div style={{ fontSize: 12, color: "#555", marginBottom: 20, lineHeight: 1.6 }}>
              Mọi thói quen đều dẫn về một điểm duy nhất.
            </div>

            {[
              { label: "TÊN MỤC TIÊU", val: name, set: setName, ph: "Victor P9200 NTD", inputMode: undefined },
              { label: "GIÁ TIỀN (VNĐ)", val: price, set: setPrice, ph: "1500000", inputMode: "numeric" },
              { label: "DEADLINE", val: deadline, set: setDeadline, type: "date" as const },
            ].map(({ label, val, set, ph, inputMode, type }) => (
              <div key={label} style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 9, letterSpacing: 2, color: "#555", marginBottom: 6 }}>{label}</div>
                <input value={val} onChange={e => set(e.target.value)}
                  inputMode={inputMode as "text" | "numeric" | "decimal" | undefined} type={type || "text"} placeholder={ph}
                  style={inputStyle} />
              </div>
            ))}

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 9, letterSpacing: 2, color: "#555", marginBottom: 6 }}>
                LINK ẢNH (tuỳ chọn)
              </div>
              <input value={image} onChange={e => setImage(e.target.value)}
                placeholder="https://example.com/image.jpg"
                style={inputStyle} />
              {image && (
                <div style={{ marginTop: 8, borderRadius: 12, overflow: "hidden", width: 120, height: 120, background: "rgba(255,255,255,0.05)" }}>
                  <img src={image} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              )}
            </div>

            <button onClick={() => setStep(2)} style={btnOrangeStyle}>
              TIẾP THEO: CHỌN THÓI QUEN →
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <div style={{ fontSize: 22, fontWeight: 900, color: "#fff", marginBottom: 4 }}>
              Thói quen của bạn?
            </div>
            <div style={{ fontSize: 12, color: "#555", marginBottom: 20, lineHeight: 1.6 }}>
              Thêm các thói quen bạn muốn theo dõi.
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                <input value={title} onChange={e => setTitle(e.target.value)}
                  placeholder="Tiêu đề" style={inputStyle}
                  onKeyDown={e => e.key === "Enter" && addHabit()} />
                <input value={subtitle} onChange={e => setSubtitle(e.target.value)}
                  placeholder="Mô tả ngắn (tuỳ chọn)" style={inputStyle}
                  onKeyDown={e => e.key === "Enter" && addHabit()} />
                <textarea value={description} onChange={e => setDescription(e.target.value)}
                  placeholder="Mô tả chi tiết bằng Markdown (tuỳ chọn)&#10;VD: **Chạy bộ 30 phút**&#10;- 3 hiệp hít đất x 15 cái"
                  style={{ ...inputStyle, minHeight: 80, resize: "vertical" as const, lineHeight: 1.5 }}
                  onKeyDown={e => { if (e.key === "Enter" && e.ctrlKey) addHabit(); }} />
              </div>
              <button onClick={addHabit} style={{
                ...btnOrangeStyle, width: "auto", padding: "11px 16px", flexShrink: 0, alignSelf: "stretch",
              }}>+</button>
            </div>

            {habits.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 12 }}>
                {habits.map(h => (
                  <div key={h.title} style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "10px 12px", borderRadius: 10,
                    background: "rgba(249,115,22,0.08)",
                    border: "1px solid rgba(249,115,22,0.2)",
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, color: "#fff", fontWeight: 600 }}>{h.title}</div>
                      {h.subtitle && (
                        <div style={{ fontSize: 10, color: "#888", marginTop: 2 }}>{h.subtitle}</div>
                      )}
                      {h.description && (
                        <div style={{ fontSize: 9, color: "#666", marginTop: 3, lineHeight: 1.4, whiteSpace: "pre-wrap", maxHeight: 32, overflow: "hidden" }}>
                          {h.description}
                        </div>
                      )}
                    </div>
                    <span onClick={() => removeHabit(h.title)}
                      style={{ cursor: "pointer", color: "#666", fontSize: 16, opacity: 0.6 }}>×</span>
                  </div>
                ))}
              </div>
            )}

            <div style={{
              marginTop: 16, padding: "10px 12px", borderRadius: 10,
              background: "rgba(255,255,255,0.03)",
              fontSize: 11, color: "#666",
            }}>
              Đã thêm: <strong style={{ color: "#F97316" }}>{habits.length}</strong> thói quen
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              <button onClick={() => setStep(1)}
                style={{ ...ghostBtnStyle, flex: 1, padding: "13px", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }}>
                ← QUAY LẠI
              </button>
              <button onClick={submit} style={{ ...btnOrangeStyle, flex: 2 }}
                disabled={habits.length === 0}>
                {initial ? "LƯU THAY ĐỔI" : "BẮT ĐẦU VÒNG TRÒN →"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.09)",
  borderRadius: 10, padding: "11px 13px",
  color: "#e2e8f0", fontSize: 16,
  fontFamily: "'Courier New', monospace", outline: "none",
};

const btnOrangeStyle: React.CSSProperties = {
  display: "block", width: "100%",
  background: "linear-gradient(90deg,#ea580c,#F97316)",
  border: "none", borderRadius: 12, padding: "13px",
  color: "#fff", fontWeight: 900, fontSize: 13,
  fontFamily: "'Courier New', monospace", letterSpacing: 0.5, cursor: "pointer",
};

const ghostBtnStyle: React.CSSProperties = {
  background: "none", border: "none", color: "#555",
  fontSize: 11, cursor: "pointer",
  fontFamily: "'Courier New', monospace", padding: "8px 16px",
};
