import {redirect} from "next/navigation";
import {createSupabaseServerClient} from "@/lib/supabase/server";
import ReactMarkdown from "react-markdown";
import type {Locale} from "@/i18n/routing";

export default async function EditPost({params}: {params: Promise<{locale: Locale; slug: string}>}) {
  const {locale, slug} = await params;
  const s = createSupabaseServerClient();
  const {data: {user}} = await s.auth.getUser();
  if (!user) redirect(`/${locale}/auth/login`);
  const {data} = await s.from("posts").select("id,title,excerpt,content_md,author_id").eq("slug", slug).single();
  if (!data || data.author_id !== user.id) redirect(`/${locale}/news/mine`);
  const postId = String(data.id);

  async function updatePost(formData: FormData) {
    "use server";
    const s2 = createSupabaseServerClient();
    const title = String(formData.get("title") || "").trim();
    const excerpt = String(formData.get("excerpt") || "").trim();
    const content_md = String(formData.get("content_md") || "");
    await s2.from("posts").update({title, excerpt, content_md}).eq("id", postId);
    redirect(`/${locale}/news/${slug}`);
  }

  async function deletePost() {
    "use server";
    const s2 = createSupabaseServerClient();
    await s2.from("posts").delete().eq("id", postId);
    redirect(`/${locale}/news/mine`);
  }

  return (
    <main className="mx-auto max-w-[900px] px-6 sm:px-8 py-16 grid gap-6 md:grid-cols-2">
      <section>
        <h1 className="text-2xl font-semibold">Edit Post</h1>
        <form action={updatePost} className="mt-6 grid gap-3">
          <label className="text-sm">Title</label>
          <input name="title" defaultValue={data.title} required className="rounded border px-3 py-2 bg-transparent" />
          <label className="text-sm">Excerpt</label>
          <textarea name="excerpt" defaultValue={data.excerpt || ""} className="rounded border px-3 py-2 bg-transparent" />
          <label className="text-sm">Content (Markdown)</label>
          <textarea name="content_md" defaultValue={data.content_md || ""} rows={12} className="rounded border px-3 py-2 bg-transparent font-mono" />
          <div className="flex gap-3">
            <button type="submit" className="rounded bg-blue-600 text-white px-4 py-2 hover:bg-blue-500">Save</button>
            <form action={deletePost}><button formAction={deletePost} className="rounded bg-red-600 text-white px-4 py-2 hover:bg-red-500">Delete</button></form>
          </div>
        </form>
      </section>
      <section>
        <h2 className="text-lg font-medium">Preview</h2>
        <article className="prose dark:prose-invert mt-4">
          <ReactMarkdown>{data.content_md || ""}</ReactMarkdown>
        </article>
      </section>
    </main>
  );
}


