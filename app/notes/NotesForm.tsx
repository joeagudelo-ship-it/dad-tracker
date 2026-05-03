"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { insertEvent } from "@/lib/supabase";
import { syncEventToSheets, appendToSheet } from "@/lib/actions";
import { SHEETS, formatTimestamp } from "@/lib/sheets";
import { Card, Button, Input, TextArea } from "@/components/ui";

export function NotesForm() {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [author, setAuthor] = useState("");
  const [note, setNote] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) return;

    const now = new Date();
    const today = now.toISOString().split("T")[0];
    const time = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });

    setShowForm(false);
    setAuthor(""); setNote("");

    try {
      const inserted = await insertEvent({
        date: today,
        time,
        type: "note",
        title: author || "Anonymous",
        subtitle: "Note",
        details: note,
        meta: {},
      });
      syncEventToSheets(inserted.id).catch(() => {});
    } catch {
      appendToSheet(SHEETS.generalNotes, [formatTimestamp(), author || "Anonymous", note]).catch(() => {});
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
            <Input label="Your Name (optional)" value={author} onChange={setAuthor} placeholder="e.g., Maria, John..." />
            <TextArea label="Note" value={note} onChange={setNote} placeholder="Write your observation or note..." required rows={4} />
            <Button type="submit" variant="cta">Save Note</Button>
          </form>
        </Card>
      )}
    </>
  );
}
