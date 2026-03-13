"use client";

import { useState } from "react";
import ModalBackdrop from "./ModalBackdrop";

export default function EditMemberModal({ member, onClose, onSave }) {
  const [form, setForm] = useState({
    name: member.name,
    phone: member.phone || "",
    email: member.email || "",
    address: member.address || "",
    risk: member.risk,
    kyc: member.kyc,
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-fade-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-800">Edit Member — {member.id}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer"
          >
            ✕
          </button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="text-[11px] text-slate-400 uppercase tracking-wide mb-1 block">Name</label>
            <input
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 transition-all"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] text-slate-400 uppercase tracking-wide mb-1 block">Phone</label>
              <input
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 transition-all"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 uppercase tracking-wide mb-1 block">Email</label>
              <input
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 transition-all"
              />
            </div>
          </div>
          <div>
            <label className="text-[11px] text-slate-400 uppercase tracking-wide mb-1 block">Address</label>
            <input
              value={form.address}
              onChange={(e) => handleChange("address", e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 transition-all"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] text-slate-400 uppercase tracking-wide mb-1 block">Risk Level</label>
              <select
                value={form.risk}
                onChange={(e) => handleChange("risk", e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 transition-all cursor-pointer"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] text-slate-400 uppercase tracking-wide mb-1 block">KYC Status</label>
              <select
                value={form.kyc}
                onChange={(e) => handleChange("kyc", e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 transition-all cursor-pointer"
              >
                <option value="Verified">Verified</option>
                <option value="Pending">Pending</option>
                <option value="Review">Review</option>
              </select>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="bg-slate-100 text-slate-600 rounded-xl px-5 py-2 text-xs font-semibold cursor-pointer hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            className="bg-indigo-600 text-white rounded-xl px-5 py-2 text-xs font-semibold cursor-pointer hover:bg-indigo-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </ModalBackdrop>
  );
}
