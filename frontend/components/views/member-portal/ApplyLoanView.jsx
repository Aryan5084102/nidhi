"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { post } from "@/lib/api";
import { useMember } from "@/hooks/useData";
import useNavigation from "@/hooks/useNavigation";

function formatINR(num) {
  return "₹" + num.toLocaleString("en-IN");
}

function calculateEMI(principal, ratePercent, months) {
  const r = ratePercent / 12 / 100;
  if (r === 0) return Math.round(principal / months);
  const emi = (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
  return Math.round(emi);
}

export default function ApplyLoanView() {
  const { navigate: onNavigate } = useNavigation();
  const { user } = useAuth();
  const memberId = user?.memberId || "M-1001";
  const { data: member } = useMember(memberId);

  const [scheme, setScheme] = useState(null);
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState(0);
  const [tenure, setTenure] = useState(0);
  const [purpose, setPurpose] = useState("");
  const [employment, setEmployment] = useState("");
  const [income, setIncome] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeDeduction, setAgreeDeduction] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [approved, setApproved] = useState(false);
  const [loanResult, setLoanResult] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("glimmora_apply_loan_scheme");
      if (stored) {
        const parsed = JSON.parse(stored);
        setScheme(parsed);
        setAmount(parsed.minAmount);
        setTenure(parsed.tenures[1] || parsed.tenures[0]);
        setPurpose(parsed.name);
        localStorage.removeItem("glimmora_apply_loan_scheme");
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
            <svg className="w-8 h-8 text-heading" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
          </div>
          <h2 className="text-[18px] font-bold text-heading mb-2">No loan scheme selected</h2>
          <p className="text-[13px] text-heading mb-6">Please go back and select a loan scheme to apply for.</p>
          <button onClick={() => onNavigate("my_loans")} className="px-6 py-3 bg-primary text-white rounded-xl text-[13px] font-semibold hover:bg-primary-700 transition-all cursor-pointer">
            Back to My Loans
          </button>
        </div>
      </div>
    );
  }

  const emi = calculateEMI(amount, scheme.rateNum, tenure);
  const totalPayable = emi * tenure;
  const totalInterest = totalPayable - amount;

  const handleSubmit = async () => {
    setProcessing(true);
    setSubmitError(null);
    try {
      const res = await post("/loans/apply", {
        memberId,
        amount,
        purpose,
        tenure,
      });
      setLoanResult(res.data);
      setApproved(true);
    } catch (err) {
      setSubmitError(err.data?.error || err.message || "Loan application failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const steps = [
    { num: 1, label: "Loan Amount" },
    { num: 2, label: "Your Details" },
    { num: 3, label: "Review & Apply" },
  ];

  return (
    <div className="animate-fade-in">
      {/* Top Bar with back arrow */}
      <div className="bg-white border-b border-slate-100 px-4 sm:px-6 py-3 mb-6">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => onNavigate("my_loans")} className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-heading hover:text-body hover:bg-slate-100 cursor-pointer transition-all">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
            </button>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: scheme.color + "15" }}>
              {scheme.icon}
            </div>
            <div>
              <div className="text-[14px] font-bold text-heading">{scheme.name}</div>
              <div className="text-[11px] text-heading">{scheme.rate} p.a.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Success State */}
      {approved ? (
        <div className="max-w-lg mx-auto px-4 py-16 text-center">
          <div className="w-20 h-20 rounded-full bg-success-50 border-2 border-success-200 flex items-center justify-center mx-auto mb-6 animate-bounce">
            <svg className="w-10 h-10 text-success-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
          </div>
          <h2 className="text-[22px] font-bold text-heading mb-2">Application Submitted!</h2>
          <p className="text-[13px] text-heading mb-8 max-w-sm mx-auto">Your loan application has been received. Our AI agent will verify your eligibility and you'll receive a decision within 24 hours.</p>

          <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100 text-left mb-6">
            <div className="text-[10px] text-heading uppercase tracking-wider mb-3">Application Summary</div>
            <div className="space-y-2.5">
              {[
                ["Application ID", loanResult?.id || "—"],
                ["Loan Type", loanResult?.purpose || scheme.name],
                ["Amount", formatINR(loanResult?.amount || amount)],
                ["Tenure", `${loanResult?.tenure || tenure} months`],
                ["Interest Rate", loanResult?.interestRate ? `${loanResult.interestRate}%` : scheme.rate],
                ["Monthly EMI", formatINR(loanResult?.emi || emi)],
                ["Status", null],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-[12px] text-heading">{label}</span>
                  {value ? (
                    <span className="text-[12px] font-semibold text-body font-mono">{value}</span>
                  ) : (
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-warning-50 text-warning border border-warning-200/60">{loanResult?.status || "Under Review"}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 max-w-sm mx-auto">
            <button onClick={() => onNavigate("my_loans")} className="flex-1 py-3 bg-primary text-white rounded-xl text-[13px] font-semibold hover:bg-primary-700 transition-all cursor-pointer">
              Back to My Loans
            </button>
          </div>
        </div>
      ) : processing ? (
        /* Processing State */
        <div className="max-w-lg mx-auto px-4 py-24 text-center">
          <div className="w-16 h-16 rounded-full border-4 border-slate-200 border-t-primary animate-spin mx-auto mb-6" />
          <h3 className="text-[16px] font-bold text-heading mb-2">Processing Your Application</h3>
          <p className="text-[12px] text-heading">Verifying eligibility and running AI credit check...</p>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
          {/* Step Progress */}
          <div className="flex items-center justify-center gap-1 mb-8">
            {steps.map((s, i) => (
              <div key={s.num} className="flex items-center gap-1">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all ${step >= s.num ? "bg-primary text-white" : "bg-slate-100 text-heading"}`}>
                  {step > s.num ? (
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                  ) : (
                    <span>{s.num}</span>
                  )}
                  <span className="hidden sm:inline">{s.label}</span>
                </div>
                {i < steps.length - 1 && <div className={`w-8 sm:w-16 h-0.5 ${step > s.num ? "bg-primary" : "bg-slate-200"}`} />}
              </div>
            ))}
          </div>

          {/* STEP 1: Loan Amount */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-2">
                <h2 className="text-[18px] font-bold text-heading">How much do you need?</h2>
                <p className="text-[12px] text-heading mt-1">Drag the slider or enter the amount</p>
              </div>

              {/* Amount Display */}
              <div className="text-center py-6">
                <div className="text-[36px] font-bold font-mono text-primary">{formatINR(amount)}</div>
              </div>

              {/* Slider */}
              <div className="px-2">
                <input
                  type="range"
                  min={scheme.minAmount}
                  max={scheme.maxAmount}
                  step={scheme.minAmount < 50000 ? 5000 : 25000}
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
                      className={`px-4 py-2.5 rounded-xl text-[13px] font-semibold border transition-all cursor-pointer ${tenure === t ? "bg-primary border-primary text-white" : "bg-white border-slate-200 text-slate-500 hover:border-primary-300"}`}
                    >
                      {t} months
                    </button>
                  ))}
                </div>
              </div>

              {/* EMI Calculator Card */}
              <div className="bg-gradient-to-br from-primary via-primary-700 to-secondary-700 rounded-2xl p-5 text-white">
                <div className="text-[10px] uppercase tracking-wider text-primary-200 mb-3">Your EMI Breakdown</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
                  <div>
                    <div className="text-[10px] text-primary-200 mb-1">Monthly EMI</div>
                    <div className="text-[20px] font-bold font-mono">{formatINR(emi)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-primary-200 mb-1">Total Interest</div>
                    <div className="text-[16px] font-bold font-mono">{formatINR(totalInterest)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-primary-200 mb-1">Total Payable</div>
                    <div className="text-[16px] font-bold font-mono">{formatINR(totalPayable)}</div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-[10px] text-primary-200 mb-1">
                    <span>Principal</span>
                    <span>Interest</span>
                  </div>
                  <div className="w-full h-2 bg-indigo-800 rounded-full overflow-hidden flex">
                    <div className="h-full bg-white rounded-full" style={{ width: `${(amount / totalPayable) * 100}%` }} />
                    <div className="h-full bg-primary-300 rounded-full" style={{ width: `${(totalInterest / totalPayable) * 100}%` }} />
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="flex items-center gap-4">
                {scheme.features.map((f) => (
                  <div key={f} className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <svg className="w-3.5 h-3.5 text-success-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    {f}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Your Details */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="text-center mb-2">
                <h2 className="text-[18px] font-bold text-heading">Tell us about yourself</h2>
                <p className="text-[12px] text-heading mt-1">We need a few details to process your application</p>
              </div>

              {/* Pre-filled Member Info */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-[10px] text-heading uppercase tracking-wider mb-3">From Your Profile</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  <div><div className="text-[10px] text-heading">Full Name</div><div className="text-[13px] font-semibold text-body">{member?.name}</div></div>
                  <div><div className="text-[10px] text-heading">Member ID</div><div className="text-[13px] font-mono text-body">{member?.id}</div></div>
                  <div><div className="text-[10px] text-heading">Phone</div><div className="text-[13px] text-body">{member?.phone}</div></div>
                  <div><div className="text-[10px] text-heading">STI Score</div><div className="text-[13px] font-bold" style={{ color: (member?.sti || 0) >= 80 ? "#059669" : (member?.sti || 0) >= 60 ? "#D97706" : "#DC2626" }}>{member?.sti || 0}/100</div></div>
                </div>
              </div>

              {/* Additional Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-[12px] text-slate-500 mb-1.5 font-medium">Purpose of Loan</label>
                  <select value={purpose} onChange={(e) => setPurpose(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-body text-[13px] outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-500/10 transition-all">
                    <option>{scheme.name}</option>
                    <option>Business Expansion</option>
                    <option>Home Renovation</option>
                    <option>Education</option>
                    <option>Medical Emergency</option>
                    <option>Vehicle Purchase</option>
                    <option>Personal Expenses</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] text-slate-500 mb-1.5 font-medium">Employment Type</label>
                  <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                    {["Salaried", "Self-Employed", "Business"].map((e) => (
                      <button key={e} onClick={() => setEmployment(e)} className={`py-2.5 sm:py-3 rounded-xl text-[11px] sm:text-[12px] font-semibold border transition-all cursor-pointer ${employment === e ? "bg-primary border-primary text-white" : "bg-white border-slate-200 text-slate-500 hover:border-primary-300"}`}>
                        {e}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-[12px] text-slate-500 mb-1.5 font-medium">Monthly Income (₹)</label>
                  <input type="text" value={income} onChange={(e) => setIncome(e.target.value)} placeholder="e.g., 50,000" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-body text-[13px] outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-500/10 transition-all" />
                </div>
              </div>

              {/* Eligibility Check */}
              <div className={`rounded-2xl p-4 border ${(member?.sti || 0) >= scheme.minSTI ? "bg-success-50 border-success-200/60" : "bg-danger-50 border-danger-200/60"}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${(member?.sti || 0) >= scheme.minSTI ? "bg-success-100" : "bg-danger-100"}`}>
                    {(member?.sti || 0) >= scheme.minSTI ? (
                      <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
                    ) : (
                      <svg className="w-5 h-5 text-danger-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
                    )}
                  </div>
                  <div>
                    <div className={`text-[13px] font-semibold ${(member?.sti || 0) >= scheme.minSTI ? "text-success-700" : "text-danger"}`}>
                      {(member?.sti || 0) >= scheme.minSTI ? "You're eligible for this loan!" : "STI score below minimum requirement"}
                    </div>
                    <div className="text-[11px] text-heading mt-0.5">Your STI: {member?.sti || 0} · Required: {scheme.minSTI}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Review & Apply */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="text-center mb-2">
                <h2 className="text-[18px] font-bold text-heading">Review Your Application</h2>
                <p className="text-[12px] text-heading mt-1">Verify all details before submitting</p>
              </div>

              {/* Loan Summary Card */}
              <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: scheme.color + "15" }}>{scheme.icon}</div>
                  <div>
                    <div className="text-[15px] font-bold text-heading">{scheme.name}</div>
                    <div className="text-[11px] text-heading">{scheme.rate} p.a. · {tenure} months</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 mb-4">
                  <div className="bg-slate-50 rounded-xl p-3">
                    <div className="text-[10px] text-heading uppercase tracking-wider mb-1">Loan Amount</div>
                    <div className="text-[18px] font-bold text-primary font-mono">{formatINR(amount)}</div>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3">
                    <div className="text-[10px] text-heading uppercase tracking-wider mb-1">Monthly EMI</div>
                    <div className="text-[18px] font-bold text-success font-mono">{formatINR(emi)}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  {[
                    ["Purpose", purpose],
                    ["Tenure", `${tenure} months`],
                    ["Interest Rate", scheme.rate],
                    ["Total Interest", formatINR(totalInterest)],
                    ["Total Payable", formatINR(totalPayable)],
                    ["Employment", employment || "—"],
                    ["Monthly Income", income ? `₹${income}` : "—"],
                    ["Applicant", member?.name || "—"],
                    ["Member ID", member?.id || "—"],
                    ["STI Score", `${member?.sti || 0}/100`],
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
                  <span className="text-[12px] text-slate-500 leading-relaxed">I agree to the loan terms, interest rate, repayment schedule, and processing fees as per Glimmora Nidhi policies.</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-all">
                  <input type="checkbox" checked={agreeDeduction} onChange={(e) => setAgreeDeduction(e.target.checked)} className="mt-0.5 accent-primary w-4 h-4" />
                  <span className="text-[12px] text-slate-500 leading-relaxed">I authorize automatic EMI deduction of <strong className="text-body">{formatINR(emi)}/month</strong> from my linked account for {tenure} months.</span>
                </label>
              </div>
            </div>
          )}

          {/* Error Message */}
          {submitError && (
            <div className="mt-4 p-4 bg-danger-50 border border-danger-200/60 rounded-xl">
              <p className="text-[13px] text-danger-600 font-medium">{submitError}</p>
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
              <button onClick={() => setStep(step + 1)} className="flex-1 py-3 bg-primary text-white rounded-xl text-[13px] font-semibold cursor-pointer hover:bg-primary-700 transition-all">
                Continue
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={!agreeTerms || !agreeDeduction || processing} className={`flex-1 py-3 rounded-xl text-[13px] font-semibold transition-all ${agreeTerms && agreeDeduction ? "bg-success text-white cursor-pointer hover:bg-success-700" : "bg-slate-100 text-subtle cursor-not-allowed"}`}>
                Submit Application
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
