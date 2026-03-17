"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { members } from "@/data/mockData";
import ProgressBar from "@/components/ui/ProgressBar";

const ENROLLMENT_KEY = "glimmora_member_enrollments";

function saveEnrollment(memberId, schemeId) {
  const data = JSON.parse(localStorage.getItem(ENROLLMENT_KEY) || "{}");
  const existing = data[memberId] || [];
  if (!existing.includes(schemeId)) {
    data[memberId] = [...existing, schemeId];
    localStorage.setItem(ENROLLMENT_KEY, JSON.stringify(data));
  }
  return data[memberId];
}

export default function EnrollChitFundView({ onNavigate }) {
  const { user } = useAuth();
  const memberId = user?.memberId || "M-1001";
  const member = members.find((m) => m.id === memberId) || members[0];

  const [scheme, setScheme] = useState(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    memberId: memberId,
    fullName: member?.name || "",
    phone: member?.phone || "",
    email: member?.email || "",
    nomineeName: "",
    nomineeRelation: "",
    nomineePhone: "",
    agreeTerms: false,
    agreeDeduction: false,
  });
  const [processing, setProcessing] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("glimmora_enroll_scheme");
      if (stored) {
        setScheme(JSON.parse(stored));
      }
    } catch {
      // invalid JSON
    }
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setSubmitted(true);
      if (scheme) {
        saveEnrollment(memberId, scheme.id);
      }
    }, 2000);
  };

  if (!scheme) {
    return (
      <div className="animate-fade-in">
        <div className="max-w-lg mx-auto px-4 py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-slate-50 border-2 border-slate-200 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-heading" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
          </div>
          <h2 className="text-[18px] font-bold text-heading mb-2">No scheme selected</h2>
          <p className="text-[13px] text-heading mb-6">Please go back and select a chit fund scheme to enroll in.</p>
          <button onClick={() => onNavigate("my_chitfunds")} className="px-6 py-3 bg-primary text-white rounded-xl text-[13px] font-semibold hover:bg-primary-700 transition-all cursor-pointer">
            Back to My Chit Funds
          </button>
        </div>
      </div>
    );
  }

  const totalMonths = parseInt(scheme.duration) || 0;
  const spotsLeft = scheme.totalMembers - scheme.enrolledMembers;
  const fillPct = (scheme.enrolledMembers / scheme.totalMembers) * 100;

  const steps = [
    { num: 1, label: "Scheme Details" },
    { num: 2, label: "Your Info" },
    { num: 3, label: "Nominee" },
    { num: 4, label: "Review & Confirm" },
  ];

  return (
    <div className="animate-fade-in">
      {/* Top Bar */}
      <div className="bg-white border-b border-slate-100 px-4 sm:px-6 py-3 mb-6">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => onNavigate("my_chitfunds")} className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-heading hover:text-body hover:bg-slate-100 cursor-pointer transition-all">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
            </button>
            <div className="w-10 h-10 rounded-xl bg-success-50 border border-success-200/60 flex items-center justify-center">
              <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
            </div>
            <div>
              <div className="text-[14px] font-bold text-heading">Enroll in Chit Fund</div>
              <div className="text-[11px] text-heading">{scheme.name} · {scheme.monthlyAmount}/month</div>
            </div>
          </div>
        </div>
      </div>

      {/* Success State */}
      {submitted ? (
        <div className="max-w-lg mx-auto px-4 py-16 text-center">
          <div className="w-20 h-20 rounded-full bg-success-50 border-2 border-success-200 flex items-center justify-center mx-auto mb-6 animate-bounce">
            <svg className="w-10 h-10 text-success-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
          </div>
          <h2 className="text-[22px] font-bold text-heading mb-2">Enrollment Successful!</h2>
          <p className="text-[13px] text-heading mb-8 max-w-sm mx-auto">
            Your request to join <strong className="text-body">{scheme.name}</strong> has been submitted.
            Our AI Onboarding Agent will verify your eligibility within 24 hours.
          </p>

          <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100 text-left mb-6">
            <div className="text-[10px] text-heading uppercase tracking-wider mb-3">Enrollment Summary</div>
            <div className="space-y-2.5">
              {[
                ["Enrollment ID", `EN-${Date.now().toString().slice(-6)}`],
                ["Scheme", scheme.name],
                ["Monthly Contribution", scheme.monthlyAmount],
                ["Duration", scheme.duration],
                ["Pot Size", scheme.potSize],
                ["Member", formData.fullName],
                ["Nominee", formData.nomineeName || "—"],
                ["Status", null],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-[12px] text-heading">{label}</span>
                  {value ? (
                    <span className="text-[12px] font-semibold text-body">{value}</span>
                  ) : (
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-warning-50 text-warning border border-warning-200/60">Pending Verification</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button onClick={() => onNavigate("my_chitfunds")} className="w-full max-w-sm py-3 bg-primary text-white rounded-xl text-[13px] font-semibold hover:bg-primary-700 transition-all cursor-pointer">
            Back to My Chit Funds
          </button>
        </div>

      ) : processing ? (
        /* Processing State */
        <div className="max-w-lg mx-auto px-4 py-24 text-center">
          <div className="w-16 h-16 rounded-full border-4 border-slate-200 border-t-success animate-spin mx-auto mb-6" />
          <h3 className="text-[16px] font-bold text-heading mb-2">Processing Your Enrollment</h3>
          <p className="text-[12px] text-heading">Verifying KYC status and scheme eligibility...</p>
        </div>

      ) : (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
          {/* Step Progress */}
          <div className="flex items-center justify-center gap-1 mb-8">
            {steps.map((s, i) => (
              <div key={s.num} className="flex items-center gap-1">
                <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[10px] font-semibold transition-all ${step >= s.num ? "bg-success text-white" : "bg-slate-100 text-heading"}`}>
                  {step > s.num ? (
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                  ) : (
                    <span>{s.num}</span>
                  )}
                  <span className="hidden sm:inline">{s.label}</span>
                </div>
                {i < steps.length - 1 && <div className={`w-6 sm:w-12 h-0.5 ${step > s.num ? "bg-success" : "bg-slate-200"}`} />}
              </div>
            ))}
          </div>

          {/* STEP 1: Scheme Details */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-2">
                <h2 className="text-[18px] font-bold text-heading">Scheme Overview</h2>
                <p className="text-[12px] text-heading mt-1">Review the scheme details before proceeding</p>
              </div>

              {/* Scheme Hero Card */}
              <div className="bg-gradient-to-br from-success via-success-700 to-teal-700 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-[18px] font-bold">{scheme.name}</div>
                    <div className="text-[11px] text-success-200 font-mono">{scheme.id}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-success-200 uppercase tracking-wider">Monthly</div>
                    <div className="text-[22px] font-bold font-mono">{scheme.monthlyAmount}</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-[10px] text-success-200">Duration</div>
                    <div className="text-[15px] font-bold">{scheme.duration}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-success-200">Pot Size</div>
                    <div className="text-[15px] font-bold font-mono">{scheme.potSize}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-success-200">Members</div>
                    <div className="text-[15px] font-bold">{scheme.enrolledMembers}/{scheme.totalMembers}</div>
                  </div>
                </div>
              </div>

              <p className="text-[13px] text-slate-500 leading-relaxed">{scheme.description}</p>

              {/* How it Works */}
              <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
                <div className="text-[10px] text-heading uppercase tracking-wider mb-4">How Rotation Chit Fund Works</div>
                <div className="space-y-4">
                  {[
                    { num: "1", title: "Monthly Contribution", desc: `All ${scheme.totalMembers} members contribute ${scheme.monthlyAmount} every month`, color: "indigo" },
                    { num: "2", title: "Pot Collection", desc: `Total pot of ${scheme.potSize} is collected each month from all members`, color: "emerald" },
                    { num: "3", title: "Rotation Payout", desc: "Each month, one member receives the full pot on rotation basis", color: "purple" },
                    { num: "4", title: "Complete Cycle", desc: `After ${scheme.duration}, every member will have received the pot once`, color: "amber" },
                  ].map((item) => (
                    <div key={item.num} className="flex items-start gap-4">
                      <div className={`w-9 h-9 rounded-xl bg-${item.color}-50 border border-${item.color}-200/60 flex items-center justify-center text-[12px] font-bold text-${item.color}-600 shrink-0`}>
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

              {/* Availability */}
              <div className="flex items-center justify-between bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div>
                  <div className="text-[12px] font-semibold text-body">{spotsLeft} spots remaining</div>
                  <div className="text-[11px] text-heading">{scheme.enrolledMembers} of {scheme.totalMembers} enrolled</div>
                </div>
                <div className="w-32">
                  <ProgressBar value={scheme.enrolledMembers} max={scheme.totalMembers} color="#6366F1" />
                </div>
              </div>

              {/* Eligibility Check */}
              <div className={`rounded-2xl p-4 border ${member.sti >= scheme.minSTI ? "bg-success-50 border-success-200/60" : "bg-danger-50 border-danger-200/60"}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${member.sti >= scheme.minSTI ? "bg-success-100" : "bg-danger-100"}`}>
                    {member.sti >= scheme.minSTI ? (
                      <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
                    ) : (
                      <svg className="w-5 h-5 text-danger-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
                    )}
                  </div>
                  <div>
                    <div className={`text-[13px] font-semibold ${member.sti >= scheme.minSTI ? "text-success-700" : "text-danger"}`}>
                      {member.sti >= scheme.minSTI ? "You're eligible for this scheme!" : "STI score below minimum"}
                    </div>
                    <div className="text-[11px] text-heading mt-0.5">Your STI: {member.sti} · Required: {scheme.minSTI} · KYC: {member.kyc}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Your Info */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="text-center mb-2">
                <h2 className="text-[18px] font-bold text-heading">Your Information</h2>
                <p className="text-[12px] text-heading mt-1">Verify your details for enrollment</p>
              </div>

              {/* Pre-filled Info */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <div className="text-[10px] text-heading uppercase tracking-wider mb-4">From Your Profile</div>
                <div className="grid grid-cols-2 gap-4">
                  <div><div className="text-[10px] text-heading mb-1">Member ID</div><div className="text-[13px] font-mono font-semibold text-body">{formData.memberId}</div></div>
                  <div><div className="text-[10px] text-heading mb-1">STI Score</div><div className="text-[13px] font-bold" style={{ color: member.sti >= 80 ? "#059669" : member.sti >= 60 ? "#D97706" : "#DC2626" }}>{member.sti}/100</div></div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[12px] text-slate-500 mb-1.5 font-medium">Full Name</label>
                  <input value={formData.fullName} onChange={(e) => handleChange("fullName", e.target.value)} placeholder="Enter full name" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-body text-[13px] outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-500/10 transition-all" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[12px] text-slate-500 mb-1.5 font-medium">Phone Number</label>
                    <input value={formData.phone} onChange={(e) => handleChange("phone", e.target.value)} placeholder="+91 XXXXX XXXXX" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-body text-[13px] outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-500/10 transition-all" />
                  </div>
                  <div>
                    <label className="block text-[12px] text-slate-500 mb-1.5 font-medium">Email</label>
                    <input value={formData.email} onChange={(e) => handleChange("email", e.target.value)} placeholder="email@example.com" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-body text-[13px] outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-500/10 transition-all" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Nominee */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="text-center mb-2">
                <h2 className="text-[18px] font-bold text-heading">Nominee Details</h2>
                <p className="text-[12px] text-heading mt-1">Required as per Nidhi Company regulations</p>
              </div>

              <div className="bg-warning-50 rounded-2xl p-4 border border-warning-200/60">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-warning-100 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
                  </div>
                  <div>
                    <div className="text-[12px] font-semibold text-amber-800">Why do we need a nominee?</div>
                    <div className="text-[11px] text-amber-700 mt-0.5">The nominee will receive the chit fund benefits in case of unforeseen circumstances. This is mandatory under Nidhi Company rules.</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[12px] text-slate-500 mb-1.5 font-medium">Nominee Full Name</label>
                  <input value={formData.nomineeName} onChange={(e) => handleChange("nomineeName", e.target.value)} placeholder="Enter nominee's full name" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-body text-[13px] outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-500/10 transition-all" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[12px] text-slate-500 mb-1.5 font-medium">Relationship</label>
                    <select value={formData.nomineeRelation} onChange={(e) => handleChange("nomineeRelation", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-body text-[13px] outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-500/10 transition-all">
                      <option value="">Select...</option>
                      <option value="Spouse">Spouse</option>
                      <option value="Parent">Parent</option>
                      <option value="Child">Child</option>
                      <option value="Sibling">Sibling</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[12px] text-slate-500 mb-1.5 font-medium">Nominee Phone</label>
                    <input value={formData.nomineePhone} onChange={(e) => handleChange("nomineePhone", e.target.value)} placeholder="+91 XXXXX XXXXX" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-body text-[13px] outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-500/10 transition-all" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Review & Confirm */}
          {step === 4 && (
            <div className="space-y-5">
              <div className="text-center mb-2">
                <h2 className="text-[18px] font-bold text-heading">Review & Confirm</h2>
                <p className="text-[12px] text-heading mt-1">Verify all details before submitting</p>
              </div>

              {/* Summary Card */}
              <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100">
                  <div className="w-12 h-12 rounded-xl bg-success-50 border border-success-200/60 flex items-center justify-center">
                    <svg className="w-6 h-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                  </div>
                  <div>
                    <div className="text-[15px] font-bold text-heading">{scheme.name}</div>
                    <div className="text-[11px] text-heading">{scheme.monthlyAmount}/month · {scheme.duration} · Pot: {scheme.potSize}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  {[
                    ["Scheme", scheme.name],
                    ["Monthly Contribution", scheme.monthlyAmount],
                    ["Duration", scheme.duration],
                    ["Pot Size", scheme.potSize],
                    ["Total Members", `${scheme.totalMembers}`],
                    ["Member", formData.fullName],
                    ["Member ID", formData.memberId],
                    ["Phone", formData.phone],
                    ["Email", formData.email],
                    ["Nominee", formData.nomineeName || "—"],
                    ["Nominee Relation", formData.nomineeRelation || "—"],
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
                  <input type="checkbox" checked={formData.agreeTerms} onChange={(e) => handleChange("agreeTerms", e.target.checked)} className="mt-0.5 accent-success w-4 h-4" />
                  <span className="text-[12px] text-slate-500 leading-relaxed">I agree to the terms and conditions of the chit fund scheme, including rotation payout rules, foreman commission (5%), and forfeiture policy.</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-all">
                  <input type="checkbox" checked={formData.agreeDeduction} onChange={(e) => handleChange("agreeDeduction", e.target.checked)} className="mt-0.5 accent-success w-4 h-4" />
                  <span className="text-[12px] text-slate-500 leading-relaxed">I authorize automatic monthly deductions of <strong className="text-body">{scheme.monthlyAmount}</strong> from my linked account for the entire scheme duration of {scheme.duration}.</span>
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
            {step < 4 ? (
              <button onClick={() => setStep(step + 1)} className="flex-1 py-3 bg-success text-white rounded-xl text-[13px] font-semibold cursor-pointer hover:bg-success-700 transition-all">
                Continue
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={!formData.agreeTerms || !formData.agreeDeduction} className={`flex-1 py-3 rounded-xl text-[13px] font-semibold transition-all ${formData.agreeTerms && formData.agreeDeduction ? "bg-success text-white cursor-pointer hover:bg-success-700" : "bg-slate-100 text-subtle cursor-not-allowed"}`}>
                Submit Enrollment
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
