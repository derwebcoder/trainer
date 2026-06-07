import { useMemo, useState } from "react";
import { findExercise } from "@/lib/exercises";
import type { ActiveSet, Workout, WorkoutSet } from "@/types/workout";
import { MotivationBanner } from "./motivation-banner";
import { MuscleChip } from "./muscle-chip";

type Props = {
  workout: Workout;
  motivations: string[];
  onComplete: (sets: WorkoutSet[]) => void;
  onCancel: () => void;
};

export function ActiveWorkoutScreen({ workout, motivations, onComplete, onCancel }: Props) {
  const [sets, setSets] = useState<ActiveSet[]>(() =>
    workout.sets.map((s) => ({ ...s, done: false })),
  );

  const updateWeight = (id: string, weight: number) => {
    setSets((s) => s.map((x) => (x.id === id ? { ...x, weight } : x)));
  };
  const toggleDone = (id: string) => {
    setSets((s) =>
      s.map((x) =>
        x.id === id
          ? x.done
            ? { ...x, done: false, doneAt: undefined }
            : { ...x, done: true, doneAt: Date.now() }
          : x,
      ),
    );
  };

  const ordered = useMemo(
    () => [...sets.filter((s) => !s.done), ...sets.filter((s) => s.done)],
    [sets],
  );

  const doneCount = sets.filter((s) => s.done).length;
  const allDone = doneCount === sets.length && sets.length > 0;

  const finish = () => {
    onComplete(sets.map(({ done: _d, doneAt: _da, ...rest }) => rest));
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f3f3ee",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          padding: "60px 20px 14px",
          background: "#0a0a0a",
          color: "#fff",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <button
            onClick={onCancel}
            style={{
              background: "transparent",
              border: "1.5px solid rgba(255,255,255,0.3)",
              color: "#fff",
              padding: "6px 12px",
              borderRadius: 999,
              fontFamily: "var(--display-font)",
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: 0.8,
              textTransform: "uppercase",
            }}
          >
            ← BACK
          </button>
        </div>
        <h1
          style={{
            margin: "8px 0 0",
            fontFamily: "var(--display-font)",
            fontSize: 32,
            fontWeight: 900,
            letterSpacing: -1.2,
            textTransform: "uppercase",
            lineHeight: 0.95,
          }}
        >
          {workout.name}
        </h1>
        <div
          style={{
            marginTop: 12,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              flex: 1,
              height: 6,
              background: "rgba(255,255,255,0.15)",
              borderRadius: 999,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: sets.length === 0 ? "0%" : `${(doneCount / sets.length) * 100}%`,
                background: "#ff5a1f",
                transition: "width 0.4s cubic-bezier(.2,.8,.2,1)",
              }}
            />
          </div>
          <div
            style={{
              fontFamily: "var(--mono-font)",
              fontSize: 13,
              fontWeight: 700,
              color: "#fff",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {doneCount}/{sets.length}
          </div>
        </div>
      </div>

      <MotivationBanner phrases={motivations} />

      <div
        style={{
          padding: "20px 20px 24px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          flex: 1,
        }}
      >
        {ordered.map((s) => (
          <SetRow
            key={s.id}
            set={s}
            onWeightChange={(w) => updateWeight(s.id, w)}
            onToggleDone={() => toggleDone(s.id)}
          />
        ))}
      </div>

      <div style={{ padding: "0 20px 32px", position: "sticky", bottom: 0 }}>
        <button
          onClick={finish}
          disabled={!allDone}
          style={{
            width: "100%",
            height: 64,
            background: allDone ? "#ff5a1f" : "#dcdcd5",
            color: allDone ? "#fff" : "#999",
            border: "1.5px solid #0a0a0a",
            borderRadius: 16,
            cursor: allDone ? "pointer" : "not-allowed",
            fontFamily: "var(--display-font)",
            fontSize: 16,
            fontWeight: 900,
            letterSpacing: 1.2,
            textTransform: "uppercase",
            boxShadow: allDone ? "4px 4px 0 #0a0a0a" : "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            animation: allDone ? "pulseGlow 1.6s ease-in-out infinite" : "none",
          }}
        >
          {allDone ? "✓ COMPLETE WORKOUT" : `${sets.length - doneCount} SETS LEFT`}
        </button>
      </div>
    </div>
  );
}

type SetRowProps = {
  set: ActiveSet;
  onWeightChange: (w: number) => void;
  onToggleDone: () => void;
};

function SetRow({ set, onWeightChange, onToggleDone }: SetRowProps) {
  const lib = findExercise(set.name);
  return (
    <div
      style={{
        background: set.done ? "transparent" : "#fff",
        border: "1.5px solid #0a0a0a",
        borderRadius: 16,
        padding: "14px 14px 14px 18px",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        boxShadow: set.done ? "none" : "3px 3px 0 #0a0a0a",
        opacity: set.done ? 0.45 : 1,
        transition: "opacity 0.3s, box-shadow 0.2s, background 0.2s",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: "var(--display-font)",
              fontSize: 17,
              fontWeight: 800,
              letterSpacing: -0.3,
              textTransform: "uppercase",
              textDecoration: set.done ? "line-through" : "none",
              color: "#0a0a0a",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {set.name}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginTop: 4,
            }}
          >
            <div
              style={{
                fontFamily: "var(--mono-font)",
                fontSize: 10,
                color: "#999",
                letterSpacing: 1,
              }}
            >
              WEIGHT
            </div>
            <input
              type="number"
              value={set.weight}
              onChange={(e) => onWeightChange(+e.target.value)}
              disabled={set.done}
              style={{
                width: 60,
                height: 28,
                background: set.done ? "transparent" : "#f3f3ee",
                border: set.done ? "none" : "1px solid #0a0a0a",
                borderRadius: 6,
                padding: "0 6px",
                fontFamily: "var(--mono-font)",
                fontSize: 14,
                fontWeight: 700,
                color: "#0a0a0a",
                outline: "none",
                textAlign: "center",
              }}
            />
            <div
              style={{
                fontFamily: "var(--mono-font)",
                fontSize: 10,
                color: "#999",
                letterSpacing: 1,
              }}
            >
              KG
            </div>
          </div>
        </div>

        <button
          onClick={onToggleDone}
          style={{
            padding: "0 16px",
            height: 44,
            background: set.done ? "transparent" : "#0a0a0a",
            color: set.done ? "#0a0a0a" : "#fff",
            border: "1.5px solid #0a0a0a",
            borderRadius: 999,
            fontFamily: "var(--display-font)",
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: 0.8,
            textTransform: "uppercase",
            flexShrink: 0,
          }}
        >
          {set.done ? "UNDO" : "DONE"}
        </button>
      </div>

      {lib && (lib.primary.length > 0 || lib.secondary.length > 0) && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 3,
          }}
        >
          {lib.primary.map((m) => (
            <MuscleChip key={m} muscle={m} size="sm" />
          ))}
          {lib.secondary.map((m) => (
            <MuscleChip key={m} muscle={m} secondary size="sm" />
          ))}
        </div>
      )}
    </div>
  );
}
