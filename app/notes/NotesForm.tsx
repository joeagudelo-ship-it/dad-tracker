"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SHEETS, formatTimestamp } from "@/lib/sheets";
import { appendToSheet } from "@/lib/actions";
import { Card, Button, Input, TextArea } from "@/components/ui";

export function NotesForm() {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [author, setAuthor] = useState("");
  const [note, setNote] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) return;
    setSubmitting(true);
    await appendToSheet(SHEETS.generalNotes, [formatTimestamp(), author || "Anonymous", note]);
    setAuthor(""); setNote("");
    setShowForm(false);
    router.refresh();
    setSubmitting(false);
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
            <Button type="submit" variant="cta" disabled={submitting}>
              {submitting ? "Saving..." : "Save Note"}
            </Button>
          </form>
        </Card>
      )}
    </>
  );
}
