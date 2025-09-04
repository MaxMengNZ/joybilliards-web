"use client";
import {useI18n} from "@/lib/i18n/I18nProvider";
import {Link} from "@/i18n/routing";

const mock = [
  { slug: "joy-open-2025", title: "Joy Open 2025", date: "2025-10-01", venue: "Joy Billiards" },
  { slug: "weekly-heyball-37", title: "Weekly Heyball #37", date: "2025-09-25", venue: "Joy Billiards" },
  { slug: "amateur-cup", title: "Amateur Cup", date: "2025-10-10", venue: "Joy Billiards" }
];

export function FeaturedEvents() {
  const {t} = useI18n();
  return (
    <section className="mx-auto max-w-[1400px] px-6 sm:px-8 py-12">
      <h2 className="text-2xl font-semibold mb-6 text-center">{t("home.featured_title")}</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {mock.map((e) => (
          <Link key={e.slug} href={{pathname: `/events/${e.slug}`}} className="block rounded-2xl border border-black/10 dark:border-white/10 p-6 bg-white/70 dark:bg-black/30 backdrop-blur transition hover:shadow-lg hover:scale-[1.01] will-change-transform">
            <div className="text-lg font-medium tracking-tight">{e.title}</div>
            <div className="text-xs text-gray-500 mt-1">{e.date} · {e.venue}</div>
            <span className="inline-block mt-4 text-sm underline">报名</span>
          </Link>
        ))}
      </div>
    </section>
  );
}


