import { useCallback, useSyncExternalStore } from "react";

export const DONE_STORAGE_KEY = "kvizy:done";

const EMPTY: ReadonlySet<number> = new Set();

export function parseDoneIds(raw: string | null): ReadonlySet<number> {
  if (!raw) return EMPTY;
  try {
    const value: unknown = JSON.parse(raw);
    if (!Array.isArray(value)) return EMPTY;
    return new Set(value.filter((id): id is number => Number.isSafeInteger(id) && id > 0));
  } catch {
    return EMPTY;
  }
}

export function serializeDoneIds(ids: ReadonlySet<number>): string {
  return JSON.stringify([...ids].sort((a, b) => a - b));
}

export function withDone(ids: ReadonlySet<number>, id: number, done: boolean): ReadonlySet<number> {
  if (ids.has(id) === done) return ids;
  const next = new Set(ids);
  if (done) next.add(id);
  else next.delete(id);
  return next;
}

const listeners = new Set<() => void>();
// Used when localStorage is unavailable (private mode, blocked storage): marks then last until reload.
let memoryRaw: string | null = null;
let cachedRaw: string | null | undefined;
let cachedIds: ReadonlySet<number> = EMPTY;

function readRaw(): string | null {
  try {
    return window.localStorage.getItem(DONE_STORAGE_KEY);
  } catch {
    return memoryRaw;
  }
}

function getSnapshot(): ReadonlySet<number> {
  const raw = readRaw();
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedIds = parseDoneIds(raw);
  }
  return cachedIds;
}

const getServerSnapshot = () => EMPTY;

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === DONE_STORAGE_KEY) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function setDone(id: number, done: boolean) {
  const raw = serializeDoneIds(withDone(getSnapshot(), id, done));
  memoryRaw = raw;
  try {
    window.localStorage.setItem(DONE_STORAGE_KEY, raw);
  } catch {}
  for (const listener of listeners) listener();
}

/** Quizzes the visitor marked as done, keyed by the quiz's database id and kept in this browser. */
export function useDoneQuizzes() {
  const done = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const toggle = useCallback((id: number, value: boolean) => setDone(id, value), []);
  return { done, setDone: toggle };
}
