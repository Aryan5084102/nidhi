// --- Inline Data ---

export const tabs = [
  { id: "dashboard", label: "Dashboard" },
  { id: "schedule", label: "Payment Schedule" },
  { id: "overdue", label: "Overdue Loans" },
  { id: "workflow", label: "Collections Workflow" },
  { id: "recovery", label: "Recovery Cases" },
  { id: "analytics", label: "Collections Analytics" },
];

export const collectionsDashboard = {
  totalDue: "₹18,45,000",
  collectedThisMonth: "₹12,30,500",
  collectionRate: "91.4%",
  overdueAmount: "₹5,62,800",
  recoveryRate: "78.2%",
  activeCases: 34,
  monthlyTrend: [
    { month: "Oct", due: 1520000, collected: 1380000, overdue: 140000 },
    { month: "Nov", due: 1610000, collected: 1490000, overdue: 120000 },
    { month: "Dec", due: 1750000, collected: 1540000, overdue: 210000 },
    { month: "Jan", due: 1680000, collected: 1560000, overdue: 120000 },
    { month: "Feb", due: 1820000, collected: 1710000, overdue: 110000 },
    { month: "Mar", due: 1845000, collected: 1230500, overdue: 562800 },
  ],
  topDefaulters: [
    { name: "Ramesh Gupta", id: "M-1042", outstanding: "₹1,25,000", daysOverdue: 112, scheme: "Gold Chit 50L" },
    { name: "Priya Nair", id: "M-1078", outstanding: "₹98,500", daysOverdue: 87, scheme: "Personal Loan" },
    { name: "Suresh Yadav", id: "M-1015", outstanding: "₹76,200", daysOverdue: 65, scheme: "Silver Chit 25L" },
    { name: "Kavita Sharma", id: "M-1091", outstanding: "₹54,800", daysOverdue: 45, scheme: "Vehicle Loan" },
  ],
};

export const paymentSchedule = [
  { id: "PAY-3001", member: "Anitha Reddy", scheme: "Gold Chit 50L", amountDue: "₹25,000", dueDate: "15 Mar 2026", status: "Paid" },
  { id: "PAY-3002", member: "Vikram Singh", scheme: "Silver Chit 25L", amountDue: "₹12,500", dueDate: "15 Mar 2026", status: "Pending" },
  { id: "PAY-3003", member: "Deepa Menon", scheme: "Personal Loan", amountDue: "₹8,750", dueDate: "10 Mar 2026", status: "Paid" },
  { id: "PAY-3004", member: "Ramesh Gupta", scheme: "Gold Chit 50L", amountDue: "₹25,000", dueDate: "05 Mar 2026", status: "Overdue" },
  { id: "PAY-3005", member: "Sunita Devi", scheme: "Diamond Chit 1Cr", amountDue: "₹50,000", dueDate: "15 Mar 2026", status: "Partial" },
  { id: "PAY-3006", member: "Arun Kumar", scheme: "Vehicle Loan", amountDue: "₹15,200", dueDate: "12 Mar 2026", status: "Paid" },
  { id: "PAY-3007", member: "Priya Nair", scheme: "Personal Loan", amountDue: "₹9,800", dueDate: "01 Mar 2026", status: "Overdue" },
  { id: "PAY-3008", member: "Manoj Tiwari", scheme: "Silver Chit 25L", amountDue: "₹12,500", dueDate: "15 Mar 2026", status: "Pending" },
  { id: "PAY-3009", member: "Lakshmi Iyer", scheme: "Gold Chit 50L", amountDue: "₹25,000", dueDate: "15 Mar 2026", status: "Paid" },
  { id: "PAY-3010", member: "Suresh Yadav", scheme: "Silver Chit 25L", amountDue: "₹12,500", dueDate: "28 Feb 2026", status: "Overdue" },
  { id: "PAY-3011", member: "Kavita Sharma", scheme: "Vehicle Loan", amountDue: "₹15,200", dueDate: "10 Mar 2026", status: "Partial" },
  { id: "PAY-3012", member: "Rajesh Pillai", scheme: "Diamond Chit 1Cr", amountDue: "₹50,000", dueDate: "15 Mar 2026", status: "Pending" },
];

