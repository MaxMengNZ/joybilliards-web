"use client";
import {useEffect, useMemo, useState} from "react";

type Table = { id: string; name: string; model: "Q7" | "Q8" };
type Slot = { start: string; end: string; status: "free" | "busy" };
type Availability = { date: string; tables: { table: Table; slots: Slot[] }[] };

export default function BookingClient() {
  const [data, setData] = useState<Availability | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [activeTableId, setActiveTableId] = useState<string | null>(null);

  const today = useMemo(() => new Date().toISOString(), []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const res = await fetch(`/api/booking/availability?date=${encodeURIComponent(today)}`, { cache: "no-store" });
        const json = (await res.json()) as Availability;
        if (!cancelled) {
          setData(json);
          setError(null);
        }
      } catch (e) {
        if (!cancelled) setError("无法加载可用性数据");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [today]);

  const active = useMemo(() => {
    if (!data || !activeTableId) return null;
    return data.tables.find(t => t.table.id === activeTableId) ?? null;
  }, [data, activeTableId]);

  if (loading) return <div className="h-40 rounded bg-muted animate-pulse" aria-busy="true" />;
  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (!data) return null;

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4" role="list" aria-label="Tables">
        {data.tables.map(({ table }) => (
          <button
            key={table.id}
            onClick={() => { setActiveTableId(table.id); setOpen(true); }}
            className="group rounded-xl border p-4 hover:shadow transition focus:outline-none focus:ring-2 focus:ring-blue-500"
            role="listitem"
            aria-label={`Table ${table.name}, model ${table.model}`}
          >
            <PoolTableIcon className="mx-auto h-16 w-16 text-muted-foreground group-hover:text-foreground" />
            <div className="mt-3 text-center">
              <div className="font-medium">{table.name}</div>
              <div className="text-xs text-muted-foreground">{table.model}</div>
            </div>
          </button>
        ))}
      </div>

      {open && active && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} aria-hidden="true" />
          <div className="relative z-10 w-full max-w-2xl rounded-xl border bg-background p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">{active.table.name}</h2>
                <p className="text-xs text-muted-foreground">{new Date(data.date).toDateString()} · {active.table.model}</p>
              </div>
              <button onClick={() => setOpen(false)} className="rounded px-3 py-1 text-sm border hover:bg-muted">Close</button>
            </div>

            <div className="mt-4 max-h-[60vh] overflow-y-auto">
              <TimeGrid slots={active.slots} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TimeGrid({ slots }: { slots: Slot[] }) {
  // 显示 10:00 - 22:00 之间的时段
  const filtered = slots.filter(s => {
    const h = new Date(s.start).getHours();
    return h >= 10 && h < 22;
  });
  return (
    <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-2" aria-label="Time slots">
      {filtered.map((s, i) => (
        <div
          key={i}
          title={`${new Date(s.start).toLocaleTimeString()} - ${new Date(s.end).toLocaleTimeString()}`}
          className={`h-9 rounded text-center text-xs leading-9 select-none ${s.status === 'free' ? 'bg-emerald-500/70' : 'bg-muted-foreground/30'}`}
          aria-disabled={s.status !== 'free'}
        >
          {new Date(s.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      ))}
    </div>
  );
}

function PoolTableIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <rect x="6" y="12" width="36" height="20" rx="4" fill="currentColor" opacity="0.2" />
      <rect x="8" y="14" width="32" height="16" rx="3" stroke="currentColor" fill="none" />
      <circle cx="24" cy="22" r="2" fill="currentColor" />
      <circle cx="30" cy="20" r="1.2" fill="currentColor" />
      <circle cx="18" cy="24" r="1.2" fill="currentColor" />
    </svg>
  );
}


