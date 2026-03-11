/* eslint-disable import/no-commonjs */
const member = require('../public/icon/members.png')
const loan = require('../public/icon/loan.png')
const deposit = require('../public/icon/deposit.png')
const liquidity = require('../public/icon/liquidity.png')
const alert = require('../public/icon/alert.png')
const compliance = require('../public/icon/compliance.png')
const fund = require('../public/icon/fund.png')
const executive = require('../public/icon/executive.png')
const agent = require('../public/icon/agent.png')
const config = require('../public/icon/config.png')




export const metrics = [
  { label: "Active Members", value: "12,450", change: "+4.2%", icon: member, color: "#5B9E8A" },
  { label: "Active Loans", value: "5,200", change: "+1.8%", icon: loan, color: "#6B8ABF" },
  { label: "Deposit Pool", value: "₹45M", change: "+6.1%", icon: deposit, color: "#9585B5" },
  { label: "Liquidity Ratio", value: "1.45", change: "-0.03", icon: liquidity, color: "#C49A4C" },
  { label: "AI Risk Alerts", value: "23", change: "+5", icon: alert, color: "#BF6F6D" },
  { label: "Compliance Score", value: "94%", change: "+2%", icon: compliance, color: "#6B9E89" },
];

export const members = [
  { id: "M-1001", name: "Rajesh Kumar", phone: "9876543210", email: "rajesh@email.com", address: "12, MG Road, Bengaluru", deposits: "₹50,000", loans: "₹10,000", risk: "Low", sti: 92, kyc: "Verified", joinDate: "15 Jan 2025" },
  { id: "M-1002", name: "Anita Sharma", phone: "9876543211", email: "anita@email.com", address: "45, Jayanagar, Bengaluru", deposits: "₹70,000", loans: "₹20,000", risk: "Medium", sti: 74, kyc: "Verified", joinDate: "20 Feb 2025" },
  { id: "M-1003", name: "Vikram Nair", phone: "9876543212", email: "vikram@email.com", address: "78, Koramangala, Bengaluru", deposits: "₹30,000", loans: "₹15,000", risk: "High", sti: 45, kyc: "Pending", joinDate: "10 Mar 2025" },
  { id: "M-1004", name: "Priya Venkat", phone: "9876543213", email: "priya@email.com", address: "23, Indiranagar, Bengaluru", deposits: "₹90,000", loans: "₹5,000", risk: "Low", sti: 88, kyc: "Verified", joinDate: "05 Apr 2025" },
  { id: "M-1005", name: "Suresh Iyer", phone: "9876543214", email: "suresh@email.com", address: "56, HSR Layout, Bengaluru", deposits: "₹25,000", loans: "₹12,000", risk: "High", sti: 38, kyc: "Review", joinDate: "12 May 2025" },
  { id: "M-1006", name: "Meena Pillai", phone: "9876543215", email: "meena@email.com", address: "89, Whitefield, Bengaluru", deposits: "₹60,000", loans: "₹8,000", risk: "Low", sti: 95, kyc: "Verified", joinDate: "18 Jun 2025" },
  { id: "M-1007", name: "Karthik Menon", phone: "9876543216", email: "karthik@email.com", address: "34, BTM Layout, Bengaluru", deposits: "₹45,000", loans: "₹18,000", risk: "Medium", sti: 68, kyc: "Verified", joinDate: "22 Jul 2025" },
  { id: "M-1008", name: "Deepa Reddy", phone: "9876543217", email: "deepa@email.com", address: "67, Electronic City, Bengaluru", deposits: "₹80,000", loans: "₹7,000", risk: "Low", sti: 85, kyc: "Verified", joinDate: "01 Aug 2025" },
  { id: "M-1009", name: "Arun Prasad", phone: "9876543218", email: "arun@email.com", address: "90, Marathahalli, Bengaluru", deposits: "₹35,000", loans: "₹22,000", risk: "High", sti: 42, kyc: "Pending", joinDate: "15 Sep 2025" },
  { id: "M-1010", name: "Lakshmi Devi", phone: "9876543219", email: "lakshmi@email.com", address: "11, Banashankari, Bengaluru", deposits: "₹55,000", loans: "₹9,000", risk: "Low", sti: 90, kyc: "Verified", joinDate: "20 Oct 2025" },
  { id: "M-1011", name: "Ramesh Babu", phone: "9876543220", email: "ramesh@email.com", address: "44, Rajajinagar, Bengaluru", deposits: "₹40,000", loans: "₹14,000", risk: "Medium", sti: 65, kyc: "Verified", joinDate: "05 Nov 2025" },
  { id: "M-1012", name: "Sunita Rao", phone: "9876543221", email: "sunita@email.com", address: "77, Malleshwaram, Bengaluru", deposits: "₹95,000", loans: "₹3,000", risk: "Low", sti: 96, kyc: "Verified", joinDate: "10 Dec 2025" },
  { id: "M-1013", name: "Ganesh Hegde", phone: "9876543222", email: "ganesh@email.com", address: "22, Yelahanka, Bengaluru", deposits: "₹28,000", loans: "₹16,000", risk: "High", sti: 40, kyc: "Review", joinDate: "18 Jan 2026" },
  { id: "M-1014", name: "Kavitha Nair", phone: "9876543223", email: "kavitha@email.com", address: "55, JP Nagar, Bengaluru", deposits: "₹72,000", loans: "₹11,000", risk: "Medium", sti: 72, kyc: "Verified", joinDate: "25 Jan 2026" },
  { id: "M-1015", name: "Mohan Das", phone: "9876543224", email: "mohan@email.com", address: "88, Vijayanagar, Bengaluru", deposits: "₹65,000", loans: "₹6,000", risk: "Low", sti: 87, kyc: "Verified", joinDate: "02 Feb 2026" },
  { id: "M-1016", name: "Savitha Kulkarni", phone: "9876543225", email: "savitha@email.com", address: "33, Basavanagudi, Bengaluru", deposits: "₹48,000", loans: "₹19,000", risk: "Medium", sti: 70, kyc: "Verified", joinDate: "10 Feb 2026" },
  { id: "M-1017", name: "Vinod Shetty", phone: "9876543226", email: "vinod@email.com", address: "66, Hebbal, Bengaluru", deposits: "₹22,000", loans: "₹25,000", risk: "High", sti: 35, kyc: "Pending", joinDate: "18 Feb 2026" },
  { id: "M-1018", name: "Padma Krishnan", phone: "9876543227", email: "padma@email.com", address: "99, Sadashivanagar, Bengaluru", deposits: "₹85,000", loans: "₹4,000", risk: "Low", sti: 93, kyc: "Verified", joinDate: "25 Feb 2026" },
];