export const overdueLoans = [
  { id: "OD-501", member: "Ramesh Gupta", memberId: "M-1042", loanType: "Chit Fund Loan", outstanding: "₹1,25,000", totalLoan: "₹3,00,000", daysOverdue: 112, lastPayment: "18 Nov 2025", emiAmount: "₹25,000", collateral: "Fixed Deposit", contactPhone: "+91 98765 43210" },
  { id: "OD-502", member: "Priya Nair", memberId: "M-1078", loanType: "Personal Loan", outstanding: "₹98,500", totalLoan: "₹2,00,000", daysOverdue: 87, lastPayment: "14 Dec 2025", emiAmount: "₹9,800", collateral: "None", contactPhone: "+91 87654 32109" },
  { id: "OD-503", member: "Suresh Yadav", memberId: "M-1015", loanType: "Chit Fund Loan", outstanding: "₹76,200", totalLoan: "₹1,50,000", daysOverdue: 65, lastPayment: "05 Jan 2026", emiAmount: "₹12,500", collateral: "Gold Jewellery", contactPhone: "+91 76543 21098" },
  { id: "OD-504", member: "Kavita Sharma", memberId: "M-1091", loanType: "Vehicle Loan", outstanding: "₹54,800", totalLoan: "₹4,50,000", daysOverdue: 45, lastPayment: "25 Jan 2026", emiAmount: "₹15,200", collateral: "Vehicle RC", contactPhone: "+91 65432 10987" },
  { id: "OD-505", member: "Dinesh Patel", memberId: "M-1034", loanType: "Personal Loan", outstanding: "₹42,300", totalLoan: "₹1,00,000", daysOverdue: 32, lastPayment: "07 Feb 2026", emiAmount: "₹8,750", collateral: "None", contactPhone: "+91 54321 09876" },
  { id: "OD-506", member: "Meena Kumari", memberId: "M-1056", loanType: "Chit Fund Loan", outstanding: "₹1,10,000", totalLoan: "₹2,50,000", daysOverdue: 95, lastPayment: "06 Dec 2025", emiAmount: "₹20,000", collateral: "Property Docs", contactPhone: "+91 43210 98765" },
];

export const collectionsWorkflow = {
  stages: [
    {
      name: "Notice Sent",
      count: 12,
      color: "#6366F1",
      cases: [
        { id: "WF-101", member: "Manoj Tiwari", amount: "₹12,500", daysOverdue: 8, action: "SMS + Email reminder sent on 08 Mar 2026" },
        { id: "WF-102", member: "Rajesh Pillai", amount: "₹50,000", daysOverdue: 5, action: "First notice dispatched on 10 Mar 2026" },
        { id: "WF-103", member: "Sunita Devi", amount: "₹25,000", daysOverdue: 12, action: "Second reminder sent on 06 Mar 2026" },
      ],
    },
    {
      name: "Follow-up Call",
      count: 8,
      color: "#F59E0B",
      cases: [
        { id: "WF-201", member: "Dinesh Patel", amount: "₹8,750", daysOverdue: 32, action: "Called on 09 Mar — promised payment by 15 Mar" },
        { id: "WF-202", member: "Kavita Sharma", amount: "₹15,200", daysOverdue: 45, action: "Called on 07 Mar — no response, rescheduled" },
      ],
    },
    {
      name: "Field Visit",
      count: 5,
      color: "#EF4444",
      cases: [
        { id: "WF-301", member: "Suresh Yadav", amount: "₹12,500", daysOverdue: 65, action: "Field agent Ravi Kumar visited on 05 Mar — partial commitment" },
        { id: "WF-302", member: "Priya Nair", amount: "₹9,800", daysOverdue: 87, action: "Scheduled visit for 12 Mar — agent Meena assigned" },
      ],
    },
    {
      name: "Legal Notice",
      count: 3,
      color: "#DC2626",
      cases: [
        { id: "WF-401", member: "Ramesh Gupta", amount: "₹25,000", daysOverdue: 112, action: "Legal notice issued via registered post on 01 Mar 2026" },
        { id: "WF-402", member: "Meena Kumari", amount: "₹20,000", daysOverdue: 95, action: "Legal notice drafted, pending dispatch" },
      ],
    },
    {
      name: "Recovery",
      count: 2,
      color: "#7C3AED",
      cases: [
        { id: "WF-501", member: "Ramesh Gupta", amount: "₹1,25,000", daysOverdue: 112, action: "Recovery proceedings initiated — collateral FD marked for lien" },
      ],
    },
  ],
};

