"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "@/context/AuthContext";
import { loanApplications, depositAccounts } from "@/data/mockData";
import PageHeader from "@/components/ui/PageHeader";
import HeaderStat from "@/components/ui/HeaderStat";
import TabBar from "@/components/ui/TabBar";
import StatusBadge from "@/components/ui/StatusBadge";

const typeIcons = {
  "EMI Payment": "🏛️",
  "Chit Contribution": "🔄",
  "RD Installment": "💰",
  "FD Deposit": "📦",
};

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
  for (let i = 0; i < 12; i++) id += chars.charAt(Math.floor(Math.random() * chars.length));
  return id;
}

const bankList = [
  { id: "sbi", name: "State Bank of India", short: "SBI", color: "#1a4b8c" },
  { id: "hdfc", name: "HDFC Bank", short: "HDFC", color: "#004c8f" },
  { id: "icici", name: "ICICI Bank", short: "ICICI", color: "#f37021" },
  { id: "axis", name: "Axis Bank", short: "AXIS", color: "#97144d" },
  { id: "kotak", name: "Kotak Mahindra Bank", short: "KTK", color: "#ed1c24" },
  { id: "bob", name: "Bank of Baroda", short: "BOB", color: "#f36e23" },
  { id: "pnb", name: "Punjab National Bank", short: "PNB", color: "#0a2f6e" },
  { id: "union", name: "Union Bank of India", short: "UBI", color: "#003b71" },
];

const walletList = [
  { id: "paytm", name: "Paytm Wallet", color: "#00BAF2" },
  { id: "phonepe", name: "PhonePe Wallet", color: "#5F259F" },
  { id: "amazonpay", name: "Amazon Pay", color: "#FF9900" },
  { id: "mobikwik", name: "MobiKwik", color: "#E1272E" },
];

const upiApps = [
  { id: "gpay", name: "Google Pay", color: "#4285F4" },
  { id: "phonepe", name: "PhonePe", color: "#5F259F" },
  { id: "paytm", name: "Paytm", color: "#00BAF2" },
  { id: "bhim", name: "BHIM UPI", color: "#00838f" },
];

const methodTabs = [
  { id: "upi", label: "UPI", icon: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" /></svg>
  )},
  { id: "card", label: "Cards", icon: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" /></svg>
  )},
  { id: "netbanking", label: "Net Banking", icon: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" /></svg>
  )},
  { id: "wallet", label: "Wallets", icon: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6.75A2.25 2.25 0 0 0 18.75 4.5H5.25A2.25 2.25 0 0 0 3 6.75V9" /></svg>
  )},
  { id: "nach", label: "Auto-Debit", icon: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" /></svg>
  )},
];

