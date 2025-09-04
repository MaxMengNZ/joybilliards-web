"use client";
import NextLink from "next/link";
import {usePathname} from "next/navigation";
import {PropsWithChildren} from "react";

export const locales = ["en-NZ", "zh-CN"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en-NZ";

function extractLocaleFromPathname(pathname: string): Locale {
  const segment = pathname.split("/")[1];
  if (locales.includes(segment as Locale)) return segment as Locale;
  return defaultLocale;
}

type Href = string | { pathname: string };

export function Link({ href, locale, children, className }: PropsWithChildren<{ href: Href; locale?: Locale; className?: string }>) {
  const pathname = usePathname() ?? "/";
  const currentLocale = extractLocaleFromPathname(pathname);
  const targetLocale = locale ?? currentLocale;

  let path = typeof href === "string" ? href : href.pathname;
  if (!path.startsWith("/")) path = `/${path}`;
  const finalHref = `/${targetLocale}${path}`;

  return (
    <NextLink href={finalHref} className={className}>
      {children}
    </NextLink>
  );
}

export { usePathname };


