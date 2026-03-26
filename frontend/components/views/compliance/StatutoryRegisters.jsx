"use client";

import { useState } from "react";
import StatusBadge from "@/components/ui/StatusBadge";
import SectionCard from "@/components/ui/SectionCard";
import { Download } from "lucide-react";

const REGISTER_TABS = [
  "Subscriber Register",
  "Chit Agreement Register",
  "Draw Minutes Register",
  "Auction Proceedings",
  "Default Register",
  "Foreman Commission",
  "Security Deposit Register",
];

const subscriberData = [
  { sl: 1, memberId: "M-1001", name: "Rajesh Kumar", address: "12, MG Road, Bengaluru", dateOfAdmission: "2024-01-15", sharesHeld: 50, nominee: "Sunita Kumar", kycStatus: "Compliant" },
  { sl: 2, memberId: "M-1002", name: "Anita Sharma", address: "45, Nehru Nagar, Hyderabad", dateOfAdmission: "2024-01-18", sharesHeld: 30, nominee: "Vikram Sharma", kycStatus: "Compliant" },
  { sl: 3, memberId: "M-1003", name: "Suresh Reddy", address: "78, Tank Bund Rd, Hyderabad", dateOfAdmission: "2024-02-02", sharesHeld: 40, nominee: "Lakshmi Reddy", kycStatus: "Pending" },
  { sl: 4, memberId: "M-1004", name: "Priya Nair", address: "23, Marine Drive, Kochi", dateOfAdmission: "2024-02-10", sharesHeld: 25, nominee: "Anil Nair", kycStatus: "Compliant" },
  { sl: 5, memberId: "M-1005", name: "Vikram Singh", address: "56, Connaught Place, Delhi", dateOfAdmission: "2024-02-20", sharesHeld: 60, nominee: "Meera Singh", kycStatus: "Compliant" },
  { sl: 6, memberId: "M-1006", name: "Deepa Menon", address: "89, Residency Rd, Bengaluru", dateOfAdmission: "2024-03-05", sharesHeld: 35, nominee: "Ramesh Menon", kycStatus: "Pending" },
  { sl: 7, memberId: "M-1007", name: "Arun Patel", address: "34, SG Highway, Ahmedabad", dateOfAdmission: "2024-03-12", sharesHeld: 45, nominee: "Kavita Patel", kycStatus: "Compliant" },
  { sl: 8, memberId: "M-1008", name: "Lakshmi Iyer", address: "67, Anna Salai, Chennai", dateOfAdmission: "2024-03-22", sharesHeld: 20, nominee: "Srinivas Iyer", kycStatus: "Compliant" },
  { sl: 9, memberId: "M-1009", name: "Mohammed Farooq", address: "11, Charminar Rd, Hyderabad", dateOfAdmission: "2024-04-01", sharesHeld: 55, nominee: "Ayesha Farooq", kycStatus: "Non-Compliant" },
  { sl: 10, memberId: "M-1010", name: "Geeta Devi", address: "92, Ashram Rd, Ahmedabad", dateOfAdmission: "2024-04-10", sharesHeld: 30, nominee: "Sunil Kumar", kycStatus: "Compliant" },
];

