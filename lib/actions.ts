"use server";

import { API_KEY, SPREADSHEET_ID, HEADERS } from "./sheets";
import { supabase } from "./supabase";

const BASE_URL = "https://sheets.googleapis.com/v4/spreadsheets";

const TYPE_TO_SHEET: Record<string, string> = {
  care: "CareNeeds",
  doctor: "DoctorUpdates",
  note: "GeneralNotes",
  vital: "Vitals",
  visitor: "VisitorLog",
  shift: "ShiftSchedule",
  status: "QuickStatus",
  meal: "Meals",
  event: "EventLog",
};

export async function syncEventToSheets(eventId: string) {
  console.log(`[syncEventToSheets] START - eventId: ${eventId}`);
  if (!supabase) {
    console.log(`[syncEventToSheets] SKIP - Supabase not configured`);
    return { ok: false, error: "Supabase not configured" };
  }
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", eventId)
    .single();
  if (error || !data) {
    console.log(`[syncEventToSheets] FAIL - Event not found: ${error?.message || 'no data'}`);
    return { ok: false, error: "Event not found" };
  }

  console.log(`[syncEventToSheets] Found event - type: ${data.type}, title: ${data.title}`);
  const sheetName = TYPE_TO_SHEET[data.type] || "EventLog";
  let row: string[] = [];

  switch (data.type) {
    case "care":
      row = [data.date, data.title, data.subtitle, data.details, ""];
      break;
    case "doctor":
      row = [`${data.date}, ${data.time}`, data.title, data.details, data.meta?.actions || ""];
      break;
    case "note":
      row = [`${data.date}, ${data.time}`, data.title, data.details];
      break;
    case "vital":
      row = [`${data.date}, ${data.time}`, data.title, data.subtitle, data.details, ""];
      break;
    case "visitor":
      row = [data.title, `${data.date}, ${data.time}`, "", data.details];
      break;
    case "shift":
      row = [data.date, data.title, data.subtitle, data.details, ""];
      break;
    case "status":
      row = [`${data.date}, ${data.time}`, data.title, data.subtitle, data.details];
      break;
    case "meal":
      row = [`${data.date}, ${data.time}`, data.title, data.subtitle, data.details];
      break;
    case "event":
      row = [`${data.date}, ${data.time}`, "", data.title, data.details];
      break;
  }

  console.log(`[syncEventToSheets] Appending to sheet: ${sheetName}, row: ${JSON.stringify(row)}`);
  const url = `${BASE_URL}/${SPREADSHEET_ID}/values/${encodeURIComponent(sheetName)}:append?key=${API_KEY}&valueInputOption=USER_ENTERED`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ values: [row] }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.log(`[syncEventToSheets] FAIL - HTTP ${res.status}: ${body}`);
  } else {
    console.log(`[syncEventToSheets] SUCCESS - synced to ${sheetName}`);
  }
  return { ok: res.ok };
}

export async function appendToSheet(sheetName: string, values: string[]) {
  console.log(`[appendToSheet] sheet: ${sheetName}, values: ${JSON.stringify(values)}`);
  const url = `${BASE_URL}/${SPREADSHEET_ID}/values/${encodeURIComponent(sheetName)}:append?key=${API_KEY}&valueInputOption=USER_ENTERED`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ values: [values] }),
  });
  if (!res.ok) {
    const body = await res.text();
    console.log(`[appendToSheet] FAIL - HTTP ${res.status}: ${body}`);
    throw new Error(`Failed to append to ${sheetName}`);
  }
  console.log(`[appendToSheet] SUCCESS`);
  return res.json();
}

export async function batchAppendToSheet(sheetName: string, rows: string[][]) {
  const url = `${BASE_URL}/${SPREADSHEET_ID}/values/${encodeURIComponent(sheetName)}:append?key=${API_KEY}&valueInputOption=USER_ENTERED`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ values: rows }),
  });
  if (!res.ok) throw new Error(`Failed to batch append to ${sheetName}`);
  return res.json();
}

export async function initSheetHeaders() {
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
