import { useMemo } from "react";
import { aggregateMuscles, relativeDate } from "@/lib/exercises";
import type { Workout } from "@/types/workout";
import { MuscleChip } from "./muscle-chip";

type Props = {
  workouts: Workout[];
  manageMode: boolean;
  setManageMode: (v: boolean) => void;
  onStart: (w: Workout) => void;
  onEdit: (w: Workout) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
};

export function WorkoutsScreen({
  workouts,
  manageMode,
  setManageMode,
  onStart,
  onEdit,
  onDelete,
  onAddNew,
}: Props) {
  const sorted = useMemo(
    () =>
      [...workouts].sort((a, b) => {
        if (a.lastDone == null && b.lastDone == null) return 0;
        if (a.lastDone == null) return -1;
        if (b.lastDone == null) return 1;
        return a.lastDone - b.lastDone;
      }),
    [workouts],
  );

  return (
    <div style={{ padding: "0 0 120px", minHeight: "100%", background: "#f3f3ee" }}>
      <div style={{ padding: "16px 20px 0" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: 4,
          }}
        >
          <div
            style={{
              fontFamily: "var(--mono-font)",
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "#999",
            }}
          >
            ◉ {workouts.length} routines
          </div>
          <button
            onClick={() => setManageMode(!manageMode)}
            style={{
              padding: "6px 12px",
              background: manageMode ? "#0a0a0a" : "transparent",
              color: manageMode ? "#fff" : "#0a0a0a",
              border: "1.5px solid #0a0a0a",
              borderRadius: 999,
              fontFamily: "var(--display-font)",
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: 0.8,
              textTransform: "uppercase",
            }}
          >
            {manageMode ? "DONE" : "MANAGE"}
          </button>
        </div>
        <h1
          style={{
            margin: 0,
            fontFamily: "var(--display-font)",
            fontSize: 38,
            fontWeight: 900,
            letterSpacing: -1.4,
            color: "#0a0a0a",
            lineHeight: 0.95,
          }}
        >
          YOUR
          <br />
          <span style={{ color: "#ff5a1f" }}>ROUTINES.</span>
        </h1>
        <div
          style={{
            marginTop: 10,
            fontFamily: "var(--mono-font)",
            fontSize: 11,
            color: "#666",
            letterSpacing: 0.5,
          }}
        >
          SORTED BY ↑ OLDEST FIRST · TIME TO MOVE
        </div>
      </div>

      {manageMode && (
        <div style={{ padding: "24px 20px 0" }}>
          <button
            onClick={onAddNew}
            style={{
              width: "100%",
              height: 64,
              background: "transparent",
              border: "2px dashed #0a0a0a",
              borderRadius: 16,
              fontFamily: "var(--display-font)",
              fontSize: 14,
              fontWeight: 800,
              letterSpacing: 1,
              textTransform: "uppercase",
              color: "#0a0a0a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 5v14M5 12h14"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
            ADD NEW ROUTINE
          </button>
        </div>
      )}

      <div
        style={{
          padding: `${manageMode ? 10 : 24}px 20px 0`,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {sorted.map((w, i) => (
          <WorkoutCard
            key={w.id}
            workout={w}
            index={i}
            urgent={i === 0}
            manageMode={manageMode}
            onStart={() => onStart(w)}
            onEdit={() => onEdit(w)}
            onDelete={() => onDelete(w.id)}
          />
        ))}
      </div>
    </div>
  );
}

type CardProps = {
  workout: Workout;
  index: number;
  urgent: boolean;
  manageMode: boolean;
  onStart: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

function WorkoutCard({ workout, index, urgent, manageMode, onStart, onEdit, onDelete }: CardProps) {
  const rel = relativeDate(workout.lastDone);
  const isOverdue = workout.lastDone == null || Date.now() - workout.lastDone > 7 * 86400000;
  const muscles = aggregateMuscles(workout.sets);
  const highlight = urgent && !manageMode;

  return (
    <div
      style={{
        position: "relative",
        background: highlight ? "#0a0a0a" : "#fff",
        color: highlight ? "#fff" : "#0a0a0a",
        border: "1.5px solid #0a0a0a",
        borderRadius: 18,
        padding: "16px 18px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        boxShadow: highlight ? "4px 4px 0 #ff5a1f" : "3px 3px 0 #0a0a0a",
        transition: "all 0.2s",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: highlight ? "#ff5a1f" : "#f3f3ee",
            color: highlight ? "#fff" : "#0a0a0a",
            border: highlight ? "none" : "1.5px solid #0a0a0a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--mono-font)",
            fontSize: 12,
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: "var(--display-font)",
              fontSize: 18,
              fontWeight: 800,
              letterSpacing: -0.3,
              lineHeight: 1.1,
              textTransform: "uppercase",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {workout.name}
          </div>
          <div
            style={{
              marginTop: 4,
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontFamily: "var(--mono-font)",
              fontSize: 10,
              fontWeight: 500,
              color: highlight ? "rgba(255,255,255,0.7)" : "#666",
              letterSpacing: 0.5,
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: isOverdue ? "#ff5a1f" : "#52c878",
              }}
            />
            {rel.toUpperCase()} · {workout.sets.length} SETS
          </div>
        </div>

        {manageMode ? (
          <div style={{ display: "flex", gap: 6 }}>
            <button
              onClick={onEdit}
              style={{
                width: 40,
                height: 40,
                background: "#fff",
                border: "1.5px solid #0a0a0a",
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              title="Edit"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4 12.5-12.5z"
                  stroke="#0a0a0a"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              onClick={onDelete}
              style={{
                width: 40,
                height: 40,
                background: "#9b3919",
                border: "1.5px solid #0a0a0a",
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              title="Delete"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        ) : (
          <button
            onClick={onStart}
            style={{
              width: 56,
              height: 56,
              background: urgent ? "#ff5a1f" : "#0a0a0a",
              border: "none",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "inset 0 0 0 1.5px #0a0a0a",
              flexShrink: 0,
            }}
            title="Start workout"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff" style={{ marginLeft: 3 }}>
              <path d="M6 4l14 8-14 8V4z" />
            </svg>
          </button>
        )}
      </div>
      {muscles.length > 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 3,
            paddingLeft: 44,
          }}
        >
          {muscles.map((m) => (
            <MuscleChip key={m} muscle={m} size="sm" />
          ))}
        </div>
      )}
    </div>
  );
}
