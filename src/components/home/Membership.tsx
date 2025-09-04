"use client";
import {useI18n} from "@/lib/i18n/I18nProvider";
import {Link} from "@/i18n/routing";

export function Membership() {
  const {t} = useI18n();
  return (
    <section className="mx-auto max-w-[1400px] px-6 sm:px-8 py-14">
      <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 md:p-12 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">{t("home.membership_title")}</h2>
          <p className="text-sm text-white/90 mt-2">{t("home.membership_desc")}</p>
        </div>
        <div>
          <Link href={{pathname: "/membership"}} className="inline-block rounded px-5 py-2.5 bg-white text-blue-700 hover:bg-white/90">
            {t("home.membership_cta")}
          </Link>
        </div>
      </div>
    </section>
  );
}


