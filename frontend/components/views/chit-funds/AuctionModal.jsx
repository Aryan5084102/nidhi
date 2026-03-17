"use client";

import { useState, useEffect } from "react";

const mockBidders = [
  { memberId: "M-1001", name: "Rajesh Kumar", bid: "₹1,15,000", time: "2 min ago", sti: 92 },
  { memberId: "M-1006", name: "Meena Pillai", bid: "₹1,12,000", time: "5 min ago", sti: 95 },
  { memberId: "M-1004", name: "Priya Venkat", bid: "₹1,10,000", time: "8 min ago", sti: 88 },
  { memberId: "M-1010", name: "Lakshmi Devi", bid: "₹1,08,000", time: "12 min ago", sti: 90 },
  { memberId: "M-1007", name: "Karthik Menon", bid: "₹1,05,000", time: "15 min ago", sti: 68 },
];

export default function AuctionModal({ scheme, onClose }) {
  const [bidAmount, setBidAmount] = useState("");
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const [bidders, setBidders] = useState(mockBidders);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleBid = (e) => {
    e.preventDefault();
    if (!bidAmount) return;
    const newBid = {
      memberId: "M-1001",
      name: "You",
      bid: `₹${bidAmount}`,
      time: "Just now",
      sti: 92,
    };
    setBidders([newBid, ...bidders]);
    setBidAmount("");
  };

  const potValue = parseInt((scheme.potSize || "0").replace(/[₹,]/g, ""));
  const minBid = Math.floor(potValue * 0.7);
  const maxDiscount = Math.floor(potValue * 0.3);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-700 shadow-xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-secondary p-6 rounded-t-2xl text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="flex items-center justify-between relative z-10">
            <div>
              <h3 className="text-lg font-bold">{scheme.name} - Live Auction</h3>
              <p className="text-primary-200 text-sm mt-0.5">Scheme: {scheme.id} | Monthly: {scheme.monthlyAmount}</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors cursor-pointer">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Timer + Pot Info */}
          <div className="grid grid-cols-3 gap-4 mt-4 relative z-10">
            <div className="bg-white/15 rounded-xl p-3 text-center">
              <p className="text-xs text-primary-200">Time Remaining</p>
              <p className="text-2xl font-bold font-mono">{formatTime(timeLeft)}</p>
            </div>
            <div className="bg-white/15 rounded-xl p-3 text-center">
              <p className="text-xs text-primary-200">Pot Size</p>
              <p className="text-2xl font-bold">{scheme.potSize}</p>
            </div>
            <div className="bg-white/15 rounded-xl p-3 text-center">
              <p className="text-xs text-primary-200">Total Bidders</p>
              <p className="text-2xl font-bold">{bidders.length}</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Auction Rules */}
          <div className="bg-warning-50 dark:bg-amber-900/20 border border-warning-200 dark:border-amber-800/50 rounded-xl p-4">
            <h4 className="text-xs font-semibold text-amber-700 dark:text-warning-300 mb-2">Auction Rules</h4>
            <ul className="text-xs text-warning dark:text-warning-400 space-y-1">
              <li>- Lowest unique bid wins the pot (reverse auction)</li>
              <li>- Minimum bid: ₹{minBid.toLocaleString("en-IN")} (Pot - Max Discount {maxDiscount.toLocaleString("en-IN")})</li>
              <li>- 5% foreman commission deducted from pot</li>
              <li>- Winner cannot bid in future auctions of this scheme</li>
            </ul>
          </div>

          {/* Place Bid */}
          <form onSubmit={handleBid} className="flex gap-3">
            <div className="flex-1 relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-heading">₹</span>
              <input
                type="text"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value.replace(/[^0-9,]/g, ""))}
                placeholder={`Min ${minBid.toLocaleString("en-IN")}`}
                className="w-full pl-8 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/50"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-primary hover:bg-primary-700 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer whitespace-nowrap"
            >
              Place Bid
            </button>
          </form>

          {/* Live Bids */}
          <div>
            <h4 className="text-sm font-semibold text-body dark:text-slate-200 mb-3">Live Bids</h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {bidders.map((bid, i) => (
                <div key={`${bid.memberId}-${i}`} className={`flex items-center justify-between p-3 rounded-xl transition-colors ${i === 0 ? "bg-success-50 dark:bg-emerald-900/20 border border-success-200 dark:border-emerald-800/50" : "bg-slate-50 dark:bg-slate-700/50"}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? "bg-success-500 text-white" : "bg-slate-200 dark:bg-slate-600 text-body dark:text-subtle"}`}>
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-body dark:text-slate-200">{bid.name}</p>
                      <p className="text-xs text-heading">{bid.memberId} | STI: {bid.sti}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-800 dark:text-white">{bid.bid}</p>
                    <p className="text-xs text-heading">{bid.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
