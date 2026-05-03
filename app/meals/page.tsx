import { getSheetData, SHEETS, formatDate } from "@/lib/sheets";
import { Card, EmptyState } from "@/components/ui";
import { MealsForm } from "./MealsForm";

export default async function MealsPage() {
  const data = await getSheetData(SHEETS.meals);
  const entries = data.length > 1 ? data.slice(1).reverse() : [];

  const emptyIcon = (
    <svg className="w-10 h-10 text-[#ea580c]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.72 6 11.25v3.15c0 1.53.845 2.74 1.976 2.834a49.056 49.056 0 018.048 0C17.155 17.15 18 15.94 18 14.4V11.25c0-1.53-.845-2.74-1.976-2.834A48.483 48.483 0 0012 8.25z" />
    </svg>
  );

  const appetiteColors: Record<string, string> = {
    Good: "bg-[#d1fae5] dark:bg-[#064e3b] text-[#059669]",
    Fair: "bg-[#fef3c7] dark:bg-[#422006] text-[#d97706]",
    Poor: "bg-[#fee2e2] dark:bg-[#450a0a] text-[#dc2626]",
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-[#164e63] dark:text-[#f8fafc]">Meals</h2>
          <p className="text-[#64748b] dark:text-[#94a3b8] text-sm font-medium">Food intake and appetite</p>
        </div>
      </div>

      <MealsForm />

      {entries.length === 0 ? (
        <EmptyState
          title="No meals recorded yet"
          description="Track what your dad eats and his appetite"
          icon={emptyIcon}
        />
      ) : (
        <div className="space-y-3">
          {entries.map((row: string[], i: number) => {
            const appColor = appetiteColors[row[2]] || "bg-[#f1f5f9] dark:bg-[#334155] text-[#64748b]";
            return (
              <Card key={i} className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#ffedd5] dark:bg-[#431407] rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-5 h-5 text-[#ea580c]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.72 6 11.25v3.15c0 1.53.845 2.74 1.976 2.834a49.056 49.056 0 018.048 0C17.155 17.15 18 15.94 18 14.4V11.25c0-1.53-.845-2.74-1.976-2.834A48.483 48.483 0 0012 8.25z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[#1e293b] dark:text-[#f8fafc] text-lg">{row[1]}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${appColor}`}>
                        Appetite: {row[2] || "N/A"}
                      </span>
                    </div>
                    {row[3] && <p className="text-sm text-[#64748b] dark:text-[#94a3b8] mt-2 leading-relaxed">{row[3]}</p>}
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
