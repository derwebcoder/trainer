import { useCallback } from "react";

const QUICK_ADDS = [0.5, 2, 5, 10] as const;

type Props = {
  intake: number;
  setIntake: React.Dispatch<React.SetStateAction<number>>;
  history: number[];
  setHistory: React.Dispatch<React.SetStateAction<number[]>>;
  proteinMin: number;
  proteinMax: number;
};

export function ProteinScreen({
  intake,
  setIntake,
  history,
  setHistory,
  proteinMin,
  proteinMax,
}: Props) {
  const addProtein = useCallback(
    (amt: number) => {
      setIntake((v) => +(v + amt).toFixed(1));
      setHistory((h) => [...h, amt]);
    },
    [setIntake, setHistory],
  );

  const undo = useCallback(() => {
    setHistory((h) => {
      if (h.length === 0) return h;
      const last = h[h.length - 1]!;
      setIntake((v) => Math.max(0, +(v - last).toFixed(1)));
      return h.slice(0, -1);
    });
  }, [setIntake, setHistory]);

  return (
    <div style={{ padding: "0 0 120px", minHeight: "100%", background: "#f3f3ee" }}>
      <div style={{ padding: "16px 20px 0" }}>
        <div style={labelTiny}>◉ Today · {todayLabel()}</div>
        <h1 style={hero}>
          DAILY
          <br />
          <span style={{ color: "#ff5a1f" }}>PROTEIN.</span>
        </h1>
      </div>

      <div
        style={{
          padding: "28px 20px 0",
          display: "flex",
          alignItems: "baseline",
          gap: 8,
        }}
      >
        <div
          style={{
            fontFamily: "var(--display-font)",
            fontSize: 96,
            fontWeight: 900,
            lineHeight: 0.85,
            letterSpacing: -4.5,
            color: "#0a0a0a",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {Math.floor(intake)}
          <span style={{ fontSize: 56, color: "#999" }}>
            {intake % 1 ? `.${(intake % 1).toFixed(1).slice(2)}` : ""}
          </span>
        </div>
        <div
          style={{
            fontFamily: "var(--mono-font)",
            fontSize: 13,
            fontWeight: 500,
            color: "#666",
            letterSpacing: 1,
            marginLeft: 4,
          }}
        >
          g / {proteinMin}–{proteinMax}g
        </div>
      </div>

      <div style={{ padding: "14px 20px 0" }}>
        <StatusPill intake={intake} min={proteinMin} max={proteinMax} />
      </div>

      <div style={{ padding: "24px 20px 0" }}>
        <BarViz intake={intake} min={proteinMin} max={proteinMax} />
      </div>

      <div style={{ padding: "32px 20px 0" }}>
        <div
          style={{
            fontFamily: "var(--mono-font)",
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: 2,
            color: "#999",
            textTransform: "uppercase",
            marginBottom: 12,
          }}
        >
          QUICK ADD
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 8,
          }}
        >
          {QUICK_ADDS.map((g) => (
            <QuickButton key={g} grams={g} onClick={() => addProtein(g)} />
          ))}
        </div>
      </div>

      <div style={{ padding: "12px 20px 0", display: "flex", gap: 8 }}>
        <button
          onClick={undo}
          disabled={history.length === 0}
          style={{
            flex: 1,
            height: 52,
            background: history.length ? "#0a0a0a" : "#dcdcd5",
            color: history.length ? "#fff" : "#999",
            border: "none",
            borderRadius: 14,
            fontFamily: "var(--display-font)",
            fontSize: 15,
            fontWeight: 800,
            letterSpacing: 0.5,
            textTransform: "uppercase",
            cursor: history.length ? "pointer" : "not-allowed",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            transition: "transform 0.1s",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 14L4 9l5-5M4 9h11a5 5 0 010 10h-3"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          UNDO
        </button>
      </div>
    </div>
  );
}

function todayLabel() {
  const d = new Date();
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

const labelTiny: React.CSSProperties = {
  fontFamily: "var(--mono-font)",
  fontSize: 11,
  fontWeight: 500,
  letterSpacing: 2,
  textTransform: "uppercase",
  color: "#999",
  marginBottom: 4,
};

const hero: React.CSSProperties = {
  margin: 0,
  fontFamily: "var(--display-font)",
  fontSize: 38,
  fontWeight: 900,
  letterSpacing: -1.4,
  color: "#0a0a0a",
  lineHeight: 0.95,
};

function StatusPill({ intake, min, max }: { intake: number; min: number; max: number }) {
  let label: string;
  let color: string;
  let bg: string;
  if (intake === 0) {
    label = "NOT STARTED";
    color = "#666";
    bg = "#e8e8e0";
  } else if (intake < min) {
    label = `${Math.round(min - intake)}g TO FLOOR`;
    color = "#fff";
    bg = "#0a0a0a";
  } else if (intake <= max) {
    label = "IN THE ZONE 🔥";
    color = "#fff";
    bg = "#ff5a1f";
  } else {
    label = `${Math.round(intake - max)}g OVER CEILING`;
    color = "#fff";
    bg = "#9b3919";
  }
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 12px",
        background: bg,
        color,
        borderRadius: 999,
        fontFamily: "var(--display-font)",
        fontSize: 12,
        fontWeight: 800,
        letterSpacing: 0.8,
      }}
    >
      {label}
    </div>
  );
}

