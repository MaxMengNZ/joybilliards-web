import {listPosts} from "@/lib/news";
import Link from "next/link";

export default async function NewsPage() {
  const posts = await listPosts();
  return (
    <main className="mx-auto max-w-[1000px] px-6 sm:px-8 py-16">
      <h1 className="text-3xl font-semibold tracking-tight text-center">News</h1>
      <div className="mt-8 grid gap-6">
        {posts.map(p => (
          <Link key={p.slug} href={`./news/${p.slug}`} className="rounded-2xl border border-black/10 dark:border-white/10 p-6 bg-white/70 dark:bg-black/30 backdrop-blur hover:shadow-md transition">
            <div className="text-lg font-medium tracking-tight">{p.title}</div>
            <div className="text-xs text-gray-500 mt-1">{p.published_at ? new Date(p.published_at).toLocaleDateString() : ""}</div>
            {p.excerpt && <p className="text-sm text-gray-600 mt-2">{p.excerpt}</p>}
            <span className="inline-block mt-3 text-sm underline">Read More</span>
          </Link>
        ))}
      </div>
    </main>
  );
}