export const agents = [
  { name: "Onboarding Agent", status: "Active", processed: 142, pending: 8, color: "#5B9E8A" },
  { name: "Compliance Agent", status: "Active", processed: 89, pending: 3, color: "#6B8ABF" },
  { name: "Risk Review Agent", status: "Warning", processed: 201, pending: 14, color: "#C49A4C" },
  { name: "Liquidity Agent", status: "Active", processed: 67, pending: 2, color: "#9585B5" },
  { name: "Fraud Triage Agent", status: "Alert", processed: 34, pending: 5, color: "#BF6F6D" },
  { name: "Executive Reporting", status: "Active", processed: 12, pending: 1, color: "#6B9E89" },
];

export const liquidityData = [
  { month: "Oct", inflow: 42, payout: 35 },
  { month: "Nov", inflow: 48, payout: 38 },
  { month: "Dec", inflow: 55, payout: 40 },
  { month: "Jan", inflow: 50, payout: 45 },
  { month: "Feb", inflow: 62, payout: 42 },
  { month: "Mar", inflow: 68, payout: 48 },
];

export const fraudAlerts = [
  { id: "FA-001", type: "Auction Manipulation", member: "M-1003", severity: "High", time: "2h ago", status: "Open" },
  { id: "FA-002", type: "Suspicious Network", member: "M-1005", severity: "Critical", time: "4h ago", status: "Review" },
  { id: "FA-003", type: "Behavioural Anomaly", member: "M-1008", severity: "Medium", time: "6h ago", status: "Open" },
];

export const roadmap = [
  { phase: "Phase 0", title: "Foundation", duration: "0-3m", status: "complete" },
  { phase: "Phase 1", title: "Core Digitisation", duration: "4-8m", status: "active" },
  { phase: "Phase 2", title: "Trust & Compliance", duration: "9-12m", status: "upcoming" },
  { phase: "Phase 3", title: "Liquidity & Fraud", duration: "13-16m", status: "upcoming" },
  { phase: "Phase 4", title: "Governance", duration: "17-20m", status: "upcoming" },
  { phase: "Phase 5", title: "Scale-Out", duration: "21+m", status: "upcoming" },
];

