const riskColors = {
  Low: ["#059669", "#ECFDF5"],
  Medium: ["#D97706", "#FFFBEB"],
  High: ["#DC2626", "#FEF2F2"],
  Critical: ["#991B1B", "#FEF2F2"],
};

export default function RiskBadge({ risk }) {
  const [fg, bg] = riskColors[risk] || riskColors.Low;

  return (
    <span
      className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
      style={{
        background: bg,
        color: fg,
      }}
    >
      {risk}
    </span>
  );
}
