import type { Tab } from "@/types/workout";
import { Dumbbell, Milk, Settings } from "lucide-react";

type Item = {
  id: Tab;
  label: string;
  icon: React.ReactNode;
};

const ITEMS: Item[] = [
  {
    id: "protein",
    label: "Protein",
    icon: <Milk />,
  },
  {
    id: "workouts",
    label: "Workouts",
    icon: <Dumbbell />,
  },
  {
    id: "settings",
    label: "",
    icon: <Settings />,
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
