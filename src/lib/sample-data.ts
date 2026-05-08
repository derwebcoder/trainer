import type { Workout } from "@/types/workout";

const day = 86400000;
const now = Date.now();

export const SAMPLE_WORKOUTS: Workout[] = [
  {
    id: "w1",
    name: "Push Day",
    lastDone: now - 9 * day,
    sets: [
      { id: "s1", name: "Bench Press", weight: 60 },
      { id: "s2", name: "Overhead Press", weight: 40 },
      { id: "s5", name: "Tricep Dips", weight: 0 },
    ],
  },
  {
    id: "w2",
    name: "Pull Day",
    lastDone: now - 4 * day,
    sets: [
      { id: "s6", name: "Pull-Ups", weight: 0 },
      { id: "s7", name: "Deadlifts", weight: 90 },
      { id: "s8", name: "Bicep Curls", weight: 12 },
    ],
  },
  {
    id: "w3",
    name: "Leg Smasher",
    lastDone: now - 2 * day,
    sets: [
      { id: "s10", name: "Squats", weight: 80 },
      { id: "s11", name: "Deadlifts", weight: 70 },
      { id: "s13", name: "Calf Raises", weight: 40 },
    ],
  },
  {
    id: "w4",
    name: "Full Body",
    lastDone: now - 14 * day,
    sets: [
      { id: "s14", name: "Squats", weight: 60 },
      { id: "s15", name: "Bench Press", weight: 50 },
      { id: "s16", name: "Pull-Ups", weight: 0 },
    ],
  },
];

export const DEFAULT_MOTIVATIONS = [
  "ONE MORE REP.",
  "DISCIPLINE > MOTIVATION.",
  "SHOW UP. EVERY DAMN DAY.",
  "STRONG MIND, STRONG BODY.",
  "EARN IT.",
];
