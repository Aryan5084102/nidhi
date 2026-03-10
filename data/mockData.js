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
  { id: "M-1001", name: "Rajesh Kumar", deposits: "₹50,000", loans: "₹10,000", risk: "Low", sti: 92, kyc: "Verified" },
  { id: "M-1002", name: "Anita Sharma", deposits: "₹70,000", loans: "₹20,000", risk: "Medium", sti: 74, kyc: "Verified" },
  { id: "M-1003", name: "Vikram Nair", deposits: "₹30,000", loans: "₹15,000", risk: "High", sti: 45, kyc: "Pending" },
  { id: "M-1004", name: "Priya Venkat", deposits: "₹90,000", loans: "₹5,000", risk: "Low", sti: 88, kyc: "Verified" },
  { id: "M-1005", name: "Suresh Iyer", deposits: "₹25,000", loans: "₹12,000", risk: "High", sti: 38, kyc: "Review" },
  { id: "M-1006", name: "Meena Pillai", deposits: "₹60,000", loans: "₹8,000", risk: "Low", sti: 95, kyc: "Verified" },
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

