import {hasSupabaseEnv} from "@/lib/env";
import {createSupabaseServerClient} from "@/lib/supabase/server";

export type EventItem = {
  slug: string;
  name: string;
  start_at: string;
  venue?: string;
  fee_cents?: number;
  published?: boolean;
};

const mockEvents: EventItem[] = [
  {slug: "joy-open-2025", name: "Joy Open 2025", start_at: "2025-10-01T10:00:00Z", venue: "Joy Billiards", fee_cents: 3000, published: true},
  {slug: "weekly-heyball-37", name: "Weekly Heyball #37", start_at: "2025-09-25T18:30:00Z", venue: "Joy Billiards", fee_cents: 1000, published: true},
];

export async function listEvents(): Promise<EventItem[]> {
  if (!hasSupabaseEnv()) return mockEvents;
  const supabase = createSupabaseServerClient();
  const {data, error} = await supabase.from("events").select("slug,name,start_at,venue_id,published,fee_cents").eq("published", true).order("start_at", {ascending: true});
  if (error) return mockEvents;
  return (data || []).map((e: {slug: string; name: string; start_at: string; fee_cents?: number; published?: boolean}) => ({ slug: e.slug, name: e.name, start_at: e.start_at, fee_cents: e.fee_cents, published: e.published }));
}

export async function getEventBySlug(slug: string): Promise<EventItem | null> {
  if (!hasSupabaseEnv()) return mockEvents.find(e => e.slug === slug) ?? null;
  const supabase = createSupabaseServerClient();
  const {data, error} = await supabase.from("events").select("slug,name,start_at,fee_cents,published").eq("slug", slug).single();
  if (error) return null;
  return data as {slug: string; name: string; start_at: string; fee_cents?: number; published?: boolean};
}


