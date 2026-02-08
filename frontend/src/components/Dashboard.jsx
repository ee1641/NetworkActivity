import React from "react";
import Sidebar from "./Sidebar";

const Dashboard = () => {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-gray-300 px-4 md:px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
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

            {/* Settings */}
            <button className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100">
              <i className="fas fa-cog" />
            </button>

            {/* User Profile */}
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
        <Sidebar />

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
                  <select className="text-sm text-gray-700 bg-transparent border-none outline-none">
                    <option>Last 24 Hours</option>
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                    <option>Custom Range</option>
                  </select>
                </div>

                {/* Token Type Filter */}
                <div className="flex items-center space-x-2 border border-gray-300 px-3 py-2 bg-white">
                  <i className="fas fa-filter text-gray-600 text-sm" />
                  <select className="text-sm text-gray-700 bg-transparent border-none outline-none">
                    <option>All Tokens</option>
                    <option>ETH</option>
                    <option>BTC</option>
                    <option>USDT</option>
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
                  <span className="text-xs text-gray-600">Inflow</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-gray-900">
                      $2.4M
                    </span>
                    <i className="fas fa-arrow-up text-gray-700 text-xs" />
                    <span className="text-xs text-gray-600">12.5%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Outflow</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-gray-900">
                      $1.8M
                    </span>
                    <i className="fas fa-arrow-down text-gray-700 text-xs" />
                    <span className="text-xs text-gray-600">8.3%</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Net Flow</span>
                    <span className="text-lg font-bold text-gray-900">
                      +$600K
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
                    <button className="px-2 py-1 bg-gray-900 text-white">
                      24H
                    </button>
                    <button className="px-2 py-1 text-gray-600 hover:bg-gray-100">
                      7D
                    </button>
                    <button className="px-2 py-1 text-gray-600 hover:bg-gray-100">
                      30D
                    </button>
                  </div>
                  <i className="fas fa-ellipsis-v text-gray-400" />
                </div>
              </div>

              <div className="h-64 bg-gray-100 border border-gray-300 flex items-center justify-center overflow-hidden">
                <div className="w-full h-full flex items-end justify-around px-4 pb-4">
                  <div className="w-8 bg-gray-400" style={{ height: "60%" }} />
                  <div className="w-8 bg-gray-500" style={{ height: "75%" }} />
                  <div className="w-8 bg-gray-400" style={{ height: "45%" }} />
                  <div className="w-8 bg-gray-600" style={{ height: "85%" }} />
                  <div className="w-8 bg-gray-500" style={{ height: "70%" }} />
                  <div className="w-8 bg-gray-400" style={{ height: "55%" }} />
                  <div className="w-8 bg-gray-500" style={{ height: "80%" }} />
                  <div className="w-8 bg-gray-600" style={{ height: "90%" }} />
                  <div className="w-8 bg-gray-500" style={{ height: "65%" }} />
                  <div className="w-8 bg-gray-400" style={{ height: "50%" }} />
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

              <div className="text-center py-4">
                <div className="text-4xl font-bold text-gray-900 mb-2">847</div>
                <div className="text-xs text-gray-600 mb-4">
                  Total Active Clusters
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">High Activity</span>
                    <span className="font-semibold text-gray-900">124</span>
                  </div>
                  <div className="w-full bg-gray-200 h-2">
                    <div
                      className="bg-gray-700 h-2"
                      style={{ width: "35%" }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Medium Activity</span>
                    <span className="font-semibold text-gray-900">456</span>
                  </div>
                  <div className="w-full bg-gray-200 h-2">
                    <div
                      className="bg-gray-500 h-2"
                      style={{ width: "54%" }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Low Activity</span>
                    <span className="font-semibold text-gray-900">267</span>
                  </div>
                  <div className="w-full bg-gray-200 h-2">
                    <div
                      className="bg-gray-400 h-2"
                      style={{ width: "31%" }}
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
                <div className="flex items-start space-x-3 p-3 bg-gray-100 border-l-4 border-gray-800">
                  <i className="fas fa-exclamation-triangle text-gray-800 mt-1" />
                  <div className="flex-1">
                    <div className="text-xs font-semibold text-gray-900 mb-1">
                      High Volume Detected
                    </div>
                    <div className="text-xs text-gray-600">
                      Cluster #4521 - 2 min ago
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-gray-100 border-l-4 border-gray-600">
                  <i className="fas fa-info-circle text-gray-600 mt-1" />
                  <div className="flex-1">
                    <div className="text-xs font-semibold text-gray-900 mb-1">
                      Unusual Pattern
                    </div>
                    <div className="text-xs text-gray-600">
                      Cluster #3892 - 15 min ago
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-gray-100 border-l-4 border-gray-600">
                  <i className="fas fa-info-circle text-gray-600 mt-1" />
                  <div className="flex-1">
                    <div className="text-xs font-semibold text-gray-900 mb-1">
                      New Cluster Formed
                    </div>
                    <div className="text-xs text-gray-600">
                      Cluster #5103 - 32 min ago
                    </div>
                  </div>
                </div>

                <button className="w-full text-xs text-gray-700 py-2 border border-gray-300 hover:bg-gray-50">
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
                  Recent Activity
                </h3>
                <i className="fas fa-ellipsis-v text-gray-400" />
              </div>

              <div className="space-y-3">
                <div className="flex items-start space-x-3 pb-3 border-b border-gray-200">
                  <div className="w-8 h-8 bg-gray-300 flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-arrow-right text-gray-700 text-xs" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-gray-900 mb-1">
                      Transfer: 125.5 ETH
                    </div>
                    <div className="text-xs text-gray-600 truncate">
                      0x742d...3f8a → 0x9c1e...7b2d
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      2 minutes ago
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3 pb-3 border-b border-gray-200">
                  <div className="w-8 h-8 bg-gray-300 flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-arrow-right text-gray-700 text-xs" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-gray-900 mb-1">
                      Transfer: 50.2 BTC
                    </div>
                    <div className="text-xs text-gray-600 truncate">
                      0x1a2b...4c5d → 0x6e7f...8g9h
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      8 minutes ago
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3 pb-3 border-b border-gray-200">
                  <div className="w-8 h-8 bg-gray-300 flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-arrow-right text-gray-700 text-xs" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-gray-900 mb-1">
                      Transfer: 1,000 USDT
                    </div>
                    <div className="text-xs text-gray-600 truncate">
                      0x3d4e...5f6g → 0x7h8i...9j0k
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      15 minutes ago
                    </div>
                  </div>
                </div>

                <button className="w-full text-xs text-gray-700 py-2 border border-gray-300 hover:bg-gray-50">
                  View All Activity
                </button>
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
                    15,847
                  </div>
                  <div className="text-xs text-gray-600">
                    Total Transactions
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    +5.2% vs yesterday
                  </div>
                </div>

                <div className="text-center p-4 bg-gray-50 border border-gray-200">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    $8.2M
                  </div>
                  <div className="text-xs text-gray-600">Total Volume</div>
                  <div className="text-xs text-gray-500 mt-1">
                    +12.8% vs yesterday
                  </div>
                </div>

                <div className="text-center p-4 bg-gray-50 border border-gray-200">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    3,421
                  </div>
                  <div className="text-xs text-gray-600">Active Wallets</div>
                  <div className="text-xs text-gray-500 mt-1">
                    +2.1% vs yesterday
                  </div>
                </div>

                <div className="text-center p-4 bg-gray-50 border border-gray-200">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    98.7%
                  </div>
                  <div className="text-xs text-gray-600">Success Rate</div>
                  <div className="text-xs text-gray-500 mt-1">
                    -0.3% vs yesterday
                  </div>
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
