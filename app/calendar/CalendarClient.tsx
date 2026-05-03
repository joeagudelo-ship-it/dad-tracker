"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { getDaysInMonth, buildTimeline } from "@/lib/sheets";
import { Card } from "@/components/ui";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function toDateKey(year: number, month: number, day: number): string {
  return `${String(month + 1).padStart(2, "0")}/${String(day).padStart(2, "0")}/${year}`;
}

export default function CalendarPage({
  allData,
}: {
  allData: Record<string, string[][]>;
}) {
  const now = new Date();
  const [currentMonth, setCurrentMonth] = useState(now.getMonth());
  const [currentYear, setCurrentYear] = useState(now.getFullYear());

  const eventDates = useMemo(() => {
    const events = buildTimeline(allData);
    return new Set(events.map((e) => e.date));
  }, [allData]);

  const days = useMemo(() => getDaysInMonth(currentYear, currentMonth), [currentYear, currentMonth]);
  const firstDayOfWeek = days[0]?.getDay() || 0;
  const prevMonthDays = getDaysInMonth(currentYear, currentMonth - 1).length;

  const today = new Date();
  const isCurrentMonth = today.getMonth() === currentMonth && today.getFullYear() === currentYear;
  const todayDate = today.getDate();

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    cells.push(prevMonthDays - firstDayOfWeek + 1 + i);
  }
  days.forEach((d) => cells.push(d.getDate()));
  while (cells.length % 7 !== 0) {
    cells.push(cells.length - days.length - firstDayOfWeek + 1);
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-extrabold text-[#164e63] dark:text-[#f8fafc]">Calendar</h2>
        <p className="text-[#64748b] dark:text-[#94a3b8] text-sm font-medium">Monthly overview of all activity</p>
      </div>

      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={prevMonth}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#f1f5f9] dark:bg-[#334155] text-[#64748b] dark:text-[#94a3b8] hover:bg-[#e2e8f0] dark:hover:bg-[#475569] transition-colors"
            aria-label="Previous month"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <h3 className="text-lg font-bold text-[#1e293b] dark:text-[#f8fafc]">
            {MONTHS[currentMonth]} {currentYear}
          </h3>
          <button
            onClick={nextMonth}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#f1f5f9] dark:bg-[#334155] text-[#64748b] dark:text-[#94a3b8] hover:bg-[#e2e8f0] dark:hover:bg-[#475569] transition-colors"
            aria-label="Next month"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAYS.map((d) => (
            <div key={d} className="text-center text-[11px] font-bold text-[#94a3b8] uppercase tracking-wider py-1">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {cells.map((day, i) => {
            const isPrevMonth = day !== null && i < firstDayOfWeek;
            const isNextMonth = day !== null && i >= firstDayOfWeek + days.length;
            const isToday = isCurrentMonth && day === todayDate;

            const cellMonth = isPrevMonth
              ? (currentMonth === 0 ? 11 : currentMonth - 1)
              : isNextMonth
                ? (currentMonth === 11 ? 0 : currentMonth + 1)
                : currentMonth;
            const cellYear = isPrevMonth && currentMonth === 0
              ? currentYear - 1
              : isNextMonth && currentMonth === 11
                ? currentYear + 1
                : currentYear;

            const dk = day !== null ? toDateKey(cellYear, cellMonth, day) : null;
            const hasEvent = dk ? eventDates.has(dk) : false;

            if (day === null) {
              return <div key={i} className="aspect-square" />;
            }

            return (
              <Link
                key={i}
                href={`/day/${encodeURIComponent(dk!)}`}
                className={`aspect-square flex flex-col items-center justify-center rounded-xl text-sm font-semibold transition-all relative
                  ${isPrevMonth || isNextMonth ? "text-[#cbd5e1] dark:text-[#475569]" : "text-[#1e293b] dark:text-[#f8fafc]"}
                  ${isToday ? "bg-[#0891b2] text-white font-bold" : "hover:bg-[#f1f5f9] dark:hover:bg-[#334155]"}
                  ${hasEvent && !isToday ? "bg-[#cffafe] dark:bg-[#083344]" : ""}
                `}
              >
                {day}
                {hasEvent && !isToday && (
                  <div className="flex gap-0.5 mt-0.5">
                    <div className="w-1 h-1 rounded-full bg-[#0891b2] dark:bg-[#22d3ee]" />
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </Card>

      <div className="flex items-center gap-4 text-xs text-[#64748b] dark:text-[#94a3b8] font-medium">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#0891b2]" />
          <span>Today</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#cffafe] dark:bg-[#083344] border border-[#0891b2]/20" />
          <span>Has entries</span>
        </div>
      </div>
    </div>
  );
}
