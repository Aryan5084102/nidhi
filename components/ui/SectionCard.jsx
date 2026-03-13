export default function SectionCard({ title, children, className = "" }) {
  return (
    <div className={`bg-white rounded-2xl p-5 card-shadow border border-slate-100 ${className}`}>
      {title && <h3 className="text-[15px] font-bold text-slate-900 mb-4">{title}</h3>}
      {children}
    </div>
  );
}
