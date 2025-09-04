"use client";
import {createContext, useContext, PropsWithChildren, useMemo} from "react";

type Messages = Record<string, unknown>;

function getByPath(obj: Record<string, unknown>, path: string): string {
  const value = path.split(".").reduce<unknown>((acc, key) => (acc && typeof acc === "object" && (acc as Record<string, unknown>)[key] != null ? (acc as Record<string, unknown>)[key] : undefined), obj);
  return typeof value === "string" ? value : path;
}

type I18nContextValue = {
  locale: string;
  messages: Messages;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({locale, messages, children}: PropsWithChildren<{locale: string; messages: Messages;}>) {
  const value = useMemo<I18nContextValue>(() => ({
    locale,
    messages,
    t: (key: string) => String(getByPath(messages, key)),
  }), [locale, messages]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}


