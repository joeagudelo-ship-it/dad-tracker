"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { insertEvents } from "@/lib/supabase";
import { syncEventToSheets } from "@/lib/actions";
import { Card, Button } from "@/components/ui";

export function EventLog() {
  const router = useRouter();
  const [entries, setEntries] = useState<{ time: string; text: string }[]>([]);
  const [time, setTime] = useState("");
  const [text, setText] = useState("");
  const [saved, setSaved] = useState(false);
  const textRef = useRef<HTMLInputElement>(null);
  const timeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const now = new Date();
    setTime(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }));
  }, []);

  useEffect(() => {
    if (saved) {
      const timer = setTimeout(() => setSaved(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [saved]);

  const addEntry = () => {
    if (!text.trim()) return;
    const t = time || new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
    setEntries((prev) => [...prev, { time: t, text: text.trim() }]);
    setText("");
    textRef.current?.focus();
  };

  const removeEntry = (i: number) => {
    setEntries((prev) => prev.filter((_, idx) => idx !== i));
  };

  const submitAll = async () => {
    if (entries.length === 0) return;

    const today = new Date().toISOString().split("T")[0];
    const dbEvents = entries.map((entry) => ({
      date: today,
      time: entry.time,
      type: "event" as const,
      title: entry.text,
      subtitle: "Logged",
      details: "",
      meta: {},
    }));

    console.log(`[EventLog] Submitting ${dbEvents.length} events to Supabase`);

    // Instant write to Supabase
    setEntries([]);
    setSaved(true);

    try {
      const inserted = await insertEvents(dbEvents);
      console.log(`[EventLog] Supabase insert OK, ${Array.isArray(inserted) ? inserted.length : 1} rows, syncing to Sheets...`);
      // Background sync each event to Sheets (fire-and-forget)
      if (Array.isArray(inserted)) {
        inserted.forEach((ev) => {
          syncEventToSheets(ev.id).catch((err) => console.error(`[EventLog] syncEventToSheets error:`, err));
        });
      }
      router.refresh();
    } catch (err) {
      console.log(`[EventLog] Supabase failed, falling back to Sheets: ${err}`);
      // If Supabase fails, fall back to direct Sheets write
      const { batchAppendToSheet } = await import("@/lib/actions");
      const { SHEETS } = await import("@/lib/sheets");
      const todayFmt = new Date().toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" });
      const rows = entries.map((entry) => [`${todayFmt}, ${entry.time}`, "", entry.text, ""]);
      console.log(`[EventLog] Fallback: writing ${rows.length} rows to Sheets`);
      await batchAppendToSheet(SHEETS.eventLog, rows);
      setEntries([]);
      router.refresh();
    }
  };

  const handleTimeKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      textRef.current?.focus();
    }
  };

  const handleTextKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addEntry();
    }
  };

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-lg font-extrabold text-[#164e63] dark:text-[#f8fafc]">Event Log</h3>
          <p className="text-sm text-[#64748b] dark:text-[#94a3b8]">Timestamped entries — pain, meds, etc.</p>
        </div>
        {entries.length > 0 && (
          <span className="text-xs font-bold bg-[#0891b2]/10 text-[#0891b2] px-2.5 py-1 rounded-full">
            {entries.length} pending
          </span>
        )}
      </div>

      {entries.length > 0 && (
        <div className="mb-4 space-y-2 max-h-60 overflow-y-auto">
          {entries.map((entry, i) => (
            <div key={i} className="flex items-center gap-3 bg-[#f8fafc] dark:bg-[#1e293b] rounded-xl px-4 py-3">
              <span className="text-sm font-bold text-[#0891b2] whitespace-nowrap w-16">{entry.time}</span>
              <span className="text-sm text-[#1e293b] dark:text-[#f8fafc] flex-1 leading-snug">{entry.text}</span>
              <button
                onClick={() => removeEntry(i)}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-[#94a3b8] hover:bg-[#fee2e2] hover:text-[#dc2626] transition-colors flex-shrink-0"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2 mb-3">
        <input
          ref={timeRef}
          type="text"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          onKeyDown={handleTimeKeyDown}
          placeholder="Time"
          className="w-24 min-h-[48px] rounded-xl border-2 border-[#e2e8f0] dark:border-[#334155] bg-white dark:bg-[#1c1917] text-[#1e293b] dark:text-[#f8fafc] text-center font-bold text-sm px-2"
        />
        <input
          ref={textRef}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleTextKeyDown}
          placeholder="e.g., Dad was in pain, took pain meds..."
          className="flex-1 min-h-[48px] rounded-xl border-2 border-[#e2e8f0] dark:border-[#334155] bg-white dark:bg-[#1c1917] text-[#1e293b] dark:text-[#f8fafc] text-sm px-4"
        />
        <Button
          onClick={addEntry}
          variant="secondary"
          className="w-auto px-4 min-h-[48px] rounded-xl font-bold"
          disabled={!text.trim()}
        >
          +
        </Button>
      </div>

      {entries.length > 0 && (
        <Button
          onClick={submitAll}
          variant="cta"
          className="mt-2"
        >
          {saved ? "Saved ✓" : `Save ${entries.length} Event${entries.length > 1 ? "s" : ""}`}
        </Button>
      )}
    </Card>
  );
}
