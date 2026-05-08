type Props = {
  muscle: string;
  secondary?: boolean;
  size?: "sm" | "md" | "lg";
};

const COLOR = "#ff5a1f";

export function MuscleChip({ muscle, secondary = false, size = "md" }: Props) {
  const fs = size === "sm" ? 9 : size === "lg" ? 11 : 10;
  const pad = size === "sm" ? "3px 7px" : size === "lg" ? "5px 10px" : "4px 8px";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: pad,
        background: secondary ? "transparent" : COLOR,
        color: secondary ? COLOR : "#fff",
        border: secondary ? `1px solid ${COLOR}` : "none",
        borderRadius: 999,
        fontFamily: "var(--mono-font)",
        fontSize: fs,
        fontWeight: 700,
        letterSpacing: 0.5,
        textTransform: "uppercase",
        whiteSpace: "nowrap",
      }}
    >
      {muscle}
    </span>
  );
}
