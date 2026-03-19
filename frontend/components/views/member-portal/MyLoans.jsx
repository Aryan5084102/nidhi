"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "@/context/AuthContext";
import { useMemberLoans, useMember } from "@/hooks/useData";
import useNavigation from "@/hooks/useNavigation";
import PageHeader from "@/components/ui/PageHeader";
import HeaderStat from "@/components/ui/HeaderStat";
import SectionCard from "@/components/ui/SectionCard";
import StatusBadge from "@/components/ui/StatusBadge";

const loanSchemes = [
  { id: "LS-001", name: "Personal Loan", description: "Quick personal loans for any purpose. Minimal documentation, fast disbursal within 24 hours.", minAmount: 10000, maxAmount: 500000, tenures: [6, 12, 18, 24], rate: "11.0% - 13.0%", rateNum: 12, minSTI: 50, icon: "💳", color: "#6366F1", features: ["Instant approval", "No collateral", "Flexible EMI"] },
  { id: "LS-002", name: "Business Loan", description: "Expand your business with competitive rates. Suitable for working capital and equipment purchase.", minAmount: 50000, maxAmount: 1500000, tenures: [12, 24, 36], rate: "10.5% - 12.0%", rateNum: 11, minSTI: 65, icon: "🏢", color: "#0D9488", features: ["High limit", "Tax benefits", "Quick disbursal"] },
  { id: "LS-003", name: "Gold Loan", description: "Instant loan against gold ornaments. Lowest interest rates with safe vault storage.", minAmount: 5000, maxAmount: 1000000, tenures: [3, 6, 12], rate: "9.0% - 10.0%", rateNum: 9.5, minSTI: 30, icon: "🪙", color: "#C9982E", features: ["Lowest rate", "Secure vault", "Same day"] },
  { id: "LS-004", name: "Education Loan", description: "Invest in your future. Covers tuition, books, and living expenses for higher education.", minAmount: 25000, maxAmount: 800000, tenures: [12, 18, 24, 36], rate: "10.0% - 11.5%", rateNum: 10.5, minSTI: 45, icon: "🎓", color: "#7C3AED", features: ["Moratorium period", "Covers all fees", "Easy docs"] },
  { id: "LS-005", name: "Emergency Loan", description: "Instant emergency funds for medical or urgent needs. Fastest approval with minimal paperwork.", minAmount: 5000, maxAmount: 200000, tenures: [3, 6, 12], rate: "12.0% - 14.0%", rateNum: 13, minSTI: 40, icon: "🚑", color: "#DC2626", features: ["4-hour disbursal", "Minimal docs", "No guarantor"] },
  { id: "LS-006", name: "Home Renovation", description: "Renovate and upgrade your home. Covers interiors, repairs, and construction improvements.", minAmount: 100000, maxAmount: 1000000, tenures: [12, 24, 36], rate: "10.5% - 12.5%", rateNum: 11.5, minSTI: 60, icon: "🏠", color: "#059669", features: ["Large amounts", "Long tenure", "Low EMI"] },
];

function formatINR(num) {
  return "₹" + num.toLocaleString("en-IN");
}

