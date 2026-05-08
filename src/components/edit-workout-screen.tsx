import { useState } from "react";
import { aggregateMuscles, EXERCISE_LIBRARY, findExercise } from "@/lib/exercises";
import type { Exercise, Workout, WorkoutSet } from "@/types/workout";
import { MuscleChip } from "./muscle-chip";

export type EditDraft = {
  id?: string;
  name: string;
  sets: WorkoutSet[];
  lastDone?: number | null;
};

type Props = {
  workout: EditDraft;
  onSave: (w: Workout | EditDraft) => void;
  onCancel: () => void;
};

export function EditWorkoutScreen({ workout, onSave, onCancel }: Props) {
  const [name, setName] = useState(workout.name);
  const [sets, setSets] = useState<WorkoutSet[]>(workout.sets);
  const [picking, setPicking] = useState(false);

  const addSet = (exercise: Exercise | { name: string } | null) => {
    if (!exercise) {
      setPicking(false);
      return;
    }
    const newSet: WorkoutSet = {
      id: "ns" + Date.now() + Math.random().toString(36).slice(2),
      name: exercise.name,
      weight: 0,
    };
    setSets((s) => [...s, newSet]);
    setPicking(false);
  };
  const updateSet = (id: string, patch: Partial<WorkoutSet>) =>
    setSets((s) => s.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  const deleteSet = (id: string) => setSets((s) => s.filter((x) => x.id !== id));
  const moveSet = (id: string, dir: -1 | 1) => {
    setSets((s) => {
      const i = s.findIndex((x) => x.id === id);
      if (i < 0) return s;
      const j = i + dir;
      if (j < 0 || j >= s.length) return s;
      const c = [...s];
      [c[i], c[j]] = [c[j]!, c[i]!];
      return c;
    });
  };

  const aggregated = aggregateMuscles(sets);

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
            marginBottom: 10,
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
          <button
            onClick={() => onSave({ ...workout, name: name || "UNTITLED", sets })}
            style={{
              background: "#ff5a1f",
              border: "none",
              color: "#fff",
              padding: "6px 14px",
              borderRadius: 999,
              fontFamily: "var(--display-font)",
              fontSize: 11,
              fontWeight: 900,
              letterSpacing: 0.8,
              textTransform: "uppercase",
            }}
          >
            SAVE
          </button>
        </div>
        <div
          style={{
            fontFamily: "var(--mono-font)",
            fontSize: 10,
            color: "rgba(255,255,255,0.5)",
            letterSpacing: 1.5,
            marginBottom: 4,
          }}
        >
          {workout.id ? "EDIT ROUTINE" : "NEW ROUTINE"}
        </div>
        <input
          type="text"
          value={name}
          placeholder="ROUTINE NAME"
          onChange={(e) => setName(e.target.value)}
          style={{
            width: "100%",
            background: "transparent",
            border: "none",
            borderBottom: "1.5px solid rgba(255,255,255,0.15)",
            padding: "4px 0",
            fontFamily: "var(--display-font)",
            fontSize: 28,
            fontWeight: 900,
            letterSpacing: -1,
            color: "#fff",
            textTransform: "uppercase",
            outline: "none",
            boxSizing: "border-box",
          }}
        />
        {aggregated.length > 0 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 4,
              marginTop: 12,
            }}
          >
            {aggregated.map((m) => (
              <MuscleChip key={m} muscle={m} size="sm" />
            ))}
          </div>
        )}
      </div>

      <div style={{ padding: "20px 20px 0", flex: 1 }}>
        <div
          style={{
            fontFamily: "var(--mono-font)",
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: 2,
            color: "#999",
            textTransform: "uppercase",
            marginBottom: 10,
          }}
        >
          EXERCISES · {sets.length}
        </div>

        {sets.length === 0 && (
          <div
            style={{
              padding: "32px 0",
              textAlign: "center",
              fontFamily: "var(--mono-font)",
              fontSize: 11,
              color: "#999",
              letterSpacing: 1,
            }}
          >
            NO EXERCISES YET
          </div>
        )}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {sets.map((s, i) => (
            <EditSetRow
              key={s.id}
              set={s}
              index={i}
              total={sets.length}
              onChange={(patch) => updateSet(s.id, patch)}
              onDelete={() => deleteSet(s.id)}
              onMove={(dir) => moveSet(s.id, dir)}
            />
          ))}
        </div>

        <button
          onClick={() => setPicking(true)}
          style={{
            width: "100%",
            height: 56,
            marginTop: 12,
            background: "#0a0a0a",
            color: "#fff",
            border: "1.5px solid #0a0a0a",
            borderRadius: 14,
            fontFamily: "var(--display-font)",
            fontSize: 13,
            fontWeight: 900,
            letterSpacing: 1,
            textTransform: "uppercase",
            boxShadow: "3px 3px 0 #ff5a1f",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 5v14M5 12h14"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
          ADD EXERCISE
        </button>
        <div style={{ height: 120 }} />
      </div>

      {picking && <ExercisePicker onPick={addSet} onCancel={() => setPicking(false)} />}
    </div>
  );
}

