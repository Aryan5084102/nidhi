import MetricCard from "./MetricCard";

export default function MetricGrid({ metrics, columns = "grid-cols-2 md:grid-cols-4" }) {
  return (
    <div className={`grid ${columns} gap-4 mb-6`}>
      {metrics.map((m) => (
        <MetricCard key={m.label} label={m.label} value={m.value} color={m.color} change={m.change} />
      ))}
    </div>
  );
}
