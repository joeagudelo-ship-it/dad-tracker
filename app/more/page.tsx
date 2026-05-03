import Link from "next/link";
import { Card } from "@/components/ui";
import { TimelineIcon, SECTION_THEMES } from "@/components/TimelineIcon";

const sections = [
  { name: "Care Needs", path: "/care", desc: "Supplies, medications, tasks", type: "care" as const },
  { name: "Doctor Updates", path: "/doctor", desc: "Medical team notes", type: "doctor" as const },
  { name: "General Notes", path: "/notes", desc: "Family observations", type: "note" as const },
  { name: "Vitals", path: "/vitals", desc: "Health measurements", type: "vital" as const },
  { name: "Visitors", path: "/visitors", desc: "Who stopped by", type: "visitor" as const },
  { name: "Shift Schedule", path: "/shift", desc: "Who is covering", type: "shift" as const },
  { name: "Meals", path: "/meals", desc: "Food and appetite tracking", type: "meal" as const },
];

export default function MorePage() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-extrabold text-[#164e63] dark:text-[#f8fafc]">All Sections</h2>
        <p className="text-[#64748b] dark:text-[#94a3b8] text-sm font-medium">Every part of the tracker</p>
      </div>

      <div className="space-y-3">
        {sections.map((s) => {
          const theme = SECTION_THEMES[s.type];
          return (
            <Link key={s.path} href={s.path}>
              <Card interactive className="p-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${theme.bg}`}>
                    {TimelineIcon.get(s.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[#1e293b] dark:text-[#f8fafc]">{s.name}</p>
                    <p className="text-sm text-[#64748b] dark:text-[#94a3b8]">{s.desc}</p>
                  </div>
                  <svg className="w-5 h-5 text-[#94a3b8]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