export const chitSchemes = [
  {
    id: "CS-001",
    name: "Glimmora Gold 25",
    monthlyAmount: "₹5,000",
    duration: "25 months",
    totalMembers: 25,
    enrolledMembers: 18,
    potSize: "₹1,25,000",
    nextAuction: "2026-03-22",
    status: "Open",
    description: "Ideal for small savings. Monthly contribution of ₹5,000 with a pot value of ₹1.25 Lakhs. Open to all verified members.",
    minSTI: 60,
    kycRequired: "Verified",
  },
  {
    id: "CS-002",
    name: "Glimmora Silver 30",
    monthlyAmount: "₹10,000",
    duration: "30 months",
    totalMembers: 30,
    enrolledMembers: 30,
    potSize: "₹3,00,000",
    nextAuction: "2026-03-18",
    status: "Full",
    description: "Mid-tier scheme for regular savers. Monthly contribution of ₹10,000 with a pot value of ₹3 Lakhs.",
    minSTI: 70,
    kycRequired: "Verified",
  },
  {
    id: "CS-003",
    name: "Glimmora Diamond 20",
    monthlyAmount: "₹25,000",
    duration: "20 months",
    totalMembers: 20,
    enrolledMembers: 12,
    potSize: "₹5,00,000",
    nextAuction: "2026-04-01",
    status: "Open",
    description: "Premium scheme for high-value contributors. Monthly ₹25,000 with a ₹5 Lakhs pot. Requires strong trust score.",
    minSTI: 80,
    kycRequired: "Verified",
  },
  {
    id: "CS-004",
    name: "Glimmora Platinum 40",
    monthlyAmount: "₹50,000",
    duration: "40 months",
    totalMembers: 40,
    enrolledMembers: 22,
    potSize: "₹20,00,000",
    nextAuction: "2026-04-10",
    status: "Open",
    description: "Our flagship long-duration scheme. Monthly ₹50,000 with a ₹20 Lakhs pot. Suitable for serious investors.",
    minSTI: 85,
    kycRequired: "Verified",
  },
  {
    id: "CS-005",
    name: "Glimmora Starter 20",
    monthlyAmount: "₹2,000",
    duration: "20 months",
    totalMembers: 20,
    enrolledMembers: 15,
    potSize: "₹40,000",
    nextAuction: "2026-03-25",
    status: "Open",
    description: "Entry-level scheme for new members. Low monthly commitment of ₹2,000 with a ₹40,000 pot. Great for beginners.",
    minSTI: 40,
    kycRequired: "Pending",
  },
  {
    id: "CS-006",
    name: "Glimmora Family 25",
    monthlyAmount: "₹15,000",
    duration: "25 months",
    totalMembers: 25,
    enrolledMembers: 25,
    potSize: "₹3,75,000",
    nextAuction: "2026-03-20",
    status: "Full",
    description: "Family-oriented savings scheme. Monthly ₹15,000 with a ₹3.75 Lakhs pot. Joint member accounts allowed.",
    minSTI: 65,
    kycRequired: "Verified",
  },
];

export const loanApplications = [
  {
    id: "LA-001", memberId: "M-1001", memberName: "Rajesh Kumar", amount: "₹2,00,000",
    purpose: "Business Expansion", tenure: "24 months", interestRate: "12%", risk: "Low",
    stiScore: 92, status: "Approved", appliedDate: "05 Mar 2026", emi: "₹9,420", nextEmi: "15 Mar 2026",
  },
  {
    id: "LA-002", memberId: "M-1002", memberName: "Anita Sharma", amount: "₹5,00,000",
    purpose: "Home Renovation", tenure: "36 months", interestRate: "11.5%", risk: "Medium",
    stiScore: 74, status: "Under Review", appliedDate: "08 Mar 2026", emi: "₹16,500", nextEmi: "—",
  },
  {
    id: "LA-003", memberId: "M-1003", memberName: "Vikram Nair", amount: "₹1,50,000",
    purpose: "Education", tenure: "18 months", interestRate: "13%", risk: "High",
    stiScore: 45, status: "Pending", appliedDate: "09 Mar 2026", emi: "₹9,250", nextEmi: "—",
  },
  {
    id: "LA-004", memberId: "M-1004", memberName: "Priya Venkat", amount: "₹3,00,000",
    purpose: "Medical Emergency", tenure: "12 months", interestRate: "10.5%", risk: "Low",
    stiScore: 88, status: "Disbursed", appliedDate: "01 Mar 2026", emi: "₹26,400", nextEmi: "18 Mar 2026",
  },
  {
    id: "LA-005", memberId: "M-1005", memberName: "Suresh Iyer", amount: "₹75,000",
    purpose: "Vehicle Purchase", tenure: "12 months", interestRate: "14%", risk: "High",
    stiScore: 38, status: "Rejected", appliedDate: "28 Feb 2026", emi: "—", nextEmi: "—",
  },
  {
    id: "LA-006", memberId: "M-1006", memberName: "Meena Pillai", amount: "₹4,00,000",
    purpose: "Business Expansion", tenure: "36 months", interestRate: "11%", risk: "Low",
    stiScore: 95, status: "Approved", appliedDate: "03 Mar 2026", emi: "₹13,100", nextEmi: "20 Mar 2026",
  },
  {
    id: "LA-007", memberId: "M-1002", memberName: "Anita Sharma", amount: "₹1,00,000",
    purpose: "Gold Loan", tenure: "6 months", interestRate: "9.5%", risk: "Low",
    stiScore: 74, status: "Pending", appliedDate: "10 Mar 2026", emi: "₹17,250", nextEmi: "—",
  },
];

