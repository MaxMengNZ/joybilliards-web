import {Suspense} from "react";
import {use} from "react";
import {locales, type Locale} from "@/i18n/config";

async function fetchAvailability(dateISO: string) {
  const base = process.env.NEXT_PUBLIC_APP_URL || "";
  const res = await fetch(`${base}/api/booking/availability?date=${encodeURIComponent(dateISO)}`, { cache: "no-store" });
  return res.json();
}

export default function BookingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  if (!locales.includes(locale as Locale)) return null;
  const today = new Date().toISOString();
  return (
    <main className="container mx-auto px-4 py-10">
      <section className="mb-8 text-center">
        <h1 className="text-3xl font-semibold">Book Your Table Anytime</h1>
        <p className="text-muted-foreground mt-2">在线预订球台，按时段/台号实时查看可用性</p>
      </section>

      <Suspense fallback={<div className="h-40 rounded bg-muted animate-pulse" /> }>
        {/* 简化版：初始加载今日数据，后续交互再补全 */}
        <Availability dateISO={today} />
      </Suspense>
    </main>
  );
}

function Availability({ dateISO }: { dateISO: string }) {
  const data = use(fetchAvailability(dateISO));
  return (
    <div className="rounded border p-4">
      <div className="mb-3 font-medium">{new Date(dateISO).toDateString()}</div>
      <div className="grid gap-2">
        {data.tables?.map((row: any) => (
          <div key={row.table.id} className="flex items-center gap-2">
            <div className="w-28 shrink-0 text-sm">{row.table.name} <span className="ml-1 text-xs text-muted-foreground">{row.table.model}</span></div>
            <div className="flex-1 flex gap-1 overflow-x-auto">
              {row.slots.slice(20, 44).map((slot: any, i: number) => (
                <div key={i} title={`${new Date(slot.start).toLocaleTimeString()} - ${new Date(slot.end).toLocaleTimeString()}`} className={`h-6 w-3 rounded ${slot.status === 'free' ? 'bg-emerald-500/70' : 'bg-muted-foreground/30'}`}></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

