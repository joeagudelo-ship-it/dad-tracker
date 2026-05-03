"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SHEETS, formatTimestamp } from "@/lib/sheets";
import { appendToSheet } from "@/lib/actions";
import { Card, Button, Input, Select, TextArea } from "@/components/ui";

export function ShiftForm() {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [person, setPerson] = useState("");
  const [shift, setShift] = useState("Morning");
  const [notes, setNotes] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!person.trim()) return;
    setSubmitting(true);
    await appendToSheet(SHEETS.shiftSchedule, [formatTimestamp().split(",")[0], person, shift, notes]);
    setPerson(""); setNotes(""); setShift("Morning");
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
            <Select
              label="Shift"
              value={shift}
              onChange={setShift}
              options={[
                { value: "Morning", label: "Morning (6am - 2pm)" },
                { value: "Afternoon", label: "Afternoon (2pm - 8pm)" },
                { value: "Evening", label: "Evening (8pm - 12am)" },
                { value: "Night", label: "Night (12am - 6am)" },
              ]}
            />
            <TextArea label="Notes (optional)" value={notes} onChange={setNotes} placeholder="Any special instructions..." />
            <Button type="submit" variant="cta" disabled={submitting}>
              {submitting ? "Saving..." : "Save Shift"}
            </Button>
          </form>
        </Card>
      )}
    </>
  );
}