type EditSetRowProps = {
  set: WorkoutSet;
  index: number;
  total: number;
  onChange: (patch: Partial<WorkoutSet>) => void;
  onDelete: () => void;
  onMove: (dir: -1 | 1) => void;
};

function EditSetRow({ set, index, total, onChange, onDelete, onMove }: EditSetRowProps) {
  const lib = findExercise(set.name);

  return (
    <div
      style={{
        background: "#fff",
        border: "1.5px solid #0a0a0a",
        borderRadius: 14,
        padding: "12px 12px 12px 14px",
        boxShadow: "2px 2px 0 #0a0a0a",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 24,
            height: 24,
            borderRadius: 5,
            background: "#0a0a0a",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--mono-font)",
            fontSize: 10,
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </div>

        <input
          type="text"
          value={set.name}
          placeholder="CUSTOM EXERCISE"
          onChange={(e) => onChange({ name: e.target.value })}
          style={{
            flex: 1,
            minWidth: 0,
            border: "none",
            background: "transparent",
            fontFamily: "var(--display-font)",
            fontSize: 15,
            fontWeight: 800,
            letterSpacing: -0.2,
            textTransform: "uppercase",
            outline: "none",
            padding: 0,
          }}
        />

        <input
          type="number"
          value={set.weight}
          onChange={(e) => onChange({ weight: +e.target.value })}
          style={{
            width: 50,
            height: 28,
            border: "1px solid #0a0a0a",
            borderRadius: 6,
            background: "#f3f3ee",
            fontFamily: "var(--mono-font)",
            fontSize: 12,
            fontWeight: 700,
            textAlign: "center",
            outline: "none",
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontFamily: "var(--mono-font)",
            fontSize: 9,
            color: "#999",
            letterSpacing: 1,
            flexShrink: 0,
          }}
        >
          KG
        </span>

        <button
          onClick={onDelete}
          style={{
            width: 28,
            height: 28,
            background: "transparent",
            border: "none",
            color: "#9b3919",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 6l12 12M6 18L18 6"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginTop: 8,
          paddingLeft: 34,
        }}
      >
        <div style={{ flex: 1, display: "flex", flexWrap: "wrap", gap: 3 }}>
          {lib ? (
            <>
              {lib.primary.map((m) => (
                <MuscleChip key={m} muscle={m} size="sm" />
              ))}
              {lib.secondary.slice(0, 2).map((m) => (
                <MuscleChip key={m} muscle={m} secondary size="sm" />
              ))}
              {lib.secondary.length > 2 && (
                <span
                  style={{
                    fontFamily: "var(--mono-font)",
                    fontSize: 9,
                    color: "#999",
                    alignSelf: "center",
                  }}
                >
                  +{lib.secondary.length - 2}
                </span>
              )}
            </>
          ) : (
            <span
              style={{
                fontFamily: "var(--mono-font)",
                fontSize: 9,
                color: "#bbb",
                letterSpacing: 0.8,
                alignSelf: "center",
              }}
            >
              {set.name ? "CUSTOM · NO MUSCLE DATA" : ""}
            </span>
          )}
        </div>
        <div style={{ display: "flex", gap: 2, flexShrink: 0 }}>
          <button onClick={() => onMove(-1)} disabled={index === 0} style={moveBtn(index === 0)}>
            ↑
          </button>
          <button
            onClick={() => onMove(+1)}
            disabled={index === total - 1}
            style={moveBtn(index === total - 1)}
          >
            ↓
          </button>
        </div>
      </div>
    </div>
  );
}

function moveBtn(disabled: boolean): React.CSSProperties {
  return {
    width: 24,
    height: 24,
    background: disabled ? "#f0f0e8" : "#fff",
    border: "1px solid #dcdcd5",
    borderRadius: 5,
    cursor: disabled ? "not-allowed" : "pointer",
    color: disabled ? "#ccc" : "#0a0a0a",
    fontFamily: "var(--mono-font)",
    fontSize: 11,
    fontWeight: 700,
    padding: 0,
  };
}

type PickerProps = {
  onPick: (e: Exercise | { name: string; primary: []; secondary: [] } | null) => void;
  onCancel: () => void;
};

function ExercisePicker({ onPick, onCancel }: PickerProps) {
  const [query, setQuery] = useState("");
  const filtered = EXERCISE_LIBRARY.filter((e) =>
    e.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div
      onClick={onCancel}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        zIndex: 50,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        animation: "fadeIn 0.2s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#f3f3ee",
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          maxHeight: "80%",
          display: "flex",
          flexDirection: "column",
          animation: "slideUp 0.25s cubic-bezier(.2,.8,.2,1)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "10px 0 0",
          }}
        >
          <div
            style={{
              width: 40,
              height: 4,
              borderRadius: 2,
              background: "#dcdcd5",
            }}
          />
        </div>
        <div style={{ padding: "14px 20px 8px" }}>
          <div
            style={{
              fontFamily: "var(--mono-font)",
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: 2,
              color: "#999",
              textTransform: "uppercase",
            }}
          >
            PICK EXERCISE
          </div>
          <input
            type="text"
            value={query}
            placeholder="SEARCH OR ADD CUSTOM..."
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            style={{
              width: "100%",
              marginTop: 6,
              padding: "8px 0",
              border: "none",
              borderBottom: "1.5px solid #0a0a0a",
              background: "transparent",
              fontFamily: "var(--display-font)",
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: -0.5,
              textTransform: "uppercase",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "8px 20px 4px",
          }}
          className="scroll-hide"
        >
          {filtered.map((ex) => (
            <button
              key={ex.name}
              onClick={() => onPick(ex)}
              style={{
                width: "100%",
                marginBottom: 8,
                padding: "12px 14px",
                background: "#fff",
                border: "1.5px solid #0a0a0a",
                borderRadius: 14,
                textAlign: "left",
                boxShadow: "2px 2px 0 #0a0a0a",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--display-font)",
                  fontSize: 16,
                  fontWeight: 900,
                  color: "#0a0a0a",
                  letterSpacing: -0.3,
                  textTransform: "uppercase",
                  marginBottom: 6,
                }}
              >
                {ex.name}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                {ex.primary.map((m) => (
                  <MuscleChip key={m} muscle={m} size="sm" />
                ))}
                {ex.secondary.map((m) => (
                  <MuscleChip key={m} muscle={m} secondary size="sm" />
                ))}
              </div>
            </button>
          ))}
          {filtered.length === 0 && query.trim() && (
            <div
              style={{
                padding: "20px 0",
                textAlign: "center",
                fontFamily: "var(--mono-font)",
                fontSize: 11,
                color: "#999",
                letterSpacing: 1,
              }}
            >
              NO MATCH IN LIBRARY
            </div>
          )}
        </div>

        <div
          style={{
            padding: "10px 20px 24px",
            borderTop: "1.5px solid #e5e5dd",
            background: "#f3f3ee",
          }}
        >
          <button
            onClick={() =>
              onPick(query.trim() ? { name: query.trim(), primary: [], secondary: [] } : null)
            }
            style={{
              width: "100%",
              height: 48,
              background: "transparent",
              border: "1.5px dashed #0a0a0a",
              borderRadius: 12,
              fontFamily: "var(--display-font)",
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: 1,
              textTransform: "uppercase",
              color: "#0a0a0a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            + ADD CUSTOM
            {query.trim() ? `: "${query.trim().toUpperCase()}"` : " EXERCISE"}
          </button>
        </div>
      </div>
    </div>
  );
}
