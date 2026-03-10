"use client";

import { useState, useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Filler,
  Tooltip,
  Legend
);

// Mock data for different time frames
const timeFrameData = {
  "1W": {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    inflow: [8, 12, 9, 14, 11, 6, 4],
    payout: [6, 9, 7, 10, 8, 5, 3],
  },
  "1M": {
    labels: ["W1", "W2", "W3", "W4"],
    inflow: [42, 55, 48, 62],
    payout: [35, 40, 38, 45],
  },
  "3M": {
    labels: ["Jan", "Feb", "Mar"],
    inflow: [50, 62, 68],
    payout: [45, 42, 48],
  },
  "6M": {
    labels: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
    inflow: [42, 48, 55, 50, 62, 68],
    payout: [35, 38, 40, 45, 42, 48],
  },
  "1Y": {
    labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
    inflow: [35, 38, 40, 44, 39, 46, 42, 48, 55, 50, 62, 68],
    payout: [28, 30, 33, 36, 32, 38, 35, 38, 40, 45, 42, 48],
  },
};

const timeFrames = ["1W", "1M", "3M", "6M", "1Y"];

export default function LiquidityChart() {
  const [activeTimeFrame, setActiveTimeFrame] = useState("6M");

  const currentData = timeFrameData[activeTimeFrame];

  const totalInflow = useMemo(() => currentData.inflow.reduce((a, b) => a + b, 0), [currentData]);
  const totalPayout = useMemo(() => currentData.payout.reduce((a, b) => a + b, 0), [currentData]);
  const netFlow = totalInflow - totalPayout;

  const chartData = {
    labels: currentData.labels,
    datasets: [
      {
        type: "bar",
        label: "Inflow",
        data: currentData.inflow,
        backgroundColor: "rgba(16, 185, 129, 0.7)",
        hoverBackgroundColor: "rgba(16, 185, 129, 0.9)",
        borderColor: "rgba(16, 185, 129, 1)",
        borderWidth: 1,
        borderRadius: 6,
        borderSkipped: false,
        barPercentage: 0.6,
        categoryPercentage: 0.7,
      },
      {
        type: "bar",
        label: "Payout",
        data: currentData.payout,
        backgroundColor: "rgba(99, 102, 241, 0.7)",
        hoverBackgroundColor: "rgba(99, 102, 241, 0.9)",
        borderColor: "rgba(99, 102, 241, 1)",
        borderWidth: 1,
        borderRadius: 6,
        borderSkipped: false,
        barPercentage: 0.6,
        categoryPercentage: 0.7,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
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
            return ` ${context.dataset.label}: ₹${context.parsed.y}L`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#94A3B8",
          font: { size: 11, family: "'Inter', sans-serif" },
        },
        border: {
          display: false,
        },
      },
      y: {
        grid: {
          color: "rgba(226, 232, 240, 0.5)",
          drawBorder: false,
        },
        ticks: {
          color: "#94A3B8",
          font: { size: 11, family: "'Inter', sans-serif" },
          callback: function (value) {
            return "₹" + value + "L";
          },
          stepSize: 20,
        },
        border: {
          display: false,
        },
        beginAtZero: true,
      },
    },
    animation: {
      duration: 600,
      easing: "easeInOutQuart",
    },
  };

  return (
    <div className="bg-white rounded-2xl p-5 hover:shadow-md transition-all duration-300 card-shadow border border-slate-100">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-800 mb-1">
            Liquidity Trend
          </h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
              <span className="text-[11px] text-slate-500">Inflow</span>
              <span className="text-[11px] font-semibold text-emerald-600 ml-0.5">₹{totalInflow}L</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500" />
              <span className="text-[11px] text-slate-500">Payout</span>
              <span className="text-[11px] font-semibold text-indigo-600 ml-0.5">₹{totalPayout}L</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className={`text-[11px] font-semibold ${netFlow >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                Net: {netFlow >= 0 ? "+" : ""}₹{netFlow}L
              </span>
            </div>
          </div>
        </div>

        {/* Time Frame Selector */}
        <div className="flex bg-slate-100 rounded-lg p-0.5">
          {timeFrames.map((tf) => (
            <button
              key={tf}
              onClick={() => setActiveTimeFrame(tf)}
              className={`px-2.5 py-1 text-[10px] font-semibold rounded-md transition-all duration-200 cursor-pointer ${
                activeTimeFrame === tf
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-[200px]">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}