export const loanPortfolio = [
  { category: "Personal Loans", count: 1800, sanctioned: 9000000, disbursed: 7800000, npa: 45, avgRate: "12.5%", color: "#6366F1" },
  { category: "Business Loans", count: 1400, sanctioned: 12000000, disbursed: 10500000, npa: 62, avgRate: "11.0%", color: "#0D9488" },
  { category: "Gold Loans", count: 900, sanctioned: 5400000, disbursed: 5200000, npa: 12, avgRate: "9.5%", color: "#C9982E" },
  { category: "Education Loans", count: 650, sanctioned: 3200000, disbursed: 2800000, npa: 28, avgRate: "10.5%", color: "#7C3AED" },
  { category: "Emergency Loans", count: 350, sanctioned: 1750000, disbursed: 1600000, npa: 18, avgRate: "13.0%", color: "#DC2626" },
  { category: "Vehicle Loans", count: 100, sanctioned: 800000, disbursed: 650000, npa: 8, avgRate: "14.0%", color: "#059669" },
];

export const loanDefaults = [
  { id: "LD-001", memberId: "M-1003", memberName: "Vikram Nair", outstanding: "₹1,20,000", missedEmis: 4, defaultDate: "15 Jan 2026", status: "In Recovery" },
  { id: "LD-002", memberId: "M-1005", memberName: "Suresh Iyer", outstanding: "₹85,000", missedEmis: 3, defaultDate: "20 Dec 2025", status: "Defaulted" },
  { id: "LD-003", memberId: "M-1008", memberName: "Karthik Menon", outstanding: "₹2,50,000", missedEmis: 6, defaultDate: "01 Nov 2025", status: "Written Off" },
  { id: "LD-004", memberId: "M-1012", memberName: "Deepa Reddy", outstanding: "₹45,000", missedEmis: 2, defaultDate: "10 Feb 2026", status: "Recovered" },
  { id: "LD-005", memberId: "M-1015", memberName: "Arun Prasad", outstanding: "₹3,20,000", missedEmis: 5, defaultDate: "05 Dec 2025", status: "In Recovery" },
];

/* ─── Deposits Data ─── */
export const depositAccounts = [
  { id: "FD-001", memberId: "M-1001", memberName: "Rajesh Kumar", type: "Fixed Deposit", amount: "₹2,00,000", rate: "9.0%", tenure: "12 months", maturityDate: "05 Mar 2027", status: "Active", openDate: "05 Mar 2026" },
  { id: "FD-002", memberId: "M-1004", memberName: "Priya Venkat", type: "Fixed Deposit", amount: "₹5,00,000", rate: "9.5%", tenure: "24 months", maturityDate: "10 Jan 2028", status: "Active", openDate: "10 Jan 2026" },
  { id: "RD-001", memberId: "M-1002", memberName: "Anita Sharma", type: "Recurring Deposit", amount: "₹10,000/mo", rate: "8.5%", tenure: "36 months", maturityDate: "15 Jun 2028", status: "Active", openDate: "15 Jun 2025" },
  { id: "RD-002", memberId: "M-1006", memberName: "Meena Pillai", type: "Recurring Deposit", amount: "₹25,000/mo", rate: "8.5%", tenure: "24 months", maturityDate: "01 Aug 2027", status: "Active", openDate: "01 Aug 2025" },
  { id: "FD-003", memberId: "M-1003", memberName: "Vikram Nair", type: "Fixed Deposit", amount: "₹1,00,000", rate: "8.0%", tenure: "6 months", maturityDate: "20 Sep 2026", status: "Maturing Soon", openDate: "20 Mar 2026" },
  { id: "SD-001", memberId: "M-1005", memberName: "Suresh Iyer", type: "Savings Deposit", amount: "₹45,000", rate: "4.0%", tenure: "—", maturityDate: "—", status: "Active", openDate: "12 Nov 2025" },
  { id: "FD-004", memberId: "M-1008", memberName: "Karthik Menon", type: "Fixed Deposit", amount: "₹3,00,000", rate: "9.0%", tenure: "12 months", maturityDate: "15 Dec 2025", status: "Matured", openDate: "15 Dec 2024" },
];

