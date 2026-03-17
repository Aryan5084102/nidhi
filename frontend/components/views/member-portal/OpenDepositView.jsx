"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { members } from "@/data/mockData";

const depositSchemeDetails = {
  "Glimmora Fixed Deposit": {
    id: "FD",
    icon: "🏦",
    color: "#6366F1",
    description: "Lock in your savings at guaranteed high interest rates. Ideal for risk-free wealth building with assured returns.",
    features: ["Guaranteed returns", "Premature withdrawal", "Loan against FD", "Auto-renewal", "Nomination facility", "TDS applicable above ₹40K"],
    minAmount: 10000,
    maxAmount: 2500000,
    tenures: [6, 12, 24, 36],
    rates: { 6: 8.0, 12: 8.5, 24: 9.0, 36: 9.5 },
    penalty: "1% for premature withdrawal",
  },
  "Glimmora Recurring Deposit": {
    id: "RD",
    icon: "💰",
    color: "#059669",
    description: "Build savings with small monthly installments. Perfect for disciplined savers who want to grow wealth over time.",
    features: ["Low monthly commitment", "Compounding returns", "Flexible tenure", "Auto-debit facility", "Loan against RD", "No TDS on maturity"],
    minAmount: 1000,
    maxAmount: 100000,
    tenures: [12, 24, 36],
    rates: { 12: 8.0, 24: 8.25, 36: 8.5 },
    penalty: "0.5% for missed installment",
  },
  "Glimmora Savings Deposit": {
    id: "SD",
    icon: "📈",
    color: "#7C3AED",
    description: "Flexible savings account with instant liquidity. Earn interest on your balance with no lock-in period.",
    features: ["No lock-in period", "Instant withdrawal", "Daily interest calc", "No minimum balance", "Passbook facility", "Online access"],
    minAmount: 500,
    maxAmount: 500000,
    tenures: [0],
    rates: { 0: 4.0 },
    penalty: "None",
  },
};

function formatINR(num) {
  return "₹" + num.toLocaleString("en-IN");
}

function calculateMaturity(principal, ratePercent, months, type) {
  if (type === "RD") {
    // RD: monthly installment compounding
    const r = ratePercent / 400; // quarterly rate
    const n = months;
    // Approximate: sum of compound interest on each installment
    let total = 0;
    for (let i = 0; i < n; i++) {
      const remainingMonths = n - i;
      total += principal * Math.pow(1 + ratePercent / 1200, remainingMonths);
    }
    return Math.round(total);
  }
  // FD / SD: simple compound interest (quarterly)
  const r = ratePercent / 100;
  const maturity = principal * Math.pow(1 + r / 4, (4 * months) / 12);
  return Math.round(maturity);
}

function generateAccountId(type) {
  const prefix = type === "FD" ? "FD" : type === "RD" ? "RD" : "SD";
  return `${prefix}-${Date.now().toString().slice(-8)}`;
}

