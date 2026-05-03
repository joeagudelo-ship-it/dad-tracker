export const API_KEY = "AIzaSyCOEvahY8ZkDsih7hy5WzDK6wHJb495JXg";
export const SPREADSHEET_ID = "1KZaPRqgRz6EAi0tyOJ2oraYK2Jb01dTIYB2aZKjOcTc";

export const SHEETS = {
  careNeeds: "CareNeeds",
  doctorUpdates: "DoctorUpdates",
  generalNotes: "GeneralNotes",
  vitals: "Vitals",
  visitorLog: "VisitorLog",
  shiftSchedule: "ShiftSchedule",
  quickStatus: "QuickStatus",
  meals: "Meals",
  eventLog: "EventLog",
} as const;

export const HEADERS: Record<string, string[]> = {
  [SHEETS.careNeeds]: ["Date", "Item", "Status", "Priority", "Notes"],
  [SHEETS.doctorUpdates]: ["Date/Time", "Doctor", "Summary", "Action Items"],
  [SHEETS.generalNotes]: ["Date/Time", "Author", "Note"],
  [SHEETS.vitals]: ["Date/Time", "Type", "Value", "Unit", "Notes"],
  [SHEETS.visitorLog]: ["Name", "Check-In", "Check-Out", "Notes"],
  [SHEETS.shiftSchedule]: ["Date", "Person", "Shift Start", "Shift End", "Notes"],
  [SHEETS.quickStatus]: ["Date/Time", "Author", "Status", "Notes"],
  [SHEETS.meals]: ["Date/Time", "Meal", "Appetite", "Notes"],
  [SHEETS.eventLog]: ["Date/Time", "Author", "Event", "Notes"],
};

const BASE_URL = "https://sheets.googleapis.com/v4/spreadsheets";
const REVALIDATE = 15;

export async function getSheetData(sheetName: string) {
  const url = `${BASE_URL}/${SPREADSHEET_ID}/values/${encodeURIComponent(sheetName)}?key=${API_KEY}`;
  const res = await fetch(url, { next: { revalidate: REVALIDATE } });
  if (!res.ok) return [];
  const data = await res.json();
  return data.values || [];
}

export async function getAllSheetsData() {
  const sheetNames = Object.values(SHEETS);
  const ranges = sheetNames.map((s) => `ranges=${encodeURIComponent(s)}`).join("&");
  const url = `${BASE_URL}/${SPREADSHEET_ID}/values:batchGet?${ranges}&key=${API_KEY}`;
  const res = await fetch(url, { next: { revalidate: REVALIDATE } });
  if (!res.ok) return {};
  const data = await res.json();
  const result: Record<string, string[][]> = {};
  data.valueRanges?.forEach((vr: { range: string; values?: string[][] }) => {
    const sheetName = vr.range.split("!")[0];
    result[sheetName] = vr.values || [];
  });
  return result;
}

export interface TimelineEvent {
  date: string;
  time: string;
  type: "care" | "doctor" | "note" | "vital" | "visitor" | "shift" | "status" | "meal" | "event";
  title: string;
  subtitle: string;
  details?: string;
  meta?: Record<string, string>;
}

