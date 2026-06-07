import { useRef, useState } from "react";
import type { Workout } from "@/types/workout";

type Props = {
  bodyweight: number;
  setBodyweight: (v: number) => void;
  motivations: string[];
  setMotivations: (v: string[]) => void;
  workouts: Workout[];
  setWorkouts: (v: Workout[]) => void;
};

export function SettingsScreen({
  bodyweight,
  setBodyweight,
  motivations,
  setMotivations,
  workouts,
  setWorkouts,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(bodyweight));
  const [importStatus, setImportStatus] = useState<"ok" | "error" | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const lowEnd = Math.round(bodyweight * 1.6);
  const highEnd = Math.round(bodyweight * 2.0);

  const commit = () => {
    const v = parseFloat(draft);
    if (!Number.isNaN(v) && v > 20 && v < 300) {
      setBodyweight(v);
    } else {
      setDraft(String(bodyweight));
    }
    setEditing(false);
  };

  const addMotivation = () => setMotivations([...motivations, ""]);
  const updateMotivation = (i: number, v: string) => {
    const next = [...motivations];
    next[i] = v;
    setMotivations(next);
  };
  const removeMotivation = (i: number) => setMotivations(motivations.filter((_, j) => j !== i));

  const handleExport = () => {
    const json = JSON.stringify(
      { version: 1, exportedAt: Date.now(), workouts, bodyweight, motivations },
      null,
      2,
    );
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([json], { type: "application/json" }));
    a.download = `trainer-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        if (
          data.version !== 1 ||
          !Array.isArray(data.workouts) ||
          typeof data.bodyweight !== "number" ||
          !Array.isArray(data.motivations)
        ) {
          throw new Error("invalid");
        }
        setWorkouts(data.workouts as Workout[]);
        setBodyweight(data.bodyweight as number);
        setMotivations(data.motivations as string[]);
        setImportStatus("ok");
      } catch {
        setImportStatus("error");
      }
      e.target.value = "";
      setTimeout(() => setImportStatus(null), 3000);
    };
    reader.readAsText(file);
  };

  return (
    <div style={{ padding: "0 0 120px", minHeight: "100%", background: "#f3f3ee" }}>
      <div style={{ padding: "16px 20px 0" }}>
        <div
          style={{
            fontFamily: "var(--mono-font)",
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: "#999",
            marginBottom: 4,
          }}
        >
          ◉ Profile · You
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
          SET
          <br />
          <span style={{ color: "#ff5a1f" }}>YOURSELF UP.</span>
        </h1>
      </div>

      <div style={{ padding: "28px 20px 0" }}>
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
          BODYWEIGHT
        </div>

        <div
          style={{
            background: "#0a0a0a",
            color: "#fff",
            border: "1.5px solid #0a0a0a",
            borderRadius: 18,
            padding: "20px 22px",
            boxShadow: "4px 4px 0 #ff5a1f",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            {editing ? (
              <input
                type="number"
                inputMode="decimal"
                autoFocus
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onBlur={commit}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commit();
                }}
                style={{
                  width: 180,
                  background: "transparent",
                  border: "none",
                  borderBottom: "2px solid #ff5a1f",
                  color: "#fff",
                  fontFamily: "var(--display-font)",
                  fontSize: 64,
                  fontWeight: 900,
                  letterSpacing: -3,
                  outline: "none",
                  padding: 0,
                  fontVariantNumeric: "tabular-nums",
                }}
              />
            ) : (
              <button
                onClick={() => {
                  setDraft(String(bodyweight));
                  setEditing(true);
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  fontFamily: "var(--display-font)",
                  fontSize: 64,
                  fontWeight: 900,
                  letterSpacing: -3,
                  color: "#fff",
                  padding: 0,
                  lineHeight: 1,
                  fontVariantNumeric: "tabular-nums",
                  textAlign: "left",
                }}
              >
                {bodyweight}
              </button>
            )}
            <div
              style={{
                fontFamily: "var(--mono-font)",
                fontSize: 16,
                fontWeight: 700,
                color: "#ff5a1f",
                letterSpacing: 1.5,
              }}
            >
              KG
            </div>
          </div>
          <div
            style={{
              marginTop: 8,
              fontFamily: "var(--mono-font)",
              fontSize: 11,
              color: "rgba(255,255,255,0.55)",
              letterSpacing: 0.5,
            }}
          >
            {editing ? "PRESS ENTER TO SAVE" : "TAP TO EDIT"}
          </div>

          {!editing && (
            <div style={{ display: "flex", gap: 6, marginTop: 14 }}>
              {([-1, -0.5, 0.5, 1] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setBodyweight(+Math.max(20, bodyweight + d).toFixed(1))}
                  style={{
                    flex: 1,
                    height: 36,
                    background: "transparent",
                    border: "1px solid rgba(255,255,255,0.25)",
                    borderRadius: 8,
                    color: "#fff",
                    fontFamily: "var(--mono-font)",
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: 0.5,
                  }}
                >
                  {d > 0 ? "+" : ""}
                  {d}
                </button>
              ))}
            </div>
          )}

          <div
            style={{
              marginTop: 14,
              paddingTop: 12,
              borderTop: "1px dashed rgba(255,255,255,0.18)",
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              fontFamily: "var(--mono-font)",
              fontSize: 11,
              color: "rgba(255,255,255,0.55)",
              letterSpacing: 1,
            }}
          >
            <span>PROTEIN GOAL</span>
            <span
              style={{
                fontFamily: "var(--display-font)",
                fontSize: 18,
                fontWeight: 900,
                color: "#fff",
                letterSpacing: -0.5,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {lowEnd}
              <span style={{ color: "rgba(255,255,255,0.4)" }}>–</span>
              <span style={{ color: "#ff5a1f" }}>{highEnd}</span>
              <span
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.4)",
                  marginLeft: 3,
                }}
              >
                g
              </span>
            </span>
          </div>
        </div>
      </div>

      <div style={{ padding: "28px 20px 0" }}>
        <div
          style={{
            fontFamily: "var(--mono-font)",
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: 2,
            color: "#999",
            textTransform: "uppercase",
            marginBottom: 10,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
          }}
        >
          <span>MOTIVATIONS · {motivations.length}</span>
          <button
            onClick={addMotivation}
            style={{
              padding: "4px 10px",
              background: "#0a0a0a",
              color: "#fff",
              border: "none",
              borderRadius: 999,
              fontFamily: "var(--display-font)",
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: 0.8,
              textTransform: "uppercase",
            }}
          >
            + ADD
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {motivations.map((m, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "10px 12px",
                background: "#fff",
                border: "1.5px solid #0a0a0a",
                borderRadius: 12,
              }}
            >
              <input
                type="text"
                value={m}
                placeholder="YOUR PHRASE..."
                onChange={(e) => updateMotivation(i, e.target.value)}
                style={{
                  flex: 1,
                  minWidth: 0,
                  border: "none",
                  background: "transparent",
                  fontFamily: "var(--display-font)",
                  fontSize: 14,
                  fontWeight: 800,
                  letterSpacing: 0.4,
                  textTransform: "uppercase",
                  outline: "none",
                  padding: 0,
                  color: "#0a0a0a",
                }}
              />
              <button
                onClick={() => removeMotivation(i)}
                style={{
                  width: 24,
                  height: 24,
                  background: "transparent",
                  border: "none",
                  color: "#9b3919",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M6 6l12 12M6 18L18 6"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          ))}
          {motivations.length === 0 && (
            <div
              style={{
                padding: "16px 0",
                textAlign: "center",
                fontFamily: "var(--mono-font)",
                fontSize: 10.5,
                color: "#999",
                letterSpacing: 1,
              }}
            >
              NO PHRASES YET — TAP + ADD
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: "28px 20px 0" }}>
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
          DATA
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={handleExport}
            style={{
              flex: 1,
              padding: "12px 0",
              background: "#0a0a0a",
              color: "#fff",
              border: "1.5px solid #0a0a0a",
              borderRadius: 999,
              fontFamily: "var(--display-font)",
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: 0.8,
              textTransform: "uppercase",
            }}
          >
            Export JSON
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            style={{
              flex: 1,
              padding: "12px 0",
              background: "#fff",
              color: "#0a0a0a",
              border: "1.5px dashed #0a0a0a",
              borderRadius: 999,
              fontFamily: "var(--display-font)",
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: 0.8,
              textTransform: "uppercase",
            }}
          >
            Import JSON
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleImport}
            style={{ display: "none" }}
          />
        </div>
        {importStatus && (
          <div
            style={{
              marginTop: 8,
              fontFamily: "var(--mono-font)",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 1.5,
              color: importStatus === "ok" ? "#52c878" : "#9b3919",
              textAlign: "center",
            }}
          >
            {importStatus === "ok" ? "IMPORTED ✓" : "INVALID FILE"}
          </div>
        )}
      </div>
    </div>
  );
}
