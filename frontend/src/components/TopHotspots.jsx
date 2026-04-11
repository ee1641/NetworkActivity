import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import SidebarToggleButton from "./SidebarToggleButton";
import { useSidebarToggle } from "../hooks/useSidebarToggle";
import * as api from "../utils/api";

const PAGE_SIZE = 8;

const timeRangeToStartEnd = (range) => {
  const now = new Date();
  const hoursMap = {
    "Last 24 Hours": 24,
    "Last 7 Days": 168,
    "Last 30 Days": 720,
  };
  const h = hoursMap[range] ?? 720;
  return {
    start: new Date(now - h * 3600000).toISOString(),
    end: now.toISOString(),
  };
};

const buildPageButtons = (current, total) => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i);
  if (current < 4) return [0, 1, 2, 3, "...", total - 1];
  if (current > total - 5)
    return [0, "...", total - 4, total - 3, total - 2, total - 1];
  return [0, "...", current - 1, current, current + 1, "...", total - 1];
};

const formatVolume = (v) => {
  if (!v && v !== 0) return "—";
  if (v >= 1e12) return `${(v / 1e12).toFixed(2)}T VET`;
  if (v >= 1e9)  return `${(v / 1e9).toFixed(2)}B VET`;
  if (v >= 1e6)  return `${(v / 1e6).toFixed(2)}M VET`;
  if (v >= 1e3)  return `${(v / 1e3).toFixed(2)}K VET`;
  return `${v.toFixed(4)} VET`;
};

const formatCount = (n) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
};

