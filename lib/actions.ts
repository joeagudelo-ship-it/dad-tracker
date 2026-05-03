"use server";

import { API_KEY, SPREADSHEET_ID, HEADERS } from "./sheets";

const BASE_URL = "https://sheets.googleapis.com/v4/spreadsheets";

export async function appendToSheet(sheetName: string, values: string[]) {
  const url = `${BASE_URL}/${SPREADSHEET_ID}/values/${encodeURIComponent(sheetName)}:append?key=${API_KEY}&valueInputOption=USER_ENTERED`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ values: [values] }),
  });
  if (!res.ok) throw new Error(`Failed to append to ${sheetName}`);
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