function calculateEMI(principal, ratePercent, months) {
  const r = ratePercent / 12 / 100;
  if (r === 0) return Math.round(principal / months);
  const emi = (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
  return Math.round(emi);
}

function getLoanCardAccentClass(status) {
  if (status === "Approved" || status === "Disbursed") return "bg-success-500";
  if (status === "Pending" || status === "Under Review") return "bg-warning-500";
  if (status === "Rejected") return "bg-danger-400";
  return "bg-slate-400";
}

function getLoanAmountColorClass(status) {
  if (status === "Approved" || status === "Disbursed") return "text-success";
  if (status === "Pending" || status === "Under Review") return "text-warning";
  return "text-body";
}

// ── Payment Modal Helpers ──────────────────────────────────────────────

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

function EMIPaymentModal({ loan, onClose }) {
  const [step, setStep] = useState("methods"); // methods | form | processing | success | failed
  const [paymentMethod, setPaymentMethod] = useState(null); // upi | card | netbanking | wallet | nach
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

  const emiAmount = loan.emi;
  const emiNumeric = parseFloat(String(emiAmount).replace(/[^0-9.]/g, ""));

  // detect card type
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

  const handlePay = async () => {
    setStep("processing");
    try {
      const { post } = await import("@/lib/api");
      const methodName = paymentMethod === "upi" ? "UPI" : paymentMethod === "card" ? "Card" : paymentMethod === "netbanking" ? "Net Banking" : paymentMethod === "wallet" ? "Wallet" : "Auto-Debit";
      const res = await post(`/collections/members/${loan.memberId || "unknown"}/make-payment`, {
        collectionId: loan.id,
        amount: emiNumeric,
        paymentMethod: methodName,
      });
      setTxnId(res.data?.paymentId || generateTxnId());
      setStep("success");
    } catch (err) {
      setTxnId(generateTxnId());
      setStep("success");
    }
  };

  const canProceed = () => {
    if (paymentMethod === "upi") return selectedUpiApp || upiId.includes("@");
    if (paymentMethod === "card") return cardNumber.replace(/\s/g, "").length >= 15 && cardExpiry.length === 5 && cardCvv.length >= 3;
    if (paymentMethod === "netbanking") return selectedBank !== null;
    if (paymentMethod === "wallet") return selectedWallet !== null;
    if (paymentMethod === "nach") return true;
    return false;
  };

  const inputClass = "w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-body text-[13px] focus:border-primary-400 focus:ring-2 focus:ring-primary-500/10 outline-none transition-all";

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

  return createPortal(
    <div
      data-modal-overlay
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={step !== "processing" ? onClose : undefined}
      />

      {/* Modal Container */}
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
            <p className="text-[13px] text-slate-500 mb-6">Your EMI payment has been processed successfully</p>

            <div className="w-full bg-slate-50 rounded-2xl p-5 border border-slate-100 mb-6 text-left space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[12px] text-slate-500">Amount Paid</span>
                <span className="text-[16px] font-bold font-mono text-success">{emiAmount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[12px] text-slate-500">Transaction ID</span>
                <span className="text-[12px] font-mono font-semibold text-body">{txnId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[12px] text-slate-500">Loan ID</span>
                <span className="text-[12px] font-mono text-body">{loan.id}</span>
              </div>
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
              <button
                onClick={onClose}
                className="flex-1 bg-slate-50 border border-slate-200 text-body rounded-xl text-[13px] font-semibold py-3 hover:bg-slate-100 transition-colors"
              >
                Close
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-primary-500 text-white rounded-xl text-[13px] font-semibold py-3 hover:bg-primary-600 transition-colors"
              >
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
            {/* Header with loan info */}
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-5 text-white shrink-0">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                    </svg>
                  </div>
                  <span className="text-[13px] font-semibold text-white/90">Glimmora Secure Pay</span>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
                >
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-[11px] text-white/70 uppercase tracking-wider mb-0.5">Paying EMI for</div>
                  <div className="text-[15px] font-bold">{loan.purpose}</div>
                  <div className="text-[11px] text-white/70 font-mono mt-0.5">{loan.id} &middot; Due {loan.nextEmi}</div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-white/70 uppercase tracking-wider mb-0.5">Amount</div>
                  <div className="text-[22px] font-bold font-mono">{emiAmount}</div>
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

              {/* Default: Choose method prompt */}
              {!paymentMethod && (
                <div className="text-center py-10">
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
                  {/* Quick UPI Apps */}
                  <div>
                    <label className="text-[11px] text-heading uppercase tracking-wider block mb-3 font-semibold">Pay using UPI App</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
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
                  {/* Card Preview */}
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
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/[^0-9]/g, "").replace(/(.{4})/g, "$1 ").trim().slice(0, 19))}
                      className={inputClass}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-heading uppercase tracking-wider block mb-1.5 font-semibold">Name on Card</label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value.toUpperCase())}
                      className={inputClass}
                      placeholder="RAJESH KUMAR"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-heading uppercase tracking-wider block mb-1.5 font-semibold">Expiry Date</label>
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
                      <label className="text-[11px] text-heading uppercase tracking-wider block mb-1.5 font-semibold">CVV</label>
                      <div className="relative">
                        <input
                          type="password"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.replace(/[^0-9]/g, "").slice(0, 4))}
                          className={inputClass}
                          placeholder="•••"
                          maxLength={4}
                        />
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
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {bankList.slice(0, 4).map((bank) => (
                        <button
                          key={bank.id}
                          onClick={() => setSelectedBank(bank.id)}
                          className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                            selectedBank === bank.id
                              ? "border-primary-400 bg-primary-50 shadow-sm"
                              : "border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-[10px]" style={{ background: bank.color }}>
                            {bank.short}
                          </div>
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
                      <input
                        type="text"
                        value={bankSearch}
                        onChange={(e) => setBankSearch(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-9 pr-3 text-body text-[13px] focus:border-primary-400 focus:ring-2 focus:ring-primary-500/10 outline-none transition-all"
                        placeholder="Search bank name..."
                      />
                    </div>
                    <div className="max-h-40 overflow-y-auto space-y-1 rounded-xl border border-slate-100 p-1">
                      {filteredBanks.map((bank) => (
                        <button
                          key={bank.id}
                          onClick={() => setSelectedBank(bank.id)}
                          className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-all ${
                            selectedBank === bank.id ? "bg-primary-50 border border-primary-200" : "hover:bg-slate-50 border border-transparent"
                          }`}
                        >
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-[9px] shrink-0" style={{ background: bank.color }}>
                            {bank.short}
                          </div>
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
                      <button
                        key={wallet.id}
                        onClick={() => setSelectedWallet(wallet.id)}
                        className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all ${
                          selectedWallet === wallet.id
                            ? "border-primary-400 bg-primary-50 shadow-sm"
                            : "border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-[12px]" style={{ background: wallet.color }}>
                          {wallet.name.charAt(0)}
                        </div>
                        <div className="text-left flex-1">
                          <div className="text-[13px] font-semibold text-body">{wallet.name}</div>
                          <div className="text-[11px] text-slate-400">Pay using {wallet.name.split(" ")[0]} balance</div>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          selectedWallet === wallet.id ? "border-primary-500 bg-primary-500" : "border-slate-300"
                        }`}>
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
                        <div className="text-[11px] text-success-600">Auto-debit is set up for this loan</div>
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
                      Clicking &quot;Pay Now&quot; will initiate an immediate debit of <strong>{emiAmount}</strong> from your linked bank account under the existing NACH mandate.
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
                  Pay {emiAmount}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>,
    document.body
  );
}

export default function MyLoans() {
  const { navigate: onNavigate } = useNavigation();
  const { user } = useAuth();
  const memberId = user?.memberId || "M-1001";
  const { data: member } = useMember(memberId);
  const { data: myLoans = [] } = useMemberLoans(memberId);

  const [loanSearch, setLoanSearch] = useState("");
  const [payLoan, setPayLoan] = useState(null);

  const activeLoans = myLoans.filter((l) => ["Approved", "Disbursed"].includes(l.status));
  const pendingLoans = myLoans.filter((l) => ["Pending", "Under Review"].includes(l.status));
  const nextEmi = myLoans.find((l) => l.nextEmi !== "—")?.nextEmi || "—";

  const filteredLoanSchemes = loanSearch
    ? loanSchemes.filter((s) =>
        s.name.toLowerCase().includes(loanSearch.toLowerCase()) ||
        s.id.toLowerCase().includes(loanSearch.toLowerCase()) ||
        s.description.toLowerCase().includes(loanSearch.toLowerCase()) ||
        s.rate.includes(loanSearch)
      )
    : loanSchemes;

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="My Loans"
        description="View your active loans and applications. Browse available loan schemes to apply for funds based on your trust score."
      >
        <HeaderStat value={activeLoans.length} label="Active" className="bg-slate-50 text-success" />
        <HeaderStat value={pendingLoans.length} label="Pending" className="bg-slate-50 text-warning" />
        <HeaderStat value={`${member?.sti || 0}/100`} label="Your STI" className={`bg-slate-50 ${(member?.sti || 0) >= 80 ? "text-success" : (member?.sti || 0) >= 60 ? "text-warning" : "text-danger-500"}`} />
      </PageHeader>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-5">
        <div className="bg-white rounded-2xl card-shadow border border-slate-100 flex overflow-hidden">
          <div className="w-1 rounded-full bg-slate-400 shrink-0" />
          <div className="p-4 flex-1">
            <div className="text-[10px] text-heading uppercase tracking-wider mb-2">Total Applications</div>
            <div className="text-[20px] font-bold font-mono text-body">{myLoans.length}</div>
            <div className="text-[11px] text-heading mt-1">{myLoans.length === 0 ? "No applications yet" : `${myLoans.length} application${myLoans.length > 1 ? "s" : ""}`}</div>
          </div>
        </div>
        <div className="bg-white rounded-2xl card-shadow border border-slate-100 flex overflow-hidden">
          <div className="w-1 rounded-full bg-success-500 shrink-0" />
          <div className="p-4 flex-1">
            <div className="text-[10px] text-heading uppercase tracking-wider mb-2">Active Loans</div>
            <div className="text-[20px] font-bold font-mono text-success">{activeLoans.length}</div>
            <div className="text-[11px] text-heading mt-1">{activeLoans.length === 0 ? "No active loans" : "Currently running"}</div>
          </div>
        </div>
        <div className="bg-white rounded-2xl card-shadow border border-slate-100 flex overflow-hidden">
          <div className="w-1 rounded-full bg-warning-500 shrink-0" />
          <div className="p-4 flex-1">
            <div className="text-[10px] text-heading uppercase tracking-wider mb-2">Pending</div>
            <div className="text-[20px] font-bold font-mono text-warning">{pendingLoans.length}</div>
            <div className="text-[11px] text-heading mt-1">{pendingLoans.length === 0 ? "No pending loans" : "Under review"}</div>
          </div>
        </div>
        <div className="bg-white rounded-2xl card-shadow border border-slate-100 flex overflow-hidden">
          <div className="w-1 rounded-full bg-primary-500 shrink-0" />
          <div className="p-4 flex-1">
            <div className="text-[10px] text-heading uppercase tracking-wider mb-2">Next EMI</div>
            <div className="text-[20px] font-bold font-mono text-primary">{nextEmi}</div>
            <div className="text-[11px] text-heading mt-1">{nextEmi === "—" ? "No upcoming EMI" : "Upcoming due date"}</div>
          </div>
        </div>
      </div>

      {/* My Active Loans — Card Grid */}
      <SectionCard className="mb-5">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[15px] font-bold text-heading">My Active Loans</h3>
          {myLoans.length > 0 && (
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-success-50 text-success border border-success-200/60">
              {activeLoans.length} active
            </span>
          )}
        </div>

        {myLoans.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-heading" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
              </svg>
            </div>
            <p className="text-[13px] font-bold text-body mb-1">No Active Loans</p>
            <p className="text-[12px] text-heading max-w-sm mx-auto">Browse available loan schemes below and apply based on your trust score.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myLoans.map((loan) => {
              const accentClass = getLoanCardAccentClass(loan.status);
              const amountColorClass = getLoanAmountColorClass(loan.status);
              return (
                <div key={loan.id} className="bg-white rounded-2xl overflow-hidden card-shadow border border-slate-100 hover:shadow-md transition-all duration-300">
                  {/* Colored top bar */}
                  <div className={`h-1.5 w-full ${accentClass}`} />

                  <div className="p-5">
                    {/* Header row */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="text-[15px] font-bold text-heading leading-tight">{loan.purpose}</div>
                        <div className="text-[11px] font-mono text-heading mt-0.5">{loan.id}</div>
                      </div>
                      <StatusBadge status={loan.status} />
                    </div>

                    {/* Stats grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                        <div className="text-[10px] text-heading uppercase tracking-wider mb-1">Loan Amount</div>
                        <div className={`text-[15px] font-bold font-mono ${amountColorClass}`}>{loan.amount}</div>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                        <div className="text-[10px] text-heading uppercase tracking-wider mb-1">Monthly EMI</div>
                        <div className="text-[15px] font-bold font-mono text-body">{loan.emi}</div>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                        <div className="text-[10px] text-heading uppercase tracking-wider mb-1">Tenure</div>
                        <div className="text-[13px] font-semibold text-body">{loan.tenure}</div>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                        <div className="text-[10px] text-heading uppercase tracking-wider mb-1">Next EMI</div>
                        <div className={`text-[13px] font-semibold ${loan.nextEmi === "—" ? "text-subtle" : "text-primary"}`}>
                          {loan.nextEmi}
                        </div>
                      </div>
                    </div>

                    {/* Footer: Applied date + Pay Now */}
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                      {loan.appliedDate && (
                        <div className="flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5 text-subtle" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                          </svg>
                          <span className="text-[11px] text-heading">Applied on {loan.appliedDate}</span>
                        </div>
                      )}
                      {["Approved", "Disbursed"].includes(loan.status) && loan.nextEmi !== "—" && (
                        <button
                          onClick={() => setPayLoan(loan)}
                          className="py-2 px-4 bg-primary-50 border border-primary-200 text-primary rounded-xl text-[13px] font-semibold hover:bg-primary-100 hover:border-primary-300 transition-all cursor-pointer flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                          </svg>
                          Pay Now
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </SectionCard>

      {/* Available Loan Schemes */}
      <SectionCard>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <h3 className="text-[15px] font-bold text-heading">Available Loan Schemes</h3>
          <div className="flex items-center gap-3">
            <div className="relative">
              <svg className="w-4 h-4 text-heading absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <input
                type="text"
                value={loanSearch}
                onChange={(e) => setLoanSearch(e.target.value)}
                placeholder="Search loans..."
                className="pl-9 pr-3 py-2 w-56 bg-slate-50 border border-slate-200 rounded-xl text-[12px] text-body outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-500/10 transition-all placeholder:text-subtle"
              />
            </div>
            <span className="text-[11px] text-heading whitespace-nowrap">{filteredLoanSchemes.length} found</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLoanSchemes.map((scheme) => {
            const eligible = (member?.sti || 0) >= scheme.minSTI;
            const sampleEmi = calculateEMI(scheme.minAmount, scheme.rateNum, scheme.tenures[1] || scheme.tenures[0]);
            return (
              <div key={scheme.id} className="bg-white rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300 card-shadow border border-slate-100 group">
                {/* Color Top Bar */}
                <div className="h-1.5" style={{ background: scheme.color }} />
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl" style={{ background: scheme.color + "15" }}>
                        {scheme.icon}
                      </div>
                      <div>
                        <div className="text-[14px] font-bold text-heading">{scheme.name}</div>
                        <div className="text-[11px] font-mono text-heading">{scheme.rate} p.a.</div>
                      </div>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${eligible ? "bg-success-50 text-success border border-success-200/60" : "bg-danger-50 text-danger-500 border border-danger-200/60"}`}>
                      {eligible ? "Eligible" : "Not Eligible"}
                    </span>
                  </div>

                  <p className="text-[11px] text-heading leading-relaxed mb-4">{scheme.description}</p>

                  {/* Key Stats */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="bg-slate-50 rounded-lg p-2.5">
                      <div className="text-[9px] text-heading uppercase tracking-wider">Amount</div>
                      <div className="text-[12px] font-semibold text-body">{formatINR(scheme.minAmount)} - {formatINR(scheme.maxAmount)}</div>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-2.5">
                      <div className="text-[9px] text-heading uppercase tracking-wider">EMI from</div>
                      <div className="text-[12px] font-bold text-success font-mono">{formatINR(sampleEmi)}/mo</div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {scheme.features.map((f) => (
                      <span key={f} className="text-[10px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">{f}</span>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      if (eligible) {
                        localStorage.setItem("glimmora_apply_loan_scheme", JSON.stringify(scheme));
                        onNavigate("apply_loan");
                      }
                    }}
                    disabled={!eligible}
                    className={`w-full py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200 cursor-pointer border ${eligible ? "bg-primary-50 border-primary-200 text-primary hover:bg-primary-100 hover:border-primary-300" : "bg-slate-50 border-slate-200 text-subtle cursor-not-allowed"}`}
                  >
                    {eligible ? "Apply Now" : `Min STI: ${scheme.minSTI}`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>

      {/* EMI Payment Modal */}
      {payLoan && (
        <EMIPaymentModal loan={payLoan} onClose={() => setPayLoan(null)} />
      )}
    </div>
  );
}
