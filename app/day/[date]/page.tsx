import Link from "next/link";
import { getAllSheetsData, buildTimeline, TimelineEvent, formatTimestamp } from "@/lib/sheets";
import { Card } from "@/components/ui";
import { TimelineIcon } from "@/components/TimelineIcon";
import { notFound } from "next/navigation";

export default async function DayPage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;
  const allData = await getAllSheetsData();
  const events = buildTimeline(allData);
  const dayEvents = events.filter((e) => e.date === date);

  if (dayEvents.length === 0 && !date) {
    notFound();
  }

  const dateObj = new Date(date.replace(/\//g, "-"));
  const displayDate = isNaN(dateObj.getTime())
    ? date
    : dateObj.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/calendar" className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#f1f5f9] dark:bg-[#334155] text-[#64748b] hover:bg-[#e2e8f0] dark:hover:bg-[#475569] transition-colors flex-shrink-0">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </Link>
        <div>
          <h2 className="text-xl font-extrabold text-[#164e63] dark:text-[#f8fafc]">{displayDate}</h2>
          <p className="text-[#64748b] dark:text-[#94a3b8] text-sm font-medium">{dayEvents.length} event{dayEvents.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      {dayEvents.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="font-bold text-[#1e293b] dark:text-[#f8fafc]">No activity this day</p>
          <p className="text-sm text-[#64748b] dark:text-[#94a3b8] mt-1">Nothing was recorded on this date</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {dayEvents.map((event, i) => (
            <Card key={i} className="p-4">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${TimelineIcon.getBg(event.type)}`}>
                  {TimelineIcon.get(event.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[#1e293b] dark:text-[#f8fafc] text-base">{event.title}</p>
                  <p className={`text-xs font-semibold mt-0.5 ${TimelineIcon.getText(event.type)}`}>{event.subtitle}</p>
                  {event.details && <p className="text-sm text-[#64748b] dark:text-[#94a3b8] mt-1.5 leading-relaxed">{event.details}</p>}
                  {event.meta?.actions && (
                    <div className="mt-2 bg-[#fef3c7] dark:bg-[#422006] rounded-lg px-3 py-2">
                      <p className="text-[10px] font-bold text-[#d97706] uppercase tracking-wider mb-0.5">Action Items</p>
                      <p className="text-sm text-[#92400e] dark:text-[#fde68a]">{event.meta.actions}</p>
                    </div>
                  )}
                  {event.time && <p className="text-xs text-[#94a3b8] dark:text-[#64748b] mt-2 font-medium">{event.time}</p>}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