export const depositSchemes = [
  { name: "Glimmora Fixed Deposit", minAmount: "₹10,000", maxAmount: "₹25,00,000", tenures: "6/12/24/36 months", rate: "8.0% - 9.5%", members: 3200, totalCorpus: "₹18.5 Cr" },
  { name: "Glimmora Recurring Deposit", minAmount: "₹1,000/mo", maxAmount: "₹1,00,000/mo", tenures: "12/24/36 months", rate: "8.0% - 8.5%", members: 1800, totalCorpus: "₹8.2 Cr" },
  { name: "Glimmora Savings Deposit", minAmount: "₹500", maxAmount: "No Limit", tenures: "Flexible", rate: "4.0%", members: 7450, totalCorpus: "₹12.8 Cr" },
];

export const depositTrend = [
  { month: "Oct", fd: 320, rd: 180, savings: 420 },
  { month: "Nov", fd: 380, rd: 200, savings: 450 },
  { month: "Dec", fd: 420, rd: 220, savings: 480 },
  { month: "Jan", fd: 390, rd: 240, savings: 510 },
  { month: "Feb", fd: 460, rd: 260, savings: 540 },
  { month: "Mar", fd: 510, rd: 280, savings: 560 },
];

/* ─── Compliance Data ─── */
export const complianceChecklist = [
  { id: "CL-001", rule: "Net Owned Funds ≥ ₹20 Lakhs", category: "Capital Adequacy", status: "Compliant", lastAudit: "01 Mar 2026", details: "Current NOF: ₹1.2 Cr. Well above the minimum requirement under Nidhi Rules 2014." },
  { id: "CL-002", rule: "Members ≥ 200 within 1 year", category: "Membership", status: "Compliant", lastAudit: "01 Mar 2026", details: "Current members: 12,450. Exceeded requirement within 3 months of incorporation." },
  { id: "CL-003", rule: "Net Owned Funds to Deposits ≤ 1:20", category: "Deposit Ratio", status: "Compliant", lastAudit: "01 Mar 2026", details: "Current ratio 1:14.5. Within safe limits as per Nidhi (Amendment) Rules 2022." },
  { id: "CL-004", rule: "Unencumbered Deposits ≥ 10%", category: "Liquidity", status: "Warning", lastAudit: "28 Feb 2026", details: "Current unencumbered: 11.2%. Approaching lower threshold, needs monitoring." },
  { id: "CL-005", rule: "Annual KYC Re-verification", category: "KYC/AML", status: "Action Required", lastAudit: "15 Feb 2026", details: "342 members due for annual KYC re-verification. Deadline: 31 Mar 2026." },
  { id: "CL-006", rule: "Loan-to-Deposit Ratio ≤ 80%", category: "Lending Limits", status: "Compliant", lastAudit: "01 Mar 2026", details: "Current LDR: 62%. Well within the prescribed limit." },
  { id: "CL-007", rule: "ROC Annual Filing (Form NDH-3)", category: "Filing", status: "Compliant", lastAudit: "20 Feb 2026", details: "NDH-3 filed for FY 2025-26. Acknowledgment received from MCA." },
  { id: "CL-008", rule: "Director Rotation Policy", category: "Governance", status: "Compliant", lastAudit: "01 Jan 2026", details: "Board rotation completed. 2 directors retired by rotation, 2 new directors appointed." },
  { id: "CL-009", rule: "Interest Rate Cap on Deposits", category: "Rate Compliance", status: "Compliant", lastAudit: "01 Mar 2026", details: "Max deposit rate: 9.5%. Within RBI prescribed ceiling of 12.5% above bank rate." },
  { id: "CL-010", rule: "Loan Not Exceeding ₹15 Lakhs", category: "Lending Limits", status: "Compliant", lastAudit: "01 Mar 2026", details: "Max sanctioned loan: ₹5L. Well within the Nidhi Rules individual loan cap." },
];

