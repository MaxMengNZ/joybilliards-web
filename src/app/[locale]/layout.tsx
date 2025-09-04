import type {Metadata, LayoutProps} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "../globals.css";
import {I18nProvider} from "@/lib/i18n/I18nProvider";
import {Header} from "@/components/layout/Header";
import {ThemeProvider} from "next-themes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Joy Billiards",
  description: "Membership, events, booking and rankings platform",
};

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const {locale} = params;
  const messages = (await import(`@/messages/${locale}.json`)).default;

  return (
    <I18nProvider locale={locale} messages={messages}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <Header />
        {children}
      </ThemeProvider>
    </I18nProvider>
  );
}


