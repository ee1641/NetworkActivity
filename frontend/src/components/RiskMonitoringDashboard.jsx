import React, { useEffect, useRef, useState, useCallback } from "react";
import { Chart } from "chart.js/auto";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import SidebarToggleButton from "./SidebarToggleButton";
import { useSidebarToggle } from "../hooks/useSidebarToggle";
import {
  fetchRiskSummary,
  fetchRiskAnomalyTimeSeries,
  fetchRiskIncidents,
  fetchRiskAlertConfig,
  saveRiskAlertConfig,
} from "../utils/api";

const RANGES = [
  { label: "24h", hours: 24 },
  { label: "7d",  hours: 168 },
  { label: "30d", hours: 720 },
];

const severityClass = (s) => {
  if (s === "HIGH")   return "bg-gray-800 text-white";
  if (s === "MEDIUM") return "bg-gray-500 text-white";
  return "bg-gray-400 text-white";
};

const fmtAmount = (n) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M VET`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K VET`;
  return `${n.toFixed(2)} VET`;
};

const RiskMonitoringDashboard = () => {
  const { isSidebarOpen, toggleSidebar } = useSidebarToggle();
  const navigate         = useNavigate();
  const chartRef         = useRef(null);
  const chartInstanceRef = useRef(null);

  const [config, setConfig] = useState({
    anomalyThreshold:    75,
    largeTxThreshold:    1000,
    activitySpikePercent: 50,
  });
  const [pendingConfig, setPendingConfig] = useState({
    anomalyThreshold:    75,
    largeTxThreshold:    1000,
    activitySpikePercent: 50,
  });
  const [summary,    setSummary]    = useState({ abnormalPatterns: 0, largeTransfers: 0, activitySpikes: 0 });
  const [timeSeries, setTimeSeries] = useState([]);
  const [incidents,  setIncidents]  = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [dateRange,  setDateRange]  = useState("24h");
  const [saved,      setSaved]      = useState(false);
  const [error,      setError]      = useState(null);
  const [filterText,     setFilterText]     = useState("");
  const [filterType,     setFilterType]     = useState("All");
  const [filterSeverity, setFilterSeverity] = useState("All");
  const loadingRef = useRef(false);

  const getWindow = useCallback((range) => {
    const hours = RANGES.find((r) => r.label === range)?.hours ?? 24;
    const end   = new Date();
    const start = new Date(end.getTime() - hours * 3600 * 1000);
    return { start: start.toISOString(), end: end.toISOString() };
  }, []);

  const loadAll = useCallback(async (range, cfg) => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    setError(null);
    const { start, end } = getWindow(range);
    try {
      const sum = await fetchRiskSummary(start, end, cfg.anomalyThreshold, cfg.largeTxThreshold, cfg.activitySpikePercent);
      setSummary(sum);
      const ts = await fetchRiskAnomalyTimeSeries(start, end);
      setTimeSeries(ts);
      const inc = await fetchRiskIncidents(start, end, cfg.largeTxThreshold, 20);
      setIncidents(inc);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [getWindow]);

  // Load config on mount then fetch data
  useEffect(() => {
    fetchRiskAlertConfig()
      .then((cfg) => {
        setConfig(cfg);
        setPendingConfig(cfg);
        loadAll(dateRange, cfg);
      })
      .catch(() => loadAll(dateRange, config));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-refresh every 30 s
  useEffect(() => {
    const id = setInterval(() => loadAll(dateRange, config), 60_000);
    return () => clearInterval(id);
  }, [dateRange, config, loadAll]);

  // Rebuild chart when timeSeries or config changes
  useEffect(() => {
    if (!chartRef.current) return;
    if (chartInstanceRef.current) chartInstanceRef.current.destroy();

    const labels = timeSeries.map((p) => p.label);
    const scores = timeSeries.map((p) => p.score);
    const n      = labels.length || 12;

    chartInstanceRef.current = new Chart(chartRef.current.getContext("2d"), {
      type: "line",
      data: {
        labels: labels.length ? labels : Array.from({ length: n }, (_, i) => `${String(i * 2).padStart(2, "0")}:00`),
        datasets: [
          {
            label: "Anomaly Score",
            data: scores.length ? scores : Array(n).fill(null),
            borderColor: "#1f2937",
            backgroundColor: "rgba(31,41,55,0.1)",
            borderWidth: 2,
            tension: 0.4,
            fill: true,
          },
          {
            label: "High Threshold",
            data: Array(n).fill(config.anomalyThreshold),
            borderColor: "#111827",
            borderDash: [5, 5],
            pointRadius: 0,
            borderWidth: 1.5,
          },
          {
            label: "Medium Threshold",
            data: Array(n).fill(config.anomalyThreshold * 0.8),
            borderColor: "#4b5563",
            borderDash: [5, 5],
            pointRadius: 0,
            borderWidth: 1.5,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              title: (items) => `${items[0].label}  —  Score: ${items[0].raw}`,
              afterBody: (items) => {
                const idx = items[0].dataIndex;
                const point = timeSeries[idx];
                if (!point?.topAddresses?.length) return [];
                return [
                  "",
                  "Top addresses:",
                  ...point.topAddresses.map(
                    (a) => `  ${a.slice(0, 10)}…${a.slice(-6)}`
                  ),
                ];
              },
              label: () => null,
            },
          },
        },
        scales: { y: { beginAtZero: true, max: 100 } },
        onClick: (event, elements) => {
          if (!elements.length) return;
          const idx = elements[0].index;
          const point = timeSeries[idx];
          if (point?.topAddresses?.length) {
            navigate(`/explorer?address=${point.topAddresses[0]}`);
          }
        },
        onHover: (event, elements) => {
          event.native.target.style.cursor = elements.length ? "pointer" : "default";
        },
      },
    });

    return () => {
      if (chartInstanceRef.current) chartInstanceRef.current.destroy();
    };
  }, [timeSeries, config, navigate]);

  const handleApply = async () => {
    try {
      await saveRiskAlertConfig(pendingConfig);
      setConfig(pendingConfig);
      await loadAll(dateRange, pendingConfig);
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    } catch (e) {
      setError(e.message);
    }
  };

  const handleRangeChange = (range) => {
    setDateRange(range);
    loadingRef.current = false; // cancel any in-flight guard so this click always proceeds
    loadAll(range, config);
  };

  const handleExport = () => {
    const header = "ID,Type,Severity,Amount,Address,TxHash,Timestamp";
    const rows   = incidents.map((inc) =>
      `"${inc.incidentId}","${inc.type}","${inc.severity}",${inc.amount},"${inc.address ?? ""}","${inc.txHash ?? ""}","${inc.timestamp ?? ""}"`
    );
    const csv  = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `risk-incidents-${dateRange}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredIncidents = incidents.filter((inc) => {
    if (filterType !== "All" && inc.type !== filterType) return false;
    if (filterSeverity !== "All" && inc.severity !== filterSeverity) return false;
    if (filterText) {
      const q = filterText.toLowerCase();
      return (
        (inc.address ?? "").toLowerCase().includes(q) ||
        (inc.txHash  ?? "").toLowerCase().includes(q) ||
        (inc.incidentId ?? "").toLowerCase().includes(q)
      );
    }
    return true;
  });

  const alertCards = [
    { title: "Abnormal Patterns", count: summary.abnormalPatterns, level: "HIGH" },
    { title: "Large Transfers",   count: summary.largeTransfers,   level: "MEDIUM" },
    { title: "Activity Spikes",   count: summary.activitySpikes,   level: "LOW" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />

      {/* Left Config Panel */}
      <aside className="w-64 bg-white border-r border-gray-300 flex flex-col">
        <div className="p-4 border-b border-gray-300 flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-800 flex items-center justify-center text-white text-lg">
            🛡️
          </div>
          <div>
            <div className="text-sm font-semibold">Risk Monitor</div>
            <div className="text-xs text-gray-600">Security Analytics</div>
          </div>
        </div>

        <div className="p-4 space-y-4 overflow-auto">
          <h3 className="text-xs font-semibold uppercase text-gray-500">Alert Config</h3>

          <div>
            <label className="text-xs text-gray-700 block mb-1">
              Anomaly Threshold: <span className="font-semibold">{pendingConfig.anomalyThreshold}</span>
            </label>
            <input
              type="range"
              className="w-full"
              min={0}
              max={100}
              value={pendingConfig.anomalyThreshold}
              onChange={(e) =>
                setPendingConfig((c) => ({ ...c, anomalyThreshold: Number(e.target.value) }))
              }
            />
          </div>

          <div>
            <label className="text-xs text-gray-700 block mb-1">Large Transfer (VET)</label>
            <input
              type="number"
              className="w-full border border-gray-300 p-2 text-xs text-gray-900 bg-white"
              value={pendingConfig.largeTxThreshold}
              onChange={(e) =>
                setPendingConfig((c) => ({ ...c, largeTxThreshold: Number(e.target.value) }))
              }
            />
          </div>

          <div>
            <label className="text-xs text-gray-700 block mb-1">Activity Spike (%)</label>
            <input
              type="number"
              className="w-full border border-gray-300 p-2 text-xs text-gray-900 bg-white"
              value={pendingConfig.activitySpikePercent}
              onChange={(e) =>
                setPendingConfig((c) => ({ ...c, activitySpikePercent: Number(e.target.value) }))
              }
            />
          </div>

          <button
            onClick={handleApply}
            className="w-full bg-gray-900 text-white text-xs py-2 hover:bg-gray-800 transition-colors"
          >
            {saved ? "Saved ✓" : "Apply"}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b border-gray-300 p-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <SidebarToggleButton isSidebarOpen={isSidebarOpen} onToggle={toggleSidebar} />
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Risk Monitoring Dashboard</h1>
              <p className="text-sm text-gray-600">Blockchain analytics</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {/* Date range selector */}
            <div className="flex border border-gray-300 text-xs overflow-hidden">
              {RANGES.map((r) => (
                <button
                  key={r.label}
                  onClick={() => handleRangeChange(r.label)}
                  className={`px-3 py-1 transition-colors ${
                    dateRange === r.label
                      ? "bg-gray-900 text-white"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>

            <span className={`text-xs px-3 py-1 ${loading ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-700"}`}>
              {loading ? "Loading…" : "Live"}
            </span>

            <button
              onClick={handleExport}
              className="border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-gray-50"
            >
              Export
            </button>
          </div>
        </header>

        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="p-6 space-y-6">
          {/* Alert Cards */}
          <div className="grid md:grid-cols-3 gap-4">
            {alertCards.map((card, i) => (
              <div key={i} className="bg-white border border-gray-300 p-4">
                <div className="flex justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-900">{card.title}</h3>
                  <span className={`text-xs px-2 py-0.5 ${severityClass(card.level)}`}>
                    {card.level}
                  </span>
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  {loading ? "—" : card.count.toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          {/* Anomaly Detection Chart */}
          <div className="bg-white border border-gray-300 p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Anomaly Detection</h2>
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <span className="flex items-center space-x-1">
                  <span className="inline-block w-4 h-0.5 bg-gray-800 border-t-2 border-dashed border-gray-800"></span>
                  <span>High ({config.anomalyThreshold})</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="inline-block w-4 h-0.5 border-t-2 border-dashed border-gray-500"></span>
                  <span>Medium ({Math.round(config.anomalyThreshold * 0.8)})</span>
                </span>
              </div>
            </div>
            <div className="h-80">
              <canvas ref={chartRef} />
            </div>
          </div>

          {/* Incident Details Table */}
          <div className="bg-white border border-gray-300">
            <div className="p-4 border-b border-gray-300 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900">Incident Details</span>
                <span className="text-xs text-gray-500">
                  {filteredIncidents.length} of {incidents.length} records
                </span>
              </div>
              <div className="flex gap-2 flex-wrap">
                <input
                  type="text"
                  placeholder="Search address or tx hash…"
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                  className="flex-1 min-w-[180px] border border-gray-300 px-2 py-1 text-xs text-gray-900 bg-white placeholder-gray-400"
                />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="border border-gray-300 px-2 py-1 text-xs text-gray-900 bg-white"
                >
                  <option value="All">All Types</option>
                  <option value="Large Transfer">Large Transfer</option>
                  <option value="Abnormal Pattern">Abnormal Pattern</option>
                  <option value="Activity Spike">Activity Spike</option>
                </select>
                <select
                  value={filterSeverity}
                  onChange={(e) => setFilterSeverity(e.target.value)}
                  className="border border-gray-300 px-2 py-1 text-xs text-gray-900 bg-white"
                >
                  <option value="All">All Severities</option>
                  <option value="HIGH">HIGH</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="LOW">LOW</option>
                </select>
                {(filterText || filterType !== "All" || filterSeverity !== "All") && (
                  <button
                    onClick={() => { setFilterText(""); setFilterType("All"); setFilterSeverity("All"); }}
                    className="border border-gray-300 px-2 py-1 text-xs text-gray-500 hover:bg-gray-50"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-left text-xs font-semibold text-gray-700">ID</th>
                    <th className="p-2 text-left text-xs font-semibold text-gray-700">Type</th>
                    <th className="p-2 text-left text-xs font-semibold text-gray-700">Severity</th>
                    <th className="p-2 text-left text-xs font-semibold text-gray-700">Amount</th>
                    <th className="p-2 text-left text-xs font-semibold text-gray-700">Address</th>
                    <th className="p-2 text-left text-xs font-semibold text-gray-700">Tx Hash</th>
                    <th className="p-2 text-left text-xs font-semibold text-gray-700">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredIncidents.length === 0 && !loading && (
                    <tr>
                      <td colSpan={7} className="p-4 text-center text-gray-400 text-xs">
                        {incidents.length === 0
                          ? "No incidents detected in this time window."
                          : "No incidents match the current filters."}
                      </td>
                    </tr>
                  )}
                  {filteredIncidents.map((inc, i) => (
                    <tr
                      key={i}
                      className="border-t border-gray-200 hover:bg-blue-50 cursor-pointer"
                      onClick={() => inc.address && navigate(`/explorer?address=${inc.address}`)}
                      title={inc.address ? `Open ${inc.address} in explorer` : undefined}
                    >
                      <td className="p-2 text-gray-900 font-mono text-xs">#{inc.incidentId}</td>
                      <td className="p-2 text-gray-700">{inc.type}</td>
                      <td className="p-2">
                        <span className={`text-xs px-2 py-0.5 ${severityClass(inc.severity)}`}>
                          {inc.severity}
                        </span>
                      </td>
                      <td className="p-2 text-gray-900 font-semibold">{fmtAmount(inc.amount)}</td>
                      <td className="p-2 text-gray-600 font-mono text-xs truncate max-w-[140px]" title={inc.address}>
                        {inc.address ? `${inc.address.slice(0, 8)}…${inc.address.slice(-6)}` : "—"}
                      </td>
                      <td className="p-2 text-gray-600 font-mono text-xs truncate max-w-[120px]" title={inc.txHash}>
                        {inc.txHash ? `${inc.txHash.slice(0, 8)}…` : "—"}
                      </td>
                      <td className="p-2 text-gray-500 text-xs">
                        {inc.timestamp ? new Date(inc.timestamp).toLocaleString() : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RiskMonitoringDashboard;