export const complianceScore = {
  overall: 94,
  categories: [
    { name: "Capital Adequacy", score: 100, weight: 20 },
    { name: "Membership Rules", score: 100, weight: 15 },
    { name: "Deposit Compliance", score: 95, weight: 20 },
    { name: "Lending Compliance", score: 98, weight: 15 },
    { name: "KYC/AML", score: 78, weight: 15 },
    { name: "Filing & Governance", score: 96, weight: 15 },
  ],
};

export const regulatoryFilings = [
  { form: "NDH-1", description: "Return of Statutory Compliances", dueDate: "30 Apr 2026", status: "Upcoming", filedDate: "—" },
  { form: "NDH-2", description: "Application for Extension of Time", dueDate: "—", status: "Not Required", filedDate: "—" },
  { form: "NDH-3", description: "Half-Yearly Return", dueDate: "30 Sep 2026", status: "Upcoming", filedDate: "—" },
  { form: "NDH-4", description: "Application for Declaration as Nidhi", dueDate: "—", status: "Filed", filedDate: "15 Jan 2025" },
  { form: "AOC-4", description: "Annual Financial Statements", dueDate: "30 Oct 2026", status: "Upcoming", filedDate: "—" },
  { form: "MGT-7A", description: "Annual Return (Small Company)", dueDate: "28 Nov 2026", status: "Upcoming", filedDate: "—" },
];

/* ─── Fraud Intelligence Data ─── */
export const fraudCases = [
  { id: "FC-001", type: "Auction Manipulation", description: "Coordinated bidding detected in CS-002 auction. Multiple linked members placed identical bids within 2 seconds.", member: "M-1003, M-1015, M-1022", severity: "Critical", detectedBy: "AI Pattern Engine", time: "2h ago", status: "Investigating", potentialLoss: "₹3,00,000" },
  { id: "FC-002", type: "Identity Fraud", description: "Duplicate PAN card detected across 3 member accounts. Same biometric hash linked to different KYC documents.", member: "M-1005", severity: "Critical", detectedBy: "KYC Verification Agent", time: "4h ago", status: "Escalated", potentialLoss: "₹1,50,000" },
  { id: "FC-003", type: "Deposit Layering", description: "Rapid deposit-withdrawal pattern detected. 8 transactions in 24h with increasing amounts, possible structuring.", member: "M-1008", severity: "High", detectedBy: "AML Monitor", time: "6h ago", status: "Under Review", potentialLoss: "₹5,20,000" },
  { id: "FC-004", type: "Ghost Member", description: "KYC documents for M-1033 flagged as potentially fabricated. Address verification failed, phone number unresponsive.", member: "M-1033", severity: "High", detectedBy: "Onboarding Agent", time: "1d ago", status: "Confirmed", potentialLoss: "₹40,000" },
  { id: "FC-005", type: "Collusion Ring", description: "Network analysis revealed 5 members with shared phone/address forming a chit fund collusion ring to manipulate auctions.", member: "M-1012, M-1018, M-1025, M-1029, M-1031", severity: "Critical", detectedBy: "Graph Analytics", time: "1d ago", status: "Investigating", potentialLoss: "₹8,50,000" },
  { id: "FC-006", type: "Behavioural Anomaly", description: "Member STI score dropped from 85 to 32 in 30 days. Sudden multiple loan applications detected across schemes.", member: "M-1005", severity: "Medium", detectedBy: "Behavioural AI", time: "2d ago", status: "Monitoring", potentialLoss: "₹75,000" },
];

export const fraudMetrics = {
  totalAlerts: 23,
  criticalAlerts: 8,
  resolvedThisMonth: 15,
  avgResolutionTime: "4.2 days",
  falsePositiveRate: "12%",
  totalPreventedLoss: "₹24.5L",
};

export const fraudTrend = [
  { month: "Oct", alerts: 12, resolved: 10, falsePositive: 2 },
  { month: "Nov", alerts: 18, resolved: 14, falsePositive: 3 },
  { month: "Dec", alerts: 15, resolved: 13, falsePositive: 1 },
  { month: "Jan", alerts: 22, resolved: 18, falsePositive: 4 },
  { month: "Feb", alerts: 20, resolved: 17, falsePositive: 2 },
  { month: "Mar", alerts: 23, resolved: 15, falsePositive: 3 },
];

