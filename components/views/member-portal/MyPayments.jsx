"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "@/context/AuthContext";
import { loanApplications, depositAccounts } from "@/data/mockData";
import PageHeader from "@/components/ui/PageHeader";
import HeaderStat from "@/components/ui/HeaderStat";
import TabBar from "@/components/ui/TabBar";
import SectionCard from "@/components/ui/SectionCard";
import StatusBadge from "@/components/ui/StatusBadge";

const typeIcons = {
  "EMI Payment": "🏛️",
  "Chit Contribution": "🔄",
  "RD Installment": "💰",
  "FD Deposit": "📦",
};

const bankOptions = [
  { value: "sbi", label: "State Bank of India (SBI)" },
  { value: "hdfc", label: "HDFC Bank" },
  { value: "icici", label: "ICICI Bank" },
  { value: "axis", label: "Axis Bank" },
  { value: "kotak", label: "Kotak Mahindra Bank" },
];

function generatePayments(memberId) {
  const payments = [];
  const myLoans = loanApplications.filter((l) => l.memberId === memberId && ["Approved", "Disbursed"].includes(l.status));
  const myDeposits = depositAccounts.filter((d) => d.memberId === memberId && d.status === "Active");

  myLoans.forEach((loan) => {
    payments.push({
      id: `PAY-EMI-${loan.id}`,
      type: "EMI Payment",
      description: `${loan.purpose} (${loan.id})`,
      amount: loan.emi,
      date: loan.nextEmi !== "—" ? loan.nextEmi : "—",
      method: "Auto-Debit",
      status: "Upcoming",
    });
    payments.push({
      id: `PAY-EMI-${loan.id}-PREV`,
      type: "EMI Payment",
      description: `${loan.purpose} (${loan.id})`,
      amount: loan.emi,
      date: loan.appliedDate || "—",
      method: "Auto-Debit",
      status: "Paid",
    });
  });

  myDeposits.forEach((dep) => {
    if (dep.type.includes("Recurring")) {
      payments.push({
        id: `PAY-RD-${dep.id}`,
        type: "RD Installment",
        description: `${dep.type} (${dep.id})`,
        amount: dep.amount,
        date: "01 Apr 2026",
        method: "Auto-Debit",
        status: "Upcoming",
      });
      payments.push({
        id: `PAY-RD-${dep.id}-PREV`,
        type: "RD Installment",
        description: `${dep.type} (${dep.id})`,
        amount: dep.amount,
        date: "01 Mar 2026",
        method: "Auto-Debit",
        status: "Paid",
      });
    }
  });

  return payments;
}

const filterTabs = [
  { id: "all", label: "All" },
  { id: "paid", label: "Paid" },
  { id: "upcoming", label: "Upcoming" },
];

