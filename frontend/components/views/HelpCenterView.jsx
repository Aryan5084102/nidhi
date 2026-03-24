"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import useNavigation from "@/hooks/useNavigation";

// ── FAQ Data ─────────────────────────────────────────────────────────────────

const MEMBER_FAQS = [
  {
    category: "Chit Funds",
    icon: "🔄",
    questions: [
      { q: "What is a chit fund?", a: "A chit fund is a rotating savings scheme where a group of members contribute a fixed monthly amount. Each month, one member wins the pot through an auction. It's a blend of savings and borrowing regulated under the Chit Funds Act, 1982." },
      { q: "How do I enroll in a chit fund?", a: "Go to My Chit Funds → browse available schemes → click 'Enroll Now'. You'll need to meet the minimum STI score and KYC requirements. Your enrollment will be reviewed and approved by a manager." },
      { q: "How does the auction work?", a: "Each month, eligible members bid a discount they're willing to accept. The member who bids the lowest amount wins the pot. The discount is distributed as dividend among other members. You can only win once per scheme." },
      { q: "When will I receive my payout?", a: "You'll receive your payout in the month you win the auction. If you haven't won yet, you can check your position in My Chit Funds → View Members & Rotation." },
    ],
  },
  {
    category: "Loans",
    icon: "💰",
    questions: [
      { q: "How do I apply for a loan?", a: "Go to My Loans → browse Available Loan Schemes → click 'Apply Now'. Fill in the amount, tenure, purpose, and employment details. Your application will be reviewed by the branch manager." },
      { q: "What is the minimum STI score for a loan?", a: "Each loan scheme has its own minimum STI requirement (typically 30–65). Personal loans require STI ≥ 50, Gold loans require STI ≥ 30, and Business loans require STI ≥ 65." },
      { q: "How do I pay my EMI?", a: "Go to My Loans → find your active loan → click 'Pay Now'. You can pay via UPI, Cards, Net Banking, Wallets, or Auto-Debit (NACH)." },
      { q: "What happens if I miss an EMI?", a: "Missing 3 consecutive EMIs may flag your loan as a default. This will lower your STI score and may affect future loan eligibility. Contact the branch immediately if you're facing difficulties." },
    ],
  },
  {
    category: "Deposits",
    icon: "🏦",
    questions: [
      { q: "What types of deposits are available?", a: "We offer Fixed Deposits (FD), Recurring Deposits (RD), and Savings accounts. FDs offer the highest interest rates (up to 9.5%), RDs allow monthly savings, and Savings accounts earn 4% interest." },
      { q: "How do I open a deposit?", a: "Go to My Deposits → click 'Open New Deposit' → select deposit type → enter amount, tenure, and nominee details → submit. Your application will be reviewed and approved." },
      { q: "Can I withdraw my deposit early?", a: "Early withdrawal is possible for FDs with a small penalty. RDs can be closed early but you may receive reduced interest. Contact the branch for specific terms." },
      { q: "What is auto-renewal?", a: "If auto-renewal is enabled, your FD will automatically renew at maturity for the same tenure at the prevailing interest rate. You can change this setting anytime before maturity." },
    ],
  },
  {
    category: "Account & KYC",
    icon: "👤",
    questions: [
      { q: "How do I complete my KYC?", a: "Go to Profile → KYC Documents → upload your PAN card, Aadhaar card, Address proof, and Passport photo. Each document will be verified by the compliance team." },
      { q: "What is the STI score?", a: "STI (Strength Through Integrity) is a trust score from 0–100 based on payment punctuality (25%), account activity (25%), KYC status (20%), fraud flags (15%), and deposit tenure (15%). Higher scores unlock better loan rates and chit fund access." },
      { q: "How can I improve my STI score?", a: "Pay EMIs and contributions on time, complete your KYC verification, maintain active deposits, and keep a clean fraud record. Your STI is recalculated weekly." },
      { q: "How do I change my password?", a: "Go to Profile → scroll down to the Security section → click 'Change Password'. You'll need your current password and a new password meeting the requirements." },
    ],
  },
];

const ADMIN_FAQS = [
  {
    category: "Member Management",
    icon: "👥",
    questions: [
      { q: "How do I add a new member?", a: "Go to Members → click 'Add Member' → fill in the member's details (name, phone, email, address). The member will be created with a default STI score and KYC status as 'Pending'." },
      { q: "How do I verify a member's KYC?", a: "Go to Compliance → KYC Monitoring tab → find the member → review their uploaded documents → mark each document as verified or rejected." },
      { q: "How do I deactivate a member?", a: "Go to Members → find the member → click the delete/deactivate option. Only Admin role can deactivate members. Ensure all active loans and enrollments are settled first." },
    ],
  },
  {
    category: "Loan & Deposit Management",
    icon: "📋",
    questions: [
      { q: "How do I approve a loan?", a: "Go to Loans → Approval tab → review the application details, AI risk score, and member STI → click Approve or Reject. After approval, the loan can be disbursed from the same tab." },
      { q: "How do I handle loan defaults?", a: "Go to Loans → Defaults tab → view all defaulted accounts. Assign recovery agents, update recovery status, and track outstanding amounts. Members with 3+ missed EMIs are flagged automatically." },
      { q: "How do I create a new chit scheme?", a: "Go to Chit Funds → Schemes tab → click 'Create Scheme'. Set the name, monthly amount, duration, total members, minimum STI, and KYC requirements." },
    ],
  },
  {
    category: "Compliance & Fraud",
    icon: "🛡️",
    questions: [
      { q: "How do I check compliance status?", a: "Go to Compliance → Dashboard tab → view the overall compliance score and status by category (Capital Adequacy, Membership, Lending, etc.). The Checklist tab shows all individual compliance rules." },
      { q: "How do I investigate a fraud case?", a: "Go to Fraud Intel → Active Cases tab → click on a case to view details → update status (Investigating/Resolved/False Positive) and add remarks. The AI Fraud Sentinel agent detects anomalies automatically." },
      { q: "Where are the regulatory filings?", a: "Go to Compliance → Regulatory Filings tab → view all required filings (NDH-1, NDH-3, AOC-4, MGT-7A) with their deadlines and status." },
    ],
  },
  {
    category: "System & Configuration",
    icon: "⚙️",
    questions: [
      { q: "How do I manage users?", a: "Go to Settings → User Management tab → add, edit, or deactivate system users. You can assign roles (Admin, Branch Manager, Member) to control access." },
      { q: "How do I configure interest rates?", a: "Go to Settings → Deposits/Loans tabs → update minimum amounts, maximum rates, default thresholds, and other parameters. Changes take effect immediately for new applications." },
      { q: "How do I view audit logs?", a: "Go to Settings → Audit Log tab or Compliance → Audit Logs tab → view all system actions with timestamps, user details, IP addresses, and modules." },
    ],
  },
];

