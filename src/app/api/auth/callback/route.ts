import {NextResponse} from "next/server";
import {createSupabaseServerClient} from "@/lib/supabase/server";

export async function GET(request: Request) {
  const {searchParams} = new URL(request.url);
  const code = searchParams.get("code");
  const locale = searchParams.get("l") || "en-NZ";
  if (!code) return NextResponse.redirect(new URL(`/${locale}/auth/login`, request.url));

  const supabase = createSupabaseServerClient();
  const {error} = await supabase.auth.exchangeCodeForSession(code);
  if (error) return NextResponse.redirect(new URL(`/${locale}/auth/login?error=${encodeURIComponent(error.message)}`, request.url));

  return NextResponse.redirect(new URL(`/${locale}/profile`, request.url));
}


