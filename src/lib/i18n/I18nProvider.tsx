"use client";
import {createContext, useContext, PropsWithChildren, useMemo} from "react";

type Messages = Record<string, any>;

function getByPath(obj: any, path: string): string {
  return path.split(".").reduce((acc, key) => (acc && acc[key] != null ? acc[key] : undefined), obj) ?? path;
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


