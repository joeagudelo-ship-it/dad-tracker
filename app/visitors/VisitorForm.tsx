"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { insertEvent } from "@/lib/supabase";
import { syncEventToSheets, appendToSheet } from "@/lib/actions";
import { SHEETS, formatTimestamp } from "@/lib/sheets";
import { Card, Button, Input, TextArea } from "@/components/ui";

export function VisitorForm() {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const now = new Date();
    const today = now.toISOString().split("T")[0];
    const time = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });

    setShowForm(false);
    setName(""); setNotes("");

    try {
      const inserted = await insertEvent({
        date: today,
        time,
        type: "visitor",
        title: name,
        subtitle: `Checked in at ${time}`,
        details: notes,
        meta: {},
      });
      syncEventToSheets(inserted.id).catch(() => {});
    } catch {
      appendToSheet(SHEETS.visitorLog, [name, formatTimestamp(), "", notes]).catch(() => {});
    }

    router.refresh();
  };

  return (
    <>
      <Button onClick={() => setShowForm(!showForm)} variant={showForm ? "secondary" : "primary"} className="w-auto px-5">
        {showForm ? "Cancel" : "+ Add"}
      </Button>

      {showForm && (
        <Card className="p-5 mt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Visitor Name" value={name} onChange={setName} placeholder="e.g., Aunt Maria" required />
            <TextArea label="Notes (optional)" value={notes} onChange={setNotes} placeholder="Brought flowers, Stayed for lunch..." />
            <Button type="submit" variant="cta">Check In Visitor</Button>
          </form>
        </Card>
      )}
    </>
  );
}
