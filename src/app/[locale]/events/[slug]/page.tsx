import {getEventBySlug} from "@/lib/events";
import Link from "next/link";

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) {
    return (
      <main className="mx-auto max-w-[900px] px-6 sm:px-8 py-16 text-center">
        <h1 className="text-3xl font-semibold">未找到赛事</h1>
        <Link href="../../events" className="text-sm underline mt-4 inline-block">返回列表</Link>
      </main>
    );
  }
  return (
    <main className="mx-auto max-w-[900px] px-6 sm:px-8 py-16">
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">{event.name}</h1>
        <div className="text-sm text-gray-500 mt-2">开赛时间：{new Date(event.start_at).toLocaleString()}</div>
        <div className="mt-8">
          <Link href={`./${slug}/register`} className="rounded px-5 py-2.5 bg-blue-600 text-white hover:bg-blue-500">报名</Link>
        </div>
      </div>
      <div className="mt-10 rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-black/30 backdrop-blur p-6">
        <h2 className="text-lg font-medium">规则与说明</h2>
        <p className="text-sm text-gray-500 mt-2">本赛事采用中式台球规则，报名以先到先得为准。</p>
      </div>
    </main>
  );
}