const auctionData = [
  { auctionNo: "AUC-001", schemeId: "SCH-2024-A", date: "2024-03-10", subscribersPresent: 18, bidsReceived: 7, winningBid: "₹8,500", winnerMemberId: "M-1003", prizeAmount: "₹1,91,500", foremanCommission: "₹10,000", recordedBy: "Admin-01" },
  { auctionNo: "AUC-002", schemeId: "SCH-2024-A", date: "2024-04-10", subscribersPresent: 17, bidsReceived: 5, winningBid: "₹7,200", winnerMemberId: "M-1007", prizeAmount: "₹1,92,800", foremanCommission: "₹10,000", recordedBy: "Admin-01" },
  { auctionNo: "AUC-003", schemeId: "SCH-2024-B", date: "2024-04-15", subscribersPresent: 24, bidsReceived: 9, winningBid: "₹12,000", winnerMemberId: "M-1001", prizeAmount: "₹4,88,000", foremanCommission: "₹25,000", recordedBy: "Admin-02" },
  { auctionNo: "AUC-004", schemeId: "SCH-2024-A", date: "2024-05-10", subscribersPresent: 16, bidsReceived: 6, winningBid: "₹6,800", winnerMemberId: "M-1005", prizeAmount: "₹1,93,200", foremanCommission: "₹10,000", recordedBy: "Admin-01" },
  { auctionNo: "AUC-005", schemeId: "SCH-2024-B", date: "2024-05-15", subscribersPresent: 23, bidsReceived: 8, winningBid: "₹11,500", winnerMemberId: "M-1010", prizeAmount: "₹4,88,500", foremanCommission: "₹25,000", recordedBy: "Admin-02" },
  { auctionNo: "AUC-006", schemeId: "SCH-2024-C", date: "2024-06-01", subscribersPresent: 14, bidsReceived: 4, winningBid: "₹5,000", winnerMemberId: "M-1002", prizeAmount: "₹95,000", foremanCommission: "₹5,000", recordedBy: "Admin-01" },
  { auctionNo: "AUC-007", schemeId: "SCH-2024-A", date: "2024-06-10", subscribersPresent: 15, bidsReceived: 5, winningBid: "₹7,000", winnerMemberId: "M-1008", prizeAmount: "₹1,93,000", foremanCommission: "₹10,000", recordedBy: "Admin-02" },
  { auctionNo: "AUC-008", schemeId: "SCH-2024-B", date: "2024-06-15", subscribersPresent: 22, bidsReceived: 7, winningBid: "₹10,800", winnerMemberId: "M-1004", prizeAmount: "₹4,89,200", foremanCommission: "₹25,000", recordedBy: "Admin-01" },
];

const defaultData = [
  { sl: 1, memberId: "M-1009", name: "Mohammed Farooq", scheme: "SCH-2024-A", defaultDate: "2024-05-15", outstandingAmount: "₹32,000", missedInstalments: 3, recoveryStatus: "In Recovery", legalAction: "Notice Sent", remarks: "Partial payment received" },
  { sl: 2, memberId: "M-1006", name: "Deepa Menon", scheme: "SCH-2024-B", defaultDate: "2024-06-20", outstandingAmount: "₹50,000", missedInstalments: 2, recoveryStatus: "In Recovery", legalAction: "Pending", remarks: "Follow-up scheduled" },
  { sl: 3, memberId: "M-1003", name: "Suresh Reddy", scheme: "SCH-2024-C", defaultDate: "2024-07-05", outstandingAmount: "₹15,000", missedInstalments: 1, recoveryStatus: "Recovered", legalAction: "Not Required", remarks: "Cleared on 2024-07-20" },
  { sl: 4, memberId: "M-1005", name: "Vikram Singh", scheme: "SCH-2024-A", defaultDate: "2024-08-10", outstandingAmount: "₹64,000", missedInstalments: 4, recoveryStatus: "Defaulted", legalAction: "Legal Filed", remarks: "Arbitration in progress" },
  { sl: 5, memberId: "M-1010", name: "Geeta Devi", scheme: "SCH-2024-B", defaultDate: "2024-08-25", outstandingAmount: "₹25,000", missedInstalments: 1, recoveryStatus: "In Recovery", legalAction: "Pending", remarks: "EMI restructured" },
];

const foremanCommissionData = [
  { sl: 1, scheme: "SCH-2024-A", month: "Mar 2024", instalmentCollected: "₹3,60,000", commissionRate: "5%", grossCommission: "₹18,000", tds: "₹1,800", netPayable: "₹16,200", paymentDate: "2024-04-05", status: "Paid" },
  { sl: 2, scheme: "SCH-2024-B", month: "Mar 2024", instalmentCollected: "₹6,00,000", commissionRate: "5%", grossCommission: "₹30,000", tds: "₹3,000", netPayable: "₹27,000", paymentDate: "2024-04-05", status: "Paid" },
  { sl: 3, scheme: "SCH-2024-A", month: "Apr 2024", instalmentCollected: "₹3,55,000", commissionRate: "5%", grossCommission: "₹17,750", tds: "₹1,775", netPayable: "₹15,975", paymentDate: "2024-05-05", status: "Paid" },
  { sl: 4, scheme: "SCH-2024-B", month: "Apr 2024", instalmentCollected: "₹5,90,000", commissionRate: "5%", grossCommission: "₹29,500", tds: "₹2,950", netPayable: "₹26,550", paymentDate: "2024-05-05", status: "Paid" },
  { sl: 5, scheme: "SCH-2024-C", month: "Apr 2024", instalmentCollected: "₹1,40,000", commissionRate: "5%", grossCommission: "₹7,000", tds: "₹700", netPayable: "₹6,300", paymentDate: "2024-05-05", status: "Paid" },
  { sl: 6, scheme: "SCH-2024-A", month: "May 2024", instalmentCollected: "₹3,48,000", commissionRate: "5%", grossCommission: "₹17,400", tds: "₹1,740", netPayable: "₹15,660", paymentDate: "2024-06-05", status: "Paid" },
  { sl: 7, scheme: "SCH-2024-B", month: "May 2024", instalmentCollected: "₹5,85,000", commissionRate: "5%", grossCommission: "₹29,250", tds: "₹2,925", netPayable: "₹26,325", paymentDate: "—", status: "Pending" },
  { sl: 8, scheme: "SCH-2024-C", month: "May 2024", instalmentCollected: "₹1,35,000", commissionRate: "5%", grossCommission: "₹6,750", tds: "₹675", netPayable: "₹6,075", paymentDate: "—", status: "Pending" },
];

