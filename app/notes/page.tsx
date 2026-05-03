import { getSheetData, SHEETS, formatDate } from "@/lib/sheets";
import { Card, EmptyState, Button } from "@/components/ui";
import { NotesForm } from "./NotesForm";

export default async function NotesPage() {
  const data = await getSheetData(SHEETS.generalNotes);
  const entries = data.length > 1 ? data.slice(1).reverse() : [];

  const emptyIcon = (
    <svg className="w-10 h-10 text-[#7c3aed]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
    </svg>
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-[#164e63] dark:text-[#f8fafc]">General Notes</h2>
          <p className="text-[#64748b] dark:text-[#94a3b8] text-sm font-medium">Observations and thoughts</p>
        </div>
      </div>

      <NotesForm />

      {entries.length === 0 ? (
        <EmptyState
          title="No notes yet"
          description="Share observations and thoughts about your dad"
          icon={emptyIcon}
        />
      ) : (
        <div className="space-y-3">
          {entries.map((row: string[], i: number) => (
            <Card key={i} className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-[#ede9fe] dark:bg-[#2e1065] rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-5 h-5 text-[#7c3aed]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-[#1e293b] dark:text-[#f8fafc]">{row[1] || "Anonymous"}</span>
                  </div>
                  <p className="text-sm text-[#334155] dark:text-[#cbd5e1] leading-relaxed whitespace-pre-wrap">{row[2]}</p>
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
