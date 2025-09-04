"use client";
import {useI18n} from "@/lib/i18n/I18nProvider";

export function Banner() {
  const {t} = useI18n();
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#0b0f17] via-[#0b0f17] to-[#0b0f17]/60">
      <div className="mx-auto max-w-[1400px]">
        <div className="relative px-6 sm:px-8 py-20 sm:py-28 md:py-36 text-center">
          <div className="absolute inset-0 pointer-events-none opacity-40" aria-hidden>
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] rounded-full blur-3xl bg-[radial-gradient(circle,_rgba(79,140,255,0.18)_0%,_rgba(138,92,255,0.14)_40%,_transparent_70%)]" />
          </div>
          <h1 className="relative z-10 text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-white">
            {t("home.hero")}
          </h1>
          <p className="relative z-10 mt-4 text-base sm:text-lg text-white/80">
            {t("home.sub")}
          </p>
        </div>
      </div>
    </section>
  );
}


