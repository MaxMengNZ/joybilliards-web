"use client";
import {useI18n} from "@/lib/i18n/I18nProvider";

const items = [
  {key: "benefit_price", emoji: "💳"},
  {key: "benefit_points", emoji: "🏆"},
  {key: "benefit_official", emoji: "🎫"},
  {key: "benefit_qr", emoji: "🔲"},
];

export function Benefits() {
  const {t} = useI18n();
  return (
    <section className="mx-auto max-w-[1400px] px-6 sm:px-8 py-12">
      <h2 className="text-2xl font-semibold text-center mb-6">{t("home.benefits_title")}</h2>
      <div className="grid gap-6 md:grid-cols-4">
        {items.map((it) => (
          <div key={it.key} className="rounded-2xl border border-black/10 dark:border-white/10 p-6 bg-white/70 dark:bg-black/30 backdrop-blur text-center">
            <div className="text-3xl mb-3" aria-hidden>{it.emoji}</div>
            <div className="text-sm text-gray-700 dark:text-gray-200">{t(`home.${it.key}`)}</div>
          </div>
        ))}
      </div>
    </section>
  );
}


