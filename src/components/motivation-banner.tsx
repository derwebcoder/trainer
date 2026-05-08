import { useState } from "react";

type Props = {
  phrases: string[];
};

export function MotivationBanner({ phrases }: Props) {
  const list = phrases.filter((p) => p.trim().length > 0);
  const [phrase] = useState(() =>
    list.length === 0 ? "" : list[Math.floor(Math.random() * list.length)],
  );
  if (!phrase) return null;
  return (
    <div
      style={{
        padding: "8px 16px",
        background: "#ffe4d6",
        color: "#9b3919",
        fontFamily: "var(--display-font)",
        fontSize: 11,
        fontWeight: 800,
        letterSpacing: 1.2,
        textTransform: "uppercase",
        textAlign: "center",
      }}
    >
      ★ {phrase} ★
    </div>
  );
}
