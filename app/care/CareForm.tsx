"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SHEETS, formatTimestamp } from "@/lib/sheets";
import { appendToSheet } from "@/lib/actions";
import { Card, Button, Input, TextArea, Select } from "@/components/ui";

export function CareForm() {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [item, setItem] = useState("");
  const [status, setStatus] = useState("Needed");
  const [priority, setPriority] = useState("Medium");
  const [notes, setNotes] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item.trim()) return;
    setSubmitting(true);
    await appendToSheet(SHEETS.careNeeds, [formatTimestamp(), item, status, priority, notes]);
    setItem(""); setNotes(""); setStatus("Needed"); setPriority("Medium");
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
            <Input label="What is needed?" value={item} onChange={setItem} placeholder="e.g., Pain medication, Extra blankets" required />
            <Select
              label="Status"
              value={status}
              onChange={setStatus}
              options={[
                { value: "Needed", label: "Still Needed" },
                { value: "In Progress", label: "In Progress" },
                { value: "Done", label: "Completed" },
              ]}
            />
            <Select
              label="Priority"
              value={priority}
              onChange={setPriority}
              options={[
                { value: "High", label: "High - Urgent" },
                { value: "Medium", label: "Medium" },
                { value: "Low", label: "Low" },
              ]}
            />
            <TextArea label="Notes (optional)" value={notes} onChange={setNotes} placeholder="Any additional details..." />
            <Button type="submit" variant="cta" disabled={submitting}>
              {submitting ? "Saving..." : "Save Entry"}
            </Button>
          </form>
        </Card>
      )}
    </>
  );
}
