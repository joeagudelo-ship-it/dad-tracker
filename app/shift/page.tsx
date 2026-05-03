import { getSheetData, SHEETS, formatDate } from "@/lib/sheets";
import { Card, EmptyState } from "@/components/ui";
import { ShiftForm } from "./ShiftForm";

export default async function ShiftPage() {
  const data = await getSheetData(SHEETS.shiftSchedule);
  const entries = data.length > 1 ? data.slice(1).reverse() : [];

  const emptyIcon = (
    <svg className="w-10 h-10 text-[#2563eb]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-[#164e63] dark:text-[#f8fafc]">Shift Schedule</h2>
          <p className="text-[#64748b] dark:text-[#94a3b8] text-sm font-medium">Who is covering and when</p>
        </div>
      </div>

      <ShiftForm />

      {entries.length === 0 ? (
        <EmptyState
          title="No shifts scheduled yet"
          description="Add who is covering and their times"
          icon={emptyIcon}
        />
      ) : (
        <div className="space-y-3">
          {entries.map((row: string[], i: number) => (
            <Card key={i} className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-[#dbeafe] dark:bg-[#1e3a5f] rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-5 h-5 text-[#2563eb]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[#1e293b] dark:text-[#f8fafc] text-lg">{row[1]}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-[#dbeafe] dark:bg-[#1e3a5f] text-[#2563eb]">
                      {row[2] || "Start"} → {row[3] || "End"}
                    </span>
                  </div>
                  {row[4] && <p className="text-sm text-[#64748b] dark:text-[#94a3b8] mt-2 leading-relaxed">{row[4]}</p>}
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
