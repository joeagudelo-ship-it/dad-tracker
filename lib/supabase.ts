import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export type EventType = "care" | "doctor" | "note" | "vital" | "visitor" | "shift" | "status" | "meal" | "event";

export interface DBEvent {
  id: string;
  created_at: string;
  date: string;
  time: string;
  type: EventType;
  title: string;
  subtitle: string;
  details: string;
  meta: Record<string, string>;
}

export function isSupabaseConfigured() {
  return supabase !== null;
}

export async function insertEvent(event: Omit<DBEvent, "id" | "created_at">) {
  if (!supabase) throw new Error("Supabase not configured");
  console.log(`[supabase.insertEvent] Inserting: type=${event.type}, title=${event.title}, date=${event.date}`);
  const { data, error } = await supabase
    .from("events")
    .insert([event])
    .select()
    .single();
  if (error) {
    console.error(`[supabase.insertEvent] Error: ${error.message}`);
    throw error;
  }
  console.log(`[supabase.insertEvent] Success, id=${data.id}`);
  return data;
}

export async function insertEvents(events: Omit<DBEvent, "id" | "created_at">[]) {
  if (!supabase) throw new Error("Supabase not configured");
  console.log(`[supabase.insertEvents] Inserting ${events.length} events`);
  const { data, error } = await supabase
    .from("events")
    .insert(events)
    .select();
  if (error) {
    console.error(`[supabase.insertEvents] Error: ${error.message}`);
    throw error;
  }
  console.log(`[supabase.insertEvents] Success, ${Array.isArray(data) ? data.length : 0} rows`);
  return data;
}

export async function getAllEvents() {
  if (!supabase) throw new Error("Supabase not configured");
  console.log(`[supabase.getAllEvents] Fetching all events`);
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error(`[supabase.getAllEvents] Error: ${error.message}`);
    throw error;
  }
  console.log(`[supabase.getAllEvents] Got ${data?.length || 0} events`);
  return data || [];
}

export async function getEventsByDate(date: string) {
  if (!supabase) throw new Error("Supabase not configured");
  console.log(`[supabase.getEventsByDate] Fetching events for date: ${date}`);
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("date", date)
    .order("time", { ascending: false });
  if (error) {
    console.error(`[supabase.getEventsByDate] Error: ${error.message}`);
    throw error;
  }
  console.log(`[supabase.getEventsByDate] Got ${data?.length || 0} events`);
  return data || [];
}

export async function getEventsForMonth(year: number, month: number) {
  if (!supabase) throw new Error("Supabase not configured");
  const startDate = `${year}-${String(month + 1).padStart(2, "0")}-01`;
  const endDate = `${year}-${String(month + 1).padStart(2, "0")}-31`;
  const { data, error } = await supabase
    .from("events")
    .select("date")
    .gte("date", startDate)
    .lte("date", endDate);
  if (error) throw error;
  return data || [];
}
