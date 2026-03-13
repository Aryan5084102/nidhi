"use client";

import SectionCard from "@/components/ui/SectionCard";

/* ─── Inline Data: Roles & Permissions ─── */
const roleDefinitions = [
  {
    name: "Super Admin", description: "Full system access with ability to manage all configurations, users, and override any restriction.", userCount: 1,
    permissions: {
      Members: ["Read", "Write", "Delete"], Loans: ["Read", "Write", "Delete"], Deposits: ["Read", "Write", "Delete"],
      "Chit Funds": ["Read", "Write", "Delete"], Compliance: ["Read", "Write", "Delete"], Reports: ["Read", "Write", "Delete"],
      Config: ["Read", "Write", "Delete"], "AI Agents": ["Read", "Write", "Delete"],
    },
  },
  {
    name: "Admin", description: "Administrative access to manage operations, users, and most configurations. Cannot delete system-level configs.", userCount: 2,
    permissions: {
      Members: ["Read", "Write", "Delete"], Loans: ["Read", "Write"], Deposits: ["Read", "Write"],
      "Chit Funds": ["Read", "Write"], Compliance: ["Read", "Write"], Reports: ["Read", "Write"],
      Config: ["Read", "Write"], "AI Agents": ["Read", "Write"],
    },
  },
  {
    name: "Branch Manager", description: "Manages branch-level operations including member onboarding, loan approvals, and deposit accounts.", userCount: 2,
    permissions: {
      Members: ["Read", "Write"], Loans: ["Read", "Write"], Deposits: ["Read", "Write"],
      "Chit Funds": ["Read", "Write"], Compliance: ["Read"], Reports: ["Read"],
      Config: ["Read"], "AI Agents": ["Read"],
    },
  },
  {
    name: "Operations", description: "Handles day-to-day operations such as processing deposits, loan EMIs, and member queries.", userCount: 3,
    permissions: {
      Members: ["Read", "Write"], Loans: ["Read"], Deposits: ["Read", "Write"],
      "Chit Funds": ["Read"], Compliance: ["Read"], Reports: ["Read"],
      Config: [], "AI Agents": ["Read"],
    },
  },
  {
    name: "Loan Officer", description: "Manages loan applications, approvals, disbursements, and recovery operations.", userCount: 4,
    permissions: {
      Members: ["Read"], Loans: ["Read", "Write"], Deposits: ["Read"],
      "Chit Funds": [], Compliance: ["Read"], Reports: ["Read"],
      Config: [], "AI Agents": ["Read"],
    },
  },
  {
    name: "Compliance Officer", description: "Monitors regulatory compliance, audit trails, and filing requirements under Nidhi Rules.", userCount: 2,
    permissions: {
      Members: ["Read"], Loans: ["Read"], Deposits: ["Read"],
      "Chit Funds": ["Read"], Compliance: ["Read", "Write"], Reports: ["Read", "Write"],
      Config: ["Read"], "AI Agents": ["Read"],
    },
  },
  {
    name: "Viewer", description: "Read-only access to dashboards and reports. Cannot modify any data or configurations.", userCount: 2,
    permissions: {
      Members: ["Read"], Loans: ["Read"], Deposits: ["Read"],
      "Chit Funds": ["Read"], Compliance: ["Read"], Reports: ["Read"],
      Config: [], "AI Agents": [],
    },
  },
];

const modules = ["Members", "Loans", "Deposits", "Chit Funds", "Compliance", "Reports", "Config", "AI Agents"];

const permBadge = (perm) => {
  if (perm === "Read") return "bg-emerald-50 text-emerald-600 border-emerald-200/60";
  if (perm === "Write") return "bg-amber-50 text-amber-600 border-amber-200/60";
  if (perm === "Delete") return "bg-red-50 text-red-500 border-red-200/60";
  return "bg-slate-100 text-slate-500 border-slate-200";
};

export default function RolesPermissionsTab() {
  return (
    <div className="animate-fade-in">
      <SectionCard className="mb-5">
        <h3 className="text-[15px] font-bold text-slate-900 mb-1">Roles & Permissions</h3>
        <p className="text-[13px] text-slate-400">Define access levels and permission sets for each role in the organization.</p>
      </SectionCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
        {roleDefinitions.map((role) => (
          <div key={role.name} className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="text-[14px] font-bold text-slate-900">{role.name}</h4>
                <p className="text-[11px] text-slate-400 mt-0.5 max-w-xs">{role.description}</p>
              </div>
              <span className="text-[11px] whitespace-nowrap font-semibold px-2.5 py-0.5 rounded-full border bg-indigo-50 text-indigo-600 border-indigo-200/60">
                {role.userCount} {role.userCount === 1 ? "user" : "users"}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {modules.map((mod) => {
                const perms = role.permissions[mod] || [];
                if (perms.length === 0) return null;
                return (
                  <div key={mod} className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 mr-0.5">{mod}:</span>
                    {perms.map((p) => (
                      <span key={`${mod}-${p}`} className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${permBadge(p)}`}>
                        {p}
                      </span>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <SectionCard className="mb-4">
        <h3 className="text-[15px] font-bold text-slate-900 mb-1">Permission Matrix</h3>
        <p className="text-[13px] text-slate-400">Overview of all roles and their access across modules.</p>
      </SectionCard>

      <div className="bg-white rounded-2xl card-shadow border border-slate-100 overflow-hidden overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Module</th>
              {roleDefinitions.map((r) => (
                <th key={r.name} className="text-left whitespace-nowrap text-[11px] text-slate-400 uppercase tracking-wider font-medium px-3 py-3">{r.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {modules.map((mod) => (
              <tr key={mod} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-3 text-[12px] font-semibold text-slate-700">{mod}</td>
                {roleDefinitions.map((role) => {
                  const perms = role.permissions[mod] || [];
                  return (
                    <td key={`${role.name}-${mod}`} className="px-3 py-3">
                      <div className="flex gap-1 ">
                        {perms.length === 0 ? (
                          <span className="text-[10px] text-slate-300">--</span>
                        ) : (
                          perms.map((p) => (
                            <span key={p} className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${permBadge(p)}`}>{p}</span>
                          ))
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
