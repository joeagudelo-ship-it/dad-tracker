"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SHEETS, formatTimestamp } from "@/lib/sheets";
import { appendToSheet } from "@/lib/actions";
import { Card } from "@/components/ui";

const quickStatuses = [
  { label: "Resting", emoji: "😴", color: "bg-[#dbeafe] dark:bg-[#1e3a5f] text-[#2563eb] hover:bg-[#bfdbfe]" },
  { label: "Eating", emoji: "🍽️", color: "bg-[#ffedd5] dark:bg-[#431407] text-[#ea580c] hover:bg-[#fed7aa]" },
  { label: "With Doctor", emoji: "👨‍⚕️", color: "bg-[#d1fae5] dark:bg-[#064e3b] text-[#059669] hover:bg-[#a7f3d0]" },
  { label: "Good Mood", emoji: "😊", color: "bg-[#fef3c7] dark:bg-[#422006] text-[#d97706] hover:bg-[#fde68a]" },
  { label: "In Pain", emoji: "😣", color: "bg-[#fee2e2] dark:bg-[#450a0a] text-[#dc2626] hover:bg-[#fecaca]" },
  { label: "Sleeping", emoji: "💤", color: "bg-[#ede9fe] dark:bg-[#2e1065] text-[#7c3aed] hover:bg-[#ddd6fe]" },
];

export function QuickStatus() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [note, setNote] = useState("");

  const handleStatus = async (status: string) => {
    setSelected(status);
    setSubmitting(status);
    await appendToSheet(SHEETS.quickStatus, [formatTimestamp(), "", status, note]);
    setNote("");
    router.refresh();
    setTimeout(() => { setSubmitting(null); setSelected(null); }, 1500);
  };

  return (
    <Card className="p-5">
      <h3 className="text-lg font-extrabold text-[#164e63] dark:text-[#f8fafc] mb-1">Quick Status</h3>
      <p className="text-sm text-[#64748b] dark:text-[#94a3b8] mb-4">Tap to log instantly</p>

      <div className="grid grid-cols-3 gap-2 mb-4">
        {quickStatuses.map((s) => {
          const isActive = selected === s.label;
          const isSubmitting = submitting === s.label;
          return (
            <button
              key={s.label}
              onClick={() => handleStatus(s.label)}
              disabled={isSubmitting}
              className={`min-h-[56px] flex flex-col items-center justify-center gap-1 rounded-xl font-semibold text-sm transition-all ${s.color} ${
                isActive ? "ring-2 ring-offset-2 ring-[#0891b2] dark:ring-offset-[#0c0a09] scale-105" : ""
              } ${isSubmitting ? "opacity-70" : ""}`}
            >
              <span className="text-xl leading-none">{s.emoji}</span>
              <span className="text-[11px]">{isSubmitting ? "Saved!" : s.label}</span>
            </button>
          );
        })}
      </div>

      <input
        type="text"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Add a note (optional)..."
        className="w-full min-h-[48px] rounded-xl border-2 border-[#e2e8f0] dark:border-[#334155] bg-white dark:bg-[#1c1917] text-[#1e293b] dark:text-[#f8fafc] placeholder-[#94a3b8] px-4 text-sm"
      />
    </Card>
  );
}
