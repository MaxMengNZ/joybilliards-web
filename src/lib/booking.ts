import {createSupabaseServerClient} from "@/lib/supabase/server";

export type TableItem = { id: string; name: string; model: "Q7" | "Q8" };
export type Slot = { start: string; end: string; status: "free" | "busy" };

export async function listTables(): Promise<TableItem[]> {
  const s = await createSupabaseServerClient();
  const { data } = await s.from("tables").select("id,name,model").order("name", { ascending: true });
  return (data ?? []) as TableItem[];
}

export async function getAvailability(dateISO: string, slotMinutes = 30) {
  const s = await createSupabaseServerClient();
  const dayStart = new Date(dateISO);
  dayStart.setHours(0,0,0,0);
  const dayEnd = new Date(dayStart); dayEnd.setDate(dayEnd.getDate() + 1);

  const [{ data: tables }, { data: bookings }] = await Promise.all([
    s.from("tables").select("id,name,model").order("name", { ascending: true }),
    s.from("bookings").select("id,table_id,start_time,end_time,status").gte("start_time", dayStart.toISOString()).lt("start_time", dayEnd.toISOString())
  ]);

  // Fallback preview when no tables seeded yet
  const effectiveTables = (tables && tables.length > 0)
    ? tables
    : Array.from({ length: 10 }).map((_, i) => ({
        id: `mock-${i + 1}`,
        name: `T${String(i + 1).padStart(2, "0")}`,
        model: (i < 8 ? "Q7" : "Q8") as "Q7" | "Q8",
      }));

  const slots: string[] = [];
  {
    const t = new Date(dayStart);
    while (t < dayEnd) {
      const start = new Date(t);
      const end = new Date(t); end.setMinutes(end.getMinutes() + slotMinutes);
      slots.push(`${start.toISOString()}|${end.toISOString()}`);
      t.setMinutes(t.getMinutes() + slotMinutes);
    }
  }

  const tableIdToBookings: Record<string, { start: string; end: string }[]> = {};
  (bookings ?? []).forEach(b => {
    if (!tableIdToBookings[b.table_id]) tableIdToBookings[b.table_id] = [];
    tableIdToBookings[b.table_id].push({ start: b.start_time, end: b.end_time });
  });

  const availability = (effectiveTables ?? []).map((t) => {
    const arr: Slot[] = slots.map(pair => {
      const [sISO, eISO] = pair.split("|");
      const busy = (tableIdToBookings[t.id] ?? []).some(b => overlaps(sISO, eISO, b.start, b.end));
      return { start: sISO, end: eISO, status: busy ? "busy" : "free" };
    });
    return { table: t as TableItem, slots: arr };
  });

  return { date: dayStart.toISOString(), tables: availability };
}

function overlaps(aStart: string, aEnd: string, bStart: string, bEnd: string) {
  return new Date(aStart) < new Date(bEnd) && new Date(bStart) < new Date(aEnd);
}


