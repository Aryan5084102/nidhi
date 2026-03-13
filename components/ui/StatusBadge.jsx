const STATUS_STYLES = {
  // General
  Active: "bg-emerald-50 text-emerald-600 border-emerald-200/60",
  Online: "bg-emerald-50 text-emerald-600 border-emerald-200/60",
  Resolved: "bg-emerald-50 text-emerald-600 border-emerald-200/60",
  Cleared: "bg-emerald-50 text-emerald-600 border-emerald-200/60",
  Filed: "bg-emerald-50 text-emerald-600 border-emerald-200/60",
  Compliant: "bg-emerald-50 text-emerald-600 border-emerald-200/60",
  Paid: "bg-emerald-50 text-emerald-600 border-emerald-200/60",
  Approved: "bg-emerald-50 text-emerald-600 border-emerald-200/60",
  Disbursed: "bg-emerald-50 text-emerald-600 border-emerald-200/60",
  Acknowledged: "bg-blue-50 text-blue-600 border-blue-200/60",
  Success: "bg-emerald-50 text-emerald-600 border-emerald-200/60",
  Connected: "bg-emerald-50 text-emerald-600 border-emerald-200/60",

  // Warning / Medium
  Warning: "bg-amber-50 text-amber-600 border-amber-200/60",
  Medium: "bg-amber-50 text-amber-600 border-amber-200/60",
  Pending: "bg-amber-50 text-amber-600 border-amber-200/60",
  "Under Review": "bg-amber-50 text-amber-600 border-amber-200/60",
  "Maturing Soon": "bg-amber-50 text-amber-600 border-amber-200/60",
  Partial: "bg-amber-50 text-amber-600 border-amber-200/60",
  Overdue: "bg-amber-50 text-amber-600 border-amber-200/60",
  Degraded: "bg-amber-50 text-amber-600 border-amber-200/60",

  // Danger / High / Critical
  Critical: "bg-red-50 text-red-500 border-red-200/60",
  High: "bg-red-50 text-red-500 border-red-200/60",
  Blocked: "bg-red-50 text-red-500 border-red-200/60",
  "Action Required": "bg-red-50 text-red-500 border-red-200/60",
  "Non-Compliant": "bg-red-50 text-red-500 border-red-200/60",
  Rejected: "bg-red-50 text-red-500 border-red-200/60",
  Open: "bg-red-50 text-red-500 border-red-200/60",
  Escalated: "bg-red-50 text-red-500 border-red-200/60",
  Confirmed: "bg-red-50 text-red-500 border-red-200/60",
  Locked: "bg-red-50 text-red-500 border-red-200/60",
  Alert: "bg-red-50 text-red-500 border-red-200/60",
  NPA: "bg-red-50 text-red-500 border-red-200/60",

  // Info / Blue
  Upcoming: "bg-blue-50 text-blue-600 border-blue-200/60",
  "Pending Review": "bg-blue-50 text-blue-600 border-blue-200/60",
  Low: "bg-emerald-50 text-emerald-600 border-emerald-200/60",
  Investigating: "bg-purple-50 text-purple-600 border-purple-200/60",

  // Orange
  Flagged: "bg-orange-50 text-orange-600 border-orange-200/60",

  // Recovery / Defaults
  Defaulted: "bg-red-50 text-red-500 border-red-200/60",
  Recovered: "bg-emerald-50 text-emerald-600 border-emerald-200/60",
  "In Recovery": "bg-amber-50 text-amber-600 border-amber-200/60",
  "Written Off": "bg-slate-100 text-slate-500 border-slate-200",

  // Neutral
  Idle: "bg-slate-100 text-slate-500 border-slate-200",
  Closed: "bg-slate-100 text-slate-500 border-slate-200",
  "Not Required": "bg-slate-100 text-slate-500 border-slate-200",
  Inactive: "bg-slate-100 text-slate-500 border-slate-200",
  Matured: "bg-blue-50 text-blue-600 border-blue-200/60",
  Monitoring: "bg-slate-100 text-slate-500 border-slate-200",
};

const DEFAULT_STYLE = "bg-slate-50 text-slate-500 border-slate-200";

export default function StatusBadge({ status }) {
  return (
    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border whitespace-nowrap ${STATUS_STYLES[status] || DEFAULT_STYLE}`}>
      {status}
    </span>
  );
}