export function buildTimeline(allData: Record<string, string[][]>): TimelineEvent[] {
  const events: TimelineEvent[] = [];

  const care = (allData[SHEETS.careNeeds] || []).slice(1);
  care.forEach((row) => {
    if (!row[0] && !row[1]) return;
    events.push({
      date: parseDate(row[0]),
      time: parseTime(row[0]),
      type: "care",
      title: row[1] || "Care Need",
      subtitle: `${row[2] || "Needed"} · ${row[3] || "Medium"} priority`,
      details: row[4],
    });
  });

  const doctors = (allData[SHEETS.doctorUpdates] || []).slice(1);
  doctors.forEach((row) => {
    if (!row[0] && !row[1]) return;
    events.push({
      date: parseDate(row[0]),
      time: parseTime(row[0]),
      type: "doctor",
      title: row[1],
      subtitle: "Doctor Update",
      details: row[2],
      meta: { actions: row[3] || "" },
    });
  });

  const notes = (allData[SHEETS.generalNotes] || []).slice(1);
  notes.forEach((row) => {
    if (!row[0] && !row[2]) return;
    events.push({
      date: parseDate(row[0]),
      time: parseTime(row[0]),
      type: "note",
      title: row[1] || "Anonymous",
      subtitle: "Note",
      details: row[2],
    });
  });

  const vitals = (allData[SHEETS.vitals] || []).slice(1);
  vitals.forEach((row) => {
    if (!row[0] && !row[1]) return;
    events.push({
      date: parseDate(row[0]),
      time: parseTime(row[0]),
      type: "vital",
      title: `${row[1]}: ${row[2]} ${row[3] || ""}`,
      subtitle: "Vital Reading",
      details: row[4],
    });
  });

  const visitors = (allData[SHEETS.visitorLog] || []).slice(1);
  visitors.forEach((row) => {
    if (!row[0]) return;
    events.push({
      date: parseDate(row[1]),
      time: parseTime(row[1]),
      type: "visitor",
      title: row[0],
      subtitle: `Checked in${row[1] ? " at " + parseTime(row[1]) : ""}`,
      details: row[3],
      meta: { checkOut: row[2] || "" },
    });
  });

  const shifts = (allData[SHEETS.shiftSchedule] || []).slice(1);
  shifts.forEach((row) => {
    if (!row[0] && !row[1]) return;
    events.push({
      date: parseDate(row[0]),
      time: "",
      type: "shift",
      title: row[1],
      subtitle: row[2] || "Shift",
      details: row[3],
    });
  });

  const statuses = (allData[SHEETS.quickStatus] || []).slice(1);
  statuses.forEach((row) => {
    if (!row[0]) return;
    events.push({
      date: parseDate(row[0]),
      time: parseTime(row[0]),
      type: "status",
      title: row[2] || "Status Update",
      subtitle: row[1] || "Anonymous",
      details: row[3],
    });
  });

  const meals = (allData[SHEETS.meals] || []).slice(1);
  meals.forEach((row) => {
    if (!row[0]) return;
    events.push({
      date: parseDate(row[0]),
      time: parseTime(row[0]),
      type: "meal",
      title: row[1] || "Meal",
      subtitle: `Appetite: ${row[2] || "N/A"}`,
      details: row[3],
    });
  });

  const eventLogs = (allData[SHEETS.eventLog] || []).slice(1);
  eventLogs.forEach((row) => {
    if (!row[0]) return;
    events.push({
      date: parseDate(row[0]),
      time: parseTime(row[0]),
      type: "event",
      title: row[2] || "Event",
      subtitle: row[1] || "Logged",
      details: row[3],
    });
  });

  events.sort((a, b) => {
    const dateA = new Date(`${a.date} ${a.time}`);
    const dateB = new Date(`${b.date} ${b.time}`);
    return dateB.getTime() - dateA.getTime();
  });

  return events;
}

function parseDate(val: string): string {
  if (!val) return "";
  const parts = val.split(",");
  return parts[0]?.trim() || "";
}

function parseTime(val: string): string {
  if (!val) return "";
  const parts = val.split(",");
  return parts[1]?.trim() || "";
}

export function formatTimestamp(): string {
  return new Date().toLocaleString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatDate(date: string): string {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return date;
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatDateOnly(date: string): string {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function getTodayKey(): string {
  const now = new Date();
  return `${String(now.getMonth() + 1).padStart(2, "0")}/${String(now.getDate()).padStart(2, "0")}/${now.getFullYear()}`;
}

export function getDaysInMonth(year: number, month: number): Date[] {
  const days: Date[] = [];
  const date = new Date(year, month, 1);
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}
