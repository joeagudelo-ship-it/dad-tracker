"use client";

import { useEffect, useState } from "react";
import { getSheetData, appendToSheet, SHEETS, formatTimestamp, formatDate } from "@/lib/sheets";
import { Card, Badge, LoadingState, EmptyState, Button, Input, TextArea, Select } from "@/components/ui";

export default function CarePage() {
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState<string[][]>([]);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [item, setItem] = useState("");
  const [status, setStatus] = useState("Needed");
  const [priority, setPriority] = useState("Medium");
  const [notes, setNotes] = useState("");

  const fetchData = async () => {
    const data = await getSheetData(SHEETS.careNeeds);
    setEntries(data.length > 1 ? data.slice(1).reverse() : []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item.trim()) return;
    setSubmitting(true);
    await appendToSheet(SHEETS.careNeeds, [formatTimestamp(), item, status, priority, notes]);
    setItem(""); setNotes(""); setStatus("Needed"); setPriority("Medium");
    setShowForm(false);
    await fetchData();
    setSubmitting(false);
  };

  if (loading) return <LoadingState />;

  const emptyIcon = (
    <svg className="w-10 h-10 text-[#0891b2]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
    </svg>
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-[#164e63] dark:text-[#f8fafc]">Care Needs</h2>
          <p className="text-[#64748b] dark:text-[#94a3b8] text-sm font-medium">Supplies, medications, tasks</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} variant={showForm ? "secondary" : "primary"} className="w-auto px-5">
          {showForm ? "Cancel" : "+ Add"}
        </Button>
      </div>

      {showForm && (
        <Card className="p-5">
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

      {entries.length === 0 ? (
        <EmptyState
          title="No care needs yet"
          description="Tap + Add to track what your dad needs"
          icon={emptyIcon}
          action={<Button onClick={() => setShowForm(true)}>+ Add First Item</Button>}
        />
      ) : (
        <div className="space-y-3">
          {entries.map((row, i) => (
            <Card key={i} className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[#1e293b] dark:text-[#f8fafc] text-lg leading-snug">{row[1]}</p>
                  <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                    <Badge variant={row[2] === "Done" ? "success" : row[2] === "In Progress" ? "warning" : "info"}>
                      {row[2] || "Needed"}
                    </Badge>
                    <Badge variant={row[3] === "High" ? "danger" : row[3] === "Medium" ? "warning" : "default"}>
                      {row[3] || "Medium"}
                    </Badge>
                  </div>
                  {row[4] && <p className="text-sm text-[#64748b] dark:text-[#94a3b8] mt-2.5 leading-relaxed">{row[4]}</p>}
                  <p className="text-xs text-[#94a3b8] dark:text-[#64748b] mt-2 font-medium">{formatDate(row[0])}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
