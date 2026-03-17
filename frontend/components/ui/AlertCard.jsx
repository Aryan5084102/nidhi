import StatusBadge from "./StatusBadge";

const SEVERITY_ICON_COLORS = {
  Critical: { bg: "bg-danger-100", text: "text-danger-500" },
  High: { bg: "bg-orange-100", text: "text-orange-500" },
  Medium: { bg: "bg-warning-100", text: "text-warning-500" },
  Low: { bg: "bg-blue-100", text: "text-blue-500" },
  Warning: { bg: "bg-warning-50 border border-warning-200/60", text: "text-warning-500" },
  "Action Required": { bg: "bg-danger-50 border border-danger-200/60", text: "text-danger-500" },
};

function WarningIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
    </svg>
  );
}

export default function AlertCard({ severity, badge, title, subtitle, description, footer }) {
  const colors = SEVERITY_ICON_COLORS[severity] || SEVERITY_ICON_COLORS.Medium;

  return (
    <div className="flex items-start gap-3 bg-slate-50 rounded-xl p-4 border border-slate-100">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${colors.bg}`}>
        <WarningIcon className={`w-4 h-4 ${colors.text}`} />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-[13px] font-semibold text-body">{title}</div>
            {subtitle && <div className="text-[11px] text-heading font-mono">{subtitle}</div>}
          </div>
          <StatusBadge status={badge || severity} />
        </div>
        {description && <div className="text-[12px] text-slate-500 mt-1">{description}</div>}
        {footer && <div className="text-[11px] text-subtle mt-2">{footer}</div>}
      </div>
    </div>
  );
}
