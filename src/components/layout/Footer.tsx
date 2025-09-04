"use client";
import {useI18n} from "@/lib/i18n/I18nProvider";
import Link from "next/link";

export function Footer() {
  const {t} = useI18n();
  return (
    <footer className="mt-16 border-t py-10">
      <div className="mx-auto max-w-[1400px] px-6 sm:px-8 grid gap-8 md:grid-cols-3 text-sm">
        <div>
          <div className="font-semibold text-base">Joy Billiards</div>
          <p className="text-gray-500 mt-2">New Zealand Heyball Hub. Tournaments, membership and rankings.</p>
        </div>
        <div>
          <div className="font-medium">{t("footer.quick")}</div>
          <ul className="mt-2 space-y-1 text-gray-500">
            <li><Link href="/en-NZ/">Home</Link></li>
            <li><Link href="/en-NZ/events">Events</Link></li>
            <li><Link href="/en-NZ/booking">Booking</Link></li>
            <li><Link href="/en-NZ/rankings">Rankings</Link></li>
            <li><Link href="/en-NZ/profile">Profile</Link></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>
        <div>
          <div className="font-medium">{t("footer.follow")}</div>
          <ul className="mt-2 space-y-1 text-gray-500">
            <li>{t("footer.address")}: 88 Tristram Street, Hamilton Central.</li>
            <li>{t("footer.phone")}: +64 22 166 0688</li>
            <li>{t("footer.email")}: info@joybilliards.co.nz</li>
            <li className="flex gap-3 pt-2">
              <a href="#" aria-label="Facebook" className="underline">Facebook</a>
              <a href="#" aria-label="Instagram" className="underline">Instagram</a>
              <a href="#" aria-label="WeChat" className="underline">WeChat</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="text-xs text-gray-500 mt-6 text-center">© 2025 Joy Billiards New Zealand Ltd. All rights reserved.</div>
    </footer>
  );
}


