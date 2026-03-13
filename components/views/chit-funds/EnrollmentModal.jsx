"use client";

import { useState } from "react";
import { members } from "@/data/mockData";

export default function EnrollmentModal({ scheme, onClose }) {
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
            <span className="text-3xl text-emerald-500">&#10003;</span>
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
              &#10005;
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
