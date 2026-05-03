import { getSheetData, SHEETS, formatDate } from "@/lib/sheets";
import { Card, EmptyState, Button } from "@/components/ui";
import { DoctorForm } from "./DoctorForm";

export default async function DoctorPage() {
  const data = await getSheetData(SHEETS.doctorUpdates);
  const entries = data.length > 1 ? data.slice(1).reverse() : [];

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
      </div>

      <DoctorForm />

      {entries.length === 0 ? (
        <EmptyState
          title="No doctor updates yet"
          description="Record what the doctors have said"
          icon={emptyIcon}
        />
      ) : (
        <div className="space-y-3">
          {entries.map((row: string[], i: number) => (
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
