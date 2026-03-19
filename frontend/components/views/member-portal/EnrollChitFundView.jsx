"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { post } from "@/lib/api";
import { useMember } from "@/hooks/useData";
import useNavigation from "@/hooks/useNavigation";

// ─── Icons ────────────────────────────────────────────────
const CheckIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);
const ChevronLeft = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
  </svg>
);
const InfoIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
  </svg>
);
const ShieldIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
  </svg>
);
const AlertIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
  </svg>
);
const UserIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);
const CoinIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);
const ClockIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const UsersIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
  </svg>
);

// ─── Custom Checkbox ───────────────────────────────────────
function Checkbox({ checked, onChange, id }) {
  return (
    <div
      onClick={() => onChange(!checked)}
      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center cursor-pointer transition-all shrink-0 ${
        checked ? "bg-emerald-500 border-emerald-500" : "bg-white border-slate-300 hover:border-emerald-400"
      }`}
    >
      {checked && <CheckIcon className="w-3 h-3 text-white" />}
    </div>
  );
}

// ─── STI Score Ring ────────────────────────────────────────
function STIRing({ score }) {
  const color = score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : "#ef4444";
  const label = score >= 80 ? "Excellent" : score >= 60 ? "Good" : "Low";
  const pct = Math.min(100, score) / 100;
  const r = 22;
  const circ = 2 * Math.PI * r;
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-14 h-14">
        <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
          <circle cx="28" cy="28" r={r} fill="none" stroke="#e2e8f0" strokeWidth="5" />
          <circle
            cx="28" cy="28" r={r} fill="none"
            stroke={color} strokeWidth="5"
            strokeDasharray={circ}
            strokeDashoffset={circ * (1 - pct)}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[11px] font-bold" style={{ color }}>{score}</span>
        </div>
      </div>
      <span className="text-[10px] font-semibold" style={{ color }}>{label}</span>
    </div>
  );
}

// ─── Field Input ───────────────────────────────────────────
function Field({ label, children, hint }) {
  return (
    <div>
      <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>
      {children}
      {hint && <p className="text-[10px] text-slate-400 mt-1">{hint}</p>}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = "text", readOnly }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      readOnly={readOnly}
      className={`w-full border rounded-xl py-3 px-4 text-[13px] font-medium outline-none transition-all ${
        readOnly
          ? "bg-slate-50 border-slate-100 text-slate-400 cursor-default"
          : "bg-white border-slate-200 text-slate-800 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/10 hover:border-slate-300"
      }`}
    />
  );
}

function Select({ value, onChange, children }) {
  return (
    <select
      value={value}
      onChange={onChange}
      className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-[13px] font-medium text-slate-800 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/10 hover:border-slate-300 transition-all cursor-pointer"
    >
      {children}
    </select>
  );
}

// ─── Main Component ────────────────────────────────────────
export default function EnrollChitFundView() {
  const { navigate } = useNavigation();
  const { user } = useAuth();
  const memberId = user?.memberId || "M-1001";
  const { data: member } = useMember(memberId);

  const [scheme, setScheme] = useState(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    memberId,
    fullName: "",
    phone: "",
    email: "",
    nomineeName: "",
    nomineeRelation: "",
    nomineePhone: "",
    agreeTerms: false,
    agreeDeduction: false,
  });
  const [processing, setProcessing] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [enrollResult, setEnrollResult] = useState(null);
  const [enrollError, setEnrollError] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("glimmora_enroll_scheme");
      if (stored) {
        setScheme(JSON.parse(stored));
        localStorage.removeItem("glimmora_enroll_scheme");
      }
    } catch { /* invalid JSON */ }
  }, []);

  useEffect(() => {
    if (member) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || member.name || "",
        phone: prev.phone || member.phone || "",
        email: prev.email || member.email || "",
      }));
    }
  }, [member]);

  const set = (field, value) => setFormData((p) => ({ ...p, [field]: value }));

  // Reset scroll to top after every step/state change (fires after React paints)
  useEffect(() => {
    requestAnimationFrame(() => {
      window.dispatchEvent(new Event("smooth-scroll-top"));
    });
  }, [step, submitted]);

  const goToStep = (n) => setStep(n);

  const handleSubmit = async () => {
    setProcessing(true);
    setEnrollError(null);
    try {
      const res = await post(`/chit-schemes/${scheme.id}/enroll`, {
        memberId,
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        nomineeName: formData.nomineeName || null,
        nomineeRelationship: formData.nomineeRelation || null,
        acceptedTerms: formData.agreeTerms,
        authorizedAutoDeduction: formData.agreeDeduction,
      });
      setEnrollResult(res.data);
      setSubmitted(true);
    } catch (err) {
      setEnrollError(err.data?.error || err.message || "Enrollment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  // ── No Scheme Selected ──
  if (!scheme) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 animate-fade-in">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 rounded-2xl bg-slate-50 border-2 border-slate-200 flex items-center justify-center mx-auto mb-6">
            <InfoIcon className="w-10 h-10 text-slate-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">No Scheme Selected</h2>
          <p className="text-[13px] text-slate-500 mb-8 leading-relaxed">
            Please go back and tap <strong>"Enroll Now"</strong> on a chit fund scheme to begin your enrollment.
          </p>
          <button
            onClick={() => navigate("my_chitfunds")}
            className="px-8 py-3 bg-emerald-500 text-white rounded-xl text-[13px] font-semibold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
          >
            Browse Chit Funds
          </button>
        </div>
      </div>
    );
  }

  const spotsLeft = scheme.totalMembers - scheme.enrolledMembers;
  const fillPct = Math.round((scheme.enrolledMembers / scheme.totalMembers) * 100);
  const isEligible = !member || (member.sti || 0) >= (scheme.minSTI || 0);

  const STEPS = [
    { num: 1, label: "Scheme", icon: CoinIcon },
    { num: 2, label: "Your Info", icon: UserIcon },
    { num: 3, label: "Nominee", icon: UsersIcon },
    { num: 4, label: "Confirm", icon: ShieldIcon },
  ];

  // ── Processing ──
  if (processing) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-8 animate-fade-in">
        <div className="relative">
          <div className="w-20 h-20 rounded-full border-4 border-emerald-100 border-t-emerald-500 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <CoinIcon className="w-8 h-8 text-emerald-500" />
          </div>
        </div>
        <div className="text-center">
          <h3 className="text-[18px] font-bold text-slate-800 mb-2">Processing Enrollment</h3>
          <p className="text-[13px] text-slate-500">Verifying KYC status and scheme eligibility…</p>
          <div className="flex items-center justify-center gap-1.5 mt-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Success ──
  if (submitted) {
    return (
      <div className="animate-fade-in">
        <div className="max-w-lg mx-auto px-4 py-10">
          {/* Confetti-like header */}
          <div className="text-center mb-8">
            <div className="relative inline-block mb-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-2xl shadow-emerald-400/30">
                <CheckIcon className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-amber-400 flex items-center justify-center text-white text-[11px] font-bold shadow-md">✓</div>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">You're Enrolled!</h2>
            <p className="text-[13px] text-slate-500 leading-relaxed max-w-xs mx-auto">
              Your request to join <strong className="text-slate-700">{scheme.name}</strong> has been submitted. Our AI Onboarding Agent will verify your eligibility within 24 hours.
            </p>
          </div>

          {/* Summary Card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/60 overflow-hidden mb-6">
            {/* Card top accent */}
            <div className="h-2 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500" />
            <div className="p-5">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center">
                  <CoinIcon className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <div className="text-[15px] font-bold text-slate-800">{enrollResult?.schemeName || scheme.name}</div>
                  <div className="text-[11px] text-slate-400 font-mono">{enrollResult?.enrollmentId || "Pending ID"}</div>
                </div>
                <div className="ml-auto">
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200/60">
                    {enrollResult?.status || "Active"}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  ["Monthly Contribution", scheme.monthlyAmount],
                  ["Duration", scheme.duration],
                  ["Total Pot Size", scheme.potSize],
                  ["Member Name", formData.fullName],
                  ["Nominee", enrollResult?.nomineeName || formData.nomineeName || "—"],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                    <span className="text-[12px] text-slate-400">{label}</span>
                    <span className="text-[12px] font-semibold text-slate-700">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Info Banner */}
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 flex items-start gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
              <InfoIcon className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-[11px] text-blue-700 leading-relaxed">
              You'll receive an SMS and email confirmation within 10 minutes. Your first contribution will be auto-debited on the scheme start date.
            </p>
          </div>

          <button
            onClick={() => navigate("my_chitfunds")}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl text-[13px] font-bold hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg shadow-emerald-500/25 cursor-pointer"
          >
            View My Chit Funds
          </button>
        </div>
      </div>
    );
  }

  // ── Main Form ──
  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-4 sm:px-6 py-3.5 mb-0">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button
            onClick={() => step > 1 ? goToStep(step - 1) : navigate("my_chitfunds")}
            className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 cursor-pointer transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <div className="text-[14px] font-bold text-slate-800 truncate">Enroll in Chit Fund</div>
            <div className="text-[11px] text-slate-400 truncate">{scheme.name} · {scheme.monthlyAmount}/month</div>
          </div>
          <div className="text-[11px] font-semibold text-slate-400">{step}/4</div>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="bg-white border-b border-slate-100 px-4 sm:px-6 py-4 mb-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const done = step > s.num;
              const active = step === s.num;
              return (
                <div key={s.num} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center gap-1.5">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                        done ? "bg-emerald-500 shadow-lg shadow-emerald-500/30"
                        : active ? "bg-emerald-500 shadow-lg shadow-emerald-500/30 ring-4 ring-emerald-500/20"
                        : "bg-slate-100"
                      }`}
                    >
                      {done
                        ? <CheckIcon className="w-4 h-4 text-white" />
                        : <Icon className={`w-4 h-4 ${active ? "text-white" : "text-slate-400"}`} />
                      }
                    </div>
                    <span className={`text-[9px] font-semibold uppercase tracking-wide hidden sm:block ${active ? "text-emerald-600" : done ? "text-emerald-500" : "text-slate-400"}`}>
                      {s.label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-2 transition-all duration-500 ${step > s.num ? "bg-emerald-400" : "bg-slate-100"}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 pb-10">

        {/* ── STEP 1: Scheme Overview ── */}
        {step === 1 && (
          <div className="space-y-5 animate-fade-in">
            <div className="text-center">
              <h2 className="text-xl font-bold text-slate-800">Scheme Overview</h2>
              <p className="text-[12px] text-slate-400 mt-1">Review before proceeding</p>
            </div>

            {/* Hero Scheme Card */}
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 p-6 text-white shadow-2xl shadow-emerald-500/25">
              {/* Decorative circles */}
              <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5" />
              <div className="absolute -bottom-6 -left-6 w-28 h-28 rounded-full bg-white/5" />

              <div className="relative">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-emerald-200 mb-1">Chit Fund Scheme</div>
                    <div className="text-[20px] font-bold leading-tight">{scheme.name}</div>
                    <div className="text-[10px] text-emerald-300 font-mono mt-0.5">{scheme.id}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-emerald-200 uppercase tracking-wider">Monthly</div>
                    <div className="text-[28px] font-black font-mono leading-none">{scheme.monthlyAmount}</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { Icon: ClockIcon, label: "Duration", value: scheme.duration },
                    { Icon: CoinIcon, label: "Pot Size", value: scheme.potSize },
                    { Icon: UsersIcon, label: "Members", value: `${scheme.enrolledMembers}/${scheme.totalMembers}` },
                  ].map(({ Icon, label, value }) => (
                    <div key={label} className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                      <Icon className="w-4 h-4 text-emerald-200 mb-1.5" />
                      <div className="text-[10px] text-emerald-300">{label}</div>
                      <div className="text-[14px] font-bold font-mono">{value}</div>
                    </div>
                  ))}
                </div>

                {/* Fill bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] text-emerald-200">{spotsLeft} spots left</span>
                    <span className="text-[10px] text-emerald-200">{fillPct}% filled</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/20 overflow-hidden">
                    <div className="h-full rounded-full bg-white/70 transition-all" style={{ width: `${fillPct}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {scheme.description && (
              <p className="text-[13px] text-slate-500 leading-relaxed px-1">{scheme.description}</p>
            )}

            {/* How it Works */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center">
                  <InfoIcon className="w-3 h-3 text-slate-500" />
                </div>
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">How It Works</span>
              </div>
              <div className="space-y-0">
                {[
                  { n: "1", title: "Monthly Contribution", desc: `All ${scheme.totalMembers} members contribute ${scheme.monthlyAmount} monthly`, color: "indigo" },
                  { n: "2", title: "Pot Collection", desc: `Full pot of ${scheme.potSize} is collected each month`, color: "emerald" },
                  { n: "3", title: "Rotation Payout", desc: "One member receives the pot each month on rotation", color: "violet" },
                  { n: "4", title: "Complete Cycle", desc: `Every member gets the pot once over ${scheme.duration}`, color: "amber" },
                ].map((item, i, arr) => (
                  <div key={item.n} className={`flex items-start gap-4 py-3.5 ${i < arr.length - 1 ? "border-b border-slate-50" : ""}`}>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-[12px] font-bold shrink-0
                      ${item.color === "indigo" ? "bg-indigo-50 text-indigo-600" :
                        item.color === "emerald" ? "bg-emerald-50 text-emerald-600" :
                        item.color === "violet" ? "bg-violet-50 text-violet-600" :
                        "bg-amber-50 text-amber-600"}`}>
                      {item.n}
                    </div>
                    <div>
                      <div className="text-[13px] font-semibold text-slate-700">{item.title}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Eligibility Status */}
            {member && (
              <div className={`rounded-2xl p-4 border flex items-center gap-4 ${
                isEligible ? "bg-emerald-50 border-emerald-200/60" : "bg-red-50 border-red-200/60"
              }`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isEligible ? "bg-emerald-100" : "bg-red-100"}`}>
                  {isEligible
                    ? <ShieldIcon className="w-6 h-6 text-emerald-600" />
                    : <AlertIcon className="w-6 h-6 text-red-500" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-[13px] font-bold ${isEligible ? "text-emerald-800" : "text-red-700"}`}>
                    {isEligible ? "You're eligible for this scheme!" : "STI score below minimum required"}
                  </div>
                  <div className={`text-[11px] mt-0.5 ${isEligible ? "text-emerald-600" : "text-red-500"}`}>
                    Your STI: <strong>{member.sti}</strong> · Required: <strong>{scheme.minSTI || 60}</strong> · KYC: <strong>{member.kyc}</strong>
                  </div>
                </div>
                <STIRing score={member.sti || 0} />
              </div>
            )}
          </div>
        )}

        {/* ── STEP 2: Your Info ── */}
        {step === 2 && (
          <div className="space-y-5 animate-fade-in">
            <div className="text-center">
              <h2 className="text-xl font-bold text-slate-800">Your Information</h2>
              <p className="text-[12px] text-slate-400 mt-1">Verify your details for enrollment</p>
            </div>

            {/* Profile Snapshot */}
            <div className="bg-gradient-to-r from-slate-50 to-slate-50/50 rounded-2xl border border-slate-100 p-5 flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-[18px] shadow-lg shadow-emerald-400/20 shrink-0">
                {formData.fullName ? formData.fullName[0].toUpperCase() : "M"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-bold text-slate-800 truncate">{formData.fullName || "Member"}</div>
                <div className="text-[11px] text-slate-400 font-mono">{formData.memberId}</div>
              </div>
              {member && (
                <div className="text-right shrink-0">
                  <div className="text-[10px] text-slate-400 mb-0.5">STI Score</div>
                  <div className={`text-[18px] font-black ${
                    (member.sti || 0) >= 80 ? "text-emerald-500" : (member.sti || 0) >= 60 ? "text-amber-500" : "text-red-500"
                  }`}>{member.sti || 0}</div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
              <Field label="Full Name">
                <Input value={formData.fullName} onChange={(e) => set("fullName", e.target.value)} placeholder="As on your KYC documents" />
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Phone Number">
                  <Input value={formData.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+91 XXXXX XXXXX" />
                </Field>
                <Field label="Email Address">
                  <Input type="email" value={formData.email} onChange={(e) => set("email", e.target.value)} placeholder="you@example.com" />
                </Field>
              </div>

              <Field label="Member ID">
                <Input value={formData.memberId} readOnly />
              </Field>
            </div>

            {/* Scheme reminder */}
            <div className="flex items-center gap-3 bg-emerald-50 rounded-xl px-4 py-3 border border-emerald-100">
              <CoinIcon className="w-5 h-5 text-emerald-500 shrink-0" />
              <div className="text-[11px] text-emerald-700">
                Enrolling in <strong>{scheme.name}</strong> · <strong>{scheme.monthlyAmount}</strong>/month for <strong>{scheme.duration}</strong>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 3: Nominee ── */}
        {step === 3 && (
          <div className="space-y-5 animate-fade-in">
            <div className="text-center">
              <h2 className="text-xl font-bold text-slate-800">Nominee Details</h2>
              <p className="text-[12px] text-slate-400 mt-1">Required under Nidhi Company regulations</p>
            </div>

            {/* Why Banner */}
            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200/60">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                  <AlertIcon className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <div className="text-[12px] font-bold text-amber-800 mb-0.5">Why is a nominee required?</div>
                  <div className="text-[11px] text-amber-700 leading-relaxed">
                    The nominee receives chit fund benefits in unforeseen circumstances. This is mandatory under Nidhi Company Act 2014, Section 21.
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
              <Field label="Nominee Full Name" hint="Enter the legal name as it appears on government ID">
                <Input
                  value={formData.nomineeName}
                  onChange={(e) => set("nomineeName", e.target.value)}
                  placeholder="Full legal name of nominee"
                />
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Relationship">
                  <Select value={formData.nomineeRelation} onChange={(e) => set("nomineeRelation", e.target.value)}>
                    <option value="">Select relationship…</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Parent">Parent</option>
                    <option value="Child">Child (above 18)</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Other">Other</option>
                  </Select>
                </Field>
                <Field label="Nominee Phone">
                  <Input
                    value={formData.nomineePhone}
                    onChange={(e) => set("nomineePhone", e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                  />
                </Field>
              </div>
            </div>

            {/* Nominee preview */}
            {formData.nomineeName && (
              <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3.5 border border-slate-100">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-white font-bold text-[13px]">
                  {formData.nomineeName[0].toUpperCase()}
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-slate-700">{formData.nomineeName}</div>
                  <div className="text-[11px] text-slate-400">{formData.nomineeRelation || "—"} · {formData.nomineePhone || "No phone added"}</div>
                </div>
                <CheckIcon className="w-4 h-4 text-emerald-500 ml-auto" />
              </div>
            )}
          </div>
        )}

        {/* ── STEP 4: Review & Confirm ── */}
        {step === 4 && (
          <div className="space-y-5 animate-fade-in">
            <div className="text-center">
              <h2 className="text-xl font-bold text-slate-800">Review & Confirm</h2>
              <p className="text-[12px] text-slate-400 mt-1">Double-check everything before submitting</p>
            </div>

            {/* Summary Card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-lg shadow-slate-200/50 overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-emerald-400 to-teal-400" />
              <div className="p-5">

                {/* Section: Scheme */}
                <div className="mb-4">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <CoinIcon className="w-3.5 h-3.5" /> Scheme
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      ["Name", scheme.name],
                      ["Monthly", scheme.monthlyAmount],
                      ["Duration", scheme.duration],
                      ["Pot Size", scheme.potSize],
                    ].map(([l, v]) => (
                      <div key={l} className="bg-slate-50 rounded-xl px-3.5 py-3">
                        <div className="text-[10px] text-slate-400 mb-0.5">{l}</div>
                        <div className="text-[13px] font-bold text-slate-700 truncate">{v}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-50 my-4" />

                {/* Section: Member */}
                <div className="mb-4">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <UserIcon className="w-3.5 h-3.5" /> Member Details
                  </div>
                  <div className="space-y-2">
                    {[
                      ["Full Name", formData.fullName || "—"],
                      ["Member ID", formData.memberId],
                      ["Phone", formData.phone || "—"],
                      ["Email", formData.email || "—"],
                    ].map(([l, v]) => (
                      <div key={l} className="flex items-center justify-between py-1">
                        <span className="text-[12px] text-slate-400">{l}</span>
                        <span className="text-[12px] font-semibold text-slate-700 truncate max-w-[55%] text-right">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-50 my-4" />

                {/* Section: Nominee */}
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <UsersIcon className="w-3.5 h-3.5" /> Nominee
                  </div>
                  <div className="space-y-2">
                    {[
                      ["Name", formData.nomineeName || "—"],
                      ["Relationship", formData.nomineeRelation || "—"],
                      ["Phone", formData.nomineePhone || "—"],
                    ].map(([l, v]) => (
                      <div key={l} className="flex items-center justify-between py-1">
                        <span className="text-[12px] text-slate-400">{l}</span>
                        <span className="text-[12px] font-semibold text-slate-700 truncate max-w-[55%] text-right">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Agreements */}
            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer bg-white p-4 rounded-xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all shadow-sm">
                <Checkbox checked={formData.agreeTerms} onChange={(v) => set("agreeTerms", v)} />
                <span className="text-[12px] text-slate-500 leading-relaxed">
                  I agree to the <strong className="text-slate-700">terms and conditions</strong> of this chit fund scheme, including rotation payout rules, foreman commission (5%), and forfeiture policy.
                </span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer bg-white p-4 rounded-xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all shadow-sm">
                <Checkbox checked={formData.agreeDeduction} onChange={(v) => set("agreeDeduction", v)} />
                <span className="text-[12px] text-slate-500 leading-relaxed">
                  I authorize <strong className="text-slate-700">automatic monthly deductions</strong> of <strong className="text-emerald-600">{scheme.monthlyAmount}</strong> from my linked account for the entire duration of {scheme.duration}.
                </span>
              </label>
            </div>

            {/* Both checked indicator */}
            {formData.agreeTerms && formData.agreeDeduction && (
              <div className="flex items-center gap-2 bg-emerald-50 rounded-xl px-4 py-3 border border-emerald-200/60">
                <CheckIcon className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="text-[12px] text-emerald-700 font-medium">All agreements accepted — ready to submit!</span>
              </div>
            )}
          </div>
        )}

        {/* Error */}
        {enrollError && (
          <div className="mt-5 p-4 bg-red-50 border border-red-200/60 rounded-xl flex items-center gap-3">
            <InfoIcon className="w-5 h-5 text-red-500 shrink-0" />
            <p className="text-[13px] text-red-700 font-medium">{enrollError}</p>
          </div>
        )}

        {/* Footer */}
        <div className="flex gap-3 mt-8 pt-6 border-t border-slate-100">
          {step > 1 && (
            <button
              onClick={() => goToStep(step - 1)}
              className="px-6 py-3.5 border border-slate-200 rounded-xl text-[13px] text-slate-500 font-semibold cursor-pointer hover:bg-slate-50 transition-all"
            >
              Back
            </button>
          )}
          {step < 4 ? (
            <button
              onClick={() => goToStep(step + 1)}
              className="flex-1 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl text-[13px] font-bold cursor-pointer hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg shadow-emerald-500/20"
            >
              Continue →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!formData.agreeTerms || !formData.agreeDeduction}
              className={`flex-1 py-3.5 rounded-xl text-[13px] font-bold transition-all ${
                formData.agreeTerms && formData.agreeDeduction
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white cursor-pointer hover:from-emerald-600 hover:to-teal-600 shadow-lg shadow-emerald-500/20"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed"
              }`}
            >
              {formData.agreeTerms && formData.agreeDeduction ? "Submit Enrollment ✓" : "Accept agreements to continue"}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
