import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "./Sidebar";
import SidebarToggleButton from "./SidebarToggleButton";
import { useSidebarToggle } from "../hooks/useSidebarToggle";
import * as api from "../utils/api";

const TransactionFlowVisualization = () => {
  const { isSidebarOpen, toggleSidebar } = useSidebarToggle();

  // State for data and UI
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLive, setIsLive] = useState(true);

  // State for filters
  const [filters, setFilters] = useState({
    start: "",
    end: "",
    minVolume: 0,
    maxVolume: 10000000,
    tokenTypes: ["ETH", "BTC", "USDT", "USDC", "DAI"],
    actorTypes: [],
  });

  // Helper to truncate addresses
  const truncateAddr = (addr) => {
    if (!addr) return "";
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Format dates to ISO string if they exist
      let startStr = filters.start ? new Date(filters.start).toISOString() : "";
      let endStr = filters.end ? new Date(filters.end).toISOString() : "";

      const aggregate = await api.fetchAggregate(
        startStr,
        endStr,
        null,
        filters.minVolume,
        filters.maxVolume,
      );
      console.log("Aggregate API Response:", aggregate);
      setData(aggregate);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setError(
        "Failed to load transaction data. Please check your connection.",
      );
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Initial fetch and Live update logic
  useEffect(() => {
    fetchData();

    let intervalId;
    if (isLive) {
      intervalId = setInterval(() => {
        // In live mode, we only refresh if no custom range is set
        if (!filters.start && !filters.end) {
          fetchData();
        }
      }, 30000); // 30 seconds
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [fetchData, isLive, filters.start, filters.end]);

  const handleApplyFilters = () => {
    fetchData();
  };

  const toggleLiveHistorical = (mode) => {
    setIsLive(mode === "live");
  };

  const handleReset = () => {
    setFilters({
      start: "",
      end: "",
      minVolume: 0,
      maxVolume: 10000000,
      tokenTypes: ["ETH", "BTC", "USDT", "USDC", "DAI"],
      actorTypes: [],
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      {/* Top Navigation Bar */}
      <header className="bg-gray-800 border-b border-gray-700 px-4 md:px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <SidebarToggleButton
              isSidebarOpen={isSidebarOpen}
              onToggle={toggleSidebar}
            />
            <div className="w-8 h-8 bg-gray-700 flex items-center justify-center">
              <i className="fas fa-project-diagram text-white text-sm" />
            </div>
            <span className="text-lg font-semibold text-white hidden sm:block">
              Transaction Flow Visualization
            </span>
          </div>

          <div className="flex items-center space-x-3 md:space-x-6">
            {/* Live/Historical Mode Toggle */}
            <div className="flex items-center space-x-2 bg-gray-700 px-3 py-1.5 border border-gray-600">
              <button
                onClick={() => toggleLiveHistorical("live")}
                className={`px-3 py-1 text-xs ${isLive ? "bg-gray-900 text-white" : "text-gray-400 hover:bg-gray-600"}`}
              >
                Live
              </button>
              <button
                onClick={() => toggleLiveHistorical("historical")}
                className={`px-3 py-1 text-xs ${!isLive ? "bg-gray-900 text-white" : "text-gray-400 hover:bg-gray-600"}`}
              >
                Historical
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1">
        {/* Shared Sidebar */}
        <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />

        {/* Left Control Panel */}
        <aside className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
          <div className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
            {/* Reset Filters */}
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">
                Filters & Controls
              </h2>
              <button
                onClick={handleReset}
                className="text-xs text-gray-400 hover:text-white"
              >
                Reset All
              </button>
            </div>

            {/* Date Range Picker */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-300">
                Date Range
              </label>
              <div className="flex items-center space-x-2 bg-gray-900 border border-gray-700 px-3 py-2">
                <i className="fas fa-calendar text-gray-400 text-xs" />
                <input
                  type="datetime-local"
                  placeholder="Start Date"
                  value={filters.start}
                  onChange={(e) =>
                    setFilters({ ...filters, start: e.target.value })
                  }
                  className="flex-1 bg-transparent text-xs text-white border-none outline-none [color-scheme:dark]"
                />
              </div>
              <div className="flex items-center space-x-2 bg-gray-900 border border-gray-700 px-3 py-2">
                <i className="fas fa-calendar text-gray-400 text-xs" />
                <input
                  type="datetime-local"
                  placeholder="End Date"
                  value={filters.end}
                  onChange={(e) =>
                    setFilters({ ...filters, end: e.target.value })
                  }
                  className="flex-1 bg-transparent text-xs text-white border-none outline-none [color-scheme:dark]"
                />
              </div>
              <div className="flex space-x-2">
                {[
                  { label: "24H", hours: 24 },
                  { label: "7D", hours: 24 * 7 },
                  { label: "30D", hours: 24 * 30 },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => {
                      const end = new Date();
                      const start = new Date(
                        end.getTime() - preset.hours * 60 * 60 * 1000,
                      );
                      // Format to YYYY-MM-DDTHH:mm for datetime-local
                      const format = (date) => {
                        const d = new Date(
                          date.getTime() - date.getTimezoneOffset() * 60000,
                        );
                        return d.toISOString().slice(0, 16);
                      };
                      setFilters({
                        ...filters,
                        start: format(start),
                        end: format(end),
                      });
                    }}
                    className="flex-1 px-2 py-1 bg-gray-700 text-white text-xs hover:bg-gray-600"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Token Type Multi-Select */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-300">
                Token Type
              </label>
              <div className="bg-gray-900 border border-gray-700 px-3 py-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-400">Select tokens</span>
                  <i className="fas fa-chevron-down text-gray-400 text-xs" />
                </div>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {["ETH", "BTC", "USDT", "USDC", "DAI"].map((token) => (
                    <label key={token} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={filters.tokenTypes.includes(token)}
                        onChange={(e) => {
                          const newTokens = e.target.checked
                            ? [...filters.tokenTypes, token]
                            : filters.tokenTypes.filter((t) => t !== token);
                          setFilters({ ...filters, tokenTypes: newTokens });
                        }}
                        className="w-3 h-3 bg-gray-700 border-gray-600"
                      />
                      <span className="text-xs text-white">{token}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Volume Slider */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-300">
                Transaction Volume
              </label>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>Min: $0</span>
                  <span>Max: $10M</span>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max="10000000"
                    value={filters.maxVolume}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        maxVolume: parseInt(e.target.value),
                      })
                    }
                    className="w-full h-2 bg-gray-700 appearance-none"
                  />
                  <div className="flex items-center justify-between mt-2">
                    <input
                      type="text"
                      placeholder="$0"
                      value={filters.minVolume}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          minVolume: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-20 px-2 py-1 bg-gray-900 border border-gray-700 text-xs text-white"
                    />
                    <span className="text-gray-500">to</span>
                    <input
                      type="text"
                      placeholder="$5M"
                      value={filters.maxVolume}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          maxVolume: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-20 px-2 py-1 bg-gray-900 border border-gray-700 text-xs text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Actor Type Checkboxes */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-300">
                Actor Type
              </label>
              <div className="space-y-2">
                {[
                  "Wallets",
                  "Exchanges",
                  "DeFi Protocols",
                  "Smart Contracts",
                  "NFT Marketplaces",
                  "DAOs",
                ].map((actor) => (
                  <label key={actor} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.actorTypes.includes(actor)}
                      onChange={(e) => {
                        const newActors = e.target.checked
                          ? [...filters.actorTypes, actor]
                          : filters.actorTypes.filter((a) => a !== actor);
                        setFilters({ ...filters, actorTypes: newActors });
                      }}
                      className="w-4 h-4 bg-gray-700 border-gray-600"
                    />
                    <span className="text-xs text-white">{actor}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Apply Filters Button */}
            <button
              onClick={handleApplyFilters}
              disabled={loading}
              className="w-full px-4 py-2 bg-gray-700 text-white text-sm font-medium hover:bg-gray-600 border border-gray-600 disabled:opacity-50"
            >
              {loading ? "Applying..." : "Apply Filters"}
            </button>

            {/* Legend */}
            <div className="space-y-2 pt-4 border-t border-gray-700">
              <h3 className="text-xs font-semibold text-white">Legend</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-300 border border-gray-500" />
                  <span className="text-xs text-gray-400">Wallet</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-400 border border-gray-500" />
                  <span className="text-xs text-gray-400">Exchange</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-500 border border-gray-600" />
                  <span className="text-xs text-gray-400">DeFi Protocol</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-600 border border-gray-700" />
                  <span className="text-xs text-gray-400">Smart Contract</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-0.5 bg-gray-400" />
                  <span className="text-xs text-gray-400">Low Volume</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-1 bg-gray-500" />
                  <span className="text-xs text-gray-400">Medium Volume</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-1.5 bg-gray-600" />
                  <span className="text-xs text-gray-400">High Volume</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Visualization Canvas */}
        <main className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-4"></div>

            <div className="flex items-center space-x-3"></div>
          </div>

          {/* Canvas Area with Mini-map */}
          <div className="flex-1 relative bg-gray-950 overflow-hidden">
            {/* Full-screen Loading Overlay */}
            {loading && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-50 flex items-center justify-center transition-all duration-300">
                <div className="flex flex-col items-center">
                  <div className="relative w-20 h-20 mb-4">
                    <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                  </div>
                  <div className="text-white font-medium text-lg tracking-wider animate-pulse uppercase">
                    Fetching Transaction Flows...
                  </div>
                </div>
              </div>
            )}

            {/* Empty State Overlay */}
            {!loading && data && (!data.flows || data.flows.length === 0) && (
              <div className="absolute inset-0 z-40 flex items-center justify-center">
                <div className="bg-gray-800/80 border border-gray-700 px-8 py-6 rounded-xl text-center shadow-2xl backdrop-blur-md">
                  <div className="text-blue-400 text-4xl mb-4">
                    <i className="fas fa-search"></i>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    No Flows Found
                  </h3>
                  <p className="text-gray-400 max-w-xs">
                    Try adjusting your filters or time range to see activity.
                  </p>
                  <button
                    onClick={handleReset}
                    className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            )}

            {/* Main Canvas */}
            <div className="absolute inset-0 flex items-center justify-center p-8">
              {error ? (
                <div className="text-red-500 text-center z-30">
                  <i className="fas fa-exclamation-triangle text-4xl mb-4" />
                  <p>{error}</p>
                </div>
              ) : (
                <div className="w-full h-full relative">
                  <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 1000 600"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <defs>
                      <linearGradient
                        id="flowGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop
                          offset="0%"
                          stopColor="#4B5563"
                          stopOpacity="0.2"
                        />
                        <stop
                          offset="50%"
                          stopColor="#6366f1"
                          stopOpacity="0.4"
                        />
                        <stop
                          offset="100%"
                          stopColor="#4B5563"
                          stopOpacity="0.2"
                        />
                      </linearGradient>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                        <feMerge>
                          <feMergeNode in="coloredBlur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>

                    {/* Real Flows */}
                    {(data?.flows || []).map((flow, fIdx) => {
                      const senderIdx = (data?.topSenders || []).findIndex(
                        (s) => s.address === flow.from,
                      );
                      const receiverIdx = (data?.topReceivers || []).findIndex(
                        (r) => r.address === flow.to,
                      );

                      // Only draw if both nodes are visible in top 5 lists
                      // (Wait, we might want to show all flows if possible, but let's stick to the current layout)
                      if (
                        senderIdx !== -1 &&
                        receiverIdx !== -1 &&
                        senderIdx < 5 &&
                        receiverIdx < 5
                      ) {
                        const x1 = 200;
                        const y1 = 100 + senderIdx * 100;
                        const x2 = 800;
                        const y2 = 100 + receiverIdx * 100;
                        const cx = 500;

                        // Calculate relative width based on value
                        const maxVal = Math.max(
                          ...data.flows.map((f) => f.value),
                        );
                        const strokeWidth = 1 + (flow.value / maxVal) * 10;

                        return (
                          <path
                            key={`flow-${fIdx}`}
                            d={`M ${x1} ${y1} C ${cx} ${y1}, ${cx} ${y2}, ${x2} ${y2}`}
                            fill="none"
                            stroke="url(#flowGradient)"
                            strokeWidth={strokeWidth}
                            className="opacity-70"
                            filter="url(#glow)"
                          >
                            <animate
                              attributeName="stroke-dashoffset"
                              from="100"
                              to="0"
                              dur={`${Math.max(1, 5 - (flow.value / maxVal) * 4)}s`}
                              repeatCount="indefinite"
                            />
                          </path>
                        );
                      }
                      return null;
                    })}

                    {/* Sender Nodes */}
                    {(data?.topSenders || []).slice(0, 5).map((sender, idx) => (
                      <g
                        key={`sender-${idx}`}
                        transform={`translate(200, ${100 + idx * 100})`}
                      >
                        <rect
                          x="-80"
                          y="-25"
                          width="160"
                          height="50"
                          rx="4"
                          fill="#111827"
                          stroke="#374151"
                        />
                        <text
                          x="0"
                          y="5"
                          textAnchor="middle"
                          fill="white"
                          fontSize="10"
                          fontWeight="bold"
                        >
                          {truncateAddr(sender.address)}
                        </text>
                        <text
                          x="0"
                          y="18"
                          textAnchor="middle"
                          fill="#9CA3AF"
                          fontSize="8"
                        >
                          {sender.transactionCount} txs
                        </text>
                      </g>
                    ))}

                    {/* Receiver Nodes */}
                    {(data?.topReceivers || [])
                      .slice(0, 5)
                      .map((receiver, idx) => (
                        <g
                          key={`receiver-${idx}`}
                          transform={`translate(800, ${100 + idx * 100})`}
                        >
                          <rect
                            x="-80"
                            y="-25"
                            width="160"
                            height="50"
                            rx="4"
                            fill="#111827"
                            stroke="#374151"
                          />
                          <text
                            x="0"
                            y="5"
                            textAnchor="middle"
                            fill="white"
                            fontSize="10"
                            fontWeight="bold"
                          >
                            {truncateAddr(receiver.address)}
                          </text>
                          <text
                            x="0"
                            y="18"
                            textAnchor="middle"
                            fill="#9CA3AF"
                            fontSize="8"
                          >
                            {receiver.transactionCount} txs
                          </text>
                        </g>
                      ))}
                  </svg>
                </div>
              )}
            </div>

            {/* Stats Overlay */}
            <div className="absolute top-4 left-4 bg-gray-900 border border-gray-700 px-4 py-3 space-y-2 z-10">
              {loading && !data ? (
                <div className="text-xs text-gray-400 animate-pulse">
                  Loading stats...
                </div>
              ) : error ? (
                <div className="text-xs text-red-400">{error}</div>
              ) : (
                <>
                  <div className="flex items-center justify-between space-x-8">
                    <span className="text-xs text-gray-400">Transactions:</span>
                    <span className="text-sm font-semibold text-white">
                      {data?.transactionCount?.toLocaleString() || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between space-x-8">
                    <span className="text-xs text-gray-400">Total Volume:</span>
                    <span className="text-sm font-semibold text-white">
                      $
                      {((data?.totalTransferredValue || 0) / 1000000).toFixed(
                        1,
                      )}
                      M
                    </span>
                  </div>
                  <div className="flex items-center justify-between space-x-8">
                    <span className="text-xs text-gray-400">
                      Unique Senders:
                    </span>
                    <span className="text-sm font-semibold text-white">
                      {data?.uniqueSenders?.toLocaleString() || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between space-x-8 pt-1 border-t border-gray-800">
                    <span className="text-xs text-gray-400">
                      Activity Level:
                    </span>
                    <div className="flex items-center">
                      <span className="text-xs font-medium text-blue-400 uppercase tracking-wider">
                        {data?.transactionCount > 50 ? "High" : "Low"}
                      </span>
                      {loading && (
                        <span className="ml-2 flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-blue-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TransactionFlowVisualization;
