import Link from "next/link";
import { getAllSheetsData, buildTimeline, TimelineEvent, formatDate, SECTION_COLORS, getTodayKey } from "@/lib/sheets";
import { Card, Badge, Button } from "@/components/ui";
import { QuickStatus } from "@/components/QuickStatus";
import { EventLog } from "@/components/EventLog";
import { TimelineIcon } from "@/components/TimelineIcon";

const sections = [
  { name: "Care Needs", path: "/care", icon: "care", shortName: "Care" },
  { name: "Doctor Updates", path: "/doctor", icon: "doctor", shortName: "Doctors" },
  { name: "General Notes", path: "/notes", icon: "note", shortName: "Notes" },
  { name: "Vitals", path: "/vitals", icon: "vital", shortName: "Vitals" },
  { name: "Visitors", path: "/visitors", icon: "visitor", shortName: "Visitors" },
  { name: "Shift Schedule", path: "/shift", icon: "shift", shortName: "Shifts" },
  { name: "Meals", path: "/meals", icon: "meal", shortName: "Meals" },
];

const iconPaths: Record<string, string> = {
  care: "M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z",
  doctor: "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z",
  note: "M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10",
  vital: "M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z",
  visitor: "M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z",
  shift: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z",
  meal: "M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.72 6 11.25v3.15c0 1.53.845 2.74 1.976 2.834a49.056 49.056 0 018.048 0C17.155 17.15 18 15.94 18 14.4V11.25c0-1.53-.845-2.74-1.976-2.834A48.483 48.483 0 0012 8.25z",
};

const colorMap: Record<string, { bg: string; text: string; gradient: string }> = {
  care: { bg: "bg-[#cffafe] dark:bg-[#083344]", text: "text-[#0891b2]", gradient: "from-[#0891b2] to-[#06b6d4]" },
  doctor: { bg: "bg-[#d1fae5] dark:bg-[#064e3b]", text: "text-[#059669]", gradient: "from-[#059669] to-[#10b981]" },
  note: { bg: "bg-[#ede9fe] dark:bg-[#2e1065]", text: "text-[#7c3aed]", gradient: "from-[#7c3aed] to-[#8b5cf6]" },
  vital: { bg: "bg-[#ffe4e6] dark:bg-[#4c0519]", text: "text-[#e11d48]", gradient: "from-[#e11d48] to-[#f43f5e]" },
  visitor: { bg: "bg-[#fef3c7] dark:bg-[#422006]", text: "text-[#d97706]", gradient: "from-[#d97706] to-[#f59e0b]" },
  shift: { bg: "bg-[#dbeafe] dark:bg-[#1e3a5f]", text: "text-[#2563eb]", gradient: "from-[#2563eb] to-[#3b82f6]" },
  meal: { bg: "bg-[#ffedd5] dark:bg-[#431407]", text: "text-[#ea580c]", gradient: "from-[#ea580c] to-[#f97316]" },
};

export default async function HomePage() {
  const allData = await getAllSheetsData();
  const events = buildTimeline(allData);

  const counts: Record<string, number> = {};
  sections.forEach((s) => {
    const data = allData[s.name] || [];
    counts[s.name] = data.length > 1 ? data.length - 1 : 0;
  });

  const recentEvents = events.slice(0, 5);

  const totalEntries = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#0891b2] to-[#0e7490] dark:from-[#155e75] dark:to-[#164e63] rounded-3xl p-5 text-white shadow-lg shadow-[#0891b2]/20">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-extrabold leading-tight">Dad Tracker</h2>
            <p className="text-white/70 text-sm font-medium">
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </p>
          </div>
          <Link href={`/day/${encodeURIComponent(getTodayKey())}`} className="flex-shrink-0">
            <div className="bg-white/20 hover:bg-white/30 rounded-2xl px-4 py-3 text-center transition-colors cursor-pointer">
              <p className="text-xl font-extrabold">{new Date().getDate()}</p>
              <p className="text-[10px] text-white/70 font-semibold uppercase">Today</p>
            </div>
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/10 rounded-2xl p-3 text-center">
            <p className="text-2xl font-extrabold">{totalEntries}</p>
            <p className="text-[11px] text-white/70 font-semibold uppercase tracking-wider">Total Entries</p>
          </div>
          <div className="bg-white/10 rounded-2xl p-3 text-center">
            <p className="text-2xl font-extrabold">{events.length > 0 ? new Set(events.map(e => e.date)).size : 0}</p>
            <p className="text-[11px] text-white/70 font-semibold uppercase tracking-wider">Active Days</p>
          </div>
          <div className="bg-white/10 rounded-2xl p-3 text-center">
            <p className="text-2xl font-extrabold">{sections.length}</p>
            <p className="text-[11px] text-white/70 font-semibold uppercase tracking-wider">Sections</p>
          </div>
        </div>
      </div>

      {/* Quick Status */}
      <QuickStatus />

      {/* Event Log */}
      <EventLog />

      {/* Sections Grid */}
      <div>
        <h3 className="text-lg font-extrabold text-[#164e63] dark:text-[#f8fafc] mb-3">Sections</h3>
        <div className="grid grid-cols-2 gap-3">
          {sections.map((s) => {
            const colors = colorMap[s.icon];
            return (
              <Link key={s.path} href={s.path} className="block">
                <Card interactive className="p-4">
                  <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center mb-3 shadow-sm`}>
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d={iconPaths[s.icon]} />
                    </svg>
                  </div>
                  <p className="text-2xl font-extrabold text-[#1e293b] dark:text-[#f8fafc]">{counts[s.name] || 0}</p>
                  <p className="text-sm text-[#64748b] dark:text-[#94a3b8] font-semibold">{s.shortName}</p>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      {recentEvents.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-extrabold text-[#164e63] dark:text-[#f8fafc]">Recent Activity</h3>
            <Link href="/timeline" className="text-sm font-bold text-[#0891b2] dark:text-[#22d3ee] hover:underline cursor-pointer">
              View all
            </Link>
          </div>
          <div className="space-y-2">
            {recentEvents.map((event, i) => {
              const colors = SECTION_COLORS[event.type];
              return (
                <Card key={i} className="p-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl ${colors.bg} dark:bg-transparent flex items-center justify-center flex-shrink-0`}>
                      <div className={TimelineIcon.getText(event.type)}>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d={
                            event.type === "care" ? iconPaths.care :
                            event.type === "doctor" ? iconPaths.doctor :
                            event.type === "note" ? iconPaths.note :
                            event.type === "vital" ? iconPaths.vital :
                            event.type === "visitor" ? iconPaths.visitor :
                            event.type === "shift" ? iconPaths.shift :
                            event.type === "status" ? "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" :
                            event.type === "event" ? iconPaths.note :
                            iconPaths.meal
                          } />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[#1e293b] dark:text-[#f8fafc] text-sm truncate">{event.title}</p>
                      <p className={`text-[10px] font-semibold ${colors.text} dark:text-${colors.text}`}>{event.subtitle}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-[10px] text-[#94a3b8] dark:text-[#64748b] font-medium">{event.time}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
