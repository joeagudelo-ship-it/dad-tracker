import { getSheetData, SHEETS, formatDate } from "@/lib/sheets";
import { Card, EmptyState } from "@/components/ui";
import { VisitorForm } from "./VisitorForm";

const emptyIcon = (
  <svg className="w-10 h-10 text-[#d97706]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
  </svg>
);

export default async function VisitorsPage() {
  const data = await getSheetData(SHEETS.visitorLog);
  const entries = data.length > 1 ? data.slice(1).reverse() : [];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-[#164e63] dark:text-[#f8fafc]">Visitors</h2>
          <p className="text-[#64748b] dark:text-[#94a3b8] text-sm font-medium">Who stopped by today</p>
        </div>
      </div>

      <VisitorForm />

      {entries.length === 0 ? (
        <EmptyState
          title="No visitors yet"
          description="Log who comes to visit your dad"
          icon={emptyIcon}
        />
      ) : (
        <div className="space-y-3">
          {entries.map((row: string[], i: number) => (
            <Card key={i} className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-[#fef3c7] dark:bg-[#422006] rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-5 h-5 text-[#d97706] dark:text-[#fbbf24]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[#1e293b] dark:text-[#f8fafc] text-lg">{row[0]}</p>
                  <p className="text-sm text-[#64748b] dark:text-[#94a3b8] mt-1 font-medium">
                    Checked in: {formatDate(row[1])}
                  </p>
                  {row[2] && (
                    <p className="text-sm text-[#059669] dark:text-[#34d399] mt-1 font-medium">
                      Checked out: {row[2]}
                    </p>
                  )}
                  {row[3] && <p className="text-sm text-[#64748b] dark:text-[#94a3b8] mt-2 leading-relaxed">{row[3]}</p>}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
