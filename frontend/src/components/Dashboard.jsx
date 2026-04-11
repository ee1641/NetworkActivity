import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import SidebarToggleButton from "./SidebarToggleButton";
import { useSidebarToggle } from "../hooks/useSidebarToggle";
import * as api from "../utils/api";
import { supabase } from "../utils/supabase";

const DATE_RANGES = {
  "24h": { label: "Last 24 Hours", hours: 24 },
  "7d":  { label: "Last 7 Days",   hours: 24 * 7 },
  "30d": { label: "Last 30 Days",  hours: 24 * 30 },
};

const getDateRange = (rangeKey) => {
  const hours = DATE_RANGES[rangeKey]?.hours || 24;
  const end = new Date().toISOString();
  const start = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
  return { start, end };
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { isSidebarOpen, toggleSidebar } = useSidebarToggle();
  const [stats, setStats] = useState(null);
  const [largeTxs, setLargeTxs] = useState([]);
  const [volumeData, setVolumeData] = useState([]);
  const [clusterStats, setClusterStats] = useState(null);
  const [hotspots, setHotspots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("24h");
  const [volumeRange, setVolumeRange] = useState("24h");

  const fetchDashboardData = useCallback(async (range) => {
    try {
      setLoading(true);
      const { start, end } = getDateRange(range);
      const [agg, txs, volume, clusters, topHotspots] = await Promise.all([
        api.fetchAggregate(start, end),
        api.fetchLargeTransactions(100, start, end, 5),
        api.fetchVolumeTimeSeries(start, end),
        api.fetchClusterStats(start, end),
        api.fetchHotspots({ start, end, pageSize: 5, sortBy: "trend" }),
      ]);
      setStats(agg);
      setLargeTxs(txs);
      setVolumeData(volume);
      setClusterStats(clusters);
      setHotspots(topHotspots.content || []);
    } catch (err) {
      console.error("Dashboard data fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData(dateRange);
  }, [dateRange, fetchDashboardData]);

  const handleDateRangeChange = (e) => {
    const value = e.target.value;
    setDateRange(value);
    setVolumeRange(value);
  };

  const handleVolumeRangeChange = async (range) => {
    setVolumeRange(range);
    try {
      const { start, end } = getDateRange(range);
      const volume = await api.fetchVolumeTimeSeries(start, end);
      setVolumeData(volume);
    } catch (err) {
      console.error("Volume fetch error:", err);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-gray-500 text-xl animate-pulse">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
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
            {/* Auto-refresh indicator */}
            <div className="flex items-center space-x-2 text-xs text-gray-600">
              <div className="w-2 h-2 bg-gray-400 rounded-full" />
              <span className="hidden sm:inline">Auto-refresh: 30s</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1">
        {/* Sidebar Navigation */}
        <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />

        {/* Main Dashboard Content */}
        <main className="flex-1 p-4 md:p-6">
          {/* Filter Controls */}
          <div className="bg-white border border-gray-300 p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
              <h1 className="text-xl font-semibold text-gray-900">
                Analytics Dashboard
              </h1>

              <div className="flex flex-col sm:flex-row gap-3">
                {/* Date Range Filter */}
                <div className="flex items-center space-x-2 border border-gray-300 px-3 py-2 bg-white">
                  <i className="fas fa-calendar text-gray-600 text-sm" />
                  <select
                    id="date-range-filter"
                    className="text-sm text-gray-700 bg-transparent border-none outline-none cursor-pointer"
                    value={dateRange}
                    onChange={handleDateRangeChange}
                  >
                    <option value="24h">Last 24 Hours</option>
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Widget Grid System */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Token Flow Summary Widget */}
            <div className="bg-white border border-gray-300 p-5 relative group">
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <i className="fas fa-grip-vertical text-gray-400" />
              </div>

              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-900">
                  Token Flow Summary
                </h3>
                <i className="fas fa-ellipsis-v text-gray-400" />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">
                    Total Transferred
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-gray-900">
                      ${((stats?.totalTransferredValue || 0) / 1000).toFixed(1)}
                      K
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Gas Fees</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-gray-900">
                      {(stats?.totalGasFees || 0).toFixed(4)}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Transactions</span>
                    <span className="text-lg font-bold text-gray-900">
                      {stats?.transactionCount || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction Volume Chart Widget */}
            <div className="bg-white border border-gray-300 p-5 relative group md:col-span-2">
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <i className="fas fa-grip-vertical text-gray-400" />
              </div>

              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-900">
                  Transaction Volume
                </h3>
                <div className="flex items-center space-x-3">
                  <div className="flex space-x-2 text-xs">
                    {["24h", "7d", "30d"].map((r) => (
                      <button
                        key={r}
                        onClick={() => handleVolumeRangeChange(r)}
                        className={`px-2 py-1 ${
                          volumeRange === r
                            ? "bg-gray-900 text-white"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {r.toUpperCase()}
                      </button>
                    ))}
                  </div>
                  <i className="fas fa-ellipsis-v text-gray-400" />
                </div>
              </div>

              <div className="h-64 bg-gray-100 border border-gray-300 flex items-center justify-center overflow-hidden">
                <div className="w-full h-full flex items-end justify-around px-4 pb-4">
                  {volumeData.length === 0 ? (
                    <span className="text-xs text-gray-400">
                      Waiting for sync...
                    </span>
                  ) : (
                    volumeData.map((d, i) => (
                      <div
                        key={i}
                        className="w-8 bg-gray-500 hover:bg-gray-700 transition-all cursor-crosshair"
                        style={{
                          height: `${Math.min(100, (d.count / Math.max(...volumeData.map((v) => v.count), 1)) * 100)}%`,
                        }}
                        title={`${d.ts}: ${d.count} txs`}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Active Cluster Statistics Widget */}
            <div className="bg-white border border-gray-300 p-5 relative group">
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <i className="fas fa-grip-vertical text-gray-400" />
              </div>

              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-900">
                  Active Clusters
                </h3>
                <i className="fas fa-ellipsis-v text-gray-400" />
              </div>

              {/* 
                COLLABORATIVE NOTE: 
                The cluster counts below are currently derived from "Hotspots" (active addresses) as a simplified proxy.
                Team members responsible for Clustering Algorithms may replace this with results from ClusterRepository.
              */}
              <div className="text-center py-4">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {clusterStats?.totalClusters || 0}
                </div>
                <div className="text-xs text-gray-600 mb-4">
                  Total Active Clusters
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">High Activity</span>
                    <span className="font-semibold text-gray-900">
                      {clusterStats?.highActivity || 0}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 h-2">
                    <div
                      className="bg-gray-700 h-2 transition-all duration-700"
                      style={{
                        width: `${(clusterStats?.highActivity / (clusterStats?.totalClusters || 1)) * 100}%`,
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Medium Activity</span>
                    <span className="font-semibold text-gray-900">
                      {clusterStats?.mediumActivity || 0}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 h-2">
                    <div
                      className="bg-gray-500 h-2 transition-all duration-700"
                      style={{
                        width: `${(clusterStats?.mediumActivity / (clusterStats?.totalClusters || 1)) * 100}%`,
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Low Activity</span>
                    <span className="font-semibold text-gray-900">
                      {clusterStats?.lowActivity || 0}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 h-2">
                    <div
                      className="bg-gray-400 h-2 transition-all duration-700"
                      style={{
                        width: `${(clusterStats?.lowActivity / (clusterStats?.totalClusters || 1)) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Hotspot Alerts Widget */}
            <div className="bg-white border border-gray-300 p-5 relative group">
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <i className="fas fa-grip-vertical text-gray-400" />
              </div>

              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-900">
                  Hotspot Alerts
                </h3>
                <i className="fas fa-ellipsis-v text-gray-400" />
              </div>

              <div className="space-y-3">
                {hotspots.length === 0 ? (
                  <div className="text-xs text-gray-500 py-4 text-center">
                    No significant alerts
                  </div>
                ) : (
                  hotspots.map((h, i) => (
                    <div
                      key={i}
                      className={`flex items-start space-x-3 p-3 bg-gray-100 border-l-4 ${h.trendPercent > 50 ? "border-gray-900" : "border-gray-400"}`}
                    >
                      <i
                        className={`fas ${h.trendPercent > 50 ? "fa-exclamation-triangle" : "fa-info-circle"} text-gray-700 mt-1`}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-gray-900 mb-1">
                          {h.trendPercent > 50
                            ? "High Volume Detected"
                            : "Increasing Activity"}
                        </div>
                        <div className="text-xs text-gray-600 truncate">
                          {h.labelName} ({h.address.substring(0, 6)}...)
                        </div>
                      </div>
                    </div>
                  ))
                )}

                <button
                  onClick={() => navigate("/hotspots")}
                  className="w-full text-xs text-gray-700 py-2 border border-gray-300 hover:bg-gray-50"
                >
                  View All Alerts
                </button>
              </div>
            </div>

            {/* Recent Activity Feed Widget */}
            <div className="bg-white border border-gray-300 p-5 relative group">
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <i className="fas fa-grip-vertical text-gray-400" />
              </div>

              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-900">
                  Recent Large Activity
                </h3>
                <i className="fas fa-ellipsis-v text-gray-400" />
              </div>

              <div className="space-y-3">
                {largeTxs.length === 0 ? (
                  <div className="text-xs text-gray-500 py-4 text-center">
                    No recent large activity
                  </div>
                ) : (
                  largeTxs.map((tx) => (
                    <div
                      key={tx.id}
                      className="flex items-start space-x-3 pb-3 border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-8 h-8 bg-gray-300 flex items-center justify-center flex-shrink-0">
                        <i className="fas fa-arrow-right text-gray-700 text-xs" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-gray-900 mb-1">
                          Transfer: {tx.value?.toLocaleString()} VET
                        </div>
                        <div className="text-xs text-gray-600 truncate">
                          {tx.fromAddress?.substring(0, 6)}... →{" "}
                          {tx.toAddress?.substring(0, 6)}...
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Block: {tx.blockNumber}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Additional Metrics Widget */}
            <div className="bg-white border border-gray-300 p-5 relative group lg:col-span-3">
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <i className="fas fa-grip-vertical text-gray-400" />
              </div>

              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-900">
                  Key Performance Metrics
                </h3>
                <i className="fas fa-ellipsis-v text-gray-400" />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 border border-gray-200">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {stats?.transactionCount?.toLocaleString() || 0}
                  </div>
                  <div className="text-xs text-gray-600">
                    Total Transactions
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Live data</div>
                </div>

                <div className="text-center p-4 bg-gray-50 border border-gray-200">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    ${((stats?.totalTransferredValue || 0) / 1000).toFixed(1)}K
                  </div>
                  <div className="text-xs text-gray-600">Total Volume</div>
                  <div className="text-xs text-gray-500 mt-1">Live data</div>
                </div>

                <div className="text-center p-4 bg-gray-50 border border-gray-200">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {stats?.uniqueSenders || 0}
                  </div>
                  <div className="text-xs text-gray-600">Active Wallets</div>
                  <div className="text-xs text-gray-500 mt-1">Live data</div>
                </div>

                <div className="text-center p-4 bg-gray-50 border border-gray-200">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    99.9%
                  </div>
                  <div className="text-xs text-gray-600">Success Rate</div>
                  <div className="text-xs text-gray-500 mt-1">Static proxy</div>
                </div>
              </div>
            </div>
          </div>

          {/* Customization Helper Text */}
          <div className="mt-6 p-4 bg-gray-100 border border-gray-300 text-center">
            <p className="text-xs text-gray-600">
              <i className="fas fa-info-circle mr-2" />
              Hover over widgets to see drag handles. Drag and drop to customize
              your dashboard layout.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
