import Link from "next/link";
import { Card } from "@/components/ui";

const sections = [
  { name: "Care Needs", path: "/care", desc: "Supplies, medications, tasks", icon: "care", color: "cyan" },
  { name: "Doctor Updates", path: "/doctor", desc: "Medical team notes", icon: "doctor", color: "emerald" },
  { name: "General Notes", path: "/notes", desc: "Family observations", icon: "note", color: "violet" },
  { name: "Vitals", path: "/vitals", desc: "Health measurements", icon: "vital", color: "rose" },
  { name: "Visitors", path: "/visitors", desc: "Who stopped by", icon: "visitor", color: "amber" },
  { name: "Shift Schedule", path: "/shift", desc: "Who is covering", icon: "shift", color: "blue" },
  { name: "Meals", path: "/meals", desc: "Food and appetite tracking", icon: "meal", color: "orange" },
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

const colorMap: Record<string, { bg: string; text: string }> = {
  cyan: { bg: "bg-[#cffafe] dark:bg-[#083344]", text: "text-[#0891b2]" },
  emerald: { bg: "bg-[#d1fae5] dark:bg-[#064e3b]", text: "text-[#059669]" },
  violet: { bg: "bg-[#ede9fe] dark:bg-[#2e1065]", text: "text-[#7c3aed]" },
  rose: { bg: "bg-[#ffe4e6] dark:bg-[#4c0519]", text: "text-[#e11d48]" },
  amber: { bg: "bg-[#fef3c7] dark:bg-[#422006]", text: "text-[#d97706]" },
  blue: { bg: "bg-[#dbeafe] dark:bg-[#1e3a5f]", text: "text-[#2563eb]" },
  orange: { bg: "bg-[#ffedd5] dark:bg-[#431407]", text: "text-[#ea580c]" },
};

export default function MorePage() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-extrabold text-[#164e63] dark:text-[#f8fafc]">All Sections</h2>
        <p className="text-[#64748b] dark:text-[#94a3b8] text-sm font-medium">Every part of the tracker</p>
      </div>

      <div className="space-y-3">
        {sections.map((s) => {
          const colors = colorMap[s.color];
          return (
            <Link key={s.path} href={s.path}>
              <Card interactive className="p-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colors.bg}`}>
                    <svg className={`w-6 h-6 ${colors.text}`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d={iconPaths[s.icon]} />
                    </svg>
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
