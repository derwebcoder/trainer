import type { Tab } from "@/types/workout";

type Item = {
  id: Tab;
  label: string;
  icon: React.ReactNode;
};

const ITEMS: Item[] = [
  {
    id: "protein",
    label: "Protein",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M6 3l6 4 6-4v6c0 5-3 9-6 12-3-3-6-7-6-12V3z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "workouts",
    label: "Workouts",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M2 12h2m16 0h2M6 6v12M18 6v12M9 9v6h6V9H9z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: "settings",
    label: "",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
        <path
          d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33h0a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51h0a1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82v0a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

type Props = {
  tab: Tab;
  onChange: (tab: Tab) => void;
};

export function TabBar({ tab, onChange }: Props) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        padding: "8px 12px 28px",
        background: "linear-gradient(to top, #f3f3ee 0%, #f3f3ee 70%, transparent 100%)",
        zIndex: 30,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          background: "#0a0a0a",
          borderRadius: 999,
          padding: 6,
          gap: 4,
          boxShadow: "4px 4px 0 rgba(255, 90, 31, 0.4)",
          width: "100%",
          maxWidth: 420,
        }}
      >
        {ITEMS.map((item) => {
          const active = tab === item.id;
          const iconOnly = !item.label;
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              style={{
                flex: iconOnly ? "0 0 48px" : 1,
                width: iconOnly ? 48 : undefined,
                height: 48,
                background: active ? "#ff5a1f" : "transparent",
                color: active ? "#fff" : "rgba(255,255,255,0.6)",
                border: "none",
                borderRadius: 999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                fontFamily: "var(--display-font)",
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: 0.8,
                textTransform: "uppercase",
                transition: "background 0.2s, color 0.2s",
              }}
            >
              {item.icon}
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
