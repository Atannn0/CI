"use client";

import { createContext, useCallback, useContext, useEffect, useSyncExternalStore, type ReactNode } from "react";
import { DEFAULT_LOCALE, LOCALE_STORAGE_KEY, LOCALES, t, type MessageKey, type UiLocale } from "./messages";

type LocaleContextValue = {
  locale: UiLocale;
  setLocale: (locale: UiLocale) => void;
  t: (key: MessageKey, vars?: Record<string, string | number>) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function readStoredLocale(): UiLocale {
  try {
    const raw = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (raw && (LOCALES as string[]).includes(raw)) return raw as UiLocale;
  } catch {
    /* ignore */
  }
  return DEFAULT_LOCALE;
}

function getSnapshot(): UiLocale {
  return readStoredLocale();
}

function getServerSnapshot(): UiLocale {
  return DEFAULT_LOCALE;
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next: UiLocale) => {
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
    emit();
  }, []);

  const value: LocaleContextValue = {
    locale,
    setLocale,
    t: (key, vars) => t(key, locale, vars),
  };

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
