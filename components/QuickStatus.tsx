"use client";

import { useState } from "react";
import { SHEETS, formatTimestamp } from "@/lib/sheets";
import { insertEvent } from "@/lib/supabase";
import { syncEventToSheets, appendToSheet } from "@/lib/actions";
import { Card } from "@/components/ui";

const quickStatuses = [
  { label: "Resting", emoji: "😴", color: "bg-[#dbeafe] dark:bg-[#1e3a5f] text-[#2563eb] hover:bg-[#bfdbfe]" },
  { label: "Eating", emoji: "🍽️", color: "bg-[#ffedd5] dark:bg-[#431407] text-[#ea580c] hover:bg-[#fed7aa]" },
  { label: "With Doctor", emoji: "👨‍⚕️", color: "bg-[#d1fae5] dark:bg-[#064e3b] text-[#059669] hover:bg-[#a7f3d0]" },
  { label: "Good Mood", emoji: "😊", color: "bg-[#fef3c7] dark:bg-[#422006] text-[#d97706] hover:bg-[#fde68a]" },
  { label: "In Pain", emoji: "😣", color: "bg-[#fee2e2] dark:bg-[#450a0a] text-[#dc2626] hover:bg-[#fecaca]" },
  { label: "Sleeping", emoji: "💤", color: "bg-[#ede9fe] dark:bg-[#2e1065] text-[#7c3aed] hover:bg-[#ddd6fe]" },
];

const waterAmounts = [
  { label: "150ml", value: 150 },
  { label: "250ml", value: 250 },
  { label: "500ml", value: 500 },
];

function getNowDateTime() {
  const now = new Date();
  return {
    date: now.toISOString().split("T")[0],
    time: now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }),
  };
}

export function QuickStatus() {
  const [selected, setSelected] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState<string | null>(null);

  const handleStatus = async (status: string) => {
    setSelected(status);
    setSaving(status);
    const currentNote = note;
    setNote("");

    const { date, time } = getNowDateTime();

    try {
      const inserted = await insertEvent({
        date,
        time,
        type: "status",
        title: status,
        subtitle: currentNote || "",
        details: currentNote,
        meta: {},
      });
      syncEventToSheets(inserted.id).catch(() => {});
    } catch {
      appendToSheet(SHEETS.quickStatus, [formatTimestamp(), "", status, currentNote]).catch(() => {});
    }

    setTimeout(() => { setSaving(null); setSelected(null); }, 2000);
  };

  const handleWater = async (ml: number) => {
    setSaving(`water-${ml}`);

    const { date, time } = getNowDateTime();

    try {
      const inserted = await insertEvent({
        date,
        time,
        type: "status",
        title: `Water: ${ml}ml`,
        subtitle: "Water Intake",
        details: `${ml}ml`,
        meta: { water_ml: String(ml) },
      });
      syncEventToSheets(inserted.id).catch(() => {});
    } catch {
      appendToSheet(SHEETS.quickStatus, [formatTimestamp(), "", `Water: ${ml}ml`, "Water Intake"]).catch(() => {});
    }

    setTimeout(() => { setSaving(null); }, 2000);
  };

  return (
    <Card className="p-5">
      <h3 className="text-lg font-extrabold text-[#164e63] dark:text-[#f8fafc] mb-1">Quick Status</h3>
      <p className="text-sm text-[#64748b] dark:text-[#94a3b8] mb-4">Tap to log instantly — saves in background</p>

      <div className="grid grid-cols-3 gap-2 mb-3">
        {quickStatuses.map((s) => {
          const isActive = selected === s.label;
          const isSaving = saving === s.label;
          return (
            <button
              key={s.label}
              onClick={() => handleStatus(s.label)}
              disabled={isSaving}
              className={`min-h-[56px] flex flex-col items-center justify-center gap-1 rounded-xl font-semibold text-sm transition-all ${s.color} ${
                isActive ? "ring-2 ring-offset-2 ring-[#0891b2] dark:ring-offset-[#0c0a09] scale-105" : ""
              } ${isSaving ? "opacity-70" : ""}`}
            >
              <span className="text-xl leading-none">{s.emoji}</span>
              <span className="text-[11px]">{isSaving ? "Saved ✓" : s.label}</span>
            </button>
          );
        })}
      </div>

      <div className="mb-3">
        <p className="text-xs font-bold text-[#64748b] dark:text-[#94a3b8] uppercase tracking-wider mb-2">Water Intake</p>
        <div className="grid grid-cols-3 gap-2">
          {waterAmounts.map((w) => {
            const isSaving = saving === `water-${w.value}`;
            return (
              <button
                key={w.label}
                onClick={() => handleWater(w.value)}
                disabled={isSaving}
                className={`min-h-[48px] flex items-center justify-center gap-2 rounded-xl font-semibold text-sm transition-all bg-[#e0f2fe] dark:bg-[#0c4a6e] text-[#0284c7] hover:bg-[#bae6fd] ${
                  isSaving ? "ring-2 ring-offset-2 ring-[#0891b2] dark:ring-offset-[#0c0a09] scale-105 opacity-70" : ""
                }`}
              >
                <span className="text-lg">💧</span>
                <span>{isSaving ? "Saved ✓" : w.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add a note (optional)..."
          className="flex-1 min-h-[48px] rounded-xl border-2 border-[#e2e8f0] dark:border-[#334155] bg-white dark:bg-[#1c1917] text-[#1e293b] dark:text-[#f8fafc] placeholder-[#94a3b8] px-4 text-sm"
        />
      </div>
    </Card>
  );
}
