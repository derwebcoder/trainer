import { useMemo, useState } from "react";
import { ActiveWorkoutScreen } from "@/components/active-workout-screen";
import { EditWorkoutScreen, type EditDraft } from "@/components/edit-workout-screen";
import { MotivationBanner } from "@/components/motivation-banner";
import { ProteinScreen } from "@/components/protein-screen";
import { SettingsScreen } from "@/components/settings-screen";
import { TabBar } from "@/components/tab-bar";
import { WorkoutsScreen } from "@/components/workouts-screen";
import { useDailyProtein } from "@/hooks/use-daily-protein";
import { usePersistentState } from "@/hooks/use-persistent-state";
import { DEFAULT_MOTIVATIONS, SAMPLE_WORKOUTS } from "@/lib/sample-data";
import type { Tab, Workout, WorkoutSet } from "@/types/workout";

export const Main = () => {
  const [tab, setTab] = useState<Tab>("protein");
  const { intake, history, setIntake, setHistory } = useDailyProtein();
  const [workouts, setWorkouts] = usePersistentState<Workout[]>("workouts", SAMPLE_WORKOUTS);
  const [manageMode, setManageMode] = useState(false);
  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null);
  const [editing, setEditing] = useState<EditDraft | null>(null);
  const [bodyweight, setBodyweight] = usePersistentState<number>("bodyweight", 81);
  const [motivations, setMotivations] = usePersistentState<string[]>(
    "motivations",
    DEFAULT_MOTIVATIONS,
  );

  const proteinMin = useMemo(() => Math.round(bodyweight * 1.6), [bodyweight]);
  const proteinMax = useMemo(() => Math.round(bodyweight * 2.0), [bodyweight]);

  const completeWorkout = (sets: WorkoutSet[]) => {
    if (!activeWorkout) return;
    setWorkouts((all) =>
      all.map((w) => (w.id === activeWorkout.id ? { ...w, lastDone: Date.now(), sets } : w)),
    );
    setActiveWorkout(null);
  };

  const saveEdit = (updated: EditDraft | Workout) => {
    if (updated.id) {
      setWorkouts((all) => all.map((w) => (w.id === updated.id ? (updated as Workout) : w)));
    } else {
      const created: Workout = {
        id: "w" + Date.now(),
        name: updated.name,
        sets: updated.sets,
        lastDone: null,
      };
      setWorkouts((all) => [...all, created]);
    }
    setEditing(null);
  };

  const handleTabChange = (t: Tab) => {
    setTab(t);
    setManageMode(false);
  };

  if (activeWorkout) {
    return (
      <ActiveWorkoutScreen
        workout={activeWorkout}
        motivations={motivations}
        onComplete={completeWorkout}
        onCancel={() => setActiveWorkout(null)}
      />
    );
  }

  if (editing) {
    return (
      <EditWorkoutScreen workout={editing} onSave={saveEdit} onCancel={() => setEditing(null)} />
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f3f3ee" }}>
      <MotivationBanner key={tab} phrases={motivations} />
      {tab === "protein" && (
        <ProteinScreen
          intake={intake}
          setIntake={setIntake}
          history={history}
          setHistory={setHistory}
          proteinMin={proteinMin}
          proteinMax={proteinMax}
        />
      )}
      {tab === "workouts" && (
        <WorkoutsScreen
          workouts={workouts}
          manageMode={manageMode}
          setManageMode={setManageMode}
          onStart={(w) => setActiveWorkout(w)}
          onEdit={(w) => setEditing(w)}
          onDelete={(id) => setWorkouts((all) => all.filter((w) => w.id !== id))}
          onAddNew={() => setEditing({ name: "", sets: [] })}
        />
      )}
      {tab === "settings" && (
        <SettingsScreen
          bodyweight={bodyweight}
          setBodyweight={setBodyweight}
          motivations={motivations}
          setMotivations={setMotivations}
        />
      )}
      <TabBar tab={tab} onChange={handleTabChange} />
    </div>
  );
};
