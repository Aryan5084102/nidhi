import StatusBadge from "@/components/ui/StatusBadge";
import SectionCard from "@/components/ui/SectionCard";
import DataTable from "@/components/ui/DataTable";

const kycStats = [
  { label: "Verified", value: "11,842", color: "text-success", bg: "bg-success-50", border: "border-success-200/60" },
  { label: "Pending", value: "342", color: "text-warning", bg: "bg-warning-50", border: "border-warning-200/60" },
  { label: "Expired", value: "128", color: "text-danger-500", bg: "bg-danger-50", border: "border-danger-200/60" },
  { label: "Under Review", value: "138", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200/60" },
];

const kycMembers = [
  { id: "M-1003", name: "Vikram Nair", status: "Expired", lastVerified: "10 Mar 2025", dueDate: "10 Mar 2026", risk: "High" },
  { id: "M-1005", name: "Suresh Iyer", status: "Under Review", lastVerified: "12 May 2025", dueDate: "12 May 2026", risk: "High" },
  { id: "M-1009", name: "Arun Prasad", status: "Pending", lastVerified: "\u2014", dueDate: "15 Mar 2026", risk: "High" },
  { id: "M-1017", name: "Vinod Shetty", status: "Pending", lastVerified: "\u2014", dueDate: "18 Mar 2026", risk: "Medium" },
  { id: "M-1013", name: "Ganesh Hegde", status: "Under Review", lastVerified: "18 Jan 2025", dueDate: "18 Jan 2026", risk: "High" },
  { id: "M-1022", name: "Nandini Rao", status: "Expired", lastVerified: "05 Feb 2025", dueDate: "05 Feb 2026", risk: "Medium" },
  { id: "M-1028", name: "Ravi Shankar", status: "Pending", lastVerified: "\u2014", dueDate: "20 Mar 2026", risk: "Low" },
  { id: "M-1034", name: "Sanjay Gupta", status: "Expired", lastVerified: "22 Dec 2024", dueDate: "22 Dec 2025", risk: "High" },
];

const documentQueue = [
  { id: "DQ-001", memberId: "M-1003", memberName: "Vikram Nair", docType: "Aadhaar Card", submittedOn: "08 Mar 2026", status: "Pending Verification" },
  { id: "DQ-002", memberId: "M-1017", memberName: "Vinod Shetty", docType: "PAN Card", submittedOn: "09 Mar 2026", status: "Pending Verification" },
  { id: "DQ-003", memberId: "M-1005", memberName: "Suresh Iyer", docType: "Address Proof", submittedOn: "07 Mar 2026", status: "Under Review" },
  { id: "DQ-004", memberId: "M-1028", memberName: "Ravi Shankar", docType: "Aadhaar + PAN", submittedOn: "10 Mar 2026", status: "Pending Verification" },
  { id: "DQ-005", memberId: "M-1022", memberName: "Nandini Rao", docType: "Voter ID", submittedOn: "06 Mar 2026", status: "Rejected - Blurry" },
];

const reverificationColumns = [
  { key: "id", label: "Member ID" },
  { key: "name", label: "Name" },
  { key: "status", label: "KYC Status" },
  { key: "lastVerified", label: "Last Verified" },
  { key: "dueDate", label: "Due Date" },
  { key: "risk", label: "Risk Level" },
];

const docQueueColumns = [
  { key: "id", label: "Queue ID" },
  { key: "member", label: "Member" },
  { key: "docType", label: "Document Type" },
  { key: "submittedOn", label: "Submitted" },
  { key: "status", label: "Status" },
];

export default function KycMonitoringTab() {
  return (
    <div className="animate-fade-in">
      {/* KYC Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {kycStats.map((stat) => (
          <div key={stat.label} className={`bg-white rounded-2xl p-5 card-shadow border border-slate-100`}>
            <div className="text-[10px] text-heading uppercase tracking-wider mb-2">{stat.label}</div>
            <div className={`text-[22px] font-bold font-mono ${stat.color}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Re-verification Table */}
      <div className="bg-white rounded-2xl card-shadow border border-slate-100 overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-[15px] font-bold text-heading">Members Due for KYC Re-verification</h3>
          <p className="text-[12px] text-heading mt-0.5">Members requiring annual KYC update as per Nidhi (Amendment) Rules 2022</p>
        </div>
        <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              {reverificationColumns.map((col) => (
                <th key={col.key} className="text-left text-[11px] text-heading uppercase tracking-wider font-medium px-5 py-3 whitespace-nowrap">{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {kycMembers.map((m) => (
              <tr key={m.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-3 text-[12px] text-slate-500 font-mono whitespace-nowrap">{m.id}</td>
                <td className="px-5 py-3 text-[13px] font-medium text-body whitespace-nowrap">{m.name}</td>
                <td className="px-5 py-3"><StatusBadge status={m.status} /></td>
                <td className="px-5 py-3 text-[12px] text-heading whitespace-nowrap">{m.lastVerified}</td>
                <td className="px-5 py-3 text-[12px] text-heading whitespace-nowrap">{m.dueDate}</td>
                <td className="px-5 py-3"><StatusBadge status={m.risk} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {/* Document Verification Queue */}
      <DataTable
        columns={docQueueColumns}
        data={documentQueue}
        renderRow={(doc) => (
          <tr key={doc.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors whitespace-nowrap">
            <td className="px-5 py-3 text-[12px] text-slate-500 font-mono">{doc.id}</td>
            <td className="px-5 py-3">
              <div className="text-[13px] font-medium text-body">{doc.memberName}</div>
              <div className="text-[11px] text-heading">{doc.memberId}</div>
            </td>
            <td className="px-5 py-3 text-[12px] text-slate-500">{doc.docType}</td>
            <td className="px-5 py-3 text-[12px] text-heading">{doc.submittedOn}</td>
            <td className="px-5 py-3"><StatusBadge status={doc.status.includes("Rejected") ? "Open" : doc.status.includes("Under") ? "Under Review" : "Pending"} /></td>
          </tr>
        )}
      />
    </div>
  );
}
