export default function PageHeader({ title, description, children }) {
  return (
    <div className="bg-white rounded-2xl p-5 mb-5 card-shadow border border-slate-100">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
        <div>
          <h2 className="text-[16px] font-bold text-slate-900 mb-1">{title}</h2>
          <p className="text-[13px] text-slate-400 leading-relaxed max-w-xl">{description}</p>
        </div>
        {children && (
          <div className="hidden sm:flex items-center gap-3 text-[12px]">{children}</div>
        )}
      </div>
    </div>
  );
}
