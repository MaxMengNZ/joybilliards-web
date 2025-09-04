import {redirect} from "next/navigation";
import {createSupabaseServerClient} from "@/lib/supabase/server";
import Link from "next/link";

export default async function MyPosts({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  const s = createSupabaseServerClient();
  const {data: {user}} = await s.auth.getUser();
  if (!user) redirect(`/${locale}/auth/login`);
  const {data} = await s.from("posts").select("slug,title,published_at").eq("author_id", user.id).order("published_at", {ascending: false});
  const posts = data || [];
  return (
    <main className="mx-auto max-w-[900px] px-6 sm:px-8 py-16">
      <h1 className="text-2xl font-semibold">My Posts</h1>
      <div className="mt-6 grid gap-3">
        {posts.map(p => (
          <div key={p.slug} className="rounded border p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">{p.title}</div>
              <div className="text-xs text-gray-500">{p.published_at ? new Date(String(p.published_at)).toLocaleString() : ""}</div>
            </div>
            <div className="text-sm flex gap-3">
              <Link href={`/${locale}/news/${p.slug}`} className="underline">View</Link>
              <Link href={`/${locale}/news/${p.slug}/edit`} className="underline">Edit</Link>
            </div>
          </div>
        ))}
        {posts.length === 0 && <p className="text-sm text-gray-500">No posts yet.</p>}
      </div>
    </main>
  );
}


