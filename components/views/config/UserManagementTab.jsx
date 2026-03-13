"use client";

import { useState } from "react";
import SectionCard from "@/components/ui/SectionCard";
import MetricGrid from "@/components/ui/MetricGrid";
import StatusBadge from "@/components/ui/StatusBadge";
import DataTable from "@/components/ui/DataTable";

/* ─── Inline Data: User Management ─── */
const adminUsers = [
  { id: "USR-001", name: "Arjun Mehta", email: "arjun.mehta@glimmora.in", role: "Super Admin", department: "IT", status: "Active", lastLogin: "11 Mar 2026, 09:12" },
  { id: "USR-002", name: "Priya Sharma", email: "priya.sharma@glimmora.in", role: "Admin", department: "Operations", status: "Active", lastLogin: "11 Mar 2026, 08:45" },
  { id: "USR-003", name: "Ramesh Gupta", email: "ramesh.gupta@glimmora.in", role: "Manager", department: "Branch - Jayanagar", status: "Active", lastLogin: "10 Mar 2026, 17:30" },
  { id: "USR-004", name: "Sunita Desai", email: "sunita.desai@glimmora.in", role: "Operator", department: "Loans", status: "Active", lastLogin: "11 Mar 2026, 10:05" },
  { id: "USR-005", name: "Kiran Patel", email: "kiran.patel@glimmora.in", role: "Viewer", department: "Compliance", status: "Inactive", lastLogin: "28 Feb 2026, 14:22" },
  { id: "USR-006", name: "Deepak Joshi", email: "deepak.joshi@glimmora.in", role: "Manager", department: "Branch - Koramangala", status: "Active", lastLogin: "10 Mar 2026, 16:48" },
  { id: "USR-007", name: "Anjali Reddy", email: "anjali.reddy@glimmora.in", role: "Operator", department: "Deposits", status: "Locked", lastLogin: "05 Mar 2026, 11:30" },
  { id: "USR-008", name: "Vikash Singh", email: "vikash.singh@glimmora.in", role: "Admin", department: "Risk & Fraud", status: "Active", lastLogin: "11 Mar 2026, 07:55" },
  { id: "USR-009", name: "Meera Krishnan", email: "meera.krishnan@glimmora.in", role: "Operator", department: "Chit Funds", status: "Active", lastLogin: "10 Mar 2026, 15:10" },
  { id: "USR-010", name: "Rohit Verma", email: "rohit.verma@glimmora.in", role: "Viewer", department: "Audit", status: "Inactive", lastLogin: "20 Feb 2026, 09:00" },
];

const roleBadge = (role) => {
  if (role === "Super Admin") return "bg-violet-50 text-violet-600 border-violet-200/60";
  if (role === "Admin") return "bg-indigo-50 text-indigo-600 border-indigo-200/60";
  if (role === "Manager") return "bg-blue-50 text-blue-600 border-blue-200/60";
  if (role === "Operator") return "bg-emerald-50 text-emerald-600 border-emerald-200/60";
  return "bg-slate-100 text-slate-500 border-slate-200";
};

const userColumns = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "role", label: "Role" },
  { key: "department", label: "Department" },
  { key: "status", label: "Status" },
  { key: "lastLogin", label: "Last Login" },
];

export default function UserManagementTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  const totalUsers = adminUsers.length;
  const activeUsers = adminUsers.filter((u) => u.status === "Active").length;
  const inactiveUsers = adminUsers.filter((u) => u.status === "Inactive").length;
  const lockedUsers = adminUsers.filter((u) => u.status === "Locked").length;

  const roles = ["All", "Super Admin", "Admin", "Manager", "Operator", "Viewer"];

  const filtered = adminUsers.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "All" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const metrics = [
    { label: "Total Users", value: totalUsers, color: "text-slate-700" },
    { label: "Active", value: activeUsers, color: "text-emerald-600" },
    { label: "Inactive", value: inactiveUsers, color: "text-amber-600" },
    { label: "Locked", value: lockedUsers, color: "text-red-500" },
  ];

  return (
    <div className="animate-fade-in">
      <SectionCard className="mb-5">
        <h3 className="text-[15px] font-bold text-slate-900 mb-1">User Management</h3>
        <p className="text-[13px] text-slate-400">Manage system users, assign roles, and control access across the Glimmora Nidhi platform.</p>
      </SectionCard>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {metrics.map((m) => (
          <div key={m.label} className="bg-white rounded-2xl p-5 card-shadow border border-slate-100 text-center">
            <div className={`text-2xl font-bold ${m.color}`}>{m.value}</div>
            <div className="text-[11px] text-slate-400 mt-1">{m.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-4 mb-5 card-shadow border border-slate-100 flex items-center flex-wrap justify-between gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-[13px] text-slate-700 w-72 outline-none focus:border-indigo-300 transition-colors"
          />
          <div className="flex gap-1.5 flex-wrap">
            {roles.map((r) => (
              <button key={r} onClick={() => setRoleFilter(r)}
                className={`rounded-xl px-3 py-1.5 text-[11px] whitespace-nowrap cursor-pointer transition-all border ${roleFilter === r ? "bg-indigo-50 border-indigo-300 text-indigo-600 font-semibold" : "bg-white border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600"}`}>
                {r}
              </button>
            ))}
          </div>
        </div>
        <button className="bg-indigo-500 hover:bg-indigo-600 text-white text-[12px] font-semibold px-4 py-2 rounded-xl cursor-pointer transition-colors">
          + Add User
        </button>
      </div>

      <DataTable
        columns={userColumns}
        data={filtered}
        renderRow={(u) => (
          <tr key={u.id} className="border-b whitespace-nowrap border-slate-50 hover:bg-slate-50/50 transition-colors">
            <td className="px-5 py-3 text-[12px] text-slate-500 font-mono">{u.id}</td>
            <td className="px-5 py-3 text-[13px] font-semibold text-slate-700">{u.name}</td>
            <td className="px-5 py-3 text-[12px] text-slate-500">{u.email}</td>
            <td className="px-5 py-3">
              <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${roleBadge(u.role)}`}>
                {u.role}
              </span>
            </td>
            <td className="px-5 py-3 text-[12px] text-slate-500">{u.department}</td>
            <td className="px-5 py-3">
              <StatusBadge status={u.status} />
            </td>
            <td className="px-5 py-3 text-[12px] text-slate-400">{u.lastLogin}</td>
          </tr>
        )}
      />
    </div>
  );
}