const CONTACT_OPTIONS = [
  { icon: "📧", label: "Email Support", value: "support@glimmora.com", desc: "Get a response within 24 hours" },
  { icon: "📞", label: "Phone", value: "+91 80-4567-8901", desc: "Mon–Sat, 9:00 AM – 6:00 PM IST" },
  { icon: "💬", label: "AI Assistant", value: "Available 24/7", desc: "Get instant answers to your questions", action: true },
];

// ── Components ───────────────────────────────────────────────────────────────

function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3.5 text-left cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
      >
        <span className="text-[13px] font-medium text-slate-800 dark:text-slate-200 pr-4">{question}</span>
        <svg
          className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="px-4 pb-4 pt-0 animate-fade-in">
          <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────

export default function HelpCenterView() {
  const { isMember } = useAuth();
  const { navigate } = useNavigation();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);

  const faqs = isMember ? MEMBER_FAQS : [...MEMBER_FAQS, ...ADMIN_FAQS];

  // Filter by search
  const filteredFaqs = faqs
    .map((cat) => ({
      ...cat,
      questions: cat.questions.filter(
        (q) =>
          q.q.toLowerCase().includes(search.toLowerCase()) ||
          q.a.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter((cat) => cat.questions.length > 0);

  // Filter by category
  const displayFaqs = activeCategory
    ? filteredFaqs.filter((cat) => cat.category === activeCategory)
    : filteredFaqs;

  const allCategories = faqs.map((c) => c.category);

  return (
    <div className="space-y-6">
      {/* ── Hero Section ─────────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-primary-500/10 via-success-500/5 to-transparent border border-primary-200/40 dark:border-primary-800/30 rounded-2xl p-6 md:p-8 text-center">
        <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
          </svg>
        </div>
        <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2">
          How can we help you?
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-5 max-w-md mx-auto">
          Find answers to common questions or reach out to our support team
        </p>

        {/* Search */}
        <div className="relative max-w-md mx-auto">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for help..."
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all"
          />
        </div>
      </div>

      {/* ── Quick Actions ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {CONTACT_OPTIONS.map((opt) => (
          <button
            key={opt.label}
            onClick={opt.action ? () => navigate("aiassistant") : undefined}
            className={`flex items-start gap-3 p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-left transition-all ${
              opt.action ? "hover:border-primary-300 hover:shadow-md hover:shadow-primary-500/10 cursor-pointer" : ""
            }`}
          >
            <span className="text-2xl">{opt.icon}</span>
            <div>
              <p className="text-[13px] font-semibold text-slate-800 dark:text-slate-200">{opt.label}</p>
              <p className="text-[12px] font-medium text-primary-500 mt-0.5">{opt.value}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{opt.desc}</p>
            </div>
          </button>
        ))}
      </div>

      {/* ── Category Tabs ────────────────────────────────────────────── */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        <button
          onClick={() => setActiveCategory(null)}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            !activeCategory
              ? "bg-primary-500 text-white shadow-sm"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
          }`}
        >
          All Topics
        </button>
        {allCategories.map((cat) => {
          const faq = faqs.find((f) => f.category === cat);
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                activeCategory === cat
                  ? "bg-primary-500 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              <span>{faq?.icon}</span>
              {cat}
            </button>
          );
        })}
      </div>

      {/* ── FAQ Sections ─────────────────────────────────────────────── */}
      {displayFaqs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-400 text-sm">No results found for &ldquo;{search}&rdquo;</p>
          <button
            onClick={() => { setSearch(""); setActiveCategory(null); }}
            className="text-primary-500 text-sm font-medium mt-2 cursor-pointer hover:text-primary-700"
          >
            Clear search
          </button>
        </div>
      ) : (
        displayFaqs.map((cat) => (
          <div key={cat.category}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">{cat.icon}</span>
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">{cat.category}</h2>
              <span className="text-[11px] text-slate-400 font-medium">({cat.questions.length})</span>
            </div>
            <div className="space-y-2">
              {cat.questions.map((faq) => (
                <FAQItem key={faq.q} question={faq.q} answer={faq.a} />
              ))}
            </div>
          </div>
        ))
      )}

      {/* ── Still need help? ─────────────────────────────────────────── */}
      <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-center">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
          Still need help?
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Our AI Assistant can answer any question about your account, transactions, or platform features.
        </p>
        <button
          onClick={() => navigate("aiassistant")}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-400 hover:from-primary-600 hover:to-primary-500 text-white text-[13px] font-semibold rounded-xl shadow-md shadow-primary-500/20 cursor-pointer transition-all active:scale-[0.98]"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
          </svg>
          Chat with AI Assistant
        </button>
      </div>
    </div>
  );
}
