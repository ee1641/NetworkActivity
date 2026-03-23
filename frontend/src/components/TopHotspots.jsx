import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import SidebarToggleButton from "./SidebarToggleButton";
import { useSidebarToggle } from "../hooks/useSidebarToggle";
import * as api from "../utils/api";

const TopHotspots = () => {
  const { isSidebarOpen, toggleSidebar } = useSidebarToggle();
  const [hotspots, setHotspots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState("24h");

  const fetchHotspots = async () => {
    try {
      setLoading(true);
      const data = await api.fetchHotspots();
      setHotspots(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching hotspots:", err);
      setError("Failed to load hotspots data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotspots();
  }, []);

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
            <button className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100">
              <i className="fas fa-cog" />
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-300 rounded-full" />
              <span className="text-sm text-gray-700 hidden md:block">
                User Name
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1">
        {/* Sidebar Navigation */}
        <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />

        {/* Main Content */}
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
                <button className="px-4 py-2 bg-gray-900 text-white text-sm hover:bg-gray-800">
                  <i className="fas fa-download mr-2" />
                  Export
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 text-sm hover:bg-gray-50">
                  <i className="fas fa-sync-alt mr-2" />
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
              <div className="text-2xl font-bold text-gray-900">127</div>
              <div className="text-xs text-gray-600 mt-1 flex items-center space-x-1">
                <i className="fas fa-arrow-up text-gray-700" />
                <span>+12% from yesterday</span>
              </div>
            </div>

            <div className="bg-white border border-gray-300 p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs text-gray-600">Total Volume</div>
                <i className="fas fa-dollar-sign text-gray-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900">$45.2M</div>
              <div className="text-xs text-gray-600 mt-1 flex items-center space-x-1">
                <i className="fas fa-arrow-up text-gray-700" />
                <span>+28% from yesterday</span>
              </div>
            </div>

            <div className="bg-white border border-gray-300 p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs text-gray-600">Total Transactions</div>
                <i className="fas fa-exchange-alt text-gray-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900">89.4K</div>
              <div className="text-xs text-gray-600 mt-1 flex items-center space-x-1">
                <i className="fas fa-arrow-up text-gray-700" />
                <span>+15% from yesterday</span>
              </div>
            </div>

            <div className="bg-white border border-gray-300 p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs text-gray-600">Critical Alerts</div>
                <i className="fas fa-exclamation-triangle text-gray-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900">23</div>
              <div className="text-xs text-gray-600 mt-1 flex items-center space-x-1">
                <i className="fas fa-arrow-up text-gray-700" />
                <span>+5 new alerts</span>
              </div>
            </div>
          </div>

          {/* Filter and Sort Controls */}
          <div className="bg-white border border-gray-300 p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex items-center space-x-2 border border-gray-300 px-3 py-2 bg-white">
                  <i className="fas fa-filter text-gray-600 text-sm" />
                  <select className="text-sm text-gray-700 bg-transparent border-none outline-none">
                    <option>All Categories</option>
                    <option>DeFi Protocols</option>
                    <option>NFT Marketplaces</option>
                    <option>DEX Platforms</option>
                    <option>Lending Protocols</option>
                    <option>Wallet Services</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2 border border-gray-300 px-3 py-2 bg-white">
                  <i className="fas fa-calendar text-gray-600 text-sm" />
                  <select className="text-sm text-gray-700 bg-transparent border-none outline-none">
                    <option>Last 24 Hours</option>
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                    <option>Custom Range</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-2 border border-gray-300 px-3 py-2 bg-white">
                <i className="fas fa-sort text-gray-600 text-sm" />
                <select className="text-sm text-gray-700 bg-transparent border-none outline-none">
                  <option>Sort by Volume</option>
                  <option>Sort by Transactions</option>
                  <option>Sort by Trend</option>
                  <option>Sort by Alert Level</option>
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
                          {index + 1}
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
                            {hotspot.transactionCount > 1000
                              ? "Critical"
                              : "High"}
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
                            <div className="text-gray-600 mb-1">
                              Transactions
                            </div>
                            <div className="text-lg font-bold text-gray-900">
                              {hotspot.transactionCount?.toLocaleString()}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-600 mb-1">Volume</div>
                            <div className="text-lg font-bold text-gray-900">
                              ${(hotspot.totalVolume / 1000).toFixed(1)}K
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-600 mb-1">
                              Avg Transaction
                            </div>
                            <div className="text-lg font-bold text-gray-900">
                              ${hotspot.avgTransactionValue?.toFixed(2)}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-600 mb-1">24h Trend</div>
                            <div className="flex items-center space-x-2">
                              <i className="fas fa-arrow-up text-gray-700" />
                              <span className="text-lg font-bold text-gray-900">
                                +5%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2">
                      <button className="flex-1 lg:flex-none px-4 py-2 bg-gray-900 text-white text-sm hover:bg-gray-800">
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
              <div className="text-gray-600">Showing 1-8 of 127 hotspots</div>

              <div className="flex items-center space-x-2">
                <button className="px-3 py-2 border border-gray-300 text-gray-700 text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                  <i className="fas fa-chevron-left" />
                </button>
                <button className="px-3 py-2 bg-gray-900 text-white text-sm">
                  1
                </button>
                <button className="px-3 py-2 border border-gray-300 text-gray-700 text-sm hover:bg-gray-50">
                  2
                </button>
                <button className="px-3 py-2 border border-gray-300 text-gray-700 text-sm hover:bg-gray-50">
                  3
                </button>
                <span className="px-2 text-gray-600">...</span>
                <button className="px-3 py-2 border border-gray-300 text-gray-700 text-sm hover:bg-gray-50">
                  16
                </button>
                <button className="px-3 py-2 border border-gray-300 text-gray-700 text-sm hover:bg-gray-50">
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