/* ─── Reports Data ─── */
export const reportsList = [
  { id: "RPT-001", name: "Monthly Financial Summary", category: "Finance", frequency: "Monthly", lastGenerated: "01 Mar 2026", format: "PDF", description: "Consolidated P&L, balance sheet, and cash flow statement for the month." },
  { id: "RPT-002", name: "Member Growth Report", category: "Membership", frequency: "Monthly", lastGenerated: "01 Mar 2026", format: "PDF", description: "New member enrollments, churn rate, demographic analysis, and STI distribution." },
  { id: "RPT-003", name: "Loan Portfolio Health", category: "Loans", frequency: "Weekly", lastGenerated: "08 Mar 2026", format: "Excel", description: "NPA analysis, disbursement trends, recovery rates, and risk concentration." },
  { id: "RPT-004", name: "Chit Fund Auction Report", category: "Chit Funds", frequency: "Per Auction", lastGenerated: "05 Mar 2026", format: "PDF", description: "Auction results, bid analysis, winner details, and commission breakdowns." },
  { id: "RPT-005", name: "Compliance & Regulatory", category: "Compliance", frequency: "Quarterly", lastGenerated: "01 Jan 2026", format: "PDF", description: "NDH compliance status, filing tracker, and regulatory ratio analysis." },
  { id: "RPT-006", name: "Fraud Intelligence Brief", category: "Fraud", frequency: "Weekly", lastGenerated: "08 Mar 2026", format: "PDF", description: "Alert summary, investigation status, pattern analysis, and prevention metrics." },
  { id: "RPT-007", name: "Deposit Maturity Schedule", category: "Deposits", frequency: "Monthly", lastGenerated: "01 Mar 2026", format: "Excel", description: "Upcoming FD/RD maturities, renewal projections, and liquidity impact." },
  { id: "RPT-008", name: "AI Agent Performance", category: "Operations", frequency: "Weekly", lastGenerated: "08 Mar 2026", format: "PDF", description: "Agent throughput, accuracy metrics, resolution times, and escalation rates." },
];

export const reportAnalytics = {
  totalMembers: 12450,
  memberGrowth: [
    { month: "Oct", newMembers: 320, churned: 18 },
    { month: "Nov", newMembers: 380, churned: 22 },
    { month: "Dec", newMembers: 420, churned: 15 },
    { month: "Jan", newMembers: 510, churned: 28 },
    { month: "Feb", newMembers: 480, churned: 20 },
    { month: "Mar", newMembers: 540, churned: 25 },
  ],
  revenueBreakdown: [
    { source: "Chit Fund Commission", amount: 4500000, pct: 38 },
    { source: "Loan Interest Income", amount: 3200000, pct: 27 },
    { source: "Fixed Deposit Spread", amount: 1800000, pct: 15 },
    { source: "Processing Fees", amount: 1200000, pct: 10 },
    { source: "Penalty & Late Fees", amount: 600000, pct: 5 },
    { source: "Other Income", amount: 500000, pct: 5 },
  ],
  keyMetrics: [
    { label: "Total AUM", value: "₹45.2 Cr", change: "+12.4%" },
    { label: "Monthly Revenue", value: "₹1.18 Cr", change: "+8.6%" },
    { label: "Operating Margin", value: "32.5%", change: "+2.1%" },
    { label: "Cost-to-Income", value: "44%", change: "-3.2%" },
  ],
};

