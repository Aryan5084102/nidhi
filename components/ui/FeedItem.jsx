import StatusBadge from "./StatusBadge";

export default function FeedItem({ dotColor, title, subtitle, badge, time, description, children }) {
  return (
    <div className="flex items-start gap-3 bg-slate-50 rounded-xl p-4 border border-slate-100">
      {dotColor && (
        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${dotColor}`} />
      )}
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[13px] font-semibold text-slate-700">{title}</span>
            {subtitle && <span className="text-[11px] text-slate-400 font-mono ml-2">{subtitle}</span>}
          </div>
          <div className="flex items-center gap-2">
            {time && <span className="text-[10px] text-slate-400">{time}</span>}
            {badge && <StatusBadge status={badge} />}
          </div>
        </div>
        {description && <div className="text-[12px] text-slate-500 mt-1">{description}</div>}
        {children}
      </div>
    </div>
  );
}
