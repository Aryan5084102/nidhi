"use client";

import { useState } from "react";
import { chitSchemes, members } from "@/data/mockData";

function SchemeCard({ scheme, onEnroll }) {
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
        <div className="bg-slate-100 rounded-full h-1.5 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${fillPct}%`,
              background: isFull ? "#EF4444" : "#6366F1",
            }}
          />
        </div>
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

function EnrollmentModal({ scheme, onClose }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    memberId: "",
    fullName: "",
    phone: "",
    email: "",
    nomineeNam: "",
    nomineeRelation: "",
    agreeTerms: false,
    agreeDeduction: false,
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl animate-modal-in text-center border border-slate-100"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl text-emerald-500">✓</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            Enrollment Submitted
          </h3>
          <p className="text-[13px] text-slate-500 mb-2 leading-relaxed">
            Your request to join <strong className="text-slate-700">{scheme.name}</strong> has been
            submitted successfully.
          </p>
          <p className="text-[12px] text-slate-400 mb-6">
            Our AI Onboarding Agent will verify your eligibility and KYC status.
            You will receive a confirmation within 24 hours.
          </p>
          <div className="bg-slate-50 rounded-xl p-4 mb-6 text-left">
            <div className="text-[11px] text-slate-400 uppercase tracking-wider mb-2">
              Application Summary
            </div>
            <div className="flex justify-between text-[12px] mb-1">
              <span className="text-slate-400">Scheme</span>
              <span className="text-slate-700 font-medium">
                {scheme.name}
              </span>
            </div>
            <div className="flex justify-between text-[12px] mb-1">
              <span className="text-slate-400">Monthly</span>
              <span className="text-slate-700 font-mono">
                {scheme.monthlyAmount}
              </span>
            </div>
            <div className="flex justify-between text-[12px] mb-1">
              <span className="text-slate-400">Duration</span>
              <span className="text-slate-700">{scheme.duration}</span>
            </div>
            <div className="flex justify-between text-[12px]">
              <span className="text-slate-400">Status</span>
              <span className="text-amber-600 font-semibold">
                Pending Verification
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-indigo-50 border border-indigo-200 text-indigo-600 rounded-xl text-[13px] font-semibold cursor-pointer hover:bg-indigo-100 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-lg w-full shadow-xl animate-modal-in max-h-[90vh] overflow-y-auto border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Enroll in {scheme.name}
              </h3>
              <p className="text-[12px] text-slate-400 mt-1">
                {scheme.monthlyAmount}/month &middot; {scheme.duration} &middot;
                Pot: {scheme.potSize}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-300 hover:text-slate-500 transition-colors cursor-pointer text-lg leading-none"
            >
              ✕
            </button>
          </div>

          {/* Steps Indicator */}
          <div className="flex items-center gap-2 mt-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold transition-colors ${
                    step >= s
                      ? "bg-indigo-50 text-indigo-600 border border-indigo-200"
                      : "bg-slate-50 text-slate-300 border border-slate-200"
                  }`}
                >
                  {s}
                </div>
                <span
                  className={`text-[11px] ${
                    step >= s
                      ? "text-indigo-600 font-medium"
                      : "text-slate-300"
                  }`}
                >
                  {s === 1 ? "Member Info" : s === 2 ? "Nominee" : "Confirm"}
                </span>
                {s < 3 && (
                  <div
                    className={`flex-1 h-px ${
                      step > s ? "bg-indigo-200" : "bg-slate-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {step === 1 && (
            <div className="flex flex-col gap-4 animate-fade-in">
              <div>
                <label className="block text-[12px] text-slate-500 mb-1.5 font-medium">
                  Member ID
                </label>
                <select
                  value={formData.memberId}
                  onChange={(e) => {
                    handleChange("memberId", e.target.value);
                    const member = members.find(
                      (m) => m.id === e.target.value
                    );
                    if (member) handleChange("fullName", member.name);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-slate-700 text-[13px] outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 transition-all"
                >
                  <option value="">Select existing member...</option>
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.id} - {m.name} (STI: {m.sti})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[12px] text-slate-500 mb-1.5 font-medium">
                  Full Name
                </label>
                <input
                  value={formData.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  placeholder="Enter full name"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-slate-700 text-[13px] outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 transition-all placeholder:text-slate-300"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] text-slate-500 mb-1.5 font-medium">
                    Phone Number
                  </label>
                  <input
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-slate-700 text-[13px] outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 transition-all placeholder:text-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-[12px] text-slate-500 mb-1.5 font-medium">
                    Email
                  </label>
                  <input
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="email@example.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-slate-700 text-[13px] outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 transition-all placeholder:text-slate-300"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-4 animate-fade-in">
              <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-3 text-[12px] text-amber-700">
                Nominee details are mandatory as per Nidhi Company regulations.
                The nominee will receive the chit fund benefits in case of
                unforeseen circumstances.
              </div>
              <div>
                <label className="block text-[12px] text-slate-500 mb-1.5 font-medium">
                  Nominee Full Name
                </label>
                <input
                  value={formData.nomineeNam}
                  onChange={(e) => handleChange("nomineeNam", e.target.value)}
                  placeholder="Enter nominee name"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-slate-700 text-[13px] outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 transition-all placeholder:text-slate-300"
                />
              </div>
              <div>
                <label className="block text-[12px] text-slate-500 mb-1.5 font-medium">
                  Relationship
                </label>
                <select
                  value={formData.nomineeRelation}
                  onChange={(e) =>
                    handleChange("nomineeRelation", e.target.value)
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-slate-700 text-[13px] outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 transition-all"
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
          )}

          {step === 3 && (
            <div className="flex flex-col gap-4 animate-fade-in">
              {/* Summary */}
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="text-[11px] text-slate-400 uppercase tracking-wider mb-3 font-medium">
                  Enrollment Summary
                </div>
                <div className="flex flex-col gap-2">
                  {[
                    ["Scheme", scheme.name],
                    ["Monthly Contribution", scheme.monthlyAmount],
                    ["Duration", scheme.duration],
                    ["Pot Size", scheme.potSize],
                    ["Member", formData.fullName || "-"],
                    ["Nominee", formData.nomineeNam || "-"],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="flex justify-between text-[12px]"
                    >
                      <span className="text-slate-400">{label}</span>
                      <span className="text-slate-700 font-medium">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Agreements */}
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.agreeTerms}
                  onChange={(e) =>
                    handleChange("agreeTerms", e.target.checked)
                  }
                  className="mt-0.5 accent-indigo-500"
                />
                <span className="text-[12px] text-slate-500 leading-relaxed">
                  I agree to the terms and conditions of the chit fund scheme,
                  including the auction rules, foreman commission, and
                  forfeiture policy.
                </span>
              </label>
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.agreeDeduction}
                  onChange={(e) =>
                    handleChange("agreeDeduction", e.target.checked)
                  }
                  className="mt-0.5 accent-indigo-500"
                />
                <span className="text-[12px] text-slate-500 leading-relaxed">
                  I authorize automatic monthly deductions of{" "}
                  <strong className="text-slate-700">
                    {scheme.monthlyAmount}
                  </strong>{" "}
                  from my linked account for the entire scheme duration.
                </span>
              </label>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-6 pt-0 flex gap-3">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex-1 py-2.5 border border-slate-200 rounded-xl text-[13px] text-slate-500 font-medium cursor-pointer hover:bg-slate-50 transition-colors"
            >
              Back
            </button>
          )}
          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex-1 py-2.5 bg-indigo-50 border border-indigo-200 text-indigo-600 rounded-xl text-[13px] font-semibold cursor-pointer hover:bg-indigo-100 transition-colors"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!formData.agreeTerms || !formData.agreeDeduction}
              className={`flex-1 py-2.5 rounded-xl text-[13px] font-semibold transition-colors border ${
                formData.agreeTerms && formData.agreeDeduction
                  ? "bg-emerald-50 border-emerald-200 text-emerald-600 cursor-pointer hover:bg-emerald-100"
                  : "bg-slate-50 border-slate-200 text-slate-300 cursor-not-allowed"
              }`}
            >
              Submit Enrollment
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ChitFundsView() {
  const [enrollScheme, setEnrollScheme] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");

  const filtered = chitSchemes.filter(
    (s) => filterStatus === "All" || s.status === filterStatus
  );

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="bg-white rounded-2xl p-5 mb-5 card-shadow border border-slate-100">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-[16px] font-bold text-slate-900 mb-1">
              Chit Fund Schemes
            </h2>
            <p className="text-[13px] text-slate-400 leading-relaxed max-w-xl">
              Browse available chit fund schemes and enroll as a subscriber.
              Each scheme runs periodic auctions where members can bid for the
              pot. All schemes are governed by the Chit Funds Act, 1982.
            </p>
          </div>
          <div className="flex items-center gap-3 text-[12px]">
            <div className="bg-slate-50 rounded-xl px-3 py-2 text-center">
              <div className="text-lg font-bold text-indigo-600 font-mono">
                {chitSchemes.length}
              </div>
              <div className="text-slate-400 text-[10px]">Total Schemes</div>
            </div>
            <div className="bg-slate-50 rounded-xl px-3 py-2 text-center">
              <div className="text-lg font-bold text-emerald-600 font-mono">
                {chitSchemes.filter((s) => s.status === "Open").length}
              </div>
              <div className="text-slate-400 text-[10px]">Open for Enrollment</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-5">
        {["All", "Open", "Full"].map((f) => (
          <button
            key={f}
            onClick={() => setFilterStatus(f)}
            className={`rounded-xl px-4 py-2 text-xs cursor-pointer transition-all duration-150 border ${
              filterStatus === f
                ? "bg-indigo-50 border-indigo-300 text-indigo-600 font-semibold"
                : "bg-white border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600"
            }`}
          >
            {f === "All" ? "All Schemes" : f}
          </button>
        ))}
      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((scheme) => (
          <SchemeCard
            key={scheme.id}
            scheme={scheme}
            onEnroll={setEnrollScheme}
          />
        ))}
      </div>

      {/* Enrollment Modal */}
      {enrollScheme && (
        <EnrollmentModal
          scheme={enrollScheme}
          onClose={() => setEnrollScheme(null)}
        />
      )}
    </div>
  );
}