function BarViz({ intake, min, max }: { intake: number; min: number; max: number }) {
  const pct = Math.min(intake / max, 1);
  const thresholdPct = min / max;
  const past = intake >= min;
  const over = intake > max;
  return (
    <div>
      <div
        style={{
          position: "relative",
          height: 72,
          background: "#fff",
          borderRadius: 18,
          overflow: "hidden",
          border: "1.5px solid #0a0a0a",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            width: `${pct * 100}%`,
            background: over ? "#9b3919" : past ? "#ff5a1f" : "#0a0a0a",
            transition: "width 0.4s cubic-bezier(.2,.8,.2,1), background 0.3s",
            backgroundImage: past
              ? "repeating-linear-gradient(45deg, transparent 0 10px, rgba(255,255,255,0.08) 10px 20px)"
              : "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: `${thresholdPct * 100}%`,
            width: 2,
            background: "#0a0a0a",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 4,
            left: `${thresholdPct * 100}%`,
            transform: "translateX(-50%)",
            background: "#0a0a0a",
            color: "#fff",
            padding: "2px 6px",
            fontFamily: "var(--mono-font)",
            fontSize: 9,
            fontWeight: 700,
            borderRadius: 3,
          }}
        >
          {min}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontFamily: "var(--mono-font)",
          fontSize: 10,
          color: "#999",
          marginTop: 6,
          fontWeight: 500,
        }}
      >
        <span>0</span>
        <span>{max} CEIL</span>
      </div>
    </div>
  );
}

function QuickButton({ grams, onClick }: { grams: number; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        height: 76,
        background: "#fff",
        border: "1.5px solid #0a0a0a",
        borderRadius: 14,
        position: "relative",
        overflow: "hidden",
        boxShadow: "3px 3px 0 #0a0a0a",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        transition: "transform 0.08s, box-shadow 0.08s",
      }}
      onPointerDown={(e) => {
        e.currentTarget.style.transform = "translate(3px, 3px)";
        e.currentTarget.style.boxShadow = "none";
      }}
      onPointerUp={(e) => {
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.boxShadow = "3px 3px 0 #0a0a0a";
      }}
      onPointerLeave={(e) => {
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.boxShadow = "3px 3px 0 #0a0a0a";
      }}
    >
      <div
        style={{
          fontFamily: "var(--display-font)",
          fontSize: 22,
          fontWeight: 900,
          color: "#0a0a0a",
          letterSpacing: -0.5,
          lineHeight: 1,
        }}
      >
        +{grams}
      </div>
      <div
        style={{
          fontFamily: "var(--mono-font)",
          fontSize: 9,
          fontWeight: 600,
          color: "#999",
          letterSpacing: 1.2,
        }}
      >
        GRAMS
      </div>
    </button>
  );
}