function PaymentModal({ payment, onClose }) {
  const [step, setStep] = useState("methods");
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [selectedUpiApp, setSelectedUpiApp] = useState(null);
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardType, setCardType] = useState("");
  const [selectedBank, setSelectedBank] = useState(null);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [bankSearch, setBankSearch] = useState("");
  const [txnId, setTxnId] = useState("");
  const [saveCard, setSaveCard] = useState(false);
  const [amount, setAmount] = useState(
    String(payment?.amount || "").replace(/[^\d.]/g, "") || ""
  );

  const displayAmount = payment?.amount || (amount ? "₹" + parseFloat(amount).toLocaleString("en-IN") : "₹0");

  useEffect(() => {
    const num = cardNumber.replace(/\s/g, "");
    if (num.startsWith("4")) setCardType("visa");
    else if (/^5[1-5]/.test(num) || /^2[2-7]/.test(num)) setCardType("mastercard");
    else if (/^6(?:011|5)/.test(num)) setCardType("rupay");
    else setCardType("");
  }, [cardNumber]);

  const filteredBanks = bankSearch
    ? bankList.filter((b) => b.name.toLowerCase().includes(bankSearch.toLowerCase()) || b.short.toLowerCase().includes(bankSearch.toLowerCase()))
    : bankList;

  const handlePay = () => {
    setStep("processing");
    setTimeout(() => {
      setTxnId(generateTxnId());
      setStep("success");
    }, 2200);
  };

  const canProceed = () => {
    if (!amount && !payment) return false;
    if (paymentMethod === "upi") return selectedUpiApp || upiId.includes("@");
    if (paymentMethod === "card") return cardNumber.replace(/\s/g, "").length >= 15 && cardExpiry.length === 5 && cardCvv.length >= 3;
    if (paymentMethod === "netbanking") return selectedBank !== null;
    if (paymentMethod === "wallet") return selectedWallet !== null;
    if (paymentMethod === "nach") return true;
    return false;
  };

  const inputClass = "w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-body text-[13px] focus:border-primary-400 focus:ring-2 focus:ring-primary-500/10 outline-none transition-all";

  return (
    <div
      data-modal-overlay
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4"
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={step !== "processing" ? onClose : undefined}
      />

      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg relative max-h-[90vh] flex flex-col overflow-hidden animate-modal-in"
        style={{ zIndex: 1 }}
      >

        {/* ── Success State ── */}
        {step === "success" && (
          <div className="p-8 text-center flex-1 flex flex-col items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-success-50 border-2 border-success-200 flex items-center justify-center mx-auto mb-5">
              <svg className="w-10 h-10 text-success-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h3 className="text-[18px] font-bold text-heading mb-1">Payment Successful!</h3>
            <p className="text-[13px] text-slate-500 mb-6">Your payment has been processed successfully</p>

            <div className="w-full bg-slate-50 rounded-2xl p-5 border border-slate-100 mb-6 text-left space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[12px] text-slate-500">Amount Paid</span>
                <span className="text-[16px] font-bold font-mono text-success">{displayAmount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[12px] text-slate-500">Transaction ID</span>
                <span className="text-[12px] font-mono font-semibold text-body">{txnId}</span>
              </div>
              {payment && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] text-slate-500">Type</span>
                    <span className="text-[12px] font-medium text-body">{payment.type}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] text-slate-500">Description</span>
                    <span className="text-[12px] text-body text-right max-w-48 truncate">{payment.description}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between items-center">
                <span className="text-[12px] text-slate-500">Payment Method</span>
                <span className="text-[12px] font-medium text-body capitalize">{paymentMethod === "nach" ? "NACH Auto-Debit" : paymentMethod === "netbanking" ? "Net Banking" : paymentMethod?.toUpperCase()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[12px] text-slate-500">Date & Time</span>
                <span className="text-[12px] text-body">{new Date().toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
              </div>
            </div>

            <div className="flex gap-3 w-full">
              <button onClick={onClose} className="flex-1 bg-slate-50 border border-slate-200 text-body rounded-xl text-[13px] font-semibold py-3 hover:bg-slate-100 transition-colors">
                Close
              </button>
              <button onClick={onClose} className="flex-1 bg-primary-500 text-white rounded-xl text-[13px] font-semibold py-3 hover:bg-primary-600 transition-colors">
                Download Receipt
              </button>
            </div>
          </div>
        )}

        {/* ── Processing State ── */}
        {step === "processing" && (
          <div className="p-16 text-center flex-1 flex flex-col items-center justify-center">
            <div className="relative w-16 h-16 mb-6">
              <div className="absolute inset-0 border-4 border-primary-100 rounded-full" />
              <div className="absolute inset-0 border-4 border-transparent border-t-primary-500 rounded-full animate-spin" />
            </div>
            <p className="text-[15px] font-bold text-heading mb-1">Processing Payment</p>
            <p className="text-[12px] text-slate-500">Please do not close this window or press back</p>
            <div className="mt-5 flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5">
              <svg className="w-4 h-4 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
              <span className="text-[11px] text-amber-700 font-medium">Securely processing via encrypted channel</span>
            </div>
          </div>
        )}

        {/* ── Payment Form ── */}
        {(step === "methods" || step === "form") && (
          <>
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-700 to-emerald-800 p-5 text-white shrink-0">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                    </svg>
                  </div>
                  <span className="text-[13px] font-semibold text-white/90">Glimmora Secure Pay</span>
                </div>
                <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-[11px] text-white/70 uppercase tracking-wider mb-0.5">
                    {payment ? "Paying for" : "Make a Payment"}
                  </div>
                  <div className="text-[15px] font-bold">{payment ? payment.type : "Custom Payment"}</div>
                  {payment && (
                    <div className="text-[11px] text-white/70 font-mono mt-0.5">{payment.description} &middot; Due {payment.date}</div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-white/70 uppercase tracking-wider mb-0.5">Amount</div>
                  <div className="text-[22px] font-bold font-mono">{displayAmount}</div>
                </div>
              </div>
            </div>

            {/* Method Tabs */}
            <div className="flex border-b border-slate-100 shrink-0 overflow-x-auto">
              {methodTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => { setPaymentMethod(tab.id); setStep("form"); }}
                  className={`flex-1 min-w-0 flex flex-col items-center gap-1 py-3 px-2 text-center transition-all border-b-2 ${
                    paymentMethod === tab.id
                      ? "border-primary-500 text-primary bg-primary-50/50"
                      : "border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {tab.icon}
                  <span className="text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Scrollable form area */}
            <div className="flex-1 overflow-y-auto p-5">

              {/* Default: choose method */}
              {!paymentMethod && (
                <div className="text-center py-8">
                  {/* Amount field for custom payment (no pre-selected payment) */}
                  {!payment && (
                    <div className="mb-6 text-left">
                      <label className="text-[11px] text-heading uppercase tracking-wider block mb-1.5 font-semibold">Amount (₹)</label>
                      <input
                        type="text"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
                        className={inputClass}
                        placeholder="Enter amount"
                      />
                    </div>
                  )}
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-7 h-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                    </svg>
                  </div>
                  <p className="text-[14px] font-semibold text-heading mb-1">Choose a payment method</p>
                  <p className="text-[12px] text-slate-400">Select from UPI, Cards, Net Banking, Wallets, or Auto-Debit</p>
                </div>
              )}

              {/* ── UPI ── */}
              {paymentMethod === "upi" && (
                <div className="space-y-5">
                  <div>
                    <label className="text-[11px] text-heading uppercase tracking-wider block mb-3 font-semibold">Pay using UPI App</label>
                    <div className="grid grid-cols-4 gap-2.5">
                      {upiApps.map((app) => (
                        <button
                          key={app.id}
                          onClick={() => { setSelectedUpiApp(app.id); setUpiId(""); }}
                          className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                            selectedUpiApp === app.id
                              ? "border-primary-400 bg-primary-50 shadow-sm"
                              : "border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-[11px]" style={{ background: app.color }}>
                            {app.name.charAt(0)}
                          </div>
                          <span className="text-[10px] font-semibold text-body">{app.name.split(" ")[0]}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-slate-200" />
                    <span className="text-[10px] font-semibold text-slate-400 uppercase">or enter UPI ID</span>
                    <div className="flex-1 h-px bg-slate-200" />
                  </div>

                  <div>
                    <label className="text-[11px] text-heading uppercase tracking-wider block mb-1.5 font-semibold">UPI ID / VPA</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => { setUpiId(e.target.value); setSelectedUpiApp(null); }}
                        className={inputClass}
                        placeholder="yourname@ybl"
                      />
                      {upiId.includes("@") && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <svg className="w-4.5 h-4.5 text-success-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1.5">Example: mobilenumber@ybl, name@oksbi, name@paytm</p>
                  </div>
                </div>
              )}

              {/* ── Card ── */}
              {paymentMethod === "card" && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-10 h-7 bg-amber-400 rounded-md opacity-80" />
                      <span className="text-[12px] font-bold uppercase tracking-wider text-white/60">
                        {cardType === "visa" ? "VISA" : cardType === "mastercard" ? "MASTERCARD" : cardType === "rupay" ? "RuPay" : "CARD"}
                      </span>
                    </div>
                    <div className="text-[17px] font-mono tracking-[0.2em] mb-4 text-white/90">
                      {cardNumber || "•••• •••• •••• ••••"}
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="text-[8px] uppercase text-white/40 tracking-wider">Card Holder</div>
                        <div className="text-[12px] font-semibold uppercase tracking-wider">{cardName || "YOUR NAME"}</div>
                      </div>
                      <div>
                        <div className="text-[8px] uppercase text-white/40 tracking-wider">Expires</div>
                        <div className="text-[12px] font-mono">{cardExpiry || "MM/YY"}</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-heading uppercase tracking-wider block mb-1.5 font-semibold">Card Number</label>
                    <input type="text" value={cardNumber} onChange={(e) => setCardNumber(e.target.value.replace(/[^0-9]/g, "").replace(/(.{4})/g, "$1 ").trim().slice(0, 19))} className={inputClass} placeholder="1234 5678 9012 3456" maxLength={19} />
                  </div>
                  <div>
                    <label className="text-[11px] text-heading uppercase tracking-wider block mb-1.5 font-semibold">Name on Card</label>
                    <input type="text" value={cardName} onChange={(e) => setCardName(e.target.value.toUpperCase())} className={inputClass} placeholder="RAJESH KUMAR" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-heading uppercase tracking-wider block mb-1.5 font-semibold">Expiry Date</label>
                      <input type="text" value={cardExpiry} onChange={(e) => { let val = e.target.value.replace(/[^0-9]/g, ""); if (val.length >= 2) val = val.slice(0, 2) + "/" + val.slice(2); setCardExpiry(val.slice(0, 5)); }} className={inputClass} placeholder="MM/YY" maxLength={5} />
                    </div>
                    <div>
                      <label className="text-[11px] text-heading uppercase tracking-wider block mb-1.5 font-semibold">CVV</label>
                      <div className="relative">
                        <input type="password" value={cardCvv} onChange={(e) => setCardCvv(e.target.value.replace(/[^0-9]/g, "").slice(0, 4))} className={inputClass} placeholder="•••" maxLength={4} />
                        <svg className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={saveCard} onChange={(e) => setSaveCard(e.target.checked)} className="accent-primary-500 w-3.5 h-3.5" />
                    <span className="text-[12px] text-slate-500">Save this card for faster payments</span>
                  </label>
                </div>
              )}

              {/* ── Net Banking ── */}
              {paymentMethod === "netbanking" && (
                <div className="space-y-4">
                  <div>
                    <label className="text-[11px] text-heading uppercase tracking-wider block mb-2 font-semibold">Popular Banks</label>
                    <div className="grid grid-cols-4 gap-2">
                      {bankList.slice(0, 4).map((bank) => (
                        <button key={bank.id} onClick={() => setSelectedBank(bank.id)} className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${selectedBank === bank.id ? "border-primary-400 bg-primary-50 shadow-sm" : "border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50"}`}>
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-[10px]" style={{ background: bank.color }}>{bank.short}</div>
                          <span className="text-[10px] font-semibold text-body truncate w-full text-center">{bank.short}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] text-heading uppercase tracking-wider block mb-1.5 font-semibold">Search All Banks</label>
                    <div className="relative mb-2">
                      <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                      </svg>
                      <input type="text" value={bankSearch} onChange={(e) => setBankSearch(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-9 pr-3 text-body text-[13px] focus:border-primary-400 focus:ring-2 focus:ring-primary-500/10 outline-none transition-all" placeholder="Search bank name..." />
                    </div>
                    <div className="max-h-40 overflow-y-auto space-y-1 rounded-xl border border-slate-100 p-1">
                      {filteredBanks.map((bank) => (
                        <button key={bank.id} onClick={() => setSelectedBank(bank.id)} className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-all ${selectedBank === bank.id ? "bg-primary-50 border border-primary-200" : "hover:bg-slate-50 border border-transparent"}`}>
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-[9px] shrink-0" style={{ background: bank.color }}>{bank.short}</div>
                          <span className="text-[12px] font-medium text-body">{bank.name}</span>
                          {selectedBank === bank.id && (
                            <svg className="w-4 h-4 text-primary-500 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── Wallets ── */}
              {paymentMethod === "wallet" && (
                <div className="space-y-4">
                  <label className="text-[11px] text-heading uppercase tracking-wider block mb-1 font-semibold">Select Wallet</label>
                  <div className="space-y-2">
                    {walletList.map((wallet) => (
                      <button key={wallet.id} onClick={() => setSelectedWallet(wallet.id)} className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all ${selectedWallet === wallet.id ? "border-primary-400 bg-primary-50 shadow-sm" : "border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50"}`}>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-[12px]" style={{ background: wallet.color }}>{wallet.name.charAt(0)}</div>
                        <div className="text-left flex-1">
                          <div className="text-[13px] font-semibold text-body">{wallet.name}</div>
                          <div className="text-[11px] text-slate-400">Pay using {wallet.name.split(" ")[0]} balance</div>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedWallet === wallet.id ? "border-primary-500 bg-primary-500" : "border-slate-300"}`}>
                          {selectedWallet === wallet.id && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ── NACH Auto-Debit ── */}
              {paymentMethod === "nach" && (
                <div className="space-y-4">
                  <div className="bg-success-50 border border-success-200 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-success-100 border border-success-200 flex items-center justify-center">
                        <svg className="w-4 h-4 text-success-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-[13px] font-bold text-success-700">NACH Mandate Active</div>
                        <div className="text-[11px] text-success-600">Auto-debit is set up for your account</div>
                      </div>
                    </div>
                    <div className="space-y-2.5 bg-white/60 rounded-xl p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-[12px] text-slate-500">Bank Account</span>
                        <span className="text-[12px] font-mono font-semibold text-body">XXXX XXXX 4521</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[12px] text-slate-500">Bank Name</span>
                        <span className="text-[12px] font-medium text-body">State Bank of India</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[12px] text-slate-500">Max Limit</span>
                        <span className="text-[12px] font-mono text-body">₹50,000/month</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[12px] text-slate-500">Debit Date</span>
                        <span className="text-[12px] font-medium text-body">15th of every month</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[12px] text-slate-500">UMRN</span>
                        <span className="text-[11px] font-mono text-body">NACH00000000123456</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5">
                    <svg className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                    </svg>
                    <p className="text-[11px] text-amber-700 leading-relaxed">
                      Clicking &quot;Pay Now&quot; will initiate an immediate debit of <strong>{displayAmount}</strong> from your linked bank account under the existing NACH mandate.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer — Pay Button */}
            {paymentMethod && (
              <div className="p-5 border-t border-slate-100 bg-white shrink-0">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-success-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                    </svg>
                    <span className="text-[10px] text-slate-400 font-medium">256-bit SSL Encrypted</span>
                  </div>
                  <span className="text-[10px] text-slate-400">PCI DSS Compliant</span>
                </div>
                <button
                  onClick={handlePay}
                  disabled={!canProceed()}
                  className={`w-full rounded-xl text-[14px] font-bold py-3.5 transition-all flex items-center justify-center gap-2 ${
                    canProceed()
                      ? "bg-primary-500 text-white hover:bg-primary-600 shadow-lg shadow-primary-500/25 active:scale-[0.98]"
                      : "bg-slate-100 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                  </svg>
                  Pay {displayAmount}
                </button>
              </div>
            )}
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
          <button
            onClick={(e) => { e.stopPropagation(); onClick(); }}
            className="py-1.5 px-3 bg-primary-50 border border-primary-200 text-primary rounded-xl text-[11px] font-semibold hover:bg-primary-100 hover:border-primary-300 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
            </svg>
            Pay Now
          </button>
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
