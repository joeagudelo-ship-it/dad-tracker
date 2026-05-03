import Link from "next/link";
import { getAllSheetsData, buildTimeline, TimelineEvent, formatDateOnly } from "@/lib/sheets";
import { Card } from "@/components/ui";
import { TimelineIcon } from "@/components/TimelineIcon";

function groupByDate(events: TimelineEvent[]): Map<string, TimelineEvent[]> {
  const groups = new Map<string, TimelineEvent[]>();
  events.forEach((event) => {
    const key = event.date || "Unknown";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(event);
  });
  return groups;
}

function TimelineItem({ event }: { event: TimelineEvent }) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className={`w-9 h-9 rounded-xl ${TimelineIcon.getBg(event.type)} flex items-center justify-center flex-shrink-0`}>
          {TimelineIcon.get(event.type)}
        </div>
      </div>
      <div className="flex-1 min-w-0 pb-6 border-l-2 border-[#e2e8f0] dark:border-[#334155] ml-4 pl-5">
        <p className="font-bold text-[#1e293b] dark:text-[#f8fafc] text-base leading-snug">{event.title}</p>
        <p className={`text-xs font-semibold mt-0.5 ${TimelineIcon.getText(event.type)}`}>{event.subtitle}</p>
        {event.details && <p className="text-sm text-[#64748b] dark:text-[#94a3b8] mt-1.5 leading-relaxed">{event.details}</p>}
        {event.meta?.actions && (
          <div className="mt-2 bg-[#fef3c7] dark:bg-[#422006] rounded-lg px-3 py-2">
            <p className="text-[10px] font-bold text-[#d97706] uppercase tracking-wider mb-0.5">Action Items</p>
            <p className="text-sm text-[#92400e] dark:text-[#fde68a]">{event.meta.actions}</p>
          </div>
        )}
        {event.time && <p className="text-xs text-[#94a3b8] dark:text-[#64748b] mt-1.5 font-medium">{event.time}</p>}
      </div>
    </div>
  );
}

export default async function TimelinePage() {
  const allData = await getAllSheetsData();
  const events = buildTimeline(allData);
  const grouped = groupByDate(events);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-extrabold text-[#164e63] dark:text-[#f8fafc]">Timeline</h2>
        <p className="text-[#64748b] dark:text-[#94a3b8] text-sm font-medium">Everything in chronological order</p>
      </div>

      {events.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="w-16 h-16 bg-[#f1f5f9] dark:bg-[#334155] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[#94a3b8]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="font-bold text-[#1e293b] dark:text-[#f8fafc]">No activity yet</p>
          <p className="text-sm text-[#64748b] dark:text-[#94a3b8] mt-1">Start adding entries to see the timeline</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {Array.from(grouped.entries()).map(([date, dayEvents]) => (
            <div key={date}>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px flex-1 bg-[#e2e8f0] dark:bg-[#334155]" />
                <Link href={`/day/${encodeURIComponent(date)}`} className="text-xs font-bold text-[#0891b2] dark:text-[#22d3ee] whitespace-nowrap px-3 py-1.5 bg-[#cffafe] dark:bg-[#083344] rounded-full hover:bg-[#a5f3fc] dark:hover:bg-[#155e75] transition-colors cursor-pointer">
                  {formatDateOnly(date + ", 2026")}
                </Link>
                <div className="h-px flex-1 bg-[#e2e8f0] dark:bg-[#334155]" />
              </div>
              <div>
                {dayEvents.map((event, i) => (
                  <TimelineItem key={`${date}-${i}`} event={event} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
