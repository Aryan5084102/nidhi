import ProgressBar from "@/components/ui/ProgressBar";

export default function SchemeCard({ scheme, onEnroll }) {
  const spotsLeft = scheme.totalMembers - scheme.enrolledMembers;
  const fillPct = (scheme.enrolledMembers / scheme.totalMembers) * 100;
  const isFull = scheme.status === "Full";

  return (
    <div className="bg-white rounded-2xl p-5 hover:shadow-md transition-all duration-300 group card-shadow border border-slate-100">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="text-[15px] font-bold text-slate-900">
            {scheme.name}
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            {scheme.id}
          </span>
        </div>
        <span
          className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
            isFull
              ? "bg-red-50 text-red-500 border border-red-200/60"
              : "bg-emerald-50 text-emerald-600 border border-emerald-200/60"
          }`}
        >
          {isFull ? "Full" : `${spotsLeft} spots left`}
        </span>
      </div>

      {/* Description */}
      <p className="text-[12px] text-slate-400 leading-relaxed mb-4">
        {scheme.description}
      </p>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-slate-50 rounded-xl p-3">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">
            Monthly
          </div>
          <div className="text-[16px] font-bold text-indigo-600 font-mono">
            {scheme.monthlyAmount}
          </div>
        </div>
        <div className="bg-slate-50 rounded-xl p-3">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">
            Pot Size
          </div>
          <div className="text-[16px] font-bold text-emerald-600 font-mono">
            {scheme.potSize}
          </div>
        </div>
        <div className="bg-slate-50 rounded-xl p-3">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">
            Duration
          </div>
          <div className="text-[13px] font-semibold text-slate-700">
            {scheme.duration}
          </div>
        </div>
        <div className="bg-slate-50 rounded-xl p-3">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">
            Next Auction
          </div>
          <div className="text-[13px] font-semibold text-slate-700">
            {new Date(scheme.nextAuction).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
            })}
          </div>
        </div>
      </div>

      {/* Enrollment Progress */}
      <div className="mb-4">
        <div className="flex justify-between mb-1.5">
          <span className="text-[11px] text-slate-400">
            {scheme.enrolledMembers}/{scheme.totalMembers} members enrolled
          </span>
          <span className="text-[11px] text-slate-400 font-mono">
            {fillPct.toFixed(0)}%
          </span>
        </div>
        <ProgressBar
          value={scheme.enrolledMembers}
          max={scheme.totalMembers}
          color={isFull ? "#EF4444" : "#6366F1"}
        />
      </div>

      {/* Requirements */}
      <div className="flex items-center gap-3 mb-4 text-[11px] text-slate-400">
        <span>Min STI: <strong className="text-slate-600">{scheme.minSTI}</strong></span>
        <span className="text-slate-300">|</span>
        <span>KYC: <strong className="text-slate-600">{scheme.kycRequired}</strong></span>
      </div>

      {/* Enroll Button */}
      <button
        onClick={() => !isFull && onEnroll(scheme)}
        disabled={isFull}
        className={`w-full py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200 cursor-pointer border ${
          isFull
            ? "bg-slate-50 border-slate-200 text-slate-300 cursor-not-allowed"
            : "bg-indigo-50 border-indigo-200 text-indigo-600 hover:bg-indigo-100 hover:border-indigo-300"
        }`}
      >
        {isFull ? "Scheme Full" : "Enroll Now"}
      </button>
    </div>
  );
}
