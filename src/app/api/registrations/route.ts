import {NextResponse} from "next/server";
import {createSupabaseServerClient} from "@/lib/supabase/server";
import Stripe from "stripe";

export async function POST(request: Request) {
  try {
    const supabase = createSupabaseServerClient();
    const body = await request.json();
    const {eventSlug, locale} = body as {eventSlug: string; locale: string};
    if (!eventSlug) return NextResponse.json({error: "Missing eventSlug"}, {status: 400});

    const {data: {user}} = await supabase.auth.getUser();
    if (!user) return NextResponse.json({error: "Unauthorized"}, {status: 401});

    const {data: event} = await supabase.from("events").select("id, name, fee_cents").eq("slug", eventSlug).single();
    if (!event) return NextResponse.json({error: "Event not found"}, {status: 404});

    const {data: existing} = await supabase.from("registrations").select("id,status").eq("event_id", event.id).eq("user_id", user.id).maybeSingle();
    if (existing && existing.status === "paid") {
      return NextResponse.json({ok: true, message: "already_paid"});
    }

    const {data: reg, error: regErr} = await supabase.from("registrations").upsert({
      event_id: event.id,
      user_id: user.id,
      status: "pending",
    }, {onConflict: "event_id,user_id"}).select("id").single();
    if (regErr) return NextResponse.json({error: regErr.message}, {status: 500});

    const fee = Math.max(0, event.fee_cents || 0);
    if (fee === 0) {
      await supabase.from("registrations").update({status: "paid"}).eq("id", reg.id);
      return NextResponse.json({ok: true, message: "free"});
    }

    const secret = process.env.STRIPE_SECRET_KEY;
    const pk = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    if (!secret || !pk) return NextResponse.json({error: "Stripe not configured"}, {status: 500});
    const stripe = new Stripe(secret, {apiVersion: "2024-12-18.acacia"});

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "nzd",
            unit_amount: fee,
            product_data: {name: event.name},
          },
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/${locale}/events/${eventSlug}?paid=1`,
      cancel_url: `${appUrl}/${locale}/events/${eventSlug}?cancel=1`,
      metadata: {registration_id: reg.id, event_id: event.id, user_id: user.id},
    });

    return NextResponse.json({checkoutUrl: session.url});
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({error: message}, {status: 500});
  }
}


