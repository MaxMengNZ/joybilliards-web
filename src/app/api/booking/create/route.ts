import {NextResponse} from "next/server";
import {createSupabaseServerClient} from "@/lib/supabase/server";

export async function POST(request: Request) {
  const s = await createSupabaseServerClient();
  const { data: { user } } = await s.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = await request.json().catch(() => null) as { table_id?: string; start_time?: string; end_time?: string } | null;
  if (!body || !body.table_id || !body.start_time || !body.end_time) return NextResponse.json({ error: 'invalid' }, { status: 400 });

  // 简单的重叠校验
  const { data: conflicts } = await s.from('bookings')
    .select('id')
    .eq('table_id', body.table_id)
    .lt('start_time', body.end_time)
    .gt('end_time', body.start_time)
    .limit(1);
  if (conflicts && conflicts.length > 0) return NextResponse.json({ error: 'conflict' }, { status: 409 });

  const { error } = await s.from('bookings').insert({
    table_id: body.table_id,
    user_id: user.id,
    start_time: body.start_time,
    end_time: body.end_time,
    status: 'pending'
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}


