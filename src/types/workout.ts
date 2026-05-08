export type WorkoutSet = {
  id: string;
  name: string;
  weight: number;
};

export type Workout = {
  id: string;
  name: string;
  lastDone: number | null;
  sets: WorkoutSet[];
};

export type ActiveSet = WorkoutSet & {
  done: boolean;
  doneAt?: number;
};

export type Exercise = {
  name: string;
  primary: string[];
  secondary: string[];
};

export type Tab = "protein" | "workouts" | "settings";
