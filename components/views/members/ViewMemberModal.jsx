"use client";

import ModalBackdrop from "./ModalBackdrop";
import StatusBadge from "@/components/ui/StatusBadge";
import STIBadge from "@/components/badges/STIBadge";
import RiskBadge from "@/components/badges/RiskBadge";

export default function ViewMemberModal({ member, onClose }) {
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
        <div className="px-6 py-5 space-y-4">
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