export default function OpenDepositView({ onNavigate }) {
  const { user } = useAuth();
  const memberId = user?.memberId || "M-1001";
  const member = members.find((m) => m.id === memberId) || members[0];

  const [scheme, setScheme] = useState(null);
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState(0);
  const [tenure, setTenure] = useState(0);
  const [nomineeName, setNomineeName] = useState("");
  const [nomineeRelation, setNomineeRelation] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeDeduction, setAgreeDeduction] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [accountId, setAccountId] = useState("");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("glimmora_open_deposit_scheme");
      if (stored) {
        const parsed = JSON.parse(stored);
        const details = depositSchemeDetails[parsed.name];
        if (details) {
          setScheme({ ...parsed, ...details });
          setAmount(details.minAmount);
          setTenure(details.tenures[0]);
        }
      }
    } catch {
      // invalid JSON
    }
  }, []);

  if (!scheme) {
    return (
      <div className="animate-fade-in">
        <div className="max-w-lg mx-auto px-4 py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-slate-50 border-2 border-slate-200 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-heading" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" /></svg>
          </div>
          <h2 className="text-[18px] font-bold text-heading mb-2">No deposit scheme selected</h2>
          <p className="text-[13px] text-heading mb-6">Please go back and select a deposit scheme to open an account.</p>
          <button onClick={() => onNavigate("my_deposits")} className="px-6 py-3 bg-primary text-white rounded-xl text-[13px] font-semibold hover:bg-primary-700 transition-all cursor-pointer">
            Back to My Deposits
          </button>
        </div>
      </div>
    );
  }

  const rate = scheme.rates[tenure] || Object.values(scheme.rates)[0];
  const maturityAmount = calculateMaturity(amount, rate, tenure, scheme.id);
  const interestEarned = maturityAmount - (scheme.id === "RD" ? amount * tenure : amount);
  const isFlexible = scheme.id === "SD";

  const handleSubmit = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setAccountId(generateAccountId(scheme.id));
      setSuccess(true);
    }, 2500);
  };

  const steps = isFlexible
    ? [
        { num: 1, label: "Scheme Details" },
        { num: 2, label: "Account Setup" },
        { num: 3, label: "Review & Confirm" },
      ]
    : [
        { num: 1, label: "Amount & Tenure" },
        { num: 2, label: "Account Details" },
        { num: 3, label: "Review & Confirm" },
      ];

  return (
    <div className="animate-fade-in">
      {/* Top Bar */}
      <div className="bg-white border-b border-slate-100 px-4 sm:px-6 py-3 mb-6">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => onNavigate("my_deposits")} className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-heading hover:text-body hover:bg-slate-100 cursor-pointer transition-all">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
            </button>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: scheme.color + "15" }}>
              {scheme.icon}
            </div>
            <div>
              <div className="text-[14px] font-bold text-heading">{scheme.name}</div>
              <div className="text-[11px] text-heading">{rate}% p.a. · {scheme.id === "SD" ? "Flexible" : `${tenure} months`}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Success State */}
      {success ? (
        <div className="max-w-lg mx-auto px-4 py-16 text-center">
          <div className="w-20 h-20 rounded-full bg-success-50 border-2 border-success-200 flex items-center justify-center mx-auto mb-6 animate-bounce">
            <svg className="w-10 h-10 text-success-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
          </div>
          <h2 className="text-[22px] font-bold text-heading mb-2">Account Opened Successfully!</h2>
          <p className="text-[13px] text-heading mb-8 max-w-sm mx-auto">
            Your {scheme.name} account has been created. You'll receive a confirmation on your registered phone and email.
          </p>

          <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100 text-left mb-6">
            <div className="text-[10px] text-heading uppercase tracking-wider mb-3">Account Summary</div>
            <div className="space-y-2.5">
              {[
                ["Account ID", accountId],
                ["Scheme", scheme.name],
                ["Amount", scheme.id === "RD" ? `${formatINR(amount)}/month` : formatINR(amount)],
                ...(isFlexible ? [] : [["Tenure", `${tenure} months`]]),
                ["Interest Rate", `${rate}% p.a.`],
                ...(isFlexible ? [] : [["Maturity Amount", formatINR(maturityAmount)]]),
                ...(isFlexible ? [] : [["Interest Earned", formatINR(interestEarned)]]),
                ["Nominee", nomineeName || "—"],
                ["Status", null],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-[12px] text-heading">{label}</span>
                  {value ? (
                    <span className="text-[12px] font-semibold text-body font-mono">{value}</span>
                  ) : (
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-success-50 text-success border border-success-200/60">Active</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button onClick={() => onNavigate("my_deposits")} className="w-full max-w-sm py-3 bg-primary text-white rounded-xl text-[13px] font-semibold hover:bg-primary-700 transition-all cursor-pointer">
            Back to My Deposits
          </button>
        </div>

      ) : processing ? (
        <div className="max-w-lg mx-auto px-4 py-24 text-center">
          <div className="w-16 h-16 rounded-full border-4 border-slate-200 border-t-primary animate-spin mx-auto mb-6" />
          <h3 className="text-[16px] font-bold text-heading mb-2">Opening Your Account</h3>
          <p className="text-[12px] text-heading">Verifying KYC and setting up your deposit account...</p>
        </div>

      ) : (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
          {/* Step Progress */}
          <div className="flex items-center justify-center gap-1 mb-8">
            {steps.map((s, i) => (
              <div key={s.num} className="flex items-center gap-1">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all ${step >= s.num ? "text-white" : "bg-slate-100 text-heading"}`} style={step >= s.num ? { background: scheme.color } : {}}>
                  {step > s.num ? (
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                  ) : (
                    <span>{s.num}</span>
                  )}
                  <span className="hidden sm:inline">{s.label}</span>
                </div>
                {i < steps.length - 1 && <div className={`w-8 sm:w-16 h-0.5 transition-all`} style={{ background: step > s.num ? scheme.color : "#E2E8F0" }} />}
              </div>
            ))}
          </div>

          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-2">
                <h2 className="text-[18px] font-bold text-heading">
                  {isFlexible ? "Savings Account Overview" : `Choose your ${scheme.id === "RD" ? "monthly installment" : "deposit amount"}`}
                </h2>
                <p className="text-[12px] text-heading mt-1">
                  {isFlexible ? "Review the savings account features" : "Drag the slider or enter the amount, then pick a tenure"}
                </p>
              </div>

              {/* Scheme Hero Card */}
              <div className="rounded-2xl p-6 text-white" style={{ background: `linear-gradient(135deg, ${scheme.color}, ${scheme.color}dd)` }}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-[18px] font-bold">{scheme.name}</div>
                    <div className="text-[11px] text-white/70 mt-0.5">{scheme.description.slice(0, 60)}...</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-white/60 uppercase tracking-wider">Interest Rate</div>
                    <div className="text-[24px] font-bold font-mono">{rate}%</div>
                    <div className="text-[10px] text-white/60">per annum</div>
                  </div>
                </div>
                {!isFlexible && (
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/20">
                    <div>
                      <div className="text-[10px] text-white/60">Min Amount</div>
                      <div className="text-[14px] font-bold font-mono">{formatINR(scheme.minAmount)}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-white/60">Max Amount</div>
                      <div className="text-[14px] font-bold font-mono">{formatINR(scheme.maxAmount)}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-white/60">Penalty</div>
                      <div className="text-[12px] font-semibold">{scheme.penalty}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Features Grid */}
              <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
                <div className="text-[10px] text-heading uppercase tracking-wider mb-4">Key Features</div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {scheme.features.map((f) => (
                    <div key={f} className="flex items-center gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <svg className="w-4 h-4 shrink-0" style={{ color: scheme.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                      <span className="text-[12px] font-medium text-body">{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {!isFlexible && (
                <>
                  {/* Amount Display + Slider */}
                  <div className="text-center py-4">
                    <div className="text-[10px] text-heading uppercase tracking-wider mb-2">
                      {scheme.id === "RD" ? "Monthly Installment" : "Deposit Amount"}
                    </div>
                    <div className="text-[36px] font-bold font-mono" style={{ color: scheme.color }}>{formatINR(amount)}</div>
                  </div>

                  <div className="px-2">
                    <input
                      type="range"
                      min={scheme.minAmount}
                      max={scheme.maxAmount}
                      step={scheme.minAmount < 5000 ? 500 : scheme.minAmount < 50000 ? 5000 : 25000}
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between mt-2 text-[11px] text-heading font-mono">
                      <span>{formatINR(scheme.minAmount)}</span>
                      <span>{formatINR(scheme.maxAmount)}</span>
                    </div>
                  </div>

                  {/* Tenure Selection */}
                  <div>
                    <div className="text-[10px] text-heading uppercase tracking-wider mb-3">Select Tenure</div>
                    <div className="flex gap-2 flex-wrap">
                      {scheme.tenures.map((t) => (
                        <button
                          key={t}
                          onClick={() => setTenure(t)}
                          className={`px-5 py-2.5 rounded-xl text-[13px] font-semibold border transition-all cursor-pointer ${tenure === t ? "text-white border-transparent" : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"}`}
                          style={tenure === t ? { background: scheme.color } : {}}
                        >
                          {t} months
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Maturity Calculator Card */}
                  <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
                    <div className="text-[10px] text-heading uppercase tracking-wider mb-4">
                      {scheme.id === "RD" ? "Returns Calculator" : "Maturity Calculator"}
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-center">
                        <div className="text-[10px] text-heading uppercase tracking-wider mb-1">
                          {scheme.id === "RD" ? "Total Invested" : "Principal"}
                        </div>
                        <div className="text-[18px] font-bold font-mono text-heading">
                          {formatINR(scheme.id === "RD" ? amount * tenure : amount)}
                        </div>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-center">
                        <div className="text-[10px] text-heading uppercase tracking-wider mb-1">Interest Earned</div>
                        <div className="text-[18px] font-bold font-mono text-success">
                          {formatINR(interestEarned)}
                        </div>
                      </div>
                      <div className="rounded-xl p-4 border text-center" style={{ background: scheme.color + "10", borderColor: scheme.color + "30" }}>
                        <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: scheme.color }}>Maturity Amount</div>
                        <div className="text-[18px] font-bold font-mono" style={{ color: scheme.color }}>
                          {formatINR(maturityAmount)}
                        </div>
                      </div>
                    </div>
                    {/* Visual bar */}
                    <div className="mt-4">
                      <div className="flex justify-between text-[10px] text-heading mb-1.5">
                        <span>Principal</span>
                        <span>Interest</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
                        <div className="h-full bg-slate-400 rounded-l-full" style={{ width: `${((scheme.id === "RD" ? amount * tenure : amount) / maturityAmount) * 100}%` }} />
                        <div className="h-full rounded-r-full" style={{ width: `${(interestEarned / maturityAmount) * 100}%`, background: scheme.color }} />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {isFlexible && (
                <>
                  {/* Amount for savings */}
                  <div>
                    <div className="text-[10px] text-heading uppercase tracking-wider mb-3">Initial Deposit Amount</div>
                    <div className="text-center py-4">
                      <div className="text-[36px] font-bold font-mono" style={{ color: scheme.color }}>{formatINR(amount)}</div>
                    </div>
                    <div className="px-2">
                      <input
                        type="range"
                        min={scheme.minAmount}
                        max={scheme.maxAmount}
                        step={500}
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-primary"
                      />
                      <div className="flex justify-between mt-2 text-[11px] text-heading font-mono">
                        <span>{formatINR(scheme.minAmount)}</span>
                        <span>{formatINR(scheme.maxAmount)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Savings info */}
                  <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
                    <div className="text-[10px] text-heading uppercase tracking-wider mb-4">How Savings Account Works</div>
                    <div className="space-y-4">
                      {[
                        { num: "1", title: "Deposit Anytime", desc: "Add funds to your savings account whenever you want, no fixed schedule", color: scheme.color },
                        { num: "2", title: "Earn Daily Interest", desc: `Earn ${rate}% p.a. calculated daily on your closing balance`, color: "#059669" },
                        { num: "3", title: "Withdraw Freely", desc: "No lock-in period. Withdraw your funds instantly when needed", color: "#D97706" },
                        { num: "4", title: "Track Growth", desc: "View your balance, interest earned, and transaction history anytime", color: "#7C3AED" },
                      ].map((item) => (
                        <div key={item.num} className="flex items-start gap-4">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[12px] font-bold shrink-0 text-white" style={{ background: item.color }}>
                            {item.num}
                          </div>
                          <div>
                            <div className="text-[13px] font-semibold text-body">{item.title}</div>
                            <div className="text-[11px] text-heading mt-0.5">{item.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* STEP 2: Account Details */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="text-center mb-2">
                <h2 className="text-[18px] font-bold text-heading">Account Details</h2>
                <p className="text-[12px] text-heading mt-1">Verify your details and add a nominee</p>
              </div>

              {/* Pre-filled Info */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <div className="text-[10px] text-heading uppercase tracking-wider mb-4">Account Holder</div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-[10px] text-heading mb-1">Full Name</div>
                    <div className="text-[13px] font-semibold text-body">{member.name}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-heading mb-1">Member ID</div>
                    <div className="text-[13px] font-mono font-semibold text-body">{member.id}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-heading mb-1">Phone</div>
                    <div className="text-[13px] text-body">{member.phone}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-heading mb-1">KYC Status</div>
                    <div className={`text-[13px] font-bold ${member.kyc === "Verified" ? "text-success" : "text-warning"}`}>{member.kyc}</div>
                  </div>
                </div>
              </div>

              {/* Deposit Summary */}
              <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
                <div className="text-[10px] text-heading uppercase tracking-wider mb-3">Deposit Details</div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                    <div className="text-[10px] text-heading uppercase tracking-wider mb-1">
                      {scheme.id === "RD" ? "Monthly Installment" : "Amount"}
                    </div>
                    <div className="text-[16px] font-bold font-mono" style={{ color: scheme.color }}>{formatINR(amount)}</div>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                    <div className="text-[10px] text-heading uppercase tracking-wider mb-1">Interest Rate</div>
                    <div className="text-[16px] font-bold text-success">{rate}% p.a.</div>
                  </div>
                  {!isFlexible && (
                    <>
                      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                        <div className="text-[10px] text-heading uppercase tracking-wider mb-1">Tenure</div>
                        <div className="text-[13px] font-semibold text-body">{tenure} months</div>
                      </div>
                      <div className="rounded-xl p-3 border" style={{ background: scheme.color + "08", borderColor: scheme.color + "20" }}>
                        <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: scheme.color }}>Maturity</div>
                        <div className="text-[16px] font-bold font-mono" style={{ color: scheme.color }}>{formatINR(maturityAmount)}</div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Nominee Details */}
              <div className="space-y-4">
                <div className="text-[10px] text-heading uppercase tracking-wider">Nominee Details (Optional)</div>
                <div>
                  <label className="block text-[12px] text-slate-500 mb-1.5 font-medium">Nominee Full Name</label>
                  <input
                    value={nomineeName}
                    onChange={(e) => setNomineeName(e.target.value)}
                    placeholder="Enter nominee's full name"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-body text-[13px] outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-500/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[12px] text-slate-500 mb-1.5 font-medium">Relationship</label>
                  <select
                    value={nomineeRelation}
                    onChange={(e) => setNomineeRelation(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-body text-[13px] outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-500/10 transition-all"
                  >
                    <option value="">Select relationship...</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Parent">Parent</option>
                    <option value="Child">Child</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Funding Method */}
              <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
                <div className="text-[10px] text-heading uppercase tracking-wider mb-3">Funding Method</div>
                <div className="space-y-2">
                  {[
                    { icon: "🔗", label: "Auto-Debit from Linked Account", desc: "XXXX XXXX 4521 (Primary)", selected: true },
                    { icon: "📱", label: "UPI Transfer", desc: "Pay via your UPI app", selected: false },
                    { icon: "🏧", label: "Net Banking", desc: "Transfer from your bank", selected: false },
                  ].map((m) => (
                    <div key={m.label} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${m.selected ? "border-primary-200 bg-primary-50/50" : "border-slate-200 bg-slate-50 hover:border-slate-300"}`}>
                      <span className="text-lg">{m.icon}</span>
                      <div className="flex-1">
                        <div className="text-[13px] font-medium text-body">{m.label}</div>
                        <div className="text-[11px] text-heading">{m.desc}</div>
                      </div>
                      {m.selected && (
                        <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: scheme.color }}>
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Review & Confirm */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="text-center mb-2">
                <h2 className="text-[18px] font-bold text-heading">Review & Confirm</h2>
                <p className="text-[12px] text-heading mt-1">Verify all details before opening your account</p>
              </div>

              {/* Summary Card */}
              <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: scheme.color + "15" }}>
                    {scheme.icon}
                  </div>
                  <div>
                    <div className="text-[15px] font-bold text-heading">{scheme.name}</div>
                    <div className="text-[11px] text-heading">{rate}% p.a. {!isFlexible ? `· ${tenure} months` : "· Flexible"}</div>
                  </div>
                </div>

                {!isFlexible && (
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-slate-50 rounded-xl p-3">
                      <div className="text-[10px] text-heading uppercase tracking-wider mb-1">
                        {scheme.id === "RD" ? "Monthly Amount" : "Deposit Amount"}
                      </div>
                      <div className="text-[18px] font-bold font-mono" style={{ color: scheme.color }}>{formatINR(amount)}</div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3">
                      <div className="text-[10px] text-heading uppercase tracking-wider mb-1">Maturity Amount</div>
                      <div className="text-[18px] font-bold text-success font-mono">{formatINR(maturityAmount)}</div>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  {[
                    ["Scheme Type", scheme.id === "FD" ? "Fixed Deposit" : scheme.id === "RD" ? "Recurring Deposit" : "Savings Deposit"],
                    [scheme.id === "RD" ? "Monthly Installment" : "Deposit Amount", formatINR(amount)],
                    ...(isFlexible ? [] : [["Tenure", `${tenure} months`]]),
                    ["Interest Rate", `${rate}% p.a.`],
                    ...(isFlexible ? [] : [["Interest Earned", formatINR(interestEarned)]]),
                    ...(isFlexible ? [] : [["Maturity Amount", formatINR(maturityAmount)]]),
                    ["Account Holder", member.name],
                    ["Member ID", member.id],
                    ["Nominee", nomineeName || "—"],
                    ...(nomineeRelation ? [["Nominee Relation", nomineeRelation]] : []),
                    ["Funding", "Auto-Debit (XXXX 4521)"],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between py-1.5">
                      <span className="text-[12px] text-heading">{label}</span>
                      <span className="text-[12px] font-semibold text-body">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Agreements */}
              <div className="space-y-3">
                <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-all">
                  <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} className="mt-0.5 accent-primary w-4 h-4" />
                  <span className="text-[12px] text-slate-500 leading-relaxed">
                    I agree to the terms and conditions of the {scheme.name}, including interest rates, {isFlexible ? "withdrawal policies" : "maturity terms, premature withdrawal penalties"}, and nominee declaration.
                  </span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-all">
                  <input type="checkbox" checked={agreeDeduction} onChange={(e) => setAgreeDeduction(e.target.checked)} className="mt-0.5 accent-primary w-4 h-4" />
                  <span className="text-[12px] text-slate-500 leading-relaxed">
                    {scheme.id === "RD"
                      ? <>I authorize automatic monthly deduction of <strong className="text-body">{formatINR(amount)}</strong> from my linked account for {tenure} months.</>
                      : <>I authorize the deduction of <strong className="text-body">{formatINR(amount)}</strong> from my linked account to open this deposit.</>
                    }
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Footer Navigation */}
          <div className="flex gap-3 mt-8 pt-6 border-t border-slate-100">
            {step > 1 && (
              <button onClick={() => setStep(step - 1)} className="px-6 py-3 border border-slate-200 rounded-xl text-[13px] text-slate-500 font-semibold cursor-pointer hover:bg-slate-50 transition-all">
                Back
              </button>
            )}
            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="flex-1 py-3 text-white rounded-xl text-[13px] font-semibold cursor-pointer hover:opacity-90 transition-all"
                style={{ background: scheme.color }}
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!agreeTerms || !agreeDeduction}
                className={`flex-1 py-3 rounded-xl text-[13px] font-semibold transition-all ${agreeTerms && agreeDeduction ? "bg-success text-white cursor-pointer hover:bg-success-700" : "bg-slate-100 text-subtle cursor-not-allowed"}`}
              >
                Open Account
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
