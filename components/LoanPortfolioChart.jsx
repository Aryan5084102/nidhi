"use client";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { loanPortfolio } from "@/data/mockData";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function LoanPortfolioChart() {
  const totalDisbursed = loanPortfolio.reduce((sum, l) => sum + l.disbursed, 0);

  const chartData = {
    labels: loanPortfolio.map((l) => l.category),
    datasets: [
      {
        data: loanPortfolio.map((l) => l.disbursed),
        backgroundColor: loanPortfolio.map((l) => l.color + "CC"),
        borderColor: loanPortfolio.map((l) => l.color),
        borderWidth: 2,
        hoverOffset: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "65%",
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1E293B",
        titleColor: "#F8FAFC",
        bodyColor: "#CBD5E1",
        titleFont: { size: 12, weight: "600" },
        bodyFont: { size: 11 },
        padding: 12,
        cornerRadius: 10,
        callbacks: {
          label: function (context) {
            const val = (context.parsed / 100000).toFixed(1);
            const pct = ((context.parsed / totalDisbursed) * 100).toFixed(1);
            return ` ${val}L (${pct}%)`;
          },
        },
      },
    },
    animation: { duration: 600, easing: "easeInOutQuart" },
  };

  return (
    <div className="bg-white rounded-2xl p-5 hover:shadow-md transition-all duration-300 card-shadow border border-slate-100">
      <h3 className="text-sm font-semibold text-slate-800 mb-4">
        Loan Portfolio Distribution
      </h3>
      <div className="flex items-center gap-4">
        <div className="h-[180px] w-[180px] shrink-0">
          <Doughnut data={chartData} options={chartOptions} />
        </div>
        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          {loanPortfolio.map((l, i) => (
            <div key={i} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: l.color }}
                />
                <span className="text-[11px] text-slate-600 truncate">
                  {l.category}
                </span>
              </div>
              <span className="text-[11px] font-semibold text-slate-700 shrink-0">
                {(l.disbursed / 100000).toFixed(1)}L
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
