"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { insertEvent } from "@/lib/supabase";
import { syncEventToSheets, appendToSheet } from "@/lib/actions";
import { SHEETS, formatTimestamp } from "@/lib/sheets";
import { Card, Button, Input } from "@/components/ui";

export function ShiftForm() {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [person, setPerson] = useState("");
  const [shiftStart, setShiftStart] = useState("");
  const [shiftEnd, setShiftEnd] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (showForm) {
      const now = new Date();
      const h = now.getHours();
      const m = now.getMinutes();
      setShiftStart(`${h % 12 || 12}:${m.toString().padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`);
      const endH = h + 8;
      setShiftEnd(`${endH % 12 || 12}:00 ${endH >= 12 ? "PM" : "AM"}`);
    }
  }, [showForm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!person.trim()) return;

    const now = new Date();
    const today = now.toISOString().split("T")[0];

    setShowForm(false);
    setPerson(""); setNotes("");

    try {
      const inserted = await insertEvent({
        date: today,
        time: shiftStart,
        type: "shift",
        title: person,
        subtitle: `${shiftStart} → ${shiftEnd}`,
        details: notes,
        meta: { start: shiftStart, end: shiftEnd },
      });
      syncEventToSheets(inserted.id).catch(() => {});
    } catch {
      appendToSheet(SHEETS.shiftSchedule, [formatTimestamp().split(",")[0], person, shiftStart, shiftEnd, notes]).catch(() => {});
    }

    router.refresh();
  };

  return (
    <>
      <Button onClick={() => setShowForm(!showForm)} variant={showForm ? "secondary" : "primary"} className="w-auto px-5">
        {showForm ? "Cancel" : "+ Add Shift"}
      </Button>

      {showForm && (
        <Card className="p-5 mt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Person Name" value={person} onChange={setPerson} placeholder="e.g., Maria, John..." required />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Shift Start" value={shiftStart} onChange={setShiftStart} placeholder="e.g., 8:00 AM" required />
              <Input label="Shift End" value={shiftEnd} onChange={setShiftEnd} placeholder="e.g., 4:00 PM" required />
            </div>
            <Input label="Notes (optional)" value={notes} onChange={setNotes} placeholder="Any special instructions..." />
            <Button type="submit" variant="cta">Save Shift</Button>
          </form>
        </Card>
      )}
    </>
  );
}
