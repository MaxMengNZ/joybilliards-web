"use client";
import {useI18n} from "@/lib/i18n/I18nProvider";
import {Link} from "@/i18n/routing";
import {ThemeToggle} from "@/components/nav/ThemeToggle";

export function Header() {
  const {t, locale} = useI18n();
  const targetLocale = locale === "zh-CN" ? "en-NZ" : "zh-CN";

  const items = [
    {href: "/", label: t("nav.home")},
    {href: "/events", label: t("nav.events")},
    {href: "/booking", label: t("nav.booking")},
    {href: "/rankings", label: t("nav.rankings")},
    {href: "/news", label: t("nav.news")},
    {href: "/profile", label: t("nav.profile")},
  ];

  return (
    <div className="sticky top-0 z-40 w-full backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-black/40 border-b border-black/5 dark:border-white/10">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        <div className="h-12 flex items-center justify-between">
          <div className="text-sm font-medium tracking-tight">
            <Link href="/">Joy Billiards</Link>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            {items.map((it) => (
              <Link key={it.href} href={it.href} className="text-gray-700 dark:text-gray-200 hover:opacity-80 transition">
                {it.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link href={{pathname: "/auth/login"}} className="text-xs underline">
              {t("nav.login")}
            </Link>
            <ThemeToggle />
            <Link href={{pathname: "/"}} locale={targetLocale} className="text-xs underline">
              {targetLocale === "zh-CN" ? t("locale.zh") : t("locale.en")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