const TopHotspots = () => {
  const { isSidebarOpen, toggleSidebar } = useSidebarToggle();
  const navigate = useNavigate();

  // Filter / sort state
  const [timeRange, setTimeRange] = useState("Last 30 Days");
  const [sortBy, setSortBy] = useState("transactions");
  const [page, setPage] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  // Data state
  const [hotspots, setHotspots] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [totalVolume, setTotalVolume] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [largeTransfers, setLargeTransfers] = useState(null);

  // Load large-transfer count whenever the time range changes
  useEffect(() => {
    const { start, end } = timeRangeToStartEnd(timeRange);
    api.fetchRiskSummary(start, end)
      .then((data) => setLargeTransfers(data.largeTransfers))
      .catch(() => setLargeTransfers(null));
  }, [timeRange, refreshKey]);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        setLoading(true);
        const { start, end } = timeRangeToStartEnd(timeRange);
        const data = await api.fetchHotspots({
          start,
          end,
          sortBy,
          page,
          pageSize: PAGE_SIZE,
        });

        if (cancelled) return;

        // Auto-recover: if this page is empty and we're not on page 0, reset
        if (data.content.length === 0 && page > 0) {
          setPage(0);
          return;
        }

        setHotspots(data.content);
        setTotalCount(data.totalCount);
        setTotalPages(data.totalPages);
        setTotalTransactions(data.totalTransactions);
        setTotalVolume(data.totalVolume);
        setError(null);
      } catch (err) {
        if (!cancelled) {
          console.error("Error fetching hotspots:", err);
          setError("Failed to load hotspots data.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => { cancelled = true; };
  }, [timeRange, sortBy, page, refreshKey]);

  const handleTimeRangeChange = (e) => {
    setTimeRange(e.target.value);
    setPage(0);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setPage(0);
  };

  const handleExport = () => {
    const headers = [
      "Rank", "Address", "Label", "Category",
      "Transactions", "Volume", "Avg Tx Value", "Trend %",
    ];
    const rows = hotspots.map((h, i) => [
      page * PAGE_SIZE + i + 1,
      h.address,
      h.labelName,
      h.category,
      h.transactionCount,
      h.totalVolume.toFixed(2),
      h.avgTransactionValue.toFixed(2),
      h.trendPercent.toFixed(1),
    ]);
    const csv = [headers, ...rows]
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hotspots-page-${page + 1}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-gray-300 px-4 md:px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <SidebarToggleButton
              isSidebarOpen={isSidebarOpen}
              onToggle={toggleSidebar}
            />
            <div className="w-8 h-8 bg-gray-800 flex items-center justify-center">
              <i className="fas fa-cube text-white text-sm" />
            </div>
            <span className="text-lg font-semibold text-gray-900 hidden sm:block">
              Blockchain Analytics
            </span>
          </div>

          <div className="flex items-center space-x-3 md:space-x-6">
            <div className="flex items-center space-x-2 text-xs text-gray-600">
              <div className="w-2 h-2 bg-gray-400 rounded-full" />
              <span className="hidden sm:inline">Live Updates</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1">
        <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />

        <main className="flex-1 p-4 md:p-6">
          {/* Page Header */}
          <div className="bg-white border border-gray-300 p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Top Transaction Hotspots
                </h1>
                <p className="text-xs text-gray-600 mt-1">
                  Real-time ranking of highest activity dApps and wallets
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={handleExport}
                  disabled={hotspots.length === 0 || loading}
                  className="px-4 py-2 bg-gray-900 text-white text-sm hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i className="fas fa-download mr-2" />
                  Export
                </button>
                <button
                  onClick={() => setRefreshKey((k) => k + 1)}
                  disabled={loading}
                  className="px-4 py-2 border border-gray-300 text-gray-700 text-sm hover:bg-gray-50 disabled:opacity-50"
                >
                  <i className={`fas fa-sync-alt mr-2 ${loading ? "fa-spin" : ""}`} />
                  Refresh
                </button>
              </div>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white border border-gray-300 p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs text-gray-600">Total Hotspots</div>
                <i className="fas fa-fire text-gray-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {loading ? "—" : totalCount.toLocaleString()}
              </div>
              <div className="text-xs text-gray-600 mt-1">{timeRange}</div>
            </div>

            <div className="bg-white border border-gray-300 p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs text-gray-600">Total Volume</div>
                <i className="fas fa-dollar-sign text-gray-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {loading ? "—" : formatVolume(totalVolume)}
              </div>
              <div className="text-xs text-gray-600 mt-1">{timeRange}</div>
            </div>

            <div className="bg-white border border-gray-300 p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs text-gray-600">Total Transactions</div>
                <i className="fas fa-exchange-alt text-gray-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {loading ? "—" : formatCount(totalTransactions)}
              </div>
              <div className="text-xs text-gray-600 mt-1">{timeRange}</div>
            </div>

            <div className="bg-white border border-gray-300 p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs text-gray-600">Large Transfers</div>
                <i className="fas fa-exclamation-triangle text-gray-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {largeTransfers === null ? "—" : largeTransfers.toLocaleString()}
              </div>
              <div className="text-xs text-gray-600 mt-1">Transactions ≥ 1,000 VET</div>
            </div>
          </div>

          {/* Filter and Sort Controls */}
          <div className="bg-white border border-gray-300 p-4 mb-6">
            <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
              <div className="flex items-center space-x-2 border border-gray-300 px-3 py-2 bg-white">
                <i className="fas fa-calendar text-gray-600 text-sm" />
                <select
                  value={timeRange}
                  onChange={handleTimeRangeChange}
                  className="text-sm text-gray-700 bg-transparent border-none outline-none"
                >
                  <option>Last 30 Days</option>
                  <option>Last 7 Days</option>
                  <option>Last 24 Hours</option>
                </select>
              </div>

              <div className="flex items-center space-x-2 border border-gray-300 px-3 py-2 bg-white">
                <i className="fas fa-sort text-gray-600 text-sm" />
                <select
                  value={sortBy}
                  onChange={handleSortChange}
                  className="text-sm text-gray-700 bg-transparent border-none outline-none"
                >
                  <option value="transactions">Sort by Transactions</option>
                  <option value="volume">Sort by Volume</option>
                  <option value="trend">Sort by Trend</option>
                </select>
              </div>
            </div>
          </div>

          {/* Top Hotspots List */}
          <div className="space-y-4">
            {loading ? (
              <div className="bg-white border border-gray-300 p-8 text-center text-gray-500">
                <i className="fas fa-spinner fa-spin mr-2" />
                Loading hotspots...
              </div>
            ) : error ? (
              <div className="bg-white border border-gray-300 p-8 text-center text-red-500">
                {error}
              </div>
            ) : hotspots.length === 0 ? (
              <div className="bg-white border border-gray-300 p-8 text-center text-gray-500">
                No hotspots found for this period.
                <div className="mt-2 text-xs text-gray-400">
                  The ingestion service is collecting live VeChain blocks. Try "Last 30 Days" or check back after the service has been running for a while.
                </div>
              </div>
            ) : (
              hotspots.map((hotspot, index) => (
                <div
                  key={hotspot.address}
                  className="bg-white border border-gray-300 p-5 hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gray-900 flex items-center justify-center text-white font-bold text-lg">
                          {page * PAGE_SIZE + index + 1}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-base font-semibold text-gray-900">
                            {hotspot.labelName}
                          </h3>
                          <div
                            className={`px-2 py-1 text-white text-xs ${hotspot.transactionCount > 1000 ? "bg-gray-900" : "bg-gray-500"}`}
                          >
                            {hotspot.transactionCount > 1000 ? "Critical" : "High"}
                          </div>
                          <div className="px-2 py-1 bg-gray-200 text-gray-700 text-xs">
                            {hotspot.category}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 mb-3 truncate">
                          {hotspot.address}
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                          <div>
                            <div className="text-gray-600 mb-1">Transactions</div>
                            <div className="text-lg font-bold text-gray-900">
                              {hotspot.transactionCount?.toLocaleString()}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-600 mb-1">Volume</div>
                            <div className="text-lg font-bold text-gray-900">
                              {formatVolume(hotspot.totalVolume)}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-600 mb-1">Avg Transaction</div>
                            <div className="text-lg font-bold text-gray-900">
                              ${hotspot.avgTransactionValue?.toFixed(2)}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-600 mb-1">Trend</div>
                            <div className="flex items-center space-x-2">
                              <i
                                className={`fas fa-arrow-${hotspot.trendPercent >= 0 ? "up" : "down"} text-gray-700`}
                              />
                              <span className="text-lg font-bold text-gray-900">
                                {hotspot.trendPercent >= 0 ? "+" : ""}
                                {hotspot.trendPercent.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2">
                      <button
                        onClick={() =>
                          navigate(`/explorer?address=${hotspot.address}`)
                        }
                        className="flex-1 lg:flex-none px-4 py-2 bg-gray-900 text-white text-sm hover:bg-gray-800"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          <div className="mt-6 bg-white border border-gray-300 p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0 text-sm">
              <div className="text-gray-600">
                {totalCount === 0
                  ? "No hotspots"
                  : `Showing ${page * PAGE_SIZE + 1}–${Math.min((page + 1) * PAGE_SIZE, totalCount)} of ${totalCount} hotspots`}
              </div>

              <div className="flex items-center space-x-2">
                <button
                  disabled={page === 0 || loading}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-3 py-2 border border-gray-300 text-gray-700 text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i className="fas fa-chevron-left" />
                </button>

                {buildPageButtons(page, totalPages).map((p, i) =>
                  p === "..." ? (
                    <span key={`ellipsis-${i}`} className="px-2 text-gray-600">
                      ...
                    </span>
                  ) : (
                    <button
                      key={p}
                      disabled={loading}
                      onClick={() => setPage(p)}
                      className={`px-3 py-2 text-sm ${
                        p === page
                          ? "bg-gray-900 text-white"
                          : "border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                      }`}
                    >
                      {p + 1}
                    </button>
                  ),
                )}

                <button
                  disabled={page >= totalPages - 1 || loading}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-2 border border-gray-300 text-gray-700 text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i className="fas fa-chevron-right" />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TopHotspots;
