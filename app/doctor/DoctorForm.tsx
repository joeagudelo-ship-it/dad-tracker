"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SHEETS, formatTimestamp } from "@/lib/sheets";
import { appendToSheet } from "@/lib/actions";
import { Card, Button, Input, TextArea } from "@/components/ui";

export function DoctorForm() {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [doctor, setDoctor] = useState("");
  const [summary, setSummary] = useState("");
  const [actions, setActions] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctor.trim() || !summary.trim()) return;
    setSubmitting(true);
    await appendToSheet(SHEETS.doctorUpdates, [formatTimestamp(), doctor, summary, actions]);
    setDoctor(""); setSummary(""); setActions("");
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
            <Input label="Doctor Name" value={doctor} onChange={setDoctor} placeholder="e.g., Dr. Smith" required />
            <TextArea label="What did they say?" value={summary} onChange={setSummary} placeholder="Summary of the update..." required rows={4} />
            <TextArea label="Action Items (optional)" value={actions} onChange={setActions} placeholder="Follow-up tasks, next steps..." />
            <Button type="submit" variant="cta" disabled={submitting}>
              {submitting ? "Saving..." : "Save Update"}
            </Button>
          </form>
        </Card>
      )}
    </>
  );
}
