"use client";
import {useEffect, useMemo, useState} from "react";
import {createSupabaseBrowserClient} from "@/lib/supabase/client";

type Table = { id: string; name: string; model: "Q7" | "Q8" };
type Slot = { start: string; end: string; status: "free" | "busy" };
type Availability = { date: string; tables: { table: Table; slots: Slot[] }[] };

function formatDateInput(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export default function BookingClient() {
  const [data, setData] = useState<Availability | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [activeTableId, setActiveTableId] = useState<string | null>(null);

  // 控件：日期与型号筛选
  const [dateStr, setDateStr] = useState(() => formatDateInput(new Date()));
  const [model, setModel] = useState<"All" | "Q7" | "Q8">("All");

  // 选择时段（连续范围）
  const [anchorIndex, setAnchorIndex] = useState<number | null>(null);
  const [range, setRange] = useState<{ startIdx: number; endIdx: number } | null>(null);

  const dateISO = useMemo(() => new Date(`${dateStr}T00:00:00`).toISOString(), [dateStr]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const res = await fetch(`/api/booking/availability?date=${encodeURIComponent(dateISO)}`, { cache: "no-store" });
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
  }, [dateISO]);

  // Realtime: 监听 bookings 变化，若与当前日期相关则刷新
  useEffect(() => {
    const s = createSupabaseBrowserClient();
    const channel = s.channel('bookings-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, (payload) => {
        // 简化：变更即刷新当天
        setTimeout(async () => {
          try {
            const res = await fetch(`/api/booking/availability?date=${encodeURIComponent(dateISO)}`, { cache: 'no-store' });
            const json = (await res.json()) as Availability;
            setData(json);
          } catch {}
        }, 50);
      })
      .subscribe();
    return () => { s.removeChannel(channel); };
  }, [dateISO]);

  const filteredTables = useMemo(() => {
    if (!data) return [] as { table: Table; slots: Slot[] }[];
    if (model === "All") return data.tables;
    return data.tables.filter(t => t.table.model === model);
  }, [data, model]);

  const active = useMemo(() => {
    if (!data || !activeTableId) return null;
    return data.tables.find(t => t.table.id === activeTableId) ?? null;
  }, [data, activeTableId]);

  function onOpen(tableId: string) {
    setActiveTableId(tableId);
    setAnchorIndex(null);
    setRange(null);
    setOpen(true);
  }

  if (loading) return <div className="h-40 rounded bg-muted animate-pulse" aria-busy="true" />;
  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (!data) return null;

  return (
    <div>
      {/* 控制面板 */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <label className="text-sm">日期
          <input
            type="date"
            value={dateStr}
            onChange={(e) => setDateStr(e.target.value)}
            className="ml-2 rounded border px-2 py-1 bg-transparent"
            aria-label="选择日期"
          />
        </label>
        <label className="text-sm">型号
          <select
            className="ml-2 rounded border px-2 py-1 bg-transparent"
            value={model}
            onChange={(e) => setModel(e.target.value as any)}
            aria-label="筛选型号"
          >
            <option value="All">All</option>
            <option value="Q7">Q7</option>
            <option value="Q8">Q8</option>
          </select>
        </label>
      </div>

      {/* 图标网格 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4" role="list" aria-label="Tables">
        {filteredTables.map(({ table }) => (
          <button
            key={table.id}
            onClick={() => onOpen(table.id)}
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

            <div className="mt-4 max-h-[50vh] overflow-y-auto">
              <TimeGrid
                slots={active.slots}
                onPick={(idx) => {
                  if (!filteredSlots(active.slots).at(idx) || filteredSlots(active.slots)[idx].status !== 'free') return;
                  if (anchorIndex == null) {
                    setAnchorIndex(idx);
                    setRange({ startIdx: idx, endIdx: idx });
                  } else {
                    const startIdx = Math.min(anchorIndex, idx);
                    const endIdx = Math.max(anchorIndex, idx);
                    setRange({ startIdx, endIdx });
                  }
                }}
                range={range}
              />
            </div>

            {/* 摘要栏 */}
            <SummaryBar
              tableName={active.table.name}
              dateISO={data.date}
              slots={active.slots}
              range={range}
              onClear={() => { setAnchorIndex(null); setRange(null); }}
              onReserve={async () => {
                if (!range) return;
                const slotsArr = filteredSlots(active.slots);
                const start = slotsArr[range.startIdx].start;
                const end = slotsArr[range.endIdx].end;
                try {
                  const res = await fetch('/api/booking/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ table_id: active.table.id, start_time: start, end_time: end })
                  });
                  if (res.status === 401) {
                    // 未登录
                    window.location.href = '/auth/login';
                    return;
                  }
                  if (!res.ok) {
                    const t = await res.text();
                    alert(`预订失败：${t}`);
                    return;
                  }
                  alert('已创建预订（待确认）。');
                  setOpen(false);
                } catch (e) {
                  alert('预订失败，请稍后再试');
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function filteredSlots(slots: Slot[]) {
  return slots.filter(s => {
    const h = new Date(s.start).getHours();
    // 10:00 to next day 02:00 (hours 0-1 included)
    return (h >= 10 && h <= 23) || (h >= 0 && h < 2);
  });
}

function TimeGrid({ slots, onPick, range }: { slots: Slot[]; onPick: (index: number) => void; range: { startIdx: number; endIdx: number } | null }) {
  const filtered = filteredSlots(slots);
  return (
    <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-2" aria-label="Time slots">
      {filtered.map((s, i) => {
        const selected = range && i >= range.startIdx && i <= range.endIdx;
        const base = s.status === 'free' ? 'bg-emerald-500/70 hover:bg-emerald-500' : 'bg-muted-foreground/30';
        const sel = selected ? 'ring-2 ring-blue-500' : '';
        return (
          <button
            key={i}
            title={`${new Date(s.start).toLocaleTimeString()} - ${new Date(s.end).toLocaleTimeString()}`}
            className={`h-9 rounded text-center text-xs leading-9 select-none transition ${base} ${sel}`}
            aria-disabled={s.status !== 'free'}
            onClick={() => s.status === 'free' && onPick(i)}
          >
            {new Date(s.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </button>
        );
      })}
    </div>
  );
}

function SummaryBar({ tableName, dateISO, slots, range, onClear, onReserve }: { tableName: string; dateISO: string; slots: Slot[]; range: { startIdx: number; endIdx: number } | null; onClear: () => void; onReserve: () => void }) {
  const filtered = filteredSlots(slots);
  const summary = useMemo(() => {
    if (!range) return null as null | { start: string; end: string; hours: number };
    const start = filtered[range.startIdx].start;
    const end = filtered[range.endIdx].end;
    const hours = (new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60);
    return { start, end, hours };
  }, [filtered, range]);

  return (
    <div className="mt-4 flex items-center justify-between gap-3 border-t pt-4">
      <div className="text-sm">
        <div className="font-medium">{tableName}</div>
        <div className="text-muted-foreground">
          {new Date(dateISO).toDateString()}
          {summary && (
            <> · {new Date(summary.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(summary.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {summary.hours}h</>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="rounded border px-3 py-1 text-sm hover:bg-muted" onClick={onClear}>清除选择</button>
        <button className="rounded bg-blue-600 px-4 py-2 text-sm text-white disabled:opacity-60" disabled={!summary} onClick={onReserve}>Reserve Now</button>
      </div>
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


