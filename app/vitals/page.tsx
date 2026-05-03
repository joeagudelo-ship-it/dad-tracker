"use client";

import { useEffect, useState } from "react";
import { getSheetData, appendToSheet, SHEETS, formatTimestamp, formatDate } from "@/lib/sheets";
import { Card, LoadingState, EmptyState, Button, Input, Select, TextArea } from "@/components/ui";

const vitalTypes = [
  { value: "Temperature", label: "Temperature", unit: "F", icon: "temp" },
  { value: "Blood Pressure", label: "Blood Pressure", unit: "mmHg", icon: "bp" },
  { value: "Heart Rate", label: "Heart Rate", unit: "bpm", icon: "hr" },
  { value: "Oxygen", label: "Oxygen (SpO2)", unit: "%", icon: "o2" },
  { value: "Blood Sugar", label: "Blood Sugar", unit: "mg/dL", icon: "bs" },
  { value: "Respiratory Rate", label: "Respiratory Rate", unit: "breaths/min", icon: "rr" },
  { value: "Pain Level", label: "Pain Level", unit: "/10", icon: "pain" },
  { value: "Other", label: "Other", unit: "", icon: "other" },
];

export default function VitalsPage() {
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState<string[][]>([]);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [type, setType] = useState("Temperature");
  const [value, setValue] = useState("");
  const [notes, setNotes] = useState("");

  const currentType = vitalTypes.find((t) => t.value === type);
  const unit = currentType?.unit || "";

  const fetchData = async () => {
    const data = await getSheetData(SHEETS.vitals);
    setEntries(data.length > 1 ? data.slice(1).reverse() : []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    setSubmitting(true);
    await appendToSheet(SHEETS.vitals, [formatTimestamp(), type, value, unit, notes]);
    setValue(""); setNotes(""); setType("Temperature");
    setShowForm(false);
    await fetchData();
    setSubmitting(false);
  };

  if (loading) return <LoadingState />;

  const emptyIcon = (
    <svg className="w-10 h-10 text-[#e11d48]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  );

  function getVitalColor(t: string) {
    switch (t) {
      case "Temperature": return { bg: "bg-[#fef3c7] dark:bg-[#422006]", text: "text-[#d97706]" };
      case "Blood Pressure": return { bg: "bg-[#fee2e2] dark:bg-[#450a0a]", text: "text-[#dc2626]" };
      case "Heart Rate": return { bg: "bg-[#ffe4e6] dark:bg-[#4c0519]", text: "text-[#e11d48]" };
      case "Oxygen": return { bg: "bg-[#dbeafe] dark:bg-[#1e3a5f]", text: "text-[#2563eb]" };
      case "Blood Sugar": return { bg: "bg-[#ede9fe] dark:bg-[#2e1065]", text: "text-[#7c3aed]" };
      default: return { bg: "bg-[#f1f5f9] dark:bg-[#334155]", text: "text-[#64748b]" };
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-[#164e63] dark:text-[#f8fafc]">Vitals</h2>
          <p className="text-[#64748b] dark:text-[#94a3b8] text-sm font-medium">Health measurements and readings</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} variant={showForm ? "secondary" : "primary"} className="w-auto px-5">
          {showForm ? "Cancel" : "+ Add"}
        </Button>
      </div>

      {showForm && (
        <Card className="p-5">
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

      {entries.length === 0 ? (
        <EmptyState
          title="No vitals recorded yet"
          description="Start tracking health measurements"
          icon={emptyIcon}
          action={<Button onClick={() => setShowForm(true)}>+ Record First Vitals</Button>}
        />
      ) : (
        <div className="space-y-3">
          {entries.map((row, i) => {
            const colors = getVitalColor(row[1] || "");
            return (
              <Card key={i} className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 ${colors.bg} rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    <svg className={`w-5 h-5 ${colors.text}`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-[#1e293b] dark:text-[#f8fafc]">{row[1]}</span>
                      <span className="text-xs text-[#64748b] dark:text-[#94a3b8] font-medium">{row[3]}</span>
                    </div>
                    <p className="text-2xl font-extrabold text-[#0891b2] dark:text-[#22d3ee]">{row[2]}</p>
                    {row[4] && <p className="text-sm text-[#64748b] dark:text-[#94a3b8] mt-2 leading-relaxed">{row[4]}</p>}
                    <p className="text-xs text-[#94a3b8] dark:text-[#64748b] mt-2 font-medium">{formatDate(row[0])}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
