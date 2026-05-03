"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { insertEvent } from "@/lib/supabase";
import { syncEventToSheets, appendToSheet } from "@/lib/actions";
import { SHEETS, formatTimestamp } from "@/lib/sheets";
import { Card, Button, Input, TextArea } from "@/components/ui";

export function DoctorForm() {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [doctor, setDoctor] = useState("");
  const [summary, setSummary] = useState("");
  const [actions, setActions] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctor.trim() || !summary.trim()) return;

    const now = new Date();
    const today = now.toISOString().split("T")[0];
    const time = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });

    setShowForm(false);
    setDoctor(""); setSummary(""); setActions("");

    try {
      const inserted = await insertEvent({
        date: today,
        time,
        type: "doctor",
        title: doctor,
        subtitle: "Doctor Update",
        details: summary,
        meta: { actions },
      });
      syncEventToSheets(inserted.id).catch(() => {});
    } catch {
      appendToSheet(SHEETS.doctorUpdates, [formatTimestamp(), doctor, summary, actions]).catch(() => {});
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
            <Input label="Doctor Name" value={doctor} onChange={setDoctor} placeholder="e.g., Dr. Smith" required />
            <TextArea label="What did they say?" value={summary} onChange={setSummary} placeholder="Summary of the update..." required rows={4} />
            <TextArea label="Action Items (optional)" value={actions} onChange={setActions} placeholder="Follow-up tasks, next steps..." />
            <Button type="submit" variant="cta">Save Update</Button>
          </form>
        </Card>
      )}
    </>
  );
}
