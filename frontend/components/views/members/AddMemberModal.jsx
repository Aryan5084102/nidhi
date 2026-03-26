"use client";

import { useState } from "react";
import ModalBackdrop from "./ModalBackdrop";

export default function AddMemberModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    risk: "Low",
    kyc: "Pending",
    nomineeName: "",
    nomineeRelation: "",
    nomineeAadhaar: "",
    nomineePan: "",
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const inputClass = "w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-sm text-body outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-500/10 transition-all placeholder:text-subtle";
  const labelClass = "text-[11px] text-heading uppercase tracking-wide mb-1 block";

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-fade-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-800">Add New Member</h2>
          <button
            onClick={onClose}
            className="text-heading hover:text-body text-lg cursor-pointer"
          >
            ✕
          </button>
        </div>
        <div className="px-6 py-5 space-y-4 max-h-[65vh] overflow-y-auto">
          {/* Basic Info */}
          <div>
            <label className={labelClass}>Full Name *</label>
            <input
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Enter member name"
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Phone *</label>
              <input
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="9876543210"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="email@example.com"
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Address</label>
            <input
              value={form.address}
              onChange={(e) => handleChange("address", e.target.value)}
              placeholder="Enter address"
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Risk Level</label>
              <select
                value={form.risk}
                onChange={(e) => handleChange("risk", e.target.value)}
                className={`${inputClass} cursor-pointer`}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>KYC Status</label>
              <select
                value={form.kyc}
                onChange={(e) => handleChange("kyc", e.target.value)}
                className={`${inputClass} cursor-pointer`}
              >
                <option value="Verified">Verified</option>
                <option value="Pending">Pending</option>
                <option value="Review">Review</option>
              </select>
            </div>
          </div>

          {/* Nominee Details — Chit Funds Act Requirement */}
          <div className="pt-3 border-t border-slate-100">
            <h4 className="text-[12px] font-bold text-heading uppercase tracking-wider mb-3">Nominee Details</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Nominee Name</label>
                <input
                  value={form.nomineeName}
                  onChange={(e) => handleChange("nomineeName", e.target.value)}
                  placeholder="Full name of nominee"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Relation</label>
                <select
                  value={form.nomineeRelation}
                  onChange={(e) => handleChange("nomineeRelation", e.target.value)}
                  className={`${inputClass} cursor-pointer`}
                >
                  <option value="">Select</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Father">Father</option>
                  <option value="Mother">Mother</option>
                  <option value="Son">Son</option>
                  <option value="Daughter">Daughter</option>
                  <option value="Brother">Brother</option>
                  <option value="Sister">Sister</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Nominee Aadhaar</label>
                <input
                  value={form.nomineeAadhaar}
                  onChange={(e) => handleChange("nomineeAadhaar", e.target.value)}
                  placeholder="XXXX-XXXX-1234"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Nominee PAN</label>
                <input
                  value={form.nomineePan}
                  onChange={(e) => handleChange("nomineePan", e.target.value)}
                  placeholder="ABCDE1234F"
                  className={`${inputClass} uppercase`}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="bg-slate-100 text-body rounded-xl px-5 py-2 text-xs font-semibold cursor-pointer hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (form.name && form.phone) onSave(form);
            }}
            className="bg-success text-white rounded-xl px-5 py-2 text-xs font-semibold cursor-pointer hover:bg-success-700 transition-colors"
          >
            Add Member
          </button>
        </div>
      </div>
    </ModalBackdrop>
  );
}
