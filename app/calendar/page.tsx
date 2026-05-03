import { getAllSheetsData } from "@/lib/sheets";
import CalendarClient from "./CalendarClient";

export default async function CalendarPage() {
  const allData = await getAllSheetsData();
  return <CalendarClient allData={allData} />;
}
