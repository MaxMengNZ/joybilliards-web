"use client";
import {useI18n} from "@/lib/i18n/I18nProvider";
import {Link} from "@/i18n/routing";

export function Hero() {
  const {t} = useI18n();
  return (
    <section className="mx-auto max-w-[1400px] px-6 sm:px-8 py-16">
      <div className="text-center">
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">
          {t("home.hero")}
        </h2>
        <p className="text-base text-gray-500 mt-3">
          {t("home.sub")}
        </p>
        <div className="mt-6 flex gap-3 justify-center">
          <Link href={{pathname: "/events"}} className="rounded px-5 py-2.5 bg-blue-600 text-white hover:bg-blue-500">
            {t("home.cta")}
          </Link>
          <Link href={{pathname: "/auth/login"}} className="rounded px-5 py-2.5 border border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900">
            {t("home.join")}
          </Link>
        </div>
      </div>
    </section>
  );
}