function generateTxnId() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "TXN";
  for (let i = 0; i < 12; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

function formatAmountDisplay(val) {
  const num = parseFloat(String(val).replace(/[^0-9.]/g, ""));
  if (isNaN(num)) return "₹0";
  return "₹" + num.toLocaleString("en-IN");
}

function PaymentModal({ payment, onClose }) {
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [amount, setAmount] = useState(
    String(payment?.amount || "").replace(/[^\d.]/g, "") || ""
  );
  const [upiId, setUpiId] = useState("");
  const [selectedBank, setSelectedBank] = useState("sbi");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [txnId, setTxnId] = useState("");

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setTxnId(generateTxnId());
      setSuccess(true);
    }, 1500);
  };

  const inputClass =
    "w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-body text-[13px] focus:border-primary-400 focus:ring-2 focus:ring-primary-500/10 outline-none transition-all";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={!processing ? onClose : undefined}
      />

      {/* Modal */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 animate-modal-in w-full max-w-md relative max-h-[90vh] overflow-y-auto">
        {/* Success State */}
        {success ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-success-50 border-2 border-success-200 flex items-center justify-center mx-auto mb-4 animate-bounce">
              <svg
                className="w-8 h-8 text-success-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h3 className="text-[16px] font-bold text-body mb-1">Payment Successful</h3>
            <p className="text-[13px] text-slate-500 mb-4">Payment of {formatAmountDisplay(amount)} successful</p>
            <div className="bg-slate-50 rounded-xl p-3 mb-6 border border-slate-100">
              <div className="text-[10px] text-heading uppercase tracking-wider mb-1">Transaction ID</div>
              <div className="text-[13px] font-mono font-semibold text-body">{txnId}</div>
            </div>
            <button
              onClick={onClose}
              className="w-full bg-primary-50 border border-primary-200 text-primary rounded-xl text-[13px] font-semibold py-2.5 px-4 hover:bg-primary-100 transition-colors"
            >
              Done
            </button>
          </div>
        ) : processing ? (
          /* Processing State */
          <div className="p-12 text-center">
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[13px] font-semibold text-body">Processing your payment...</p>
            <p className="text-[12px] text-heading mt-1">Please do not close this window</p>
          </div>
        ) : (
          /* Payment Form */
          <>
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-[15px] font-bold text-body">Make Payment</h3>
                <p className="text-[12px] text-heading mt-0.5">Complete your payment securely</p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-heading hover:text-body hover:bg-slate-100 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Payment Details Summary */}
              {payment && (
                <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
                  <div className="text-[10px] text-heading uppercase tracking-wider mb-3">Payment Details</div>
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center">
                      <span className="text-[12px] text-slate-500 font-medium">Type</span>
                      <span className="text-[13px] font-semibold text-body">{payment.type}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[12px] text-slate-500 font-medium">Description</span>
                      <span className="text-[13px] text-body text-right max-w-50 truncate">{payment.description}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[12px] text-slate-500 font-medium">Due Date</span>
                      <span className="text-[13px] text-body">{payment.date}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                      <span className="text-[12px] text-slate-500 font-medium">Amount</span>
                      <span className="text-[15px] font-bold font-mono text-body">{payment.amount}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Amount Field */}
              <div>
                <label className="text-[10px] text-heading uppercase tracking-wider block mb-1.5">Amount (₹)</label>
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
                  className={inputClass}
                  placeholder="Enter amount"
                />
              </div>

              {/* Payment Method */}
              <div>
                <label className="text-[10px] text-heading uppercase tracking-wider block mb-2.5">Payment Method</label>
                <div className="space-y-2">
                  {[
                    { id: "upi", label: "UPI" },
                    { id: "netbanking", label: "Net Banking" },
                    { id: "card", label: "Debit/Credit Card" },
                    { id: "nach", label: "NACH Auto-Debit" },
                  ].map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        paymentMethod === method.id
                          ? "bg-primary-50/50 border-primary-200"
                          : "bg-slate-50 border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={() => setPaymentMethod(method.id)}
                        className="accent-primary-500"
                      />
                      <span className="text-[13px] font-medium text-body">{method.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Conditional Fields based on payment method */}
              {paymentMethod === "upi" && (
                <div>
                  <label className="text-[10px] text-heading uppercase tracking-wider block mb-1.5">UPI ID</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className={inputClass}
                    placeholder="yourname@upi"
                  />
                </div>
              )}

              {paymentMethod === "netbanking" && (
                <div>
                  <label className="text-[10px] text-heading uppercase tracking-wider block mb-1.5">Select Bank</label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className={inputClass}
                  >
                    {bankOptions.map((bank) => (
                      <option key={bank.value} value={bank.value}>{bank.label}</option>
                    ))}
                  </select>
                </div>
              )}

              {paymentMethod === "card" && (
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] text-heading uppercase tracking-wider block mb-1.5">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) =>
                        setCardNumber(
                          e.target.value
                            .replace(/[^0-9]/g, "")
                            .replace(/(.{4})/g, "$1 ")
                            .trim()
                            .slice(0, 19)
                        )
                      }
                      className={inputClass}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-heading uppercase tracking-wider block mb-1.5">Expiry</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => {
                          let val = e.target.value.replace(/[^0-9]/g, "");
                          if (val.length >= 2) val = val.slice(0, 2) + "/" + val.slice(2);
                          setCardExpiry(val.slice(0, 5));
                        }}
                        className={inputClass}
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-heading uppercase tracking-wider block mb-1.5">CVV</label>
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={(e) =>
                          setCardCvv(e.target.value.replace(/[^0-9]/g, "").slice(0, 3))
                        }
                        className={inputClass}
                        placeholder="•••"
                        maxLength={3}
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === "nach" && (
                <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
                  <div className="text-[10px] text-heading uppercase tracking-wider mb-3">NACH Mandate Info</div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-[12px] text-slate-500 font-medium">Mandate Status</span>
                      <span className="text-[13px] font-semibold text-success">Active</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[12px] text-slate-500 font-medium">Bank Account</span>
                      <span className="text-[13px] text-body">XXXX XXXX 4521</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[12px] text-slate-500 font-medium">Max Debit Limit</span>
                      <span className="text-[13px] text-body">₹50,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[12px] text-slate-500 font-medium">Frequency</span>
                      <span className="text-[13px] text-body">Monthly</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-heading mt-3">
                    Payment will be auto-debited on the due date as per mandate.
                  </p>
                </div>
              )}

              {/* Pay Now Button */}
              <button
                onClick={handlePay}
                className="w-full bg-primary-50 border border-primary-200 text-primary rounded-xl text-[13px] font-semibold py-2.5 px-4 hover:bg-primary-100 transition-colors"
              >
                Pay Now {amount ? formatAmountDisplay(amount) : ""}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function PaymentRow({ payment, onClick }) {
  const isUpcoming = payment.status === "Upcoming";

  return (
    <div
      onClick={onClick}
      className={`p-4 flex items-center gap-3 transition-all duration-150 ${
        isUpcoming
          ? "bg-primary-50/50 hover:bg-primary-50 cursor-pointer border-l-2 border-primary-400"
          : "hover:bg-slate-50/60"
      }`}
    >
      {/* Timeline dot */}
      <div className="flex flex-col items-center shrink-0 self-stretch justify-start pt-1">
        <div className={`w-2.5 h-2.5 rounded-full border-2 shrink-0 ${
          isUpcoming ? "bg-primary-400 border-primary-100" : "bg-success-400 border-success-100"
        }`} />
        <div className={`w-px flex-1 mt-1 ${isUpcoming ? "bg-primary-100" : "bg-success-100"}`} />
      </div>

      {/* Icon box */}
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0 ${
        isUpcoming ? "bg-primary-100 border border-primary-200/60" : "bg-slate-50 border border-slate-100"
      }`}>
        {typeIcons[payment.type] || "💳"}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`text-[13px] font-semibold ${isUpcoming ? "text-primary-700" : "text-body"}`}>
            {payment.type}
          </span>
          <span className="text-[11px] font-mono text-heading">{payment.id}</span>
          {isUpcoming && (
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-primary-100 text-primary border border-primary-200/60">
              Due Soon
            </span>
          )}
        </div>
        <p className="text-[11px] text-heading truncate">{payment.description}</p>
      </div>

      {/* Amount + date */}
      <div className="text-right shrink-0">
        <div className={`text-[13px] font-bold font-mono ${isUpcoming ? "text-primary-700" : "text-body"}`}>
          {payment.amount}
        </div>
        <div className="text-[11px] text-heading">{payment.date}</div>
      </div>

      {/* Status badge */}
      <div className="shrink-0">
        <StatusBadge status={payment.status} />
      </div>

      {/* Method */}
      {payment.method !== "—" && (
        <span className="text-[11px] text-heading shrink-0 hidden md:block">{payment.method}</span>
      )}

      {/* Pay button for upcoming */}
      {isUpcoming && (
        <div className="shrink-0">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-primary">
            <span>Pay</span>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MyPayments() {
  const { user } = useAuth();
  const memberId = user?.memberId;
  const [filter, setFilter] = useState("all");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const paymentHistory = memberId ? generatePayments(memberId) : [];
  const payments = filter === "all" ? paymentHistory : paymentHistory.filter((p) => p.status === (filter === "paid" ? "Paid" : "Upcoming"));

  const totalPaid = paymentHistory.filter((p) => p.status === "Paid").length;
  const upcoming = paymentHistory.filter((p) => p.status === "Upcoming").length;

  // Grouped for "all" filter
  const upcomingPayments = payments.filter((p) => p.status === "Upcoming");
  const paidPayments = payments.filter((p) => p.status === "Paid");
  const showGrouped = filter === "all" && (upcomingPayments.length > 0 && paidPayments.length > 0);

  const openPaymentModal = (payment = null) => {
    setSelectedPayment(payment);
    setShowPaymentModal(true);
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
    setSelectedPayment(null);
  };

  const handleRowClick = (payment) => {
    if (payment.status === "Upcoming") {
      openPaymentModal(payment);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <PageHeader
        title="My Payments"
        description="Track your EMIs, chit contributions, and deposit installments. All payments are processed through auto-debit."
      >
        <HeaderStat value={paymentHistory.length} label="Total" className="bg-slate-50 text-body" />
        <HeaderStat value={totalPaid} label="Paid" className="bg-slate-50 text-success" />
        <HeaderStat value={upcoming} label="Upcoming" className="bg-slate-50 text-primary" />
        <button
          onClick={() => openPaymentModal()}
          className="bg-primary-50 border border-primary-200 text-primary rounded-xl text-[13px] font-semibold py-2 px-4 hover:bg-primary-100 transition-colors flex items-center gap-1.5"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
          </svg>
          Make Payment
        </button>
      </PageHeader>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-5">
        <div className="bg-white rounded-2xl card-shadow border border-slate-100 flex overflow-hidden">
          <div className="w-1 rounded-full bg-slate-400 shrink-0" />
          <div className="p-4 flex-1">
            <div className="text-[10px] text-heading uppercase tracking-wider mb-2">Total Payments</div>
            <div className="text-[20px] font-bold font-mono text-body">{paymentHistory.length}</div>
            <div className="text-[11px] text-heading mt-1">All time records</div>
          </div>
        </div>
        <div className="bg-white rounded-2xl card-shadow border border-slate-100 flex overflow-hidden">
          <div className="w-1 rounded-full bg-success-500 shrink-0" />
          <div className="p-4 flex-1">
            <div className="text-[10px] text-heading uppercase tracking-wider mb-2">Paid</div>
            <div className="text-[20px] font-bold font-mono text-success">{totalPaid}</div>
            <div className="text-[11px] text-heading mt-1">Successfully settled</div>
          </div>
        </div>
        <div className="bg-white rounded-2xl card-shadow border border-slate-100 flex overflow-hidden">
          <div className="w-1 rounded-full bg-primary-500 shrink-0" />
          <div className="p-4 flex-1">
            <div className="text-[10px] text-heading uppercase tracking-wider mb-2">Upcoming</div>
            <div className="text-[20px] font-bold font-mono text-primary">{upcoming}</div>
            <div className="text-[11px] text-heading mt-1">{upcoming === 0 ? "Nothing due" : "Due soon"}</div>
          </div>
        </div>
        <div className="bg-white rounded-2xl card-shadow border border-slate-100 flex overflow-hidden">
          <div className="w-1 rounded-full bg-danger-400 shrink-0" />
          <div className="p-4 flex-1">
            <div className="text-[10px] text-heading uppercase tracking-wider mb-2">Overdue</div>
            <div className="text-[20px] font-bold font-mono text-danger-500">0</div>
            <div className="text-[11px] text-heading mt-1">All clear</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <TabBar tabs={filterTabs} activeTab={filter} onChange={setFilter} />

      {/* Payment List */}
      <div className="bg-white rounded-2xl card-shadow border border-slate-100 overflow-hidden">
        {payments.length > 0 ? (
          showGrouped ? (
            <>
              {/* Upcoming section */}
              {upcomingPayments.length > 0 && (
                <div>
                  <div className="px-4 py-2.5 bg-primary-50 border-b border-primary-100 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                    <span className="text-[11px] font-semibold text-primary-700 uppercase tracking-wider">
                      Upcoming ({upcomingPayments.length})
                    </span>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {upcomingPayments.map((payment) => (
                      <PaymentRow key={payment.id} payment={payment} onClick={() => handleRowClick(payment)} />
                    ))}
                  </div>
                </div>
              )}

              {/* Paid section */}
              {paidPayments.length > 0 && (
                <div>
                  <div className="px-4 py-2.5 bg-success-50 border-y border-success-100 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-success-500" />
                    <span className="text-[11px] font-semibold text-success-700 uppercase tracking-wider">
                      Paid ({paidPayments.length})
                    </span>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {paidPayments.map((payment) => (
                      <PaymentRow key={payment.id} payment={payment} onClick={() => handleRowClick(payment)} />
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="divide-y divide-slate-50">
              {payments.map((payment) => (
                <PaymentRow key={payment.id} payment={payment} onClick={() => handleRowClick(payment)} />
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-16">
            <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-heading" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
              </svg>
            </div>
            <p className="text-[13px] font-semibold text-body">No payments yet</p>
            <p className="text-[12px] text-heading mt-1 max-w-sm mx-auto">
              Your payment history will appear here once you have active loans, chit fund contributions, or recurring deposit installments.
            </p>
          </div>
        )}
      </div>

      {/* Payment Modal — rendered via portal to overlay full viewport */}
      {showPaymentModal && createPortal(
        <PaymentModal payment={selectedPayment} onClose={closePaymentModal} />,
        document.body
      )}
    </div>
  );
}
