import {listEvents} from "@/lib/events";
import Link from "next/link";

export default async function EventsPage() {
  const events = await listEvents();
  return (
    <main className="mx-auto max-w-[1000px] px-6 sm:px-8 py-16">
      <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-center">赛事</h1>
      <p className="text-sm text-gray-500 text-center mt-2">近期与报名中</p>
      <div className="mt-10 grid gap-6">
        {events.map(e => (
          <Link key={e.slug} href={`./events/${e.slug}`} className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-black/30 backdrop-blur p-6 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-medium tracking-tight">{e.name}</div>
                <div className="text-xs text-gray-500 mt-1">{new Date(e.start_at).toLocaleString()}</div>
              </div>
              <span className="text-sm underline shrink-0">查看</span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}


