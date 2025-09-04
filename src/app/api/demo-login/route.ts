import {NextResponse} from "next/server";

export async function GET(request: Request) {
  const {searchParams, origin} = new URL(request.url);
  const locale = searchParams.get("l") || "en-NZ";

  const enableDemo = process.env.NEXT_PUBLIC_ENABLE_DEMO === "true" || process.env.NODE_ENV !== "production";
  const redirectUrl = new URL(`/${locale}/profile`, origin);

  if (!enableDemo) {
    return NextResponse.redirect(redirectUrl);
  }

  const res = NextResponse.redirect(redirectUrl);
  res.cookies.set({
    name: "demo",
    value: "1",
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 6,
  });
  return res;
}


