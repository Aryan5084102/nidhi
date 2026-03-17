"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { depositTrend } from "@/data/mockData";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Filler,
  Tooltip,
  Legend
);

export default function DepositGrowthChart() {
  const chartData = {
    labels: depositTrend.map((d) => d.month),
    datasets: [
      {
        label: "Fixed Deposit",
        data: depositTrend.map((d) => d.fd),
        borderColor: "#6366F1",
        backgroundColor: "rgba(99, 102, 241, 0.08)",
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 5,
        borderWidth: 2,
      },
      {
        label: "Recurring Deposit",
        data: depositTrend.map((d) => d.rd),
        borderColor: "#0D9488",
        backgroundColor: "rgba(13, 148, 136, 0.08)",
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 5,
        borderWidth: 2,
      },
      {
        label: "Savings",
        data: depositTrend.map((d) => d.savings),
        borderColor: "#F59E0B",
        backgroundColor: "rgba(245, 158, 11, 0.08)",
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 5,
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
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
        boxPadding: 4,
        usePointStyle: true,
        callbacks: {
          label: function (context) {
            return ` ${context.dataset.label}: ${context.parsed.y} accounts`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#94A3B8", font: { size: 11 } },
        border: { display: false },
      },
      y: {
        grid: { color: "rgba(226, 232, 240, 0.5)" },
        ticks: { color: "#94A3B8", font: { size: 11 } },
        border: { display: false },
        beginAtZero: true,
      },
    },
    animation: { duration: 600, easing: "easeInOutQuart" },
  };

  return (
    <div className="bg-white rounded-2xl p-5 hover:shadow-md transition-all duration-300 card-shadow border border-slate-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-slate-800">Deposit Growth</h3>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-primary-500" />
            <span className="text-[11px] text-slate-500">FD</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-teal-600" />
            <span className="text-[11px] text-slate-500">RD</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-warning-500" />
            <span className="text-[11px] text-slate-500">Savings</span>
          </div>
        </div>
      </div>
      <div className="h-[200px]">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}
