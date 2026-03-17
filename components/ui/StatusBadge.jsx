const STATUS_STYLES = {
  // General
  Active: "bg-success-50 text-success border-success-200/60",
  Online: "bg-success-50 text-success border-success-200/60",
  Resolved: "bg-success-50 text-success border-success-200/60",
  Cleared: "bg-success-50 text-success border-success-200/60",
  Filed: "bg-success-50 text-success border-success-200/60",
  Compliant: "bg-success-50 text-success border-success-200/60",
  Paid: "bg-success-50 text-success border-success-200/60",
  Approved: "bg-success-50 text-success border-success-200/60",
  Disbursed: "bg-success-50 text-success border-success-200/60",
  Acknowledged: "bg-blue-50 text-blue-600 border-blue-200/60",
  Success: "bg-success-50 text-success border-success-200/60",
  Connected: "bg-success-50 text-success border-success-200/60",

  // Warning / Medium
  Warning: "bg-warning-50 text-warning border-warning-200/60",
  Medium: "bg-warning-50 text-warning border-warning-200/60",
  Pending: "bg-warning-50 text-warning border-warning-200/60",
  "Under Review": "bg-warning-50 text-warning border-warning-200/60",
  "Maturing Soon": "bg-warning-50 text-warning border-warning-200/60",
  Partial: "bg-warning-50 text-warning border-warning-200/60",
  Overdue: "bg-warning-50 text-warning border-warning-200/60",
  Degraded: "bg-warning-50 text-warning border-warning-200/60",

  // Danger / High / Critical
  Critical: "bg-danger-50 text-danger-500 border-danger-200/60",
  High: "bg-danger-50 text-danger-500 border-danger-200/60",
  Blocked: "bg-danger-50 text-danger-500 border-danger-200/60",
  "Action Required": "bg-danger-50 text-danger-500 border-danger-200/60",
  "Non-Compliant": "bg-danger-50 text-danger-500 border-danger-200/60",
  Rejected: "bg-danger-50 text-danger-500 border-danger-200/60",
  Open: "bg-danger-50 text-danger-500 border-danger-200/60",
  Escalated: "bg-danger-50 text-danger-500 border-danger-200/60",
  Confirmed: "bg-danger-50 text-danger-500 border-danger-200/60",
  Locked: "bg-danger-50 text-danger-500 border-danger-200/60",
  Alert: "bg-danger-50 text-danger-500 border-danger-200/60",
  NPA: "bg-danger-50 text-danger-500 border-danger-200/60",

  // Info / Blue
  Processing: "bg-blue-50 text-blue-600 border-blue-200/60",
  Upcoming: "bg-blue-50 text-blue-600 border-blue-200/60",
  "Pending Review": "bg-blue-50 text-blue-600 border-blue-200/60",
  Low: "bg-success-50 text-success border-success-200/60",
  Investigating: "bg-secondary-50 text-secondary border-secondary-200/60",

  // Orange
  Flagged: "bg-orange-50 text-orange-600 border-orange-200/60",

  // Recovery / Defaults
  Defaulted: "bg-danger-50 text-danger-500 border-danger-200/60",
  Recovered: "bg-success-50 text-success border-success-200/60",
  "In Recovery": "bg-warning-50 text-warning border-warning-200/60",
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
