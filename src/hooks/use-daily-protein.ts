import { useEffect, useRef, useState } from "react";

const KEY = "muscleme:v1:protein";

type Stored = {
  date: string;
  intake: number;
  history: number[];
};

function todayKey(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function readToday(): Stored {
  const today = todayKey();
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Stored;
      if (parsed.date === today) return parsed;
    }
  } catch {
    // fall through to fresh state
  }
  return { date: today, intake: 0, history: [] };
}

function write(state: Stored) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

function msUntilNextMidnight(): number {
  const now = new Date();
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
  return next.getTime() - now.getTime();
}

export function useDailyProtein() {
  const [state, setState] = useState<Stored>(readToday);

  // persist on change
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    write(state);
  }, [state]);

  // reset at next midnight (and on tab refocus, in case the timer fired while
  // the tab was backgrounded and the timer was throttled)
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      timer = setTimeout(() => {
        const fresh: Stored = { date: todayKey(), intake: 0, history: [] };
        setState(fresh);
        schedule();
      }, msUntilNextMidnight());
    };
    schedule();

    const onVisible = () => {
      if (document.visibilityState === "visible") {
        const today = todayKey();
        setState((s) => (s.date === today ? s : { date: today, intake: 0, history: [] }));
      }
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  const setIntake: React.Dispatch<React.SetStateAction<number>> = (v) =>
    setState((s) => ({
      ...s,
      intake: typeof v === "function" ? (v as (p: number) => number)(s.intake) : v,
    }));

  const setHistory: React.Dispatch<React.SetStateAction<number[]>> = (v) =>
    setState((s) => ({
      ...s,
      history: typeof v === "function" ? (v as (p: number[]) => number[])(s.history) : v,
    }));

  return {
    intake: state.intake,
    history: state.history,
    setIntake,
    setHistory,
  };
}
