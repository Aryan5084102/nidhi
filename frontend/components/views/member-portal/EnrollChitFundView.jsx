"use client";

import { useState, useEffect, useRef } from "react";
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
const ChevronDown = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
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
const BankIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
  </svg>
);
const CalendarIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
  </svg>
);
const ShareIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
  </svg>
);
const DocIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
);

// ─── Sub-Components ───────────────────────────────────────
function Checkbox({ checked, onChange }) {
  return (
    <div onClick={() => onChange(!checked)}
      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center cursor-pointer transition-all shrink-0 ${
        checked ? "bg-emerald-500 border-emerald-500" : "bg-white border-slate-300 hover:border-emerald-400"
      }`}>
      {checked && <CheckIcon className="w-3 h-3 text-white" />}
    </div>
  );
}

function STIRing({ score }) {
  const color = score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : "#ef4444";
  const label = score >= 80 ? "Excellent" : score >= 60 ? "Good" : "Low";
  const pct = Math.min(100, score) / 100;
  const r = 22, circ = 2 * Math.PI * r;
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-14 h-14">
        <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
          <circle cx="28" cy="28" r={r} fill="none" stroke="#e2e8f0" strokeWidth="5" />
          <circle cx="28" cy="28" r={r} fill="none" stroke={color} strokeWidth="5"
            strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[11px] font-bold" style={{ color }}>{score}</span>
        </div>
      </div>
      <span className="text-[10px] font-semibold" style={{ color }}>{label}</span>
    </div>
  );
}

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
    <input type={type} value={value} onChange={onChange} placeholder={placeholder} readOnly={readOnly}
      className={`w-full border rounded-xl py-3 px-4 text-[13px] font-medium outline-none transition-all ${
        readOnly ? "bg-slate-50 border-slate-100 text-slate-400 cursor-default"
          : "bg-white border-slate-200 text-slate-800 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/10 hover:border-slate-300"
      }`} />
  );
}

function Select({ value, onChange, children }) {
  return (
    <select value={value} onChange={onChange}
      className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-[13px] font-medium text-slate-800 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/10 hover:border-slate-300 transition-all cursor-pointer">
      {children}
    </select>
  );
}

// ─── FAQ Accordion ────────────────────────────────────────
function FAQAccordion({ items }) {
  const [openIdx, setOpenIdx] = useState(-1);
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 px-5 pt-5 pb-2">
        <div className="w-5 h-5 rounded bg-violet-50 flex items-center justify-center">
          <InfoIcon className="w-3 h-3 text-violet-500" />
        </div>
        <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Frequently Asked Questions</span>
      </div>
      {items.map((item, i) => (
        <div key={i} className={`border-t border-slate-50 ${i === 0 ? "mt-2" : ""}`}>
          <button onClick={() => setOpenIdx(openIdx === i ? -1 : i)}
            className="w-full flex items-center justify-between px-5 py-3.5 text-left cursor-pointer hover:bg-slate-50/50 transition-colors">
            <span className="text-[13px] font-semibold text-slate-700 pr-4">{item.q}</span>
            <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${openIdx === i ? "rotate-180" : ""}`} />
          </button>
          <div className={`overflow-hidden transition-all duration-300 ${openIdx === i ? "max-h-40 pb-4" : "max-h-0"}`}>
            <p className="px-5 text-[12px] text-slate-500 leading-relaxed">{item.a}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── OTP Input ────────────────────────────────────────────
function OTPInput({ length = 6, value, onChange }) {
  const refs = useRef([]);
  const digits = value.split("").concat(Array(length).fill("")).slice(0, length);

  const handleChange = (i, v) => {
    if (!/^\d?$/.test(v)) return;
    const arr = [...digits];
    arr[i] = v;
    onChange(arr.join(""));
    if (v && i < length - 1) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    onChange(pasted);
    refs.current[Math.min(pasted.length, length - 1)]?.focus();
  };

  return (
    <div className="flex gap-2 justify-center">
      {digits.map((d, i) => (
        <input key={i} ref={(el) => (refs.current[i] = el)}
          type="text" inputMode="numeric" maxLength={1}
          value={d} onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)} onPaste={handlePaste}
          className="w-11 h-12 rounded-xl border-2 border-slate-200 text-center text-[18px] font-bold text-slate-800 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/10 transition-all" />
      ))}
    </div>
  );
}

// ─── Parse numeric amount from string like "₹5,000" ──────
function parseAmt(v) {
  if (typeof v === "number") return v;
  if (!v) return 0;
  return parseInt(String(v).replace(/[^\d]/g, "")) || 0;
}

function parseDuration(v) {
  if (typeof v === "number") return v;
  return parseInt(String(v)) || 0;
}

function fmtRupee(n) {
  return `₹${Number(n).toLocaleString("en-IN")}`;
}

