import {hasSupabaseEnv} from "@/lib/env";
import {createSupabaseServerClient} from "@/lib/supabase/server";

export type PostItem = { slug: string; title: string; excerpt?: string; published_at?: string };

const mockPosts: PostItem[] = [
  {slug: "welcome", title: "Welcome to Joy Billiards", excerpt: "We are live!", published_at: new Date().toISOString()},
  {slug: "weekly-update", title: "Weekly update", excerpt: "Results and highlights", published_at: new Date().toISOString()},
  {slug: "sponsors-note", title: "Club notice", excerpt: "Holiday opening hours", published_at: new Date().toISOString()},
];

export async function listPosts(): Promise<PostItem[]> {
  if (!hasSupabaseEnv()) return mockPosts;
  const supabase = await createSupabaseServerClient();
  const {data} = await supabase.from("posts").select("slug,title,excerpt,published_at").order("published_at", {ascending: false}).limit(20);
  return data || [];
}

export async function getPost(slug: string): Promise<PostItem | null> {
  if (!hasSupabaseEnv()) return mockPosts.find(p => p.slug === slug) ?? null;
  const supabase = await createSupabaseServerClient();
  const {data} = await supabase.from("posts").select("slug,title,excerpt,published_at,content_md").eq("slug", slug).maybeSingle();
  return (data as { slug: string; title: string; excerpt?: string; published_at?: string; content_md?: string } | null);
}


