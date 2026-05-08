import type { Exercise, WorkoutSet } from "@/types/workout";

export const EXERCISE_LIBRARY: Exercise[] = [
  {
    name: "Squats",
    primary: ["Quadriceps", "Glutes"],
    secondary: ["Hamstrings", "Core", "Lower Back", "Calves"],
  },
  {
    name: "Deadlifts",
    primary: ["Glutes", "Hamstrings"],
    secondary: ["Lower Back", "Core", "Trapezius", "Lats", "Forearms"],
  },
  {
    name: "Bench Press",
    primary: ["Chest"],
    secondary: ["Triceps", "Anterior Deltoids", "Serratus Anterior"],
  },
  {
    name: "Overhead Press",
    primary: ["Shoulders"],
    secondary: ["Triceps", "Upper Chest", "Trapezius", "Core"],
  },
  {
    name: "Pull-Ups",
    primary: ["Lats"],
    secondary: ["Biceps", "Rhomboids", "Trapezius", "Rear Deltoids", "Forearms"],
  },
];

const LIBRARY_INDEX = new Map(EXERCISE_LIBRARY.map((e) => [e.name.toLowerCase(), e]));

export function findExercise(name: string | undefined | null): Exercise | null {
  if (!name) return null;
  return LIBRARY_INDEX.get(name.trim().toLowerCase()) ?? null;
}

export function aggregateMuscles(sets: WorkoutSet[]): string[] {
  const counts = new Map<string, number>();
  const order: string[] = [];
  for (const s of sets) {
    const lib = findExercise(s.name);
    if (!lib) continue;
    for (const m of lib.primary) {
      if (!counts.has(m)) order.push(m);
      counts.set(m, (counts.get(m) ?? 0) + 1);
    }
  }
  return order.sort((a, b) => (counts.get(b) ?? 0) - (counts.get(a) ?? 0));
}

export function relativeDate(ts: number | null): string {
  if (ts == null) return "Never done";
  const diff = Date.now() - ts;
  const day = 86400000;
  if (diff < day * 0.04) return "Just now";
  if (diff < day) return `${Math.round(diff / 3600000)}h ago`;
  const days = Math.round(diff / day);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 14) return "1 week ago";
  if (days < 30) return `${Math.round(days / 7)} weeks ago`;
  return `${Math.round(days / 30)} months ago`;
}
