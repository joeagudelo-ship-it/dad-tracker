import Link from "next/link";
import { getAllSheetsData, buildTimeline, TimelineEvent, getTodayKey } from "@/lib/sheets";
import { getAllEvents, DBEvent } from "@/lib/supabase";
import { Card } from "@/components/ui";
import { QuickStatus } from "@/components/QuickStatus";
import { EventLog } from "@/components/EventLog";
import { TimelineIcon, ICON_PATHS, SECTION_THEMES } from "@/components/TimelineIcon";

const sections = [
  { name: "Care Needs", path: "/care", icon: "care" as const, shortName: "Care" },
  { name: "Doctor Updates", path: "/doctor", icon: "doctor" as const, shortName: "Doctors" },
  { name: "General Notes", path: "/notes", icon: "note" as const, shortName: "Notes" },
  { name: "Vitals", path: "/vitals", icon: "vital" as const, shortName: "Vitals" },
  { name: "Visitors", path: "/visitors", icon: "visitor" as const, shortName: "Visitors" },
  { name: "Shift Schedule", path: "/shift", icon: "shift" as const, shortName: "Shifts" },
  { name: "Meals", path: "/meals", icon: "meal" as const, shortName: "Meals" },
];

function dbEventToTimeline(e: DBEvent): TimelineEvent {
  return {
    date: e.date,
    time: e.time,
    type: e.type,
    title: e.title,
    subtitle: e.subtitle,
    details: e.details,
    meta: e.meta || {},
  };
}

async function fetchDashboardData() {
  try {
    const supabaseEvents = await getAllEvents();
    if (supabaseEvents.length > 0) {
      return {
        events: supabaseEvents.map(dbEventToTimeline),
        fromSupabase: true,
      };
    }
  } catch {}

  const allData = await getAllSheetsData();
  return {
    events: buildTimeline(allData),
    allData,
    fromSupabase: false,
  };
}

export default async function HomePage() {
  const data = await fetchDashboardData();
  const events = data.events;

  let counts: Record<string, number> = {};
  if (data.fromSupabase) {
    sections.forEach((s) => {
      counts[s.name] = events.filter((e) => e.type === s.icon).length;
    });
  } else {
    sections.forEach((s) => {
      const sheetData = data.allData![s.name] || [];
      counts[s.name] = sheetData.length > 1 ? sheetData.length - 1 : 0;
    });
  }

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
            const colors = SECTION_THEMES[s.icon];
            return (
              <Link key={s.path} href={s.path} className="block">
                <Card interactive className="p-4">
                  <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center mb-3 shadow-sm`}>
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d={ICON_PATHS[s.icon]} />
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
              const colors = SECTION_THEMES[event.type];
              return (
                <Card key={i} className="p-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                      {TimelineIcon.get(event.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[#1e293b] dark:text-[#f8fafc] text-sm truncate">{event.title}</p>
                      <p className={`text-[10px] font-semibold ${colors.text}`}>{event.subtitle}</p>
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
