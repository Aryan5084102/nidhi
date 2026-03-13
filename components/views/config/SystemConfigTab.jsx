"use client";

import SectionCard from "@/components/ui/SectionCard";
import StatusBadge from "@/components/ui/StatusBadge";
import DataTable from "@/components/ui/DataTable";

/* ─── Inline Data: System Configuration ─── */
const systemHealth = [
  { label: "Uptime", value: "99.97%", detail: "Last downtime: 02 Mar 2026, 02:15 (3 min)" },
  { label: "DB Size", value: "2.4 GB", detail: "PostgreSQL 15.4 | 142 tables" },
  { label: "Backup Status", value: "Healthy", detail: "Last backup: 11 Mar 2026, 02:00 IST" },
  { label: "API Response Time", value: "128 ms", detail: "Avg over last 24h | P99: 340 ms" },
];

const integrations = [
  { name: "Banking API (ICICI)", status: "Connected", lastSync: "11 Mar 2026, 09:00", provider: "ICICI Bank OpenAPI" },
  { name: "KYC Provider", status: "Connected", lastSync: "11 Mar 2026, 08:30", provider: "Digio / CKYC Registry" },
  { name: "SMS Gateway", status: "Connected", lastSync: "11 Mar 2026, 09:10", provider: "MSG91" },
  { name: "Email Service", status: "Degraded", lastSync: "10 Mar 2026, 22:15", provider: "AWS SES (ap-south-1)" },
  { name: "WhatsApp Business", status: "Connected", lastSync: "11 Mar 2026, 08:55", provider: "Meta Business API" },
];

const retentionPolicies = [
  { dataType: "Transaction Logs", retention: "7 years", lastPurge: "01 Jan 2026", status: "Active" },
  { dataType: "Audit Trails", retention: "10 years", lastPurge: "Never", status: "Active" },
  { dataType: "Session Logs", retention: "90 days", lastPurge: "01 Mar 2026", status: "Active" },
  { dataType: "Temporary Files", retention: "7 days", lastPurge: "10 Mar 2026", status: "Active" },
  { dataType: "Archived Members", retention: "5 years", lastPurge: "01 Jan 2026", status: "Active" },
];

const backupSchedule = [
  { type: "Full Database Backup", frequency: "Daily at 02:00 IST", lastRun: "11 Mar 2026, 02:00", size: "2.4 GB", status: "Success" },
  { type: "Incremental Backup", frequency: "Every 6 hours", lastRun: "11 Mar 2026, 08:00", size: "180 MB", status: "Success" },
  { type: "Configuration Backup", frequency: "Weekly (Sunday)", lastRun: "09 Mar 2026, 03:00", size: "12 MB", status: "Success" },
  { type: "Off-site Replication", frequency: "Daily at 04:00 IST", lastRun: "11 Mar 2026, 04:00", size: "2.4 GB", status: "Success" },
];

const retentionColumns = [
  { key: "dataType", label: "Data Type" },
  { key: "retention", label: "Retention Period" },
  { key: "lastPurge", label: "Last Purge" },
  { key: "status", label: "Status" },
  { key: "action", label: "Action" },
];

const backupColumns = [
  { key: "type", label: "Backup Type" },
  { key: "frequency", label: "Frequency" },
  { key: "lastRun", label: "Last Run" },
  { key: "size", label: "Size" },
  { key: "status", label: "Status" },
  { key: "action", label: "Action" },
];

export default function SystemConfigTab() {
  return (
    <div className="animate-fade-in">
      <SectionCard className="mb-5">
        <h3 className="text-[15px] font-bold text-slate-900 mb-1">System Configuration</h3>
        <p className="text-[13px] text-slate-400">System health, third-party integrations, data retention policies, and backup schedules.</p>
      </SectionCard>

      {/* System Health Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {systemHealth.map((h) => (
          <div key={h.label} className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
            <div className="text-[20px] font-bold text-slate-700">{h.value}</div>
            <div className="text-[12px] font-semibold text-slate-600 mt-1">{h.label}</div>
            <div className="text-[10px] text-slate-400 mt-1">{h.detail}</div>
          </div>
        ))}
      </div>

      {/* Integration Status */}
      <SectionCard className="mb-4">
        <h4 className="text-[14px] font-bold text-slate-900 mb-0.5">Integration Status</h4>
        <p className="text-[11px] text-slate-400">Third-party service connections and sync status.</p>
      </SectionCard>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
        {integrations.map((int) => (
          <div key={int.name} className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
            <div className="flex items-start justify-between mb-2">
              <h4 className="text-[13px] font-bold text-slate-900">{int.name}</h4>
              <StatusBadge status={int.status} />
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Provider: <span className="text-slate-600">{int.provider}</span></div>
            <div className="text-[11px] text-slate-400 mt-0.5">Last Sync: <span className="text-slate-600">{int.lastSync}</span></div>
          </div>
        ))}
      </div>

      {/* Data Retention Policies */}
      <SectionCard className="mb-4">
        <h4 className="text-[14px] font-bold text-slate-900 mb-0.5">Data Retention Policies</h4>
        <p className="text-[11px] text-slate-400">Retention periods and purge schedules for different data categories.</p>
      </SectionCard>

      <div className="mb-5">
        <DataTable
          columns={retentionColumns}
          data={retentionPolicies}
          renderRow={(p, i) => (
            <tr key={i} className="border-b border-slate-50 whitespace-nowrap hover:bg-slate-50/50 transition-colors">
              <td className="px-5 py-3 text-[12px] font-semibold text-slate-700">{p.dataType}</td>
              <td className="px-5 py-3 text-[12px] font-mono text-slate-600">{p.retention}</td>
              <td className="px-5 py-3 text-[12px] text-slate-500">{p.lastPurge}</td>
              <td className="px-5 py-3">
                <StatusBadge status={p.status} />
              </td>
              <td className="px-5 py-3">
                <button className="text-[11px] text-indigo-500 hover:text-indigo-700 font-medium cursor-pointer transition-colors">Edit</button>
              </td>
            </tr>
          )}
        />
      </div>

      {/* Backup Schedule */}
      <SectionCard className="mb-4">
        <h4 className="text-[14px] font-bold text-slate-900 mb-0.5">Backup Schedule</h4>
        <p className="text-[11px] text-slate-400">Automated backup configuration and execution history.</p>
      </SectionCard>

      <DataTable
        columns={backupColumns}
        data={backupSchedule}
        renderRow={(b, i) => (
          <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors whitespace-nowrap">
            <td className="px-5 py-3 text-[12px] font-semibold text-slate-700">{b.type}</td>
            <td className="px-5 py-3 text-[12px] text-slate-500">{b.frequency}</td>
            <td className="px-5 py-3 text-[12px] text-slate-500">{b.lastRun}</td>
            <td className="px-5 py-3 text-[12px] font-mono text-slate-600">{b.size}</td>
            <td className="px-5 py-3">
              <StatusBadge status={b.status} />
            </td>
            <td className="px-5 py-3">
              <button className="text-[11px] text-indigo-500 hover:text-indigo-700 font-medium cursor-pointer transition-colors">Edit</button>
            </td>
          </tr>
        )}
      />
    </div>
  );
}
