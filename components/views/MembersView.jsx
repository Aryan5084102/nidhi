"use client";

import { useState } from "react";
import STIBadge from "../badges/STIBadge";
import RiskBadge from "../badges/RiskBadge";
import { members } from "@/data/mockData";

const filterOptions = ["All", "Low", "Medium", "High"];

export default function MembersView() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filtered = members.filter(
    (m) =>
      (filter === "All" || m.risk === filter) &&
      m.name.toLowerCase().includes(search.toLowerCase())
  );

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
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search members..."
            className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-3 pl-9 text-slate-700 text-[13px] outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 transition-all placeholder:text-slate-300"
          />
        </div>

        {filterOptions.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-xl px-4 py-2 text-xs cursor-pointer transition-all duration-150 border ${
              filter === f
                ? "bg-indigo-50 border-indigo-300 text-indigo-600 font-semibold"
                : "bg-white border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600"
            }`}
          >
            {f}
          </button>
        ))}

        <button className="bg-emerald-50 border border-emerald-300 rounded-xl px-4 py-2 text-emerald-600 text-xs font-semibold cursor-pointer hover:bg-emerald-100 transition-colors">
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
              {filtered.map((m, i) => (
                <tr
                  key={i}
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
                      <button className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-[10px] text-slate-500 cursor-pointer hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all">
                        View
                      </button>
                      <button className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-[10px] text-slate-500 cursor-pointer hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all">
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-slate-100 flex justify-between items-center">
          <span className="text-xs text-slate-400">
            Showing {filtered.length} of {members.length} members
          </span>
          <div className="flex gap-1.5">
            {["←", "1", "2", "3", "→"].map((b) => (
              <button
                key={b}
                className={`rounded-lg px-2 py-1 text-[11px] min-w-7 cursor-pointer transition-all border ${
                  b === "1"
                    ? "bg-indigo-50 border-indigo-300 text-indigo-600 font-semibold"
                    : "bg-white border-slate-200 text-slate-400 hover:text-slate-600"
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
