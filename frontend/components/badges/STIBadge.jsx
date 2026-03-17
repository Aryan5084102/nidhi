export default function STIBadge({ score }) {
  const color = score >= 80 ? "#059669" : score >= 60 ? "#D97706" : "#DC2626";
  const bg = score >= 80 ? "#ECFDF5" : score >= 60 ? "#FFFBEB" : "#FEF2F2";

  return (
    <span
      className="rounded-lg px-2 py-0.5 text-[11px] font-mono font-bold whitespace-nowrap"
      style={{
        background: bg,
        color,
      }}
    >
      STI {score}
    </span>
  );
}
