import ProgressBar from "@/components/ui/ProgressBar";

const BRACKET_STYLES = {
  Low: "bg-success-50 text-success border-success-200/60",
  Medium: "bg-blue-50 text-blue-600 border-blue-200",
  "Upper Medium": "bg-warning-50 text-warning border-warning-200/60",
  High: "bg-secondary-50 text-secondary border-secondary-200/60",
};

const METHOD_LABEL = {
  Auction: "Auction (Bidding)",
  "Lucky Draw": "Lucky Draw",
  Both: "Auction + Lucky Draw",
};

export default function SchemeCard({ scheme, onEnroll, onViewMembers }) {
  const spotsLeft = scheme.totalMembers - scheme.enrolledMembers;
  const fillPct = (scheme.enrolledMembers / scheme.totalMembers) * 100;
  const isFull = scheme.status === "Full";
  const totalMonths = parseInt(scheme.duration) || 0;
  const rotationPct = totalMonths > 0 ? ((scheme.currentMonth || 0) / totalMonths) * 100 : 0;
  const bracket = scheme.bracket || "Low";
  const payoutMethod = scheme.payoutMethod || "Auction";

  return (
    <div className="bg-white rounded-2xl p-5 hover:shadow-md transition-all duration-300 group card-shadow border border-slate-100">
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="text-[15px] font-bold text-heading">{scheme.name}</div>
          <span className="text-[11px] text-heading font-mono">{scheme.id}</span>
        </div>
        <span
          className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
            isFull
              ? "bg-danger-50 text-danger-500 border border-danger-200/60"
              : "bg-success-50 text-success border border-success-200/60"
          }`}
        >
          {isFull ? "Full" : `${spotsLeft} spots left`}
        </span>
      </div>

      {/* Bracket & Payout Method Tags */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${BRACKET_STYLES[bracket] || BRACKET_STYLES.Low}`}>
          {bracket}
        </span>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-slate-50 text-body border-slate-200">
          {METHOD_LABEL[payoutMethod] || payoutMethod}
        </span>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-primary-50 text-primary border-primary-200/60">
          Max Discount: {scheme.maxDiscountPct || 30}%
        </span>
      </div>

      <p className="text-[12px] text-heading leading-relaxed mb-4">{scheme.description}</p>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-slate-50 rounded-xl p-3">
          <div className="text-[10px] text-heading uppercase tracking-wider mb-1">Monthly</div>
          <div className="text-[16px] font-bold text-primary font-mono">{scheme.monthlyAmount}</div>
        </div>
        <div className="bg-slate-50 rounded-xl p-3">
          <div className="text-[10px] text-heading uppercase tracking-wider mb-1">Pot Size</div>
          <div className="text-[16px] font-bold text-success font-mono">{scheme.potSize}</div>
        </div>
        <div className="bg-slate-50 rounded-xl p-3">
          <div className="text-[10px] text-heading uppercase tracking-wider mb-1">Duration</div>
          <div className="text-[13px] font-semibold text-body">{scheme.duration}</div>
        </div>
        <div className="bg-slate-50 rounded-xl p-3">
          <div className="text-[10px] text-heading uppercase tracking-wider mb-1">Next Payout</div>
          <div className="text-[13px] font-semibold text-body">
            {scheme.nextPayout && scheme.nextPayout !== "—"
              ? new Date(scheme.nextPayout).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
              : "Not started"}
          </div>
        </div>
      </div>

      {/* Enrollment Progress */}
      <div className="mb-3">
        <div className="flex justify-between mb-1.5">
          <span className="text-[11px] text-heading">{scheme.enrolledMembers}/{scheme.totalMembers} members enrolled</span>
          <span className="text-[11px] text-heading font-mono">{fillPct.toFixed(0)}%</span>
        </div>
        <ProgressBar value={scheme.enrolledMembers} max={scheme.totalMembers} color={isFull ? "#EF4444" : "#6366F1"} />
      </div>

      {/* Rotation Progress (if started) */}
      {scheme.currentMonth > 0 && (
        <div className="mb-4">
          <div className="flex justify-between mb-1.5">
            <span className="text-[11px] text-heading">Rotation: Month {scheme.currentMonth}/{totalMonths}</span>
            <span className="text-[11px] text-heading font-mono">{rotationPct.toFixed(0)}%</span>
          </div>
          <ProgressBar value={scheme.currentMonth} max={totalMonths} color="#059669" />
        </div>
      )}

      {/* Requirements */}
      <div className="flex items-center gap-3 mb-4 text-[11px] text-heading">
        <span>Min STI: <strong className="text-body">{scheme.minSTI}</strong></span>
        <span className="text-subtle">|</span>
        <span>KYC: <strong className="text-body">{scheme.kycRequired}</strong></span>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => !isFull && onEnroll(scheme)}
          disabled={isFull}
          className={`flex-1 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200 cursor-pointer border ${
            isFull
              ? "bg-slate-50 border-slate-200 text-subtle cursor-not-allowed"
              : "bg-primary-50 border-primary-200 text-primary hover:bg-primary-100 hover:border-primary-300"
          }`}
        >
          {isFull ? "Scheme Full" : "Enroll Now"}
        </button>
        {onViewMembers && isFull && (
          <button
            onClick={() => onViewMembers(scheme)}
            className="px-4 py-2.5 rounded-xl text-[13px] font-semibold bg-secondary-50 border border-secondary-200 text-secondary hover:bg-secondary-100 hover:border-purple-300 transition-all duration-200 cursor-pointer"
          >
            Members
          </button>
        )}
      </div>
    </div>
  );
}
