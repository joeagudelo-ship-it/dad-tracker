"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SHEETS, formatTimestamp } from "@/lib/sheets";
import { appendToSheet } from "@/lib/actions";
import { Card, Button, Input, TextArea } from "@/components/ui";

export function VisitorForm() {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    const timestamp = formatTimestamp();
    await appendToSheet(SHEETS.visitorLog, [name, timestamp, "", notes]);
    setName(""); setNotes("");
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
            <Input label="Visitor Name" value={name} onChange={setName} placeholder="e.g., Aunt Maria" required />
            <TextArea label="Notes (optional)" value={notes} onChange={setNotes} placeholder="Brought flowers, Stayed for lunch..." />
            <Button type="submit" variant="cta" disabled={submitting}>
              {submitting ? "Saving..." : "Check In Visitor"}
            </Button>
          </form>
        </Card>
      )}
    </>
  );
}
