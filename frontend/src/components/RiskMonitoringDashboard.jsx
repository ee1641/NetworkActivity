import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";
import Sidebar from "./Sidebar";
import SidebarToggleButton from "./SidebarToggleButton";
import { useSidebarToggle } from "../hooks/useSidebarToggle";

const RiskMonitoringDashboard = () => {
  const { isSidebarOpen, toggleSidebar } = useSidebarToggle();
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext("2d");

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    chartInstanceRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: [
          "00:00",
          "02:00",
          "04:00",
          "06:00",
          "08:00",
          "10:00",
          "12:00",
          "14:00",
          "16:00",
          "18:00",
          "20:00",
          "22:00",
        ],
        datasets: [
          {
            label: "Anomaly Score",
            data: [45, 52, 48, 65, 72, 85, 78, 92, 88, 75, 68, 58],
            borderColor: "#1f2937",
            backgroundColor: "rgba(31,41,55,0.1)",
            borderWidth: 2,
            tension: 0.4,
            fill: true,
          },
          {
            label: "High Threshold",
            data: Array(12).fill(85),
            borderColor: "#111827",
            borderDash: [5, 5],
            pointRadius: 0,
          },
          {
            label: "Medium Threshold",
            data: Array(12).fill(60),
            borderColor: "#4b5563",
            borderDash: [5, 5],
            pointRadius: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, max: 100 },
        },
      },
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Shared Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />

      {/* Left Config Panel */}
      <aside className="w-64 bg-white border-r border-gray-300 flex flex-col">
        <div className="p-4 border-b border-gray-300 flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-800 flex items-center justify-center text-white">
            🛡️
          </div>
          <div>
            <div className="text-sm font-semibold">Risk Monitor</div>
            <div className="text-xs text-gray-600">Security Analytics</div>
          </div>
        </div>

        <div className="p-4 space-y-4 overflow-auto">
          <h3 className="text-xs font-semibold uppercase text-gray-500">
            Alert Config
          </h3>

          <div>
            <label className="text-xs text-gray-700">Anomaly Threshold</label>
            <input type="range" className="w-full" defaultValue={75} />
          </div>

          <input
            className="w-full border border-gray-300 p-2 text-xs"
            placeholder="Large Transfer ($)"
          />
          <input
            className="w-full border border-gray-300 p-2 text-xs"
            placeholder="Activity Spike (%)"
          />

          <button className="w-full bg-gray-900 text-white text-xs py-2 hover:bg-gray-800">
            Apply
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <header className="bg-white border-b border-gray-300 p-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <SidebarToggleButton
              isSidebarOpen={isSidebarOpen}
              onToggle={toggleSidebar}
            />
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Risk Monitoring Dashboard
              </h1>
              <p className="text-sm text-gray-600">Blockchain analytics</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-xs bg-gray-100 px-3 py-1 text-gray-700">
              Live
            </span>
            <button className="border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-gray-50">
              Export
            </button>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Alert Cards */}
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { title: "Abnormal Patterns", count: 47, level: "HIGH" },
              { title: "Large Transfers", count: 23, level: "MEDIUM" },
              { title: "Activity Spikes", count: 12, level: "LOW" },
            ].map((card, i) => (
              <div key={i} className="bg-white border border-gray-300 p-4">
                <div className="flex justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-900">
                    {card.title}
                  </h3>
                  <span className="text-xs bg-gray-800 text-white px-2 py-0.5">
                    {card.level}
                  </span>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {card.count}
                </div>
              </div>
            ))}
          </div>

          {/* Anomaly Detection Chart */}
          <div className="bg-white border border-gray-300 p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Anomaly Detection
            </h2>
            <div className="h-80">
              <canvas ref={chartRef} />
            </div>
          </div>

          {/* Incident Details Table */}
          <div className="bg-white border border-gray-300">
            <div className="p-4 border-b border-gray-300 font-semibold text-gray-900">
              Incident Details
            </div>
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left text-xs font-semibold text-gray-700">
                    ID
                  </th>
                  <th className="p-2 text-left text-xs font-semibold text-gray-700">
                    Type
                  </th>
                  <th className="p-2 text-left text-xs font-semibold text-gray-700">
                    Severity
                  </th>
                  <th className="p-2 text-left text-xs font-semibold text-gray-700">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-200">
                  <td className="p-2 text-gray-900">#INC-8421</td>
                  <td className="p-2 text-gray-700">Abnormal</td>
                  <td className="p-2">
                    <span className="text-xs bg-gray-800 text-white px-2 py-0.5">
                      HIGH
                    </span>
                  </td>
                  <td className="p-2 text-gray-900 font-semibold">$2.4M</td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="p-2 text-gray-900">#INC-8420</td>
                  <td className="p-2 text-gray-700">Transfer</td>
                  <td className="p-2">
                    <span className="text-xs bg-gray-500 text-white px-2 py-0.5">
                      MEDIUM
                    </span>
                  </td>
                  <td className="p-2 text-gray-900 font-semibold">$850K</td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="p-2 text-gray-900">#INC-8419</td>
                  <td className="p-2 text-gray-700">Spike</td>
                  <td className="p-2">
                    <span className="text-xs bg-gray-400 text-white px-2 py-0.5">
                      LOW
                    </span>
                  </td>
                  <td className="p-2 text-gray-900 font-semibold">$120K</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RiskMonitoringDashboard;
