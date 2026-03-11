"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import STIBadge from "../badges/STIBadge";
import RiskBadge from "../badges/RiskBadge";
import { members } from "@/data/mockData";

const filterOptions = ["All", "Low", "Medium", "High"];
const ITEMS_PER_PAGE = 6;

// Modal backdrop component
function ModalBackdrop({ children, onClose }) {
  return createPortal(
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {children}
    </div>,
    document.body
  );
}

// View Member Modal
function ViewMemberModal({ member, onClose }) {
  return (
    <ModalBackdrop onClose={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-fade-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-800">Member Details</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer"
          >
            ✕
          </button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
              {member.name.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">{member.name}</p>
              <p className="text-xs text-slate-400 font-mono">{member.id}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[11px] text-slate-400 uppercase tracking-wide mb-1">Phone</p>
              <p className="text-sm text-slate-700">{member.phone || "—"}</p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400 uppercase tracking-wide mb-1">Email</p>
              <p className="text-sm text-slate-700">{member.email || "—"}</p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400 uppercase tracking-wide mb-1">Address</p>
              <p className="text-sm text-slate-700">{member.address || "—"}</p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400 uppercase tracking-wide mb-1">Join Date</p>
              <p className="text-sm text-slate-700">{member.joinDate || "—"}</p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400 uppercase tracking-wide mb-1">Deposits</p>
              <p className="text-sm font-mono text-emerald-600">{member.deposits}</p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400 uppercase tracking-wide mb-1">Loans</p>
              <p className="text-sm font-mono text-indigo-600">{member.loans}</p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400 uppercase tracking-wide mb-1">STI Score</p>
              <STIBadge score={member.sti} />
            </div>
            <div>
              <p className="text-[11px] text-slate-400 uppercase tracking-wide mb-1">Risk Level</p>
              <RiskBadge risk={member.risk} />
            </div>
            <div>
              <p className="text-[11px] text-slate-400 uppercase tracking-wide mb-1">KYC Status</p>
              <span
                className={`text-[11px] font-semibold ${
                  member.kyc === "Verified"
                    ? "text-emerald-600"
                    : member.kyc === "Pending"
                    ? "text-amber-600"
                    : "text-red-500"
                }`}
              >
                {member.kyc === "Verified" ? "✓ " : "⏳ "}
                {member.kyc}
              </span>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="bg-slate-100 text-slate-600 rounded-xl px-5 py-2 text-xs font-semibold cursor-pointer hover:bg-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </ModalBackdrop>
  );
}

// Edit Member Modal
function EditMemberModal({ member, onClose, onSave }) {
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

// Add Member Modal
function AddMemberModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    risk: "Low",
    kyc: "Pending",
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-fade-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-800">Add New Member</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer"
          >
            ✕
          </button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="text-[11px] text-slate-400 uppercase tracking-wide mb-1 block">Full Name *</label>
            <input
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Enter member name"
              className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 transition-all placeholder:text-slate-300"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] text-slate-400 uppercase tracking-wide mb-1 block">Phone *</label>
              <input
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="9876543210"
                className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 transition-all placeholder:text-slate-300"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 uppercase tracking-wide mb-1 block">Email</label>
              <input
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="email@example.com"
                className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 transition-all placeholder:text-slate-300"
              />
            </div>
          </div>
          <div>
            <label className="text-[11px] text-slate-400 uppercase tracking-wide mb-1 block">Address</label>
            <input
              value={form.address}
              onChange={(e) => handleChange("address", e.target.value)}
              placeholder="Enter address"
              className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 transition-all placeholder:text-slate-300"
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
            onClick={() => {
              if (form.name && form.phone) onSave(form);
            }}
            className="bg-emerald-600 text-white rounded-xl px-5 py-2 text-xs font-semibold cursor-pointer hover:bg-emerald-700 transition-colors"
          >
            Add Member
          </button>
        </div>
      </div>
    </ModalBackdrop>
  );
}

export default function MembersView() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewMember, setViewMember] = useState(null);
  const [editMember, setEditMember] = useState(null);

  // Local members state for add/edit
  const [localMembers, setLocalMembers] = useState(members);

  const filtered = localMembers.filter(
    (m) =>
      (filter === "All" || m.risk === filter) &&
      m.name.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const paginatedMembers = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Reset to page 1 when search/filter changes
  const handleSearch = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };
  const handleFilter = (value) => {
    setFilter(value);
    setCurrentPage(1);
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  const handleAddMember = (form) => {
    const newId = `M-${1000 + localMembers.length + 1}`;
    const newMember = {
      id: newId,
      name: form.name,
      phone: form.phone,
      email: form.email,
      address: form.address,
      deposits: "₹0",
      loans: "₹0",
      risk: form.risk,
      sti: 50,
      kyc: form.kyc,
      joinDate: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
    };
    setLocalMembers((prev) => [newMember, ...prev]);
    setShowAddModal(false);
    setCurrentPage(1);
  };

  const handleEditSave = (form) => {
    setLocalMembers((prev) =>
      prev.map((m) =>
        m.id === editMember.id
          ? { ...m, name: form.name, phone: form.phone, email: form.email, address: form.address, risk: form.risk, kyc: form.kyc }
          : m
      )
    );
    setEditMember(null);
  };

  return (
    <div className="animate-fade-in">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 mb-5 items-center">
        <div className="flex-1 min-w-[200px] relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
            🔍
          </span>
          <input
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search members..."
            className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-3 pl-9 text-slate-700 text-[13px] outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 transition-all placeholder:text-slate-300"
          />
        </div>

        {filterOptions.map((f) => (
          <button
            key={f}
            onClick={() => handleFilter(f)}
            className={`rounded-xl px-4 py-2 text-xs cursor-pointer transition-all duration-150 border ${
              filter === f
                ? "bg-indigo-50 border-indigo-300 text-indigo-600 font-semibold"
                : "bg-white border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600"
            }`}
          >
            {f}
          </button>
        ))}

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-emerald-50 border border-emerald-300 rounded-xl px-4 py-2 text-emerald-600 text-xs font-semibold cursor-pointer hover:bg-emerald-100 transition-colors"
        >
          + Add Member
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl overflow-hidden card-shadow border border-slate-100">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {[
                  "Member ID",
                  "Name",
                  "Deposits",
                  "Loans",
                  "STI Score",
                  "Risk",
                  "KYC Status",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-[11px] text-slate-400 font-semibold uppercase tracking-wide"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedMembers.map((m, i) => (
                <tr
                  key={m.id}
                  className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors"
                >
                  <td className="px-4 py-3.5 font-mono text-xs text-slate-400">
                    {m.id}
                  </td>
                  <td className="px-4 py-3.5 text-[13px] text-slate-700 font-medium">
                    {m.name}
                  </td>
                  <td className="px-4 py-3.5 font-mono text-xs text-emerald-600">
                    {m.deposits}
                  </td>
                  <td className="px-4 py-3.5 font-mono text-xs text-indigo-600">
                    {m.loans}
                  </td>
                  <td className="px-4 py-3.5">
                    <STIBadge score={m.sti} />
                  </td>
                  <td className="px-4 py-3.5">
                    <RiskBadge risk={m.risk} />
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`text-[11px] font-semibold ${
                        m.kyc === "Verified"
                          ? "text-emerald-600"
                          : m.kyc === "Pending"
                          ? "text-amber-600"
                          : "text-red-500"
                      }`}
                    >
                      {m.kyc === "Verified" ? "✓ " : "⏳ "}
                      {m.kyc}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => setViewMember(m)}
                        className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-[10px] text-slate-500 cursor-pointer hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all"
                      >
                        View
                      </button>
                      <button
                        onClick={() => setEditMember(m)}
                        className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-[10px] text-slate-500 cursor-pointer hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all"
                      >
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedMembers.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-sm text-slate-400">
                    No members found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-slate-100 flex justify-between items-center">
          <span className="text-xs text-slate-400">
            Showing {filtered.length === 0 ? 0 : startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, filtered.length)} of {filtered.length} members
          </span>
          <div className="flex gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safeCurrentPage === 1}
              className={`rounded-lg px-2 py-1 text-[11px] min-w-7 cursor-pointer transition-all border ${
                safeCurrentPage === 1
                  ? "bg-white border-slate-100 text-slate-200 cursor-not-allowed"
                  : "bg-white border-slate-200 text-slate-400 hover:text-slate-600 hover:border-slate-300"
              }`}
            >
              ←
            </button>
            {getPageNumbers().map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`rounded-lg px-2 py-1 text-[11px] min-w-7 cursor-pointer transition-all border ${
                  page === safeCurrentPage
                    ? "bg-indigo-50 border-indigo-300 text-indigo-600 font-semibold"
                    : "bg-white border-slate-200 text-slate-400 hover:text-slate-600 hover:border-slate-300"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safeCurrentPage === totalPages}
              className={`rounded-lg px-2 py-1 text-[11px] min-w-7 cursor-pointer transition-all border ${
                safeCurrentPage === totalPages
                  ? "bg-white border-slate-100 text-slate-200 cursor-not-allowed"
                  : "bg-white border-slate-200 text-slate-400 hover:text-slate-600 hover:border-slate-300"
              }`}
            >
              →
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddMemberModal onClose={() => setShowAddModal(false)} onSave={handleAddMember} />
      )}
      {viewMember && (
        <ViewMemberModal member={viewMember} onClose={() => setViewMember(null)} />
      )}
      {editMember && (
        <EditMemberModal
          member={editMember}
          onClose={() => setEditMember(null)}
          onSave={handleEditSave}
        />
      )}
    </div>
  );
}
