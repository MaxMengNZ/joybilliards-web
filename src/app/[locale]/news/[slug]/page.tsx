import {getPost} from "@/lib/news";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

export default async function NewsDetail({params}: {params: Promise<{slug: string}>}) {
  const {slug} = await params;
  const post = await getPost(slug);
  if (!post) {
    return (
      <main className="mx-auto max-w-[900px] px-6 sm:px-8 py-16 text-center">
        <h1 className="text-2xl font-semibold">Not found</h1>
        <Link href="../../news" className="underline mt-3 inline-block">Back</Link>
      </main>
    );
  }
  return (
    <main className="mx-auto max-w-[900px] px-6 sm:px-8 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">{post.title}</h1>
      <div className="text-xs text-gray-500 mt-1">{post.published_at ? new Date(post.published_at).toLocaleDateString() : ""}</div>
      {"content_md" in (post as any) && (post as any).content_md && (
        <article className="prose dark:prose-invert mt-6">
          <ReactMarkdown>{(post as any).content_md}</ReactMarkdown>
        </article>
      )}
    </main>
  );
}