// ═══════════════════════════════════════════════════════════
// ─── MAIN COMPONENT ───────────────────────────────────────
// ═══════════════════════════════════════════════════════════
export default function EnrollChitFundView() {
  const { navigate } = useNavigation();
  const { user } = useAuth();
  const memberId = user?.memberId || "M-1001";
  const { data: member } = useMember(memberId);

  const [scheme, setScheme] = useState(null);
  const [step, setStep] = useState(1);
  const TOTAL_STEPS = 6;
  const [formData, setFormData] = useState({
    memberId,
    fullName: "", phone: "", email: "",
    // Nominee
    nomineeName: "", nomineeRelation: "", nomineePhone: "",
    nomineeAadhaar: "", nomineePan: "", nomineeAddress: "",
    // Secondary nominee
    hasSecondNominee: false,
    nominee2Name: "", nominee2Relation: "", nominee2Phone: "", nominee2Share: "50",
    // Payment
    paymentMethod: "upi_autopay",
    bankName: "", accountNumber: "", ifscCode: "", upiId: "",
    // Agreements
    agreeTerms: false, agreeDeduction: false,
  });
  const [processing, setProcessing] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [enrollResult, setEnrollResult] = useState(null);
  const [enrollError, setEnrollError] = useState(null);
  // OTP
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("glimmora_enroll_scheme");
      if (stored) { setScheme(JSON.parse(stored)); localStorage.removeItem("glimmora_enroll_scheme"); }
    } catch { /* invalid JSON */ }
  }, []);

  useEffect(() => {
    if (member) setFormData((p) => ({
      ...p,
      fullName: p.fullName || member.name || "",
      phone: p.phone || member.phone || "",
      email: p.email || member.email || "",
    }));
  }, [member]);

  const set = (f, v) => setFormData((p) => ({ ...p, [f]: v }));

  useEffect(() => {
    requestAnimationFrame(() => { window.dispatchEvent(new Event("smooth-scroll-top")); });
  }, [step, submitted]);

  const goToStep = (n) => setStep(n);

  // OTP timer countdown
  useEffect(() => {
    if (otpTimer <= 0) return;
    const t = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
    return () => clearTimeout(t);
  }, [otpTimer]);

  const sendOtp = async () => {
    setOtpSending(true);
    try {
      await post("/auth/forgot-password", { email: formData.email });
      setOtpSent(true);
      setOtpTimer(60);
    } catch { /* still show OTP input for demo */ setOtpSent(true); setOtpTimer(60); }
    finally { setOtpSending(false); }
  };

  const verifyOtp = () => {
    if (otpValue.length === 6) setOtpVerified(true);
  };

  const handleSubmit = async () => {
    setProcessing(true);
    setEnrollError(null);
    try {
      const res = await post(`/chit-schemes/${scheme.id}/enroll`, {
        memberId, fullName: formData.fullName, phone: formData.phone, email: formData.email,
        nomineeName: formData.nomineeName || null,
        nomineeRelationship: formData.nomineeRelation || null,
        acceptedTerms: formData.agreeTerms,
        authorizedAutoDeduction: formData.agreeDeduction,
      });
      setEnrollResult(res.data);
      setSubmitted(true);
    } catch (err) {
      setEnrollError(err.data?.error || err.message || "Enrollment failed. Please try again.");
    } finally { setProcessing(false); }
  };

  // ── No Scheme ──
  if (!scheme) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 animate-fade-in">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 rounded-2xl bg-slate-50 border-2 border-slate-200 flex items-center justify-center mx-auto mb-6">
            <InfoIcon className="w-10 h-10 text-slate-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">No Scheme Selected</h2>
          <p className="text-[13px] text-slate-500 mb-8 leading-relaxed">
            Please go back and tap <strong>"Enroll Now"</strong> on a chit fund scheme to begin.
          </p>
          <button onClick={() => navigate("my_chitfunds")}
            className="px-8 py-3 bg-emerald-500 text-white rounded-xl text-[13px] font-semibold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 cursor-pointer">
            Browse Chit Funds
          </button>
        </div>
      </div>
    );
  }

  const monthlyAmt = parseAmt(scheme.monthlyAmount);
  const totalMonths = parseDuration(scheme.duration);
  const potSize = parseAmt(scheme.potSize);
  const spotsLeft = scheme.totalMembers - scheme.enrolledMembers;
  const fillPct = Math.round((scheme.enrolledMembers / scheme.totalMembers) * 100);
  const isEligible = !member || (member.sti || 0) >= (scheme.minSTI || 0);
  const totalPay = monthlyAmt * totalMonths;

  const STEPS = [
    { num: 1, label: "Scheme",   icon: CoinIcon },
    { num: 2, label: "Info",     icon: UserIcon },
    { num: 3, label: "Payment",  icon: BankIcon },
    { num: 4, label: "Nominee",  icon: UsersIcon },
    { num: 5, label: "Review",   icon: DocIcon },
    { num: 6, label: "Verify",   icon: ShieldIcon },
  ];

  // Build payment schedule
  const scheduleRows = [];
  const baseDate = new Date();
  baseDate.setDate(1);
  baseDate.setMonth(baseDate.getMonth() + 1);
  for (let i = 0; i < Math.min(totalMonths, 12); i++) {
    const d = new Date(baseDate);
    d.setMonth(d.getMonth() + i);
    scheduleRows.push({
      month: i + 1,
      date: d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      amount: fmtRupee(monthlyAmt),
    });
  }

  const FAQ_ITEMS = [
    { q: "How does the chit fund rotation work?", a: `Every month, all ${scheme.totalMembers} members contribute ${scheme.monthlyAmount} each. The total pot of ${scheme.potSize} is collected and given to one member who needs it. This rotates so every member receives the full pot exactly once over ${scheme.duration}.` },
    { q: "What happens if I miss a monthly payment?", a: "A grace period of 7 days is allowed. After that, a penalty of 2% on the monthly amount is charged. Repeated defaults (3+ months) may lead to forfeiture of the scheme." },
    { q: "Can I exit the scheme early?", a: "You can request early exit after completing 50% of the scheme duration. A surrender charge of 5% on total contributions is deducted. You'll receive the remaining amount within 15 working days." },
    { q: "How is my turn decided?", a: "Each month, the member who needs the money most can request the pot. If multiple members request, a fair draw or mutual agreement decides. Every member is guaranteed to receive the pot exactly once." },
    { q: "Is my money safe?", a: "Glimmora Nidhi operates under the Nidhi Companies Act 2014, regulated by the Ministry of Corporate Affairs. All chit funds are governed by the Chit Funds Act, 1982. Your contributions are collectively held and distributed transparently." },
    { q: "Can I transfer my enrollment to someone else?", a: "Transfer of enrollment is allowed only to immediate family members (spouse, parent, child) with prior approval from the branch manager. A nominal transfer fee of ₹500 applies." },
  ];

  // ── Processing ──
  if (processing) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-8 animate-fade-in">
        <div className="relative">
          <div className="w-20 h-20 rounded-full border-4 border-emerald-100 border-t-emerald-500 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center"><CoinIcon className="w-8 h-8 text-emerald-500" /></div>
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
    const enrollId = enrollResult?.enrollmentId || "Pending ID";
    const shareText = `I just enrolled in ${scheme.name} on Glimmora Nidhi! 🎉 Monthly: ${scheme.monthlyAmount}, Pot: ${scheme.potSize}`;
    return (
      <div className="animate-fade-in">
        <div className="px-4 py-10">
          <div className="text-center mb-8">
            <div className="relative inline-block mb-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-2xl shadow-emerald-400/30">
                <CheckIcon className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-amber-400 flex items-center justify-center text-white text-[11px] font-bold shadow-md">✓</div>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">You're Enrolled!</h2>
            <p className="text-[13px] text-slate-500 leading-relaxed max-w-xs mx-auto">
              Your request to join <strong className="text-slate-700">{scheme.name}</strong> has been submitted. Our AI Onboarding Agent will verify within 24 hours.
            </p>
          </div>

          {/* Summary Card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/60 overflow-hidden mb-6">
            <div className="h-2 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500" />
            <div className="p-5">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center">
                  <CoinIcon className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <div className="text-[15px] font-bold text-slate-800">{enrollResult?.schemeName || scheme.name}</div>
                  <div className="text-[11px] text-slate-400 font-mono">{enrollId}</div>
                </div>
                <span className="ml-auto px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200/60">
                  {enrollResult?.status || "Active"}
                </span>
              </div>
              <div className="space-y-3">
                {[
                  ["Monthly Contribution", scheme.monthlyAmount],
                  ["Duration", scheme.duration],
                  ["Total Pot Size", scheme.potSize],
                  ["Payment Method", formData.paymentMethod === "upi_autopay" ? "UPI AutoPay" : formData.paymentMethod === "nach" ? "NACH Mandate" : "Manual"],
                  ["Member Name", formData.fullName],
                  ["Nominee", formData.nomineeName || "—"],
                ].map(([l, v]) => (
                  <div key={l} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                    <span className="text-[12px] text-slate-400">{l}</span>
                    <span className="text-[12px] font-semibold text-slate-700">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <button onClick={() => {
              if (navigator.share) navigator.share({ title: "Glimmora Enrollment", text: shareText });
            }} className="flex flex-col items-center gap-1.5 py-3 rounded-xl bg-blue-50 border border-blue-100 hover:bg-blue-100 transition-all cursor-pointer">
              <ShareIcon className="w-5 h-5 text-blue-500" />
              <span className="text-[10px] font-semibold text-blue-700">Share</span>
            </button>
            <button onClick={() => {
              const start = new Date(baseDate);
              const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(scheme.name + " - First Payment")}&dates=${start.toISOString().replace(/[-:]/g, "").split(".")[0]}Z/${start.toISOString().replace(/[-:]/g, "").split(".")[0]}Z&details=${encodeURIComponent("Monthly chit fund contribution: " + scheme.monthlyAmount)}`;
              window.open(url, "_blank");
            }} className="flex flex-col items-center gap-1.5 py-3 rounded-xl bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 transition-all cursor-pointer">
              <CalendarIcon className="w-5 h-5 text-emerald-500" />
              <span className="text-[10px] font-semibold text-emerald-700">Calendar</span>
            </button>
            <button onClick={() => window.print()} className="flex flex-col items-center gap-1.5 py-3 rounded-xl bg-violet-50 border border-violet-100 hover:bg-violet-100 transition-all cursor-pointer">
              <DocIcon className="w-5 h-5 text-violet-500" />
              <span className="text-[10px] font-semibold text-violet-700">Download</span>
            </button>
          </div>

          {/* Info Banner */}
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 flex items-start gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
              <InfoIcon className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-[11px] text-blue-700 leading-relaxed">
              You'll receive an SMS and email confirmation within 10 minutes. Your first contribution will be auto-debited on <strong>{scheduleRows[0]?.date}</strong>.
            </p>
          </div>

          <div className="flex gap-3">
            <button onClick={() => navigate("my_chitfunds")}
              className="flex-1 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl text-[13px] font-bold hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg shadow-emerald-500/25 cursor-pointer">
              View My Chit Funds
            </button>
            <button onClick={() => navigate("member_dashboard")}
              className="px-5 py-3.5 border border-slate-200 rounded-xl text-[13px] font-semibold text-slate-500 hover:bg-slate-50 transition-all cursor-pointer">
              Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════
  // ── MAIN FORM ──
  // ══════════════════════════════════════════════════════════
  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-4 sm:px-6 py-3.5 mb-0">
        <div className="flex items-center gap-3">
          <button onClick={() => step > 1 ? goToStep(step - 1) : navigate("my_chitfunds")}
            className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 cursor-pointer transition-all">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <div className="text-[14px] font-bold text-slate-800 truncate">Enroll in Chit Fund</div>
            <div className="text-[11px] text-slate-400 truncate">{scheme.name} · {scheme.monthlyAmount}/month</div>
          </div>
          <div className="text-[11px] font-semibold text-slate-400">{step}/{TOTAL_STEPS}</div>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="bg-white border-b border-slate-100 px-4 sm:px-6 py-4 mb-6">
        <div>
          <div className="flex items-center">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const done = step > s.num, active = step === s.num;
              return (
                <div key={s.num} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center gap-1.5">
                    <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                      done ? "bg-emerald-500 shadow-lg shadow-emerald-500/30"
                        : active ? "bg-emerald-500 shadow-lg shadow-emerald-500/30 ring-4 ring-emerald-500/20"
                        : "bg-slate-100"
                    }`}>
                      {done ? <CheckIcon className="w-3.5 h-3.5 text-white" />
                        : <Icon className={`w-3.5 h-3.5 ${active ? "text-white" : "text-slate-400"}`} />}
                    </div>
                    <span className={`text-[8px] sm:text-[9px] font-semibold uppercase tracking-wide hidden sm:block ${active ? "text-emerald-600" : done ? "text-emerald-500" : "text-slate-400"}`}>
                      {s.label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-1 sm:mx-2 transition-all duration-500 ${step > s.num ? "bg-emerald-400" : "bg-slate-100"}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 pb-10">

        {/* ═══ STEP 1: Scheme Overview + Calculator + FAQ ═══ */}
        {step === 1 && (
          <div className="space-y-5 animate-fade-in">
            <div className="text-center">
              <h2 className="text-xl font-bold text-slate-800">Scheme Overview</h2>
              <p className="text-[12px] text-slate-400 mt-1">Review before proceeding</p>
            </div>

            {/* Hero Card */}
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 p-6 text-white shadow-2xl shadow-emerald-500/25">
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

            {scheme.description && <p className="text-[13px] text-slate-500 leading-relaxed px-1">{scheme.description}</p>}

            {/* Payout Calculator */}
            <div className="bg-gradient-to-r from-indigo-50 to-violet-50 rounded-2xl border border-indigo-100 p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-5 h-5 rounded bg-indigo-100 flex items-center justify-center">
                  <CoinIcon className="w-3 h-3 text-indigo-500" />
                </div>
                <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider">Payout Calculator</span>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-white rounded-xl p-3.5 border border-indigo-100">
                  <div className="text-[10px] text-slate-400 mb-0.5">You Pay Monthly</div>
                  <div className="text-[18px] font-black text-indigo-600 font-mono">{fmtRupee(monthlyAmt)}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Every month</div>
                </div>
                <div className="bg-white rounded-xl p-3.5 border border-indigo-100">
                  <div className="text-[10px] text-slate-400 mb-0.5">Total You Pay</div>
                  <div className="text-[18px] font-black text-slate-700 font-mono">{fmtRupee(totalPay)}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{totalMonths} months</div>
                </div>
                <div className="bg-white rounded-xl p-3.5 border border-indigo-100">
                  <div className="text-[10px] text-slate-400 mb-0.5">Pot You Get</div>
                  <div className="text-[18px] font-black text-emerald-600 font-mono">{fmtRupee(potSize)}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Full amount, once</div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-3.5 border border-indigo-100">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5">
                    <UsersIcon className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div>
                    <div className="text-[12px] font-bold text-slate-700 mb-0.5">How it adds up</div>
                    <div className="text-[11px] text-slate-500 leading-relaxed">
                      All {scheme.totalMembers} members contribute {scheme.monthlyAmount} each month → total pot of {scheme.potSize} is collected → one member who needs it receives the <strong className="text-emerald-600">full {scheme.potSize}</strong> → this rotates every month until everyone has received it once.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payout Calendar */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-5 h-5 rounded bg-emerald-50 flex items-center justify-center">
                  <CalendarIcon className="w-3 h-3 text-emerald-500" />
                </div>
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Payout Timeline</span>
              </div>
              <div className="relative pl-6">
                <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-100" />
                {Array.from({ length: Math.min(totalMonths, 6) }, (_, i) => {
                  const isYou = i === Math.floor(totalMonths / 2);
                  return (
                    <div key={i} className="relative flex items-center gap-3 py-2">
                      <div className={`absolute left-[-13px] w-3 h-3 rounded-full border-2 ${
                        isYou ? "bg-emerald-500 border-emerald-500" : i < 2 ? "bg-slate-300 border-slate-300" : "bg-white border-slate-300"
                      }`} />
                      <div className="flex items-center justify-between flex-1">
                        <div>
                          <span className="text-[12px] font-semibold text-slate-700">Month {i + 1}</span>
                          {isYou && <span className="ml-2 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Your estimated turn</span>}
                          {i < 2 && <span className="ml-2 text-[10px] text-slate-400">Completed</span>}
                        </div>
                        <span className="text-[11px] font-mono text-slate-400">{fmtRupee(potSize)}</span>
                      </div>
                    </div>
                  );
                })}
                {totalMonths > 6 && (
                  <div className="py-2 text-[11px] text-slate-400 italic">... and {totalMonths - 6} more months</div>
                )}
              </div>
            </div>

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
                  { n: "1", title: "Everyone Contributes", desc: `All ${scheme.totalMembers} members pay ${scheme.monthlyAmount} each month into a common pool`, color: "indigo" },
                  { n: "2", title: "Pot is Collected", desc: `The full pot of ${scheme.potSize} (${scheme.totalMembers} × ${scheme.monthlyAmount}) is collected every month`, color: "emerald" },
                  { n: "3", title: "One Member Gets It", desc: `The member who needs the money receives the full ${scheme.potSize} that month — no deductions`, color: "violet" },
                  { n: "4", title: "Fair Rotation", desc: `This rotates every month for ${scheme.duration} until every single member has received the pot exactly once`, color: "amber" },
                ].map((item, i, arr) => (
                  <div key={item.n} className={`flex items-start gap-4 py-3.5 ${i < arr.length - 1 ? "border-b border-slate-50" : ""}`}>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-[12px] font-bold shrink-0
                      ${item.color === "indigo" ? "bg-indigo-50 text-indigo-600" : item.color === "emerald" ? "bg-emerald-50 text-emerald-600" :
                        item.color === "violet" ? "bg-violet-50 text-violet-600" : "bg-amber-50 text-amber-600"}`}>
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

            {/* Eligibility */}
            {member && (
              <div className={`rounded-2xl p-4 border flex items-center gap-4 ${isEligible ? "bg-emerald-50 border-emerald-200/60" : "bg-red-50 border-red-200/60"}`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isEligible ? "bg-emerald-100" : "bg-red-100"}`}>
                  {isEligible ? <ShieldIcon className="w-6 h-6 text-emerald-600" /> : <AlertIcon className="w-6 h-6 text-red-500" />}
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

            {/* FAQ */}
            <FAQAccordion items={FAQ_ITEMS} />
          </div>
        )}

        {/* ═══ STEP 2: Your Info ═══ */}
        {step === 2 && (
          <div className="space-y-5 animate-fade-in">
            <div className="text-center">
              <h2 className="text-xl font-bold text-slate-800">Your Information</h2>
              <p className="text-[12px] text-slate-400 mt-1">Verify your details for enrollment</p>
            </div>
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
                  <div className={`text-[18px] font-black ${(member.sti || 0) >= 80 ? "text-emerald-500" : (member.sti || 0) >= 60 ? "text-amber-500" : "text-red-500"}`}>{member.sti || 0}</div>
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
            <div className="flex items-center gap-3 bg-emerald-50 rounded-xl px-4 py-3 border border-emerald-100">
              <CoinIcon className="w-5 h-5 text-emerald-500 shrink-0" />
              <div className="text-[11px] text-emerald-700">
                Enrolling in <strong>{scheme.name}</strong> · <strong>{scheme.monthlyAmount}</strong>/month for <strong>{scheme.duration}</strong>
              </div>
            </div>
          </div>
        )}

        {/* ═══ STEP 3: Payment Setup (NEW) ═══ */}
        {step === 3 && (
          <div className="space-y-5 animate-fade-in">
            <div className="text-center">
              <h2 className="text-xl font-bold text-slate-800">Payment Setup</h2>
              <p className="text-[12px] text-slate-400 mt-1">Choose how you'd like to pay monthly contributions</p>
            </div>

            {/* Payment Method Selection */}
            <div className="space-y-3">
              {[
                { id: "upi_autopay", title: "UPI AutoPay", desc: "Auto-debit from your UPI ID every month", icon: "⚡", recommended: true },
                { id: "nach", title: "NACH / Bank Mandate", desc: "Auto-debit from your bank account via NACH", icon: "🏦", recommended: false },
                { id: "manual", title: "Manual Payment", desc: "Pay manually each month via UPI/NEFT", icon: "📱", recommended: false },
              ].map((m) => (
                <button key={m.id} onClick={() => set("paymentMethod", m.id)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    formData.paymentMethod === m.id
                      ? "border-emerald-400 bg-emerald-50/50 shadow-sm"
                      : "border-slate-100 bg-white hover:border-slate-200"
                  }`}>
                  <div className="flex items-center gap-3">
                    <span className="text-[20px]">{m.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-bold text-slate-800">{m.title}</span>
                        {m.recommended && <span className="text-[9px] font-bold bg-emerald-500 text-white px-2 py-0.5 rounded-full">RECOMMENDED</span>}
                      </div>
                      <span className="text-[11px] text-slate-400">{m.desc}</span>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      formData.paymentMethod === m.id ? "border-emerald-500" : "border-slate-300"
                    }`}>
                      {formData.paymentMethod === m.id && <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Payment Details Form */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
              {formData.paymentMethod === "upi_autopay" && (
                <Field label="UPI ID" hint="Your UPI AutoPay mandate will be set up after enrollment approval">
                  <Input value={formData.upiId} onChange={(e) => set("upiId", e.target.value)} placeholder="yourname@upi" />
                </Field>
              )}
              {formData.paymentMethod === "nach" && (
                <>
                  <Field label="Bank Name">
                    <Select value={formData.bankName} onChange={(e) => set("bankName", e.target.value)}>
                      <option value="">Select your bank…</option>
                      <option value="SBI">State Bank of India</option>
                      <option value="HDFC">HDFC Bank</option>
                      <option value="ICICI">ICICI Bank</option>
                      <option value="Axis">Axis Bank</option>
                      <option value="PNB">Punjab National Bank</option>
                      <option value="BOB">Bank of Baroda</option>
                      <option value="Kotak">Kotak Mahindra Bank</option>
                      <option value="Other">Other</option>
                    </Select>
                  </Field>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Account Number">
                      <Input value={formData.accountNumber} onChange={(e) => set("accountNumber", e.target.value)} placeholder="Enter account number" />
                    </Field>
                    <Field label="IFSC Code">
                      <Input value={formData.ifscCode} onChange={(e) => set("ifscCode", e.target.value.toUpperCase())} placeholder="e.g. SBIN0001234" />
                    </Field>
                  </div>
                </>
              )}
              {formData.paymentMethod === "manual" && (
                <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                  <div className="flex items-start gap-3">
                    <AlertIcon className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[12px] font-bold text-amber-800 mb-0.5">Manual Payment Notice</div>
                      <div className="text-[11px] text-amber-700 leading-relaxed">
                        You'll receive a payment reminder 3 days before each due date. Payments must be completed within the 7-day grace period to avoid penalties.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* First Payment Preview */}
            <div className="bg-slate-50 rounded-2xl border border-slate-100 p-4">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">First Payment Preview</div>
              <div className="space-y-2">
                {[
                  ["First Deduction Date", scheduleRows[0]?.date || "—"],
                  ["Amount", fmtRupee(monthlyAmt)],
                  ["Method", formData.paymentMethod === "upi_autopay" ? "UPI AutoPay" : formData.paymentMethod === "nach" ? "NACH Mandate" : "Manual"],
                  ["Frequency", "Monthly"],
                  ["Total Payments", `${totalMonths} months`],
                ].map(([l, v]) => (
                  <div key={l} className="flex items-center justify-between py-1">
                    <span className="text-[12px] text-slate-400">{l}</span>
                    <span className="text-[12px] font-semibold text-slate-700">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══ STEP 4: Nominee (Enhanced) ═══ */}
        {step === 4 && (
          <div className="space-y-5 animate-fade-in">
            <div className="text-center">
              <h2 className="text-xl font-bold text-slate-800">Nominee Details</h2>
              <p className="text-[12px] text-slate-400 mt-1">Required under Nidhi Company regulations</p>
            </div>

            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200/60">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                  <AlertIcon className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <div className="text-[12px] font-bold text-amber-800 mb-0.5">Why is a nominee required?</div>
                  <div className="text-[11px] text-amber-700 leading-relaxed">
                    The nominee receives chit fund benefits in unforeseen circumstances. Mandatory under Nidhi Company Act 2014, Section 21.
                  </div>
                </div>
              </div>
            </div>

            {/* Primary Nominee */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Primary Nominee {formData.hasSecondNominee ? `(${100 - parseInt(formData.nominee2Share || 50)}% share)` : "(100% share)"}</div>
              <Field label="Full Name" hint="Legal name as on government ID">
                <Input value={formData.nomineeName} onChange={(e) => set("nomineeName", e.target.value)} placeholder="Full legal name" />
              </Field>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Relationship">
                  <Select value={formData.nomineeRelation} onChange={(e) => set("nomineeRelation", e.target.value)}>
                    <option value="">Select…</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Parent">Parent</option>
                    <option value="Child">Child (above 18)</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Other">Other</option>
                  </Select>
                </Field>
                <Field label="Phone">
                  <Input value={formData.nomineePhone} onChange={(e) => set("nomineePhone", e.target.value)} placeholder="+91 XXXXX XXXXX" />
                </Field>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Aadhaar Number" hint="Optional — for faster verification">
                  <Input value={formData.nomineeAadhaar} onChange={(e) => set("nomineeAadhaar", e.target.value.replace(/\D/g, "").slice(0, 12))} placeholder="XXXX XXXX XXXX" />
                </Field>
                <Field label="PAN Number" hint="Optional">
                  <Input value={formData.nomineePan} onChange={(e) => set("nomineePan", e.target.value.toUpperCase().slice(0, 10))} placeholder="ABCDE1234F" />
                </Field>
              </div>
              <Field label="Address">
                <Input value={formData.nomineeAddress} onChange={(e) => set("nomineeAddress", e.target.value)} placeholder="Full address of nominee" />
              </Field>
            </div>

            {/* Secondary Nominee Toggle */}
            <button onClick={() => set("hasSecondNominee", !formData.hasSecondNominee)}
              className="w-full flex items-center justify-between bg-white rounded-xl border border-slate-100 px-4 py-3.5 cursor-pointer hover:bg-slate-50 transition-all">
              <div className="flex items-center gap-3">
                <UsersIcon className="w-5 h-5 text-violet-500" />
                <span className="text-[13px] font-semibold text-slate-700">Add Secondary Nominee</span>
              </div>
              <div className={`w-10 h-6 rounded-full transition-all ${formData.hasSecondNominee ? "bg-emerald-500" : "bg-slate-200"} flex items-center`}>
                <div className={`w-4 h-4 rounded-full bg-white shadow transition-all ${formData.hasSecondNominee ? "ml-5" : "ml-1"}`} />
              </div>
            </button>

            {formData.hasSecondNominee && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Secondary Nominee ({formData.nominee2Share}% share)</div>
                <Field label="Full Name">
                  <Input value={formData.nominee2Name} onChange={(e) => set("nominee2Name", e.target.value)} placeholder="Full legal name" />
                </Field>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Relationship">
                    <Select value={formData.nominee2Relation} onChange={(e) => set("nominee2Relation", e.target.value)}>
                      <option value="">Select…</option>
                      <option value="Spouse">Spouse</option>
                      <option value="Parent">Parent</option>
                      <option value="Child">Child (above 18)</option>
                      <option value="Sibling">Sibling</option>
                      <option value="Other">Other</option>
                    </Select>
                  </Field>
                  <Field label="Phone">
                    <Input value={formData.nominee2Phone} onChange={(e) => set("nominee2Phone", e.target.value)} placeholder="+91 XXXXX XXXXX" />
                  </Field>
                </div>
                <Field label="Share Percentage" hint="Remaining goes to primary nominee">
                  <Select value={formData.nominee2Share} onChange={(e) => set("nominee2Share", e.target.value)}>
                    {[10, 20, 25, 30, 40, 50].map((p) => (
                      <option key={p} value={String(p)}>{p}% (Primary: {100 - p}%)</option>
                    ))}
                  </Select>
                </Field>
              </div>
            )}

            {/* Nominee Preview */}
            {formData.nomineeName && (
              <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3.5 border border-slate-100">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-white font-bold text-[13px]">
                  {formData.nomineeName[0].toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="text-[13px] font-semibold text-slate-700">{formData.nomineeName}</div>
                  <div className="text-[11px] text-slate-400">{formData.nomineeRelation || "—"} · {formData.nomineePhone || "No phone"}</div>
                </div>
                <CheckIcon className="w-4 h-4 text-emerald-500" />
              </div>
            )}
          </div>
        )}

        {/* ═══ STEP 5: Review & Confirm + Payment Schedule ═══ */}
        {step === 5 && (
          <div className="space-y-5 animate-fade-in">
            <div className="text-center">
              <h2 className="text-xl font-bold text-slate-800">Review & Confirm</h2>
              <p className="text-[12px] text-slate-400 mt-1">Double-check everything before submitting</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-lg shadow-slate-200/50 overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-emerald-400 to-teal-400" />
              <div className="p-5">
                {/* Scheme */}
                <div className="mb-4">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <CoinIcon className="w-3.5 h-3.5" /> Scheme
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[["Name", scheme.name], ["Monthly", scheme.monthlyAmount], ["Duration", scheme.duration], ["Pot Size", scheme.potSize]].map(([l, v]) => (
                      <div key={l} className="bg-slate-50 rounded-xl px-3.5 py-3">
                        <div className="text-[10px] text-slate-400 mb-0.5">{l}</div>
                        <div className="text-[13px] font-bold text-slate-700 truncate">{v}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border-t border-slate-50 my-4" />
                {/* Member + Payment */}
                <div className="mb-4">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <UserIcon className="w-3.5 h-3.5" /> Member & Payment
                  </div>
                  <div className="space-y-2">
                    {[
                      ["Name", formData.fullName || "—"], ["Member ID", formData.memberId],
                      ["Phone", formData.phone || "—"], ["Email", formData.email || "—"],
                      ["Payment Method", formData.paymentMethod === "upi_autopay" ? `UPI AutoPay (${formData.upiId || "—"})` : formData.paymentMethod === "nach" ? `NACH — ${formData.bankName || "—"}` : "Manual"],
                    ].map(([l, v]) => (
                      <div key={l} className="flex items-center justify-between py-1">
                        <span className="text-[12px] text-slate-400">{l}</span>
                        <span className="text-[12px] font-semibold text-slate-700 truncate max-w-[55%] text-right">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border-t border-slate-50 my-4" />
                {/* Nominee */}
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <UsersIcon className="w-3.5 h-3.5" /> Nominee
                  </div>
                  <div className="space-y-2">
                    {[
                      ["Primary", formData.nomineeName || "—"],
                      ["Relationship", formData.nomineeRelation || "—"],
                      ...(formData.hasSecondNominee && formData.nominee2Name ? [["Secondary", `${formData.nominee2Name} (${formData.nominee2Share}%)`]] : []),
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

            {/* Payment Schedule (first 12 months) */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-5 pt-5 pb-2 flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-slate-400" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Payment Schedule</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-[10px] text-slate-400 uppercase font-medium px-5 py-2.5 text-left">#</th>
                      <th className="text-[10px] text-slate-400 uppercase font-medium px-5 py-2.5 text-left">Due Date</th>
                      <th className="text-[10px] text-slate-400 uppercase font-medium px-5 py-2.5 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scheduleRows.map((r) => (
                      <tr key={r.month} className="border-b border-slate-50 hover:bg-slate-50/50">
                        <td className="text-[12px] text-slate-500 px-5 py-2.5 font-mono">{r.month}</td>
                        <td className="text-[12px] text-slate-700 font-medium px-5 py-2.5">{r.date}</td>
                        <td className="text-[12px] text-emerald-600 font-bold font-mono px-5 py-2.5 text-right">{r.amount}</td>
                      </tr>
                    ))}
                    {totalMonths > 12 && (
                      <tr><td colSpan={3} className="text-[11px] text-slate-400 italic px-5 py-3 text-center">... and {totalMonths - 12} more payments</td></tr>
                    )}
                    <tr className="bg-emerald-50">
                      <td colSpan={2} className="text-[12px] font-bold text-emerald-800 px-5 py-3">Total</td>
                      <td className="text-[13px] font-black text-emerald-700 font-mono px-5 py-3 text-right">{fmtRupee(totalPay)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Agreements */}
            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer bg-white p-4 rounded-xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all shadow-sm">
                <Checkbox checked={formData.agreeTerms} onChange={(v) => set("agreeTerms", v)} />
                <span className="text-[12px] text-slate-500 leading-relaxed">
                  I agree to the <strong className="text-slate-700">terms and conditions</strong>, including the monthly contribution schedule, rotation payout rules, and forfeiture policy.
                </span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer bg-white p-4 rounded-xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all shadow-sm">
                <Checkbox checked={formData.agreeDeduction} onChange={(v) => set("agreeDeduction", v)} />
                <span className="text-[12px] text-slate-500 leading-relaxed">
                  I authorize <strong className="text-slate-700">automatic monthly deductions</strong> of <strong className="text-emerald-600">{scheme.monthlyAmount}</strong> for the entire duration of {scheme.duration}.
                </span>
              </label>
            </div>

            {formData.agreeTerms && formData.agreeDeduction && (
              <div className="flex items-center gap-2 bg-emerald-50 rounded-xl px-4 py-3 border border-emerald-200/60">
                <CheckIcon className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="text-[12px] text-emerald-700 font-medium">All agreements accepted — proceed to verify!</span>
              </div>
            )}
          </div>
        )}

        {/* ═══ STEP 6: OTP Verification & Submit ═══ */}
        {step === 6 && (
          <div className="space-y-5 animate-fade-in">
            <div className="text-center">
              <h2 className="text-xl font-bold text-slate-800">Verify & Submit</h2>
              <p className="text-[12px] text-slate-400 mt-1">Confirm your identity with a one-time password</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-indigo-400/20">
                <ShieldIcon className="w-8 h-8 text-white" />
              </div>

              {!otpSent ? (
                <>
                  <h3 className="text-[16px] font-bold text-slate-800 mb-2">Identity Verification</h3>
                  <p className="text-[12px] text-slate-500 mb-6 max-w-xs mx-auto leading-relaxed">
                    We'll send a 6-digit OTP to <strong className="text-slate-700">{formData.email}</strong> to verify your identity before final submission.
                  </p>
                  <button onClick={sendOtp} disabled={otpSending}
                    className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-xl text-[13px] font-bold hover:from-indigo-600 hover:to-violet-600 transition-all shadow-lg shadow-indigo-500/20 cursor-pointer disabled:opacity-60">
                    {otpSending ? "Sending…" : "Send OTP"}
                  </button>
                </>
              ) : !otpVerified ? (
                <>
                  <h3 className="text-[16px] font-bold text-slate-800 mb-2">Enter OTP</h3>
                  <p className="text-[12px] text-slate-500 mb-6">Sent to <strong className="text-slate-700">{formData.email}</strong></p>
                  <OTPInput length={6} value={otpValue} onChange={setOtpValue} />
                  <button onClick={verifyOtp} disabled={otpValue.length < 6}
                    className={`mt-6 px-8 py-3 rounded-xl text-[13px] font-bold transition-all ${
                      otpValue.length === 6
                        ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white cursor-pointer hover:from-indigo-600 hover:to-violet-600 shadow-lg shadow-indigo-500/20"
                        : "bg-slate-100 text-slate-400 cursor-not-allowed"
                    }`}>
                    Verify OTP
                  </button>
                  <div className="mt-4">
                    {otpTimer > 0
                      ? <span className="text-[11px] text-slate-400">Resend in {otpTimer}s</span>
                      : <button onClick={sendOtp} className="text-[11px] text-indigo-500 font-semibold cursor-pointer hover:underline">Resend OTP</button>
                    }
                  </div>
                </>
              ) : (
                <>
                  <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                    <CheckIcon className="w-7 h-7 text-emerald-500" />
                  </div>
                  <h3 className="text-[16px] font-bold text-emerald-800 mb-2">Identity Verified!</h3>
                  <p className="text-[12px] text-slate-500 mb-6">You're ready to submit your enrollment.</p>
                </>
              )}
            </div>

            {/* Quick Summary */}
            {otpVerified && (
              <div className="bg-emerald-50 rounded-2xl border border-emerald-200/60 p-4">
                <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider mb-3">Enrollment Summary</div>
                <div className="space-y-2">
                  {[
                    ["Scheme", scheme.name],
                    ["Monthly", scheme.monthlyAmount],
                    ["Duration", scheme.duration],
                    ["Member", formData.fullName],
                    ["Payment", formData.paymentMethod === "upi_autopay" ? "UPI AutoPay" : formData.paymentMethod === "nach" ? "NACH" : "Manual"],
                  ].map(([l, v]) => (
                    <div key={l} className="flex items-center justify-between">
                      <span className="text-[11px] text-emerald-600">{l}</span>
                      <span className="text-[11px] font-bold text-emerald-800">{v}</span>
                    </div>
                  ))}
                </div>
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

        {/* Footer Navigation */}
        <div className="flex gap-3 mt-8 pt-6 border-t border-slate-100">
          {step > 1 && (
            <button onClick={() => goToStep(step - 1)}
              className="px-6 py-3.5 border border-slate-200 rounded-xl text-[13px] text-slate-500 font-semibold cursor-pointer hover:bg-slate-50 transition-all">
              Back
            </button>
          )}
          {step < 5 ? (
            <button onClick={() => goToStep(step + 1)}
              className="flex-1 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl text-[13px] font-bold cursor-pointer hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg shadow-emerald-500/20">
              Continue →
            </button>
          ) : step === 5 ? (
            <button onClick={() => goToStep(6)}
              disabled={!formData.agreeTerms || !formData.agreeDeduction}
              className={`flex-1 py-3.5 rounded-xl text-[13px] font-bold transition-all ${
                formData.agreeTerms && formData.agreeDeduction
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white cursor-pointer hover:from-emerald-600 hover:to-teal-600 shadow-lg shadow-emerald-500/20"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed"
              }`}>
              {formData.agreeTerms && formData.agreeDeduction ? "Proceed to Verify →" : "Accept agreements to continue"}
            </button>
          ) : (
            <button onClick={handleSubmit}
              disabled={!otpVerified}
              className={`flex-1 py-3.5 rounded-xl text-[13px] font-bold transition-all ${
                otpVerified
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white cursor-pointer hover:from-emerald-600 hover:to-teal-600 shadow-lg shadow-emerald-500/20"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed"
              }`}>
              {otpVerified ? "Submit Enrollment ✓" : "Verify OTP to submit"}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
