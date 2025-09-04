import {redirect} from "next/navigation";
import {createSupabaseServerClient} from "@/lib/supabase/server";
import {hasSupabaseEnv} from "@/lib/env";

export default async function NewPostPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  const supabase = createSupabaseServerClient();
  const {data: {user}} = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/auth/login`);
  const enabled = hasSupabaseEnv();

  async function createPost(formData: FormData) {
    "use server";
    const s = createSupabaseServerClient();
    const title = String(formData.get("title") || "").trim();
    const excerpt = String(formData.get("excerpt") || "").trim();
    const content_md = String(formData.get("content_md") || "");
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    if (!title || !slug) return;
    await s.from("posts").insert({slug, title, excerpt, content_md, author_id: user!.id, published_at: new Date().toISOString()});
    redirect(`/${locale}/news/${slug}`);
  }

  return (
    <main className="mx-auto max-w-[700px] px-6 sm:px-8 py-16">
      <h1 className="text-2xl font-semibold">New Post</h1>
      {!enabled && (
        <p className="text-sm text-red-600 mt-3">Supabase 未配置，发帖功能不可用。</p>
      )}
      <form action={enabled ? createPost : undefined} className="mt-6 grid gap-3">
        <label className="text-sm">Title</label>
        <input name="title" required className="rounded border px-3 py-2 bg-transparent" />
        <label className="text-sm">Excerpt</label>
        <textarea name="excerpt" className="rounded border px-3 py-2 bg-transparent" />
        <label className="text-sm">Content (Markdown)</label>
        <textarea name="content_md" rows={10} className="rounded border px-3 py-2 bg-transparent font-mono" />
        <button type="submit" disabled={!enabled} className="mt-2 rounded bg-blue-600 text-white px-4 py-2 hover:bg-blue-500 disabled:opacity-60">Publish</button>
      </form>
    </main>
  );
}


