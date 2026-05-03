"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SHEETS, formatTimestamp } from "@/lib/sheets";
import { appendToSheet } from "@/lib/actions";
import { Card, Button, Input, Select, TextArea } from "@/components/ui";

const vitalTypes = [
  { value: "Temperature", label: "Temperature", unit: "F" },
  { value: "Blood Pressure", label: "Blood Pressure", unit: "mmHg" },
  { value: "Heart Rate", label: "Heart Rate", unit: "bpm" },
  { value: "Oxygen", label: "Oxygen (SpO2)", unit: "%" },
  { value: "Blood Sugar", label: "Blood Sugar", unit: "mg/dL" },
  { value: "Respiratory Rate", label: "Respiratory Rate", unit: "breaths/min" },
  { value: "Pain Level", label: "Pain Level", unit: "/10" },
  { value: "Other", label: "Other", unit: "" },
];

export function VitalsForm() {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [type, setType] = useState("Temperature");
  const [value, setValue] = useState("");
  const [notes, setNotes] = useState("");

  const currentType = vitalTypes.find((t) => t.value === type);
  const unit = currentType?.unit || "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    setSubmitting(true);
    await appendToSheet(SHEETS.vitals, [formatTimestamp(), type, value, unit, notes]);
    setValue(""); setNotes(""); setType("Temperature");
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
            <Select
              label="Vital Type"
              value={type}
              onChange={setType}
              options={vitalTypes.map((t) => ({ value: t.value, label: t.label }))}
              required
            />
            <Input label={`Value${unit ? ` (${unit})` : ""}`} value={value} onChange={setValue} placeholder={`Enter ${type.toLowerCase()}...`} required type="text" />
            <TextArea label="Notes (optional)" value={notes} onChange={setNotes} placeholder="e.g., Taken after medication, Before meals..." />
            <Button type="submit" variant="cta" disabled={submitting}>
              {submitting ? "Saving..." : "Save Reading"}
            </Button>
          </form>
        </Card>
      )}
    </>
  );
}
