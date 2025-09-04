import {use} from "react";
import {locales, type Locale} from "@/i18n/config";
import BookingClient from "./BookingClient";

async function fetchAvailability(dateISO: string) {
  const base = process.env.NEXT_PUBLIC_APP_URL || "";
  const res = await fetch(`${base}/api/booking/availability?date=${encodeURIComponent(dateISO)}`, { cache: "no-store" });
  return res.json();
}

export default function BookingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  if (!locales.includes(locale as Locale)) return null;
  return (
    <main className="container mx-auto px-4 py-10">
      <section className="mb-8 text-center">
        <h1 className="text-3xl font-semibold">Book Your Table</h1>
        <p className="text-muted-foreground mt-2">选择一个球桌以查看可预订时段</p>
      </section>

      <BookingClient />
    </main>
  );
}