export const recoveryCases = [
  { id: "RC-001", member: "Ramesh Gupta", type: "Chit Fund Loan", outstanding: "₹1,25,000", stage: "Legal", assignedAgent: "Adv. Sunil Mehta", lastAction: "Legal notice served — 01 Mar 2026", status: "Active" },
  { id: "RC-002", member: "Priya Nair", type: "Personal Loan", outstanding: "₹98,500", stage: "Field Visit", assignedAgent: "Meena Krishnan", lastAction: "Visit scheduled — 12 Mar 2026", status: "Active" },
  { id: "RC-003", member: "Suresh Yadav", type: "Chit Fund Loan", outstanding: "₹76,200", stage: "Follow-up", assignedAgent: "Ravi Kumar", lastAction: "Partial payment received — 05 Mar 2026", status: "Active" },
  { id: "RC-004", member: "Meena Kumari", type: "Chit Fund Loan", outstanding: "₹1,10,000", stage: "Legal", assignedAgent: "Adv. Sunil Mehta", lastAction: "Legal notice pending dispatch", status: "Active" },
  { id: "RC-005", member: "Kavita Sharma", type: "Vehicle Loan", outstanding: "₹54,800", stage: "Follow-up", assignedAgent: "Ravi Kumar", lastAction: "Call follow-up — 07 Mar 2026", status: "Active" },
  { id: "RC-006", member: "Dinesh Patel", type: "Personal Loan", outstanding: "₹42,300", stage: "Notice Sent", assignedAgent: "Meena Krishnan", lastAction: "First notice sent — 08 Mar 2026", status: "Active" },
  { id: "RC-007", member: "Gopal Verma", type: "Chit Fund Loan", outstanding: "₹0", stage: "Settled", assignedAgent: "Ravi Kumar", lastAction: "Full settlement received — 20 Feb 2026", status: "Settled" },
  { id: "RC-008", member: "Bhavana Joshi", type: "Personal Loan", outstanding: "₹35,000", stage: "Written Off", assignedAgent: "Adv. Sunil Mehta", lastAction: "Board approved write-off — 28 Feb 2026", status: "Written Off" },
];

export const collectionsAnalytics = {
  efficiencyTrend: [
    { month: "Oct", efficiency: 90.8, target: 92 },
    { month: "Nov", efficiency: 92.5, target: 92 },
    { month: "Dec", efficiency: 88.0, target: 92 },
    { month: "Jan", efficiency: 92.9, target: 92 },
    { month: "Feb", efficiency: 93.9, target: 92 },
    { month: "Mar", efficiency: 91.4, target: 92 },
  ],
  recoveryByCategory: [
    { category: "Chit Fund Loans", total: "₹8,50,000", recovered: "₹6,20,000", rate: "72.9%" },
    { category: "Personal Loans", total: "₹4,25,000", recovered: "₹3,50,000", rate: "82.4%" },
    { category: "Vehicle Loans", total: "₹3,20,000", recovered: "₹2,85,000", rate: "89.1%" },
    { category: "Gold Loans", total: "₹2,50,000", recovered: "₹2,40,000", rate: "96.0%" },
  ],
  agentPerformance: [
    { name: "Ravi Kumar", role: "Field Agent", casesHandled: 18, resolved: 14, efficiency: "77.8%", avgResolution: "22 days" },
    { name: "Meena Krishnan", role: "Field Agent", casesHandled: 15, resolved: 12, efficiency: "80.0%", avgResolution: "19 days" },
    { name: "Adv. Sunil Mehta", role: "Legal Counsel", casesHandled: 8, resolved: 5, efficiency: "62.5%", avgResolution: "45 days" },
    { name: "Pooja Desai", role: "Tele-caller", casesHandled: 32, resolved: 28, efficiency: "87.5%", avgResolution: "8 days" },
  ],
};