/* ─── Config Data ─── */
export const systemConfig = {
  general: [
    { key: "company_name", label: "Company Name", value: "Glimmora Nidhi Limited", type: "text", category: "General" },
    { key: "cin_number", label: "CIN Number", value: "U65100KA2024PLC123456", type: "text", category: "General" },
    { key: "registered_address", label: "Registered Address", value: "No. 42, MG Road, Bengaluru, Karnataka - 560001", type: "text", category: "General" },
    { key: "financial_year", label: "Financial Year", value: "2025-2026", type: "text", category: "General" },
    { key: "currency", label: "Default Currency", value: "INR (₹)", type: "select", category: "General" },
  ],
  deposits: [
    { key: "fd_min_amount", label: "FD Minimum Amount", value: "₹10,000", type: "text", category: "Deposits" },
    { key: "fd_max_rate", label: "FD Maximum Interest Rate", value: "9.5%", type: "text", category: "Deposits" },
    { key: "rd_min_amount", label: "RD Minimum Monthly", value: "₹1,000", type: "text", category: "Deposits" },
    { key: "savings_rate", label: "Savings Deposit Rate", value: "4.0%", type: "text", category: "Deposits" },
    { key: "auto_renewal", label: "FD Auto-Renewal", value: "Enabled", type: "toggle", category: "Deposits" },
  ],
  loans: [
    { key: "max_loan_amount", label: "Maximum Loan Amount", value: "₹15,00,000", type: "text", category: "Loans" },
    { key: "min_sti_score", label: "Minimum STI Score for Loans", value: "50", type: "text", category: "Loans" },
    { key: "max_interest_rate", label: "Maximum Loan Interest Rate", value: "14%", type: "text", category: "Loans" },
    { key: "auto_emi_deduction", label: "Auto EMI Deduction", value: "Enabled", type: "toggle", category: "Loans" },
    { key: "default_threshold", label: "Default Threshold (Missed EMIs)", value: "3", type: "text", category: "Loans" },
  ],
  chitFunds: [
    { key: "foreman_commission", label: "Foreman Commission", value: "5%", type: "text", category: "Chit Funds" },
    { key: "min_bid_decrement", label: "Minimum Bid Decrement", value: "₹500", type: "text", category: "Chit Funds" },
    { key: "auction_frequency", label: "Auction Frequency", value: "Monthly", type: "select", category: "Chit Funds" },
    { key: "max_subscribers", label: "Max Subscribers per Scheme", value: "40", type: "text", category: "Chit Funds" },
    { key: "prized_subscriber_lock", label: "Prized Subscriber Lock Period", value: "30 days", type: "text", category: "Chit Funds" },
  ],
  ai: [
    { key: "risk_model_version", label: "Risk Model Version", value: "v2.4.1", type: "text", category: "AI & Agents" },
    { key: "fraud_sensitivity", label: "Fraud Detection Sensitivity", value: "High", type: "select", category: "AI & Agents" },
    { key: "auto_kyc_verify", label: "Auto KYC Verification", value: "Enabled", type: "toggle", category: "AI & Agents" },
    { key: "agent_escalation", label: "Auto-Escalation Threshold", value: "3 failures", type: "text", category: "AI & Agents" },
    { key: "sti_recalc_frequency", label: "STI Recalculation Frequency", value: "Weekly", type: "select", category: "AI & Agents" },
  ],
  notifications: [
    { key: "sms_enabled", label: "SMS Notifications", value: "Enabled", type: "toggle", category: "Notifications" },
    { key: "email_enabled", label: "Email Notifications", value: "Enabled", type: "toggle", category: "Notifications" },
    { key: "whatsapp_enabled", label: "WhatsApp Alerts", value: "Enabled", type: "toggle", category: "Notifications" },
    { key: "emi_reminder_days", label: "EMI Reminder (Days Before)", value: "3", type: "text", category: "Notifications" },
    { key: "maturity_alert_days", label: "Maturity Alert (Days Before)", value: "30", type: "text", category: "Notifications" },
  ],
};

export const auditLog = [
  { id: "AL-001", action: "Config Updated", user: "Admin", detail: "Changed FD max rate from 9.0% to 9.5%", timestamp: "10 Mar 2026, 14:30" },
  { id: "AL-002", action: "User Role Changed", user: "Admin", detail: "Promoted Ramesh (OP-005) to Branch Manager", timestamp: "09 Mar 2026, 11:15" },
  { id: "AL-003", action: "Agent Restarted", user: "System", detail: "Risk Review Agent restarted after timeout", timestamp: "08 Mar 2026, 09:45" },
  { id: "AL-004", action: "Backup Completed", user: "System", detail: "Full database backup completed (2.4 GB)", timestamp: "08 Mar 2026, 02:00" },
  { id: "AL-005", action: "Compliance Alert", user: "AI Agent", detail: "Unencumbered deposit ratio approaching threshold", timestamp: "07 Mar 2026, 16:20" },
  { id: "AL-006", action: "Member Suspended", user: "Admin", detail: "M-1033 suspended due to KYC fraud detection", timestamp: "07 Mar 2026, 10:00" },
];

export const navItems = [
  { icon: executive, label: "Executive", id: "executive" },
  { icon: member, label: "Members", id: "members" },
  { icon: fund, label: "Chit Funds", id: "chitfunds" },
  { icon: loan, label: "Loans", id: "loans" },
  { icon: deposit, label: "Deposits", id: "deposits" },
  { icon: compliance, label: "Compliance", id: "compliance" },
  { icon: agent, label: "AI Agents", id: "agents" },
  { icon: alert, label: "Fraud Intel", id: "fraud" },
  { icon: liquidity, label: "Reports", id: "reports" },
  { icon: config, label: "Config", id: "config" },
];