const LAST_UPDATED = {
  "Subscriber Register": "15 Mar 2026, 10:30 AM",
  "Chit Agreement Register": "15 Mar 2026, 10:30 AM",
  "Draw Minutes Register": "18 Mar 2026, 03:00 PM",
  "Auction Proceedings": "14 Mar 2026, 04:15 PM",
  "Default Register": "13 Mar 2026, 11:45 AM",
  "Foreman Commission": "12 Mar 2026, 09:00 AM",
  "Security Deposit Register": "10 Mar 2026, 11:00 AM",
};

function RegisterTable({ headers, rows, renderRow }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-slate-100">
            {headers.map((h) => (
              <th key={h} className="text-[10px] text-heading uppercase tracking-wider font-semibold px-3 py-2.5 whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
              {renderRow(row)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Cell({ children, mono = false }) {
  return (
    <td className={`px-3 py-2.5 text-[13px] text-body whitespace-nowrap ${mono ? "font-mono font-bold" : ""}`}>
      {children}
    </td>
  );
}

function SubscriberRegister() {
  return (
    <RegisterTable
      headers={["Sl No", "Member ID", "Name", "Address", "Date of Admission", "Shares Held", "Nominee", "KYC Status"]}
      rows={subscriberData}
      renderRow={(r) => (
        <>
          <Cell>{r.sl}</Cell>
          <Cell mono>{r.memberId}</Cell>
          <Cell>{r.name}</Cell>
          <Cell>{r.address}</Cell>
          <Cell>{r.dateOfAdmission}</Cell>
          <Cell mono>{r.sharesHeld}</Cell>
          <Cell>{r.nominee}</Cell>
          <td className="px-3 py-2.5"><StatusBadge status={r.kycStatus} /></td>
        </>
      )}
    />
  );
}

function AuctionRegister() {
  return (
    <RegisterTable
      headers={["Auction No", "Scheme ID", "Date", "Subscribers Present", "Bids Received", "Winning Bid", "Winner Member ID", "Prize Amount", "Foreman Commission", "Recorded By"]}
      rows={auctionData}
      renderRow={(r) => (
        <>
          <Cell mono>{r.auctionNo}</Cell>
          <Cell mono>{r.schemeId}</Cell>
          <Cell>{r.date}</Cell>
          <Cell mono>{r.subscribersPresent}</Cell>
          <Cell mono>{r.bidsReceived}</Cell>
          <Cell mono>{r.winningBid}</Cell>
          <Cell mono>{r.winnerMemberId}</Cell>
          <Cell mono>{r.prizeAmount}</Cell>
          <Cell mono>{r.foremanCommission}</Cell>
          <Cell>{r.recordedBy}</Cell>
        </>
      )}
    />
  );
}

function DefaultRegister() {
  return (
    <RegisterTable
      headers={["Sl No", "Member ID", "Name", "Scheme", "Default Date", "Outstanding Amount", "Missed Instalments", "Recovery Status", "Legal Action", "Remarks"]}
      rows={defaultData}
      renderRow={(r) => (
        <>
          <Cell>{r.sl}</Cell>
          <Cell mono>{r.memberId}</Cell>
          <Cell>{r.name}</Cell>
          <Cell mono>{r.scheme}</Cell>
          <Cell>{r.defaultDate}</Cell>
          <Cell mono>{r.outstandingAmount}</Cell>
          <Cell mono>{r.missedInstalments}</Cell>
          <td className="px-3 py-2.5"><StatusBadge status={r.recoveryStatus} /></td>
          <td className="px-3 py-2.5"><StatusBadge status={r.legalAction} /></td>
          <Cell>{r.remarks}</Cell>
        </>
      )}
    />
  );
}

function ForemanCommissionRegister() {
  return (
    <RegisterTable
      headers={["Sl No", "Scheme", "Month", "Instalment Collected", "Commission Rate", "Gross Commission", "TDS", "Net Payable", "Payment Date", "Status"]}
      rows={foremanCommissionData}
      renderRow={(r) => (
        <>
          <Cell>{r.sl}</Cell>
          <Cell mono>{r.scheme}</Cell>
          <Cell>{r.month}</Cell>
          <Cell mono>{r.instalmentCollected}</Cell>
          <Cell mono>{r.commissionRate}</Cell>
          <Cell mono>{r.grossCommission}</Cell>
          <Cell mono>{r.tds}</Cell>
          <Cell mono>{r.netPayable}</Cell>
          <Cell>{r.paymentDate}</Cell>
          <td className="px-3 py-2.5"><StatusBadge status={r.status} /></td>
        </>
      )}
    />
  );
}

const chitAgreementData = [
  { sl: 1, schemeId: "CS-001", schemeName: "Vasuprada Sahaya 2L", agreementDate: "2025-10-01", filedWithRegistrar: "Yes", filingDate: "2025-10-10", registrationNo: "RoC/TS/2025/A001", status: "Filed" },
  { sl: 2, schemeId: "CS-002", schemeName: "Vasuprada Sahaya 5L", agreementDate: "2025-10-05", filedWithRegistrar: "Yes", filingDate: "2025-10-12", registrationNo: "RoC/TS/2025/A002", status: "Filed" },
  { sl: 3, schemeId: "CS-003", schemeName: "Vasuprada Samruddhi 10L", agreementDate: "2025-11-01", filedWithRegistrar: "Yes", filingDate: "2025-11-08", registrationNo: "RoC/TS/2025/A003", status: "Filed" },
  { sl: 4, schemeId: "CS-005", schemeName: "Vasuprada Unnati 15L", agreementDate: "2026-01-15", filedWithRegistrar: "Yes", filingDate: "2026-01-22", registrationNo: "RoC/TS/2026/A004", status: "Filed" },
  { sl: 5, schemeId: "CS-007", schemeName: "Vasuprada Shikhar 50L", agreementDate: "2026-02-01", filedWithRegistrar: "Yes", filingDate: "2026-02-10", registrationNo: "RoC/TS/2026/A005", status: "Filed" },
  { sl: 6, schemeId: "CS-008", schemeName: "Vasuprada Shikhar 30L", agreementDate: "2026-03-01", filedWithRegistrar: "No", filingDate: "—", registrationNo: "—", status: "Pending" },
];

const drawMinutesRegisterData = [
  { sl: 1, drawId: "DM-001", scheme: "Vasuprada Sahaya 2L", date: "2026-03-05", type: "Lucky Draw", winner: "M-1001 — Rajesh Kumar", amount: "₹1,85,000", witnesses: "Anita Desai, Suresh Babu", status: "Recorded" },
  { sl: 2, drawId: "DM-002", scheme: "Vasuprada Sahaya 2L", date: "2026-02-05", type: "Lucky Draw", winner: "M-1005 — Deepa Iyer", amount: "₹1,90,000", witnesses: "Anita Desai, Kavitha Nambiar", status: "Recorded" },
  { sl: 3, drawId: "DM-003", scheme: "Vasuprada Samruddhi 10L", date: "2026-03-10", type: "Auction", winner: "M-1002 — Priya Mehta", amount: "₹7,80,000", witnesses: "Anita Desai, Arun Pillai", status: "Recorded" },
  { sl: 4, drawId: "DM-004", scheme: "Vasuprada Shikhar 30L", date: "2026-03-18", type: "Auction", winner: "M-1009 — Suresh Babu", amount: "₹24,00,000", witnesses: "Aryan Kumar, Anita Desai", status: "Recorded" },
];

const securityDepositData = [
  { sl: 1, depositType: "Fixed Deposit", bankName: "State Bank of India", branch: "MG Road, Hyderabad", fdrNo: "FDR-2025-78901", amount: "₹5,00,000", depositDate: "2025-09-01", maturityDate: "2026-09-01", filedWithRegistrar: "Yes", status: "Active" },
  { sl: 2, depositType: "Bank Guarantee", bankName: "HDFC Bank", branch: "Jubilee Hills, Hyderabad", fdrNo: "BG-2025-34567", amount: "₹3,00,000", depositDate: "2025-10-15", maturityDate: "2026-10-15", filedWithRegistrar: "Yes", status: "Active" },
];

function ChitAgreementRegister() {
  return (
    <RegisterTable
      headers={["Sl No", "Scheme ID", "Scheme Name", "Agreement Date", "Filed", "Filing Date", "Registration No", "Status"]}
      rows={chitAgreementData}
      renderRow={(r) => (
        <>
          <Cell>{r.sl}</Cell>
          <Cell mono>{r.schemeId}</Cell>
          <Cell>{r.schemeName}</Cell>
          <Cell>{r.agreementDate}</Cell>
          <Cell>{r.filedWithRegistrar}</Cell>
          <Cell>{r.filingDate}</Cell>
          <Cell mono>{r.registrationNo}</Cell>
          <td className="px-3 py-2.5"><StatusBadge status={r.status} /></td>
        </>
      )}
    />
  );
}

function DrawMinutesRegister() {
  return (
    <RegisterTable
      headers={["Sl No", "Draw ID", "Scheme", "Date", "Type", "Winner", "Amount Disbursed", "Witnesses", "Status"]}
      rows={drawMinutesRegisterData}
      renderRow={(r) => (
        <>
          <Cell>{r.sl}</Cell>
          <Cell mono>{r.drawId}</Cell>
          <Cell>{r.scheme}</Cell>
          <Cell>{r.date}</Cell>
          <Cell>{r.type}</Cell>
          <Cell>{r.winner}</Cell>
          <Cell mono>{r.amount}</Cell>
          <Cell>{r.witnesses}</Cell>
          <td className="px-3 py-2.5"><StatusBadge status={r.status === "Recorded" ? "Active" : r.status} /></td>
        </>
      )}
    />
  );
}

function SecurityDepositRegister() {
  return (
    <RegisterTable
      headers={["Sl No", "Deposit Type", "Bank", "Branch", "FDR/BG No", "Amount", "Deposit Date", "Maturity Date", "Filed with Registrar", "Status"]}
      rows={securityDepositData}
      renderRow={(r) => (
        <>
          <Cell>{r.sl}</Cell>
          <Cell>{r.depositType}</Cell>
          <Cell>{r.bankName}</Cell>
          <Cell>{r.branch}</Cell>
          <Cell mono>{r.fdrNo}</Cell>
          <Cell mono>{r.amount}</Cell>
          <Cell>{r.depositDate}</Cell>
          <Cell>{r.maturityDate}</Cell>
          <Cell>{r.filedWithRegistrar}</Cell>
          <td className="px-3 py-2.5"><StatusBadge status={r.status} /></td>
        </>
      )}
    />
  );
}

const REGISTER_COMPONENTS = {
  "Subscriber Register": SubscriberRegister,
  "Chit Agreement Register": ChitAgreementRegister,
  "Draw Minutes Register": DrawMinutesRegister,
  "Auction Proceedings": AuctionRegister,
  "Default Register": DefaultRegister,
  "Foreman Commission": ForemanCommissionRegister,
  "Security Deposit Register": SecurityDepositRegister,
};

export default function StatutoryRegisters() {
  const [activeTab, setActiveTab] = useState(REGISTER_TABS[0]);
  const ActiveRegister = REGISTER_COMPONENTS[activeTab];

  return (
    <div className="animate-fade-in">
      <SectionCard>
        <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-5">
          <div>
            <h3 className="text-[15px] font-bold text-heading mb-1">Statutory Registers</h3>
            <p className="text-[13px] text-heading">
              Mandatory registers maintained as per Chit Funds Act, 1982, Telangana State Chit Fund Rules, and Nidhi Rules 2014.
            </p>
          </div>
        </div>

        {/* Inner Tabs */}
        <div className="flex flex-wrap gap-2 mb-5">
          {REGISTER_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-[13px] font-semibold transition-all duration-200 ${
                activeTab === tab
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-[11px] text-heading">
            Last Updated: {LAST_UPDATED[activeTab]}
          </span>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-body text-[12px] font-semibold hover:bg-slate-200 transition-colors">
            <Download size={14} />
            Export
          </button>
        </div>

        {/* Active Register Table */}
        <ActiveRegister />
      </SectionCard>
    </div>
  );
}
