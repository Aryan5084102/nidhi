export default function PageHeader({ title, description, children }) {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 mb-4 sm:mb-5 card-shadow border border-slate-100">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
        <div>
          <h2 className="text-[15px] sm:text-[16px] font-bold text-heading mb-1">{title}</h2>
          <p className="text-[12px] sm:text-[13px] text-heading leading-relaxed max-w-xl">{description}</p>
        </div>
        {children && (
          <div className="flex items-center gap-2 sm:gap-3 text-[11px] sm:text-[12px] flex-wrap">{children}</div>
        )}
      </div>
    </div>
  );
}
