export const API_KEY = "AIzaSyCOEvahY8ZkDsih7hy5WzDK6wHJb495JXg";
export const SPREADSHEET_ID = "1KZaPRqgRz6EAi0tyOJ2oraYK2Jb01dTIYB2aZKjOcTc";

export const SHEETS = {
  careNeeds: "CareNeeds",
  doctorUpdates: "DoctorUpdates",
  generalNotes: "GeneralNotes",
  vitals: "Vitals",
  visitorLog: "VisitorLog",
} as const;

export const HEADERS: Record<string, string[]> = {
  [SHEETS.careNeeds]: ["Date", "Item", "Status", "Priority", "Notes"],
  [SHEETS.doctorUpdates]: ["Date/Time", "Doctor", "Summary", "Action Items"],
  [SHEETS.generalNotes]: ["Date/Time", "Author", "Note"],
  [SHEETS.vitals]: ["Date/Time", "Type", "Value", "Unit", "Notes"],
  [SHEETS.visitorLog]: ["Name", "Check-In", "Check-Out", "Notes"],
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

export async function appendToSheet(sheetName: string, values: string[]) {
  "use server";
  const url = `${BASE_URL}/${SPREADSHEET_ID}/values/${encodeURIComponent(sheetName)}:append?key=${API_KEY}&valueInputOption=USER_ENTERED`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ values: [values] }),
  });
  if (!res.ok) throw new Error(`Failed to append to ${sheetName}`);
  return res.json();
}

export async function initSheetHeaders() {
  "use server";
  const url = `${BASE_URL}/${SPREADSHEET_ID}/values:batchUpdate?key=${API_KEY}`;
  const data = {
    valueInputOption: "RAW",
    data: Object.entries(HEADERS).map(([sheet, headers]) => ({
      range: `${sheet}!A1`,
      majorDimension: "ROWS",
      values: [headers],
    })),
  };
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.ok;
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
