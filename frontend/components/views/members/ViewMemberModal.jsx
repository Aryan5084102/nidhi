"use client";

import { useState } from "react";
import ModalBackdrop from "./ModalBackdrop";
import StatusBadge from "@/components/ui/StatusBadge";
import STIBadge from "@/components/badges/STIBadge";
import RiskBadge from "@/components/badges/RiskBadge";

// Mock chit enrollment data for member profile (GAP 8)
const MOCK_CHIT_ENROLLMENTS = {
  "M-1001": [
    { schemeName: "Vasuprada Sahaya 2L", enrollmentId: "EN-001", status: "Active", monthlyContribution: "₹10,000", payoutReceived: "Yes", withdrawalStatus: "—" },
  ],
  "M-1002": [
    { schemeName: "Vasuprada Samruddhi 10L", enrollmentId: "EN-003", status: "Active", monthlyContribution: "₹50,000", payoutReceived: "No", withdrawalStatus: "—" },
  ],
  "M-1003": [
    { schemeName: "Vasuprada Sahaya 5L", enrollmentId: "EN-006", status: "Withdrawn", monthlyContribution: "₹20,000", payoutReceived: "No", withdrawalStatus: "Pending Deregistration" },
  ],
  "M-1005": [
    { schemeName: "Vasuprada Sahaya 2L", enrollmentId: "EN-002", status: "Active", monthlyContribution: "₹10,000", payoutReceived: "No", withdrawalStatus: "—" },
  ],
};

export default function ViewMemberModal({ member, onClose }) {
  const [tab, setTab] = useState("details");
  const chitEnrollments = MOCK_CHIT_ENROLLMENTS[member.id] || [];

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-fade-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-800">Member Details</h2>
          <button
            onClick={onClose}
            className="text-heading hover:text-body text-lg cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-6 pt-3 border-b border-slate-100">
          {[
            { id: "details", label: "Profile" },
            { id: "chits", label: "Chit Enrollments" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-3 py-2 text-[12px] font-semibold border-b-2 transition-all cursor-pointer ${
                tab === t.id
                  ? "border-primary text-primary"
                  : "border-transparent text-heading hover:text-body"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
          {tab === "details" ? (
            <>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary font-bold text-lg">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{member.name}</p>
                    <p className="text-xs text-heading font-mono">{member.id}</p>
                  </div>
                </div>
                <StatusBadge status={member.status || "Active"} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[11px] text-heading uppercase tracking-wide mb-1">Phone</p>
                  <p className="text-sm text-body">{member.phone || "—"}</p>
                </div>
                <div>
                  <p className="text-[11px] text-heading uppercase tracking-wide mb-1">Email</p>
                  <p className="text-sm text-body">{member.email || "—"}</p>
                </div>
                <div>
                  <p className="text-[11px] text-heading uppercase tracking-wide mb-1">Address</p>
                  <p className="text-sm text-body">{member.address || "—"}</p>
                </div>
                <div>
                  <p className="text-[11px] text-heading uppercase tracking-wide mb-1">Join Date</p>
                  <p className="text-sm text-body">{member.joinDate || "—"}</p>
                </div>
                <div>
                  <p className="text-[11px] text-heading uppercase tracking-wide mb-1">Deposits</p>
                  <p className="text-sm font-mono text-success">{member.deposits}</p>
                </div>
                <div>
                  <p className="text-[11px] text-heading uppercase tracking-wide mb-1">Loans</p>
                  <p className="text-sm font-mono text-primary">{member.loans}</p>
                </div>
                <div>
                  <p className="text-[11px] text-heading uppercase tracking-wide mb-1">STI Score</p>
                  <STIBadge score={member.sti} />
                </div>
                <div>
                  <p className="text-[11px] text-heading uppercase tracking-wide mb-1">Risk Level</p>
                  <RiskBadge risk={member.risk} />
                </div>
                <div>
                  <p className="text-[11px] text-heading uppercase tracking-wide mb-1">KYC Status</p>
                  <span
                    className={`text-[11px] font-semibold ${
                      member.kyc === "Verified"
                        ? "text-success"
                        : member.kyc === "Pending"
                        ? "text-warning"
                        : "text-danger-500"
                    }`}
                  >
                    {member.kyc === "Verified" ? "✓ " : "⏳ "}
                    {member.kyc}
                  </span>
                </div>
              </div>

              {/* Nominee Details (GAP 8) */}
              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-[12px] font-bold text-heading uppercase tracking-wider mb-3">Nominee Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[11px] text-heading uppercase tracking-wide mb-1">Nominee Name</p>
                    <p className="text-sm text-body">{member.nomineeName || "Not Provided"}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-heading uppercase tracking-wide mb-1">Relation</p>
                    <p className="text-sm text-body">{member.nomineeRelation || "—"}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-heading uppercase tracking-wide mb-1">Nominee Aadhaar</p>
                    <p className="text-sm text-body font-mono">{member.nomineeAadhaar || "—"}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-heading uppercase tracking-wide mb-1">Nominee PAN</p>
                    <p className="text-sm text-body font-mono">{member.nomineePan || "—"}</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Chit Enrollments Tab (GAP 8) */
            <div>
              {chitEnrollments.length > 0 ? (
                <div className="space-y-3">
                  {chitEnrollments.map((enr) => (
                    <div key={enr.enrollmentId} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-[13px] font-bold text-heading">{enr.schemeName}</div>
                        <StatusBadge status={enr.status} />
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div><span className="text-heading">Enrollment ID:</span> <strong className="text-body font-mono">{enr.enrollmentId}</strong></div>
                        <div><span className="text-heading">Monthly:</span> <strong className="text-body font-mono">{enr.monthlyContribution}</strong></div>
                        <div><span className="text-heading">Payout Received:</span> <strong className="text-body">{enr.payoutReceived}</strong></div>
                        <div><span className="text-heading">Withdrawal:</span> <strong className="text-body">{enr.withdrawalStatus}</strong></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-[13px] text-heading">No chit fund enrollments found for this member</p>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="bg-slate-100 text-body rounded-xl px-5 py-2 text-xs font-semibold cursor-pointer hover:bg-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </ModalBackdrop>
  );
}
