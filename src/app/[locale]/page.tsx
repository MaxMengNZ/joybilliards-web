"use client";
import {useI18n} from "@/lib/i18n/I18nProvider";
import {Link} from "@/i18n/routing";
import {usePathname} from "next/navigation";
import {useMemo} from "react";
import {Hero} from "@/components/home/Hero";
import {Sections} from "@/components/home/Sections";
import {Banner} from "@/components/home/Banner";
import {FeaturedEvents} from "@/components/home/FeaturedEvents";
import {Membership} from "@/components/home/Membership";
import {Footer} from "@/components/layout/Footer";

export default function HomePage() {
  const {t} = useI18n();

  return (
    <div className="min-h-screen">
      <main>
        <Banner />
        <Hero />
        <Sections />
        <FeaturedEvents />
        <Membership />
        <Footer />
      </main>
    </div>
  );
}


