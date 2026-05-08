import { useEffect, useRef, useState } from "react";

const PREFIX = "muscleme:v1:";

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (raw == null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // quota exceeded or storage disabled — silently drop
  }
}

export function usePersistentState<T>(
  key: string,
  initial: T | (() => T),
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    const fallback = typeof initial === "function" ? (initial as () => T)() : initial;
    return read(key, fallback);
  });

  // skip the first effect — value already came from storage
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    write(key, value);
  }, [key, value]);

  return [value, setValue];
}
