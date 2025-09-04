"use client";
import {useI18n} from "@/lib/i18n/I18nProvider";
import {Link} from "@/i18n/routing";

export function Sections() {
  const {t} = useI18n();
  return (
    <section className="mx-auto max-w-[1400px] px-6 sm:px-8 py-12">
      <div className="grid gap-6 md:grid-cols-3">
        <Card title={t("home.news")} href={{pathname: "/news"}} />
        <Card title={t("nav.booking") } href={{pathname: "/booking"}} />
        <Card title={t("nav.rankings") } href={{pathname: "/rankings"}} />
      </div>
    </section>
  );
}

function Card({title, href}: {title: string; href: {pathname: string}}) {
  return (
    <Link href={href} className="block rounded-2xl border border-black/10 dark:border-white/10 p-6 bg-white/70 dark:bg-black/30 backdrop-blur transition hover:shadow-lg hover:scale-[1.01]">
      <h3 className="text-lg font-medium tracking-tight">{title}</h3>
      <p className="text-sm text-gray-500 mt-2">Coming soon…</p>
    </Link>
  );
}


