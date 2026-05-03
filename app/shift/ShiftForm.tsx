"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SHEETS } from "@/lib/sheets";
import { appendToSheet } from "@/lib/actions";
import { Card, Button, Input } from "@/components/ui";

export function ShiftForm() {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [person, setPerson] = useState("");
  const [shiftStart, setShiftStart] = useState("");
  const [shiftEnd, setShiftEnd] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (showForm) {
      const now = new Date();
      const h = now.getHours();
      const m = now.getMinutes();
      const formatted = `${h % 12 || 12}:${m.toString().padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
      setShiftStart(formatted);
      const endH = h + 8;
      const endFormatted = `${endH % 12 || 12}:00 ${endH >= 12 ? "PM" : "AM"}`;
      setShiftEnd(endFormatted);
    }
  }, [showForm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!person.trim()) return;
    setSubmitting(true);
    const today = new Date().toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" });
    await appendToSheet(SHEETS.shiftSchedule, [today, person, shiftStart, shiftEnd, notes]);
    setPerson(""); setNotes("");
    setShowForm(false);
    router.refresh();
    setSubmitting(false);
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
            <Button type="submit" variant="cta" disabled={submitting}>
              {submitting ? "Saving..." : "Save Shift"}
            </Button>
          </form>
        </Card>
      )}
    </>
  );
}
