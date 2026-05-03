"use client";

import { useEffect, useState } from "react";
import { getSheetData, appendToSheet, SHEETS, formatTimestamp, formatDate } from "@/lib/sheets";
import { Card, LoadingState, EmptyState, Button, Input, TextArea } from "@/components/ui";

export default function DoctorPage() {
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState<string[][]>([]);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [doctor, setDoctor] = useState("");
  const [summary, setSummary] = useState("");
  const [actions, setActions] = useState("");

  const fetchData = async () => {
    const data = await getSheetData(SHEETS.doctorUpdates);
    setEntries(data.length > 1 ? data.slice(1).reverse() : []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctor.trim() || !summary.trim()) return;
    setSubmitting(true);
    await appendToSheet(SHEETS.doctorUpdates, [formatTimestamp(), doctor, summary, actions]);
    setDoctor(""); setSummary(""); setActions("");
    setShowForm(false);
    await fetchData();
    setSubmitting(false);
  };

  if (loading) return <LoadingState />;

  const emptyIcon = (
    <svg className="w-10 h-10 text-[#059669]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-[#164e63] dark:text-[#f8fafc]">Doctor Updates</h2>
          <p className="text-[#64748b] dark:text-[#94a3b8] text-sm font-medium">What the medical team said</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} variant={showForm ? "secondary" : "primary"} className="w-auto px-5">
          {showForm ? "Cancel" : "+ Add"}
        </Button>
      </div>

      {showForm && (
        <Card className="p-5">
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

      {entries.length === 0 ? (
        <EmptyState
          title="No doctor updates yet"
          description="Record what the doctors have said"
          icon={emptyIcon}
          action={<Button onClick={() => setShowForm(true)}>+ Add First Update</Button>}
        />
      ) : (
        <div className="space-y-3">
          {entries.map((row, i) => (
            <Card key={i} className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-[#d1fae5] dark:bg-[#064e3b] rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-5 h-5 text-[#059669] dark:text-[#34d399]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[#1e293b] dark:text-[#f8fafc] text-base">{row[1]}</p>
                  <p className="text-sm text-[#334155] dark:text-[#cbd5e1] mt-2 leading-relaxed">{row[2]}</p>
                  {row[3] && (
                    <div className="mt-3 bg-[#fef3c7] dark:bg-[#422006] rounded-xl p-3">
                      <p className="text-xs font-bold text-[#d97706] dark:text-[#fbbf24] uppercase tracking-wide mb-1">Action Items</p>
                      <p className="text-sm text-[#92400e] dark:text-[#fde68a] leading-relaxed">{row[3]}</p>
                    </div>
                  )}
                  <p className="text-xs text-[#94a3b8] dark:text-[#64748b] mt-3 font-medium">{formatDate(row[0])}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
