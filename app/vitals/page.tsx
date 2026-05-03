import { getSheetData, SHEETS, formatDate } from "@/lib/sheets";
import { Card, EmptyState } from "@/components/ui";
import { VitalsForm } from "./VitalsForm";

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

const emptyIcon = (
  <svg className="w-10 h-10 text-[#e11d48]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
  </svg>
);

export default async function VitalsPage() {
  const data = await getSheetData(SHEETS.vitals);
  const entries = data.length > 1 ? data.slice(1).reverse() : [];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-[#164e63] dark:text-[#f8fafc]">Vitals</h2>
          <p className="text-[#64748b] dark:text-[#94a3b8] text-sm font-medium">Health measurements and readings</p>
        </div>
      </div>

      <VitalsForm />

      {entries.length === 0 ? (
        <EmptyState
          title="No vitals recorded yet"
          description="Start tracking health measurements"
          icon={emptyIcon}
        />
      ) : (
        <div className="space-y-3">
          {entries.map((row: string[], i: number) => {
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
