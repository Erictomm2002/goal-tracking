"use client";

import { useState, useRef } from "react";
import { DealCard } from "./DealCard";
import { EmptyState } from "./EmptyState";
import { theme, stageColors } from "./styles";
import { STAGES, type CRMDeal, type CRMContact } from "@/types/crm";

interface DealKanbanProps {
  deals: CRMDeal[];
  contacts: Map<string, CRMContact>;
  onDealClick: (deal: CRMDeal) => void;
  isLoading?: boolean;
}

export function DealKanban({ deals, contacts, onDealClick, isLoading }: DealKanbanProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const contRef = useRef<HTMLDivElement>(null);

  const nonTerminalStages = STAGES.filter((s) => s !== "Thắng" && s !== "Thua");

  const scrollTo = (index: number) => {
    if (!scrollRef.current || !contRef.current) return;
    const w = contRef.current.offsetWidth;
    scrollRef.current.scrollTo({ left: w * index, behavior: "smooth" });
    setActiveIndex(index);
  };

  const handleScroll = () => {
    if (!scrollRef.current || !contRef.current) return;
    const idx = Math.round(scrollRef.current.scrollLeft / contRef.current.offsetWidth);
    setActiveIndex(Math.min(idx, nonTerminalStages.length - 1));
  };

  if (isLoading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {[1, 2, 3].map((i) => (
          <div key={i} style={{
            height: 100, borderRadius: 16,
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
          }} />
        ))}
      </div>
    );
  }

  return (
    <div ref={contRef}>
      <div style={{ display: "flex", gap: 4, paddingBottom: 12, overflowX: "auto" }}>
        {nonTerminalStages.map((stage, i) => {
          const isActive = i === activeIndex;
          const sc = stageColors[stage] ?? {};
          return (
            <button
              key={stage}
              onClick={() => scrollTo(i)}
              style={{
                padding: "6px 14px", borderRadius: 8,
                background: isActive ? sc.background : "rgba(255,255,255,0.04)",
                border: isActive ? `1px solid ${sc.color}` : "1px solid rgba(255,255,255,0.08)",
                color: isActive ? sc.color : "#7a828e",
                fontSize: 11,
                fontFamily: theme.font,
                fontWeight: isActive ? 800 : 600,
                cursor: "pointer",
                letterSpacing: 0.5,
                whiteSpace: "nowrap",
              }}
            >
              {stage}
            </button>
          );
        })}
      </div>

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        style={{
          display: "flex",
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {nonTerminalStages.map((stage) => {
          const stageDeals = deals.filter((d) => d.stage === stage);
          return (
            <div key={stage} style={{ minWidth: "100%", scrollSnapAlign: "start" }}>
              {stageDeals.length === 0 ? (
                <EmptyState title={`Không có deal "${stage}"`} />
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {stageDeals.map((deal) => (
                    <DealCard
                      key={deal.id}
                      deal={deal}
                      contactName={contacts.get(deal.contactId)?.name}
                      onClick={() => onDealClick(deal)}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {nonTerminalStages.length > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: 8, paddingTop: 14 }}>
          {nonTerminalStages.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              style={{
                width: i === activeIndex ? 24 : 8,
                height: 8,
                borderRadius: 4,
                background: i === activeIndex ? "#F97316" : "rgba(255,255,255,0.12)",
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
