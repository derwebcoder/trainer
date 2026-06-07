import type { Workout } from "@/types/workout";

export const SAMPLE_WORKOUTS: Workout[] = [
  {
    id: "w1",
    name: "Workout A",
    lastDone: 0,
    sets: [
      { id: "s1", name: "Bench Press", weight: 0 },
      { id: "s7", name: "Deadlifts", weight: 0 },
      { id: "s6", name: "Pull-Ups", weight: 0 },
      { id: "s2", name: "Overhead Press", weight: 0 },
    ],
  },
  {
    id: "w2",
    name: "Workout B",
    lastDone: 0,
    sets: [
      { id: "s10", name: "Squats", weight: 0 },
      { id: "s11", name: "Deadlifts", weight: 0 },
      { id: "s2", name: "Overhead Press", weight: 0 },
      { id: "s8", name: "Push Ups", weight: 0 },
    ],
  },
  {
    id: "w3",
    name: "Workout C",
    lastDone: 0,
    sets: [
      { id: "s1", name: "Bench Press", weight: 0 },
      { id: "s6", name: "Pull-Ups", weight: 0 },
      { id: "s10", name: "Squats", weight: 0 },
      { id: "s8", name: "Biceps Curls", weight: 0 },
    ],
  },
];

export const DEFAULT_MOTIVATIONS = ["STRONG MIND, STRONG BODY.", "EARN IT."];
