import React from "react";
import Sidebar from "./Sidebar";

const TopHotspots = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
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
        <Sidebar />

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
            {/* Hotspot 1 - Critical */}
            <div className="bg-white border border-gray-300 p-5 hover:shadow-lg transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gray-900 flex items-center justify-center text-white font-bold text-lg">
                      1
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-base font-semibold text-gray-900">
                        UniswapV3 Router
                      </h3>
                      <div className="px-2 py-1 bg-gray-900 text-white text-xs">
                        Critical
                      </div>
                      <div className="px-2 py-1 bg-gray-200 text-gray-700 text-xs">
                        DeFi
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 mb-3">
                      0x68b3...465f
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                      <div>
                        <div className="text-gray-600 mb-1">Transactions</div>
                        <div className="text-lg font-bold text-gray-900">
                          12,847
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600 mb-1">Volume</div>
                        <div className="text-lg font-bold text-gray-900">
                          $8.2M
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600 mb-1">
                          Avg Transaction
                        </div>
                        <div className="text-lg font-bold text-gray-900">
                          $638
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600 mb-1">24h Trend</div>
                        <div className="flex items-center space-x-2">
                          <i className="fas fa-arrow-up text-gray-700" />
                          <span className="text-lg font-bold text-gray-900">
                            +45%
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
                  <button className="flex-1 lg:flex-none px-4 py-2 border border-gray-300 text-gray-700 text-sm hover:bg-gray-50">
                    Set Alert
                  </button>
                </div>
              </div>
            </div>

            {/* Hotspot 2 - High */}
            <div className="bg-white border border-gray-300 p-5 hover:shadow-lg transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gray-700 flex items-center justify-center text-white font-bold text-lg">
                      2
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-base font-semibold text-gray-900">
                        OpenSea Seaport
                      </h3>
                      <div className="px-2 py-1 bg-gray-700 text-white text-xs">
                        High
                      </div>
                      <div className="px-2 py-1 bg-gray-200 text-gray-700 text-xs">
                        NFT
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 mb-3">
                      0x00c0...0000
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                      <div>
                        <div className="text-gray-600 mb-1">Transactions</div>
                        <div className="text-lg font-bold text-gray-900">
                          8,521
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600 mb-1">Volume</div>
                        <div className="text-lg font-bold text-gray-900">
                          $5.7M
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600 mb-1">
                          Avg Transaction
                        </div>
                        <div className="text-lg font-bold text-gray-900">
                          $669
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600 mb-1">24h Trend</div>
                        <div className="flex items-center space-x-2">
                          <i className="fas fa-arrow-up text-gray-700" />
                          <span className="text-lg font-bold text-gray-900">
                            +32%
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
                  <button className="flex-1 lg:flex-none px-4 py-2 border border-gray-300 text-gray-700 text-sm hover:bg-gray-50">
                    Set Alert
                  </button>
                </div>
              </div>
            </div>

            {/* Hotspot 3 - High */}
            <div className="bg-white border border-gray-300 p-5 hover:shadow-lg transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gray-700 flex items-center justify-center text-white font-bold text-lg">
                      3
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-base font-semibold text-gray-900">
                        Aave V3 Pool
                      </h3>
                      <div className="px-2 py-1 bg-gray-700 text-white text-xs">
                        High
                      </div>
                      <div className="px-2 py-1 bg-gray-200 text-gray-700 text-xs">
                        Lending
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 mb-3">
                      0x87ac...7f2e
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                      <div>
                        <div className="text-gray-600 mb-1">Transactions</div>
                        <div className="text-lg font-bold text-gray-900">
                          7,234
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600 mb-1">Volume</div>
                        <div className="text-lg font-bold text-gray-900">
                          $4.9M
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600 mb-1">
                          Avg Transaction
                        </div>
                        <div className="text-lg font-bold text-gray-900">
                          $677
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600 mb-1">24h Trend</div>
                        <div className="flex items-center space-x-2">
                          <i className="fas fa-arrow-up text-gray-700" />
                          <span className="text-lg font-bold text-gray-900">
                            +28%
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
                  <button className="flex-1 lg:flex-none px-4 py-2 border border-gray-300 text-gray-700 text-sm hover:bg-gray-50">
                    Set Alert
                  </button>
                </div>
              </div>
            </div>

            {/* Hotspot 4 - Medium */}
            <div className="bg-white border border-gray-300 p-5 hover:shadow-lg transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gray-500 flex items-center justify-center text-white font-bold text-lg">
                      4
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-base font-semibold text-gray-900">
                        Curve Finance
                      </h3>
                      <div className="px-2 py-1 bg-gray-500 text-white text-xs">
                        Medium
                      </div>
                      <div className="px-2 py-1 bg-gray-200 text-gray-700 text-xs">
                        DEX
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 mb-3">
                      0xbebc...44dd
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                      <div>
                        <div className="text-gray-600 mb-1">Transactions</div>
                        <div className="text-lg font-bold text-gray-900">
                          5,892
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600 mb-1">Volume</div>
                        <div className="text-lg font-bold text-gray-900">
                          $3.4M
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600 mb-1">
                          Avg Transaction
                        </div>
                        <div className="text-lg font-bold text-gray-900">
                          $577
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600 mb-1">24h Trend</div>
                        <div className="flex items-center space-x-2">
                          <i className="fas fa-arrow-up text-gray-700" />
                          <span className="text-lg font-bold text-gray-900">
                            +18%
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
                  <button className="flex-1 lg:flex-none px-4 py-2 border border-gray-300 text-gray-700 text-sm hover:bg-gray-50">
                    Set Alert
                  </button>
                </div>
              </div>
            </div>

            {/* Hotspot 5 - Medium */}
            <div className="bg-white border border-gray-300 p-5 hover:shadow-lg transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gray-500 flex items-center justify-center text-white font-bold text-lg">
                      5
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-base font-semibold text-gray-900">
                        1inch Router
                      </h3>
                      <div className="px-2 py-1 bg-gray-500 text-white text-xs">
                        Medium
                      </div>
                      <div className="px-2 py-1 bg-gray-200 text-gray-700 text-xs">
                        DEX
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 mb-3">
                      0x1111...1117
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                      <div>
                        <div className="text-gray-600 mb-1">Transactions</div>
                        <div className="text-lg font-bold text-gray-900">
                          4,567
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600 mb-1">Volume</div>
                        <div className="text-lg font-bold text-gray-900">
                          $2.8M
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600 mb-1">
                          Avg Transaction
                        </div>
                        <div className="text-lg font-bold text-gray-900">
                          $613
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600 mb-1">24h Trend</div>
                        <div className="flex items-center space-x-2">
                          <i className="fas fa-minus text-gray-700" />
                          <span className="text-lg font-bold text-gray-900">
                            +2%
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
                  <button className="flex-1 lg:flex-none px-4 py-2 border border-gray-300 text-gray-700 text-sm hover:bg-gray-50">
                    Set Alert
                  </button>
                </div>
              </div>
            </div>

            {/* Hotspot 6 - Medium */}
            <div className="bg-white border border-gray-300 p-5 hover:shadow-lg transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gray-500 flex items-center justify-center text-white font-bold text-lg">
                      6
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-base font-semibold text-gray-900">
                        PancakeSwap Router
                      </h3>
                      <div className="px-2 py-1 bg-gray-500 text-white text-xs">
                        Medium
                      </div>
                      <div className="px-2 py-1 bg-gray-200 text-gray-700 text-xs">
                        DEX
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 mb-3">
                      0x10ed...43c7
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                      <div>
                        <div className="text-gray-600 mb-1">Transactions</div>
                        <div className="text-lg font-bold text-gray-900">
                          3,891
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600 mb-1">Volume</div>
                        <div className="text-lg font-bold text-gray-900">
                          $2.1M
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600 mb-1">
                          Avg Transaction
                        </div>
                        <div className="text-lg font-bold text-gray-900">
                          $540
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600 mb-1">24h Trend</div>
                        <div className="flex items-center space-x-2">
                          <i className="fas fa-arrow-up text-gray-700" />
                          <span className="text-lg font-bold text-gray-900">
                            +8%
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
                  <button className="flex-1 lg:flex-none px-4 py-2 border border-gray-300 text-gray-700 text-sm hover:bg-gray-50">
                    Set Alert
                  </button>
                </div>
              </div>
            </div>

            {/* Hotspot 7 - Low */}
            <div className="bg-white border border-gray-300 p-5 hover:shadow-lg transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gray-400 flex items-center justify-center text-white font-bold text-lg">
                      7
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-base font-semibold text-gray-900">
                        Compound Finance
                      </h3>
                      <div className="px-2 py-1 bg-gray-400 text-white text-xs">
                        Low
                      </div>
                      <div className="px-2 py-1 bg-gray-200 text-gray-700 text-xs">
                        Lending
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 mb-3">
                      0x3d9a...c8b5
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                      <div>
                        <div className="text-gray-600 mb-1">Transactions</div>
                        <div className="text-lg font-bold text-gray-900">
                          2,456
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600 mb-1">Volume</div>
                        <div className="text-lg font-bold text-gray-900">
                          $1.5M
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600 mb-1">
                          Avg Transaction
                        </div>
                        <div className="text-lg font-bold text-gray-900">
                          $611
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600 mb-1">24h Trend</div>
                        <div className="flex items-center space-x-2">
                          <i className="fas fa-arrow-down text-gray-700" />
                          <span className="text-lg font-bold text-gray-900">
                            -3%
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
                  <button className="flex-1 lg:flex-none px-4 py-2 border border-gray-300 text-gray-700 text-sm hover:bg-gray-50">
                    Set Alert
                  </button>
                </div>
              </div>
            </div>

            {/* Hotspot 8 - Low */}
            <div className="bg-white border border-gray-300 p-5 hover:shadow-lg transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gray-400 flex items-center justify-center text-white font-bold text-lg">
                      8
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-base font-semibold text-gray-900">
                        Blur Marketplace
                      </h3>
                      <div className="px-2 py-1 bg-gray-400 text-white text-xs">
                        Low
                      </div>
                      <div className="px-2 py-1 bg-gray-200 text-gray-700 text-xs">
                        NFT
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 mb-3">
                      0x0000...0000
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                      <div>
                        <div className="text-gray-600 mb-1">Transactions</div>
                        <div className="text-lg font-bold text-gray-900">
                          1,823
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600 mb-1">Volume</div>
                        <div className="text-lg font-bold text-gray-900">
                          $1.2M
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600 mb-1">
                          Avg Transaction
                        </div>
                        <div className="text-lg font-bold text-gray-900">
                          $658
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600 mb-1">24h Trend</div>
                        <div className="flex items-center space-x-2">
                          <i className="fas fa-minus text-gray-700" />
                          <span className="text-lg font-bold text-gray-900">
                            0%
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
                  <button className="flex-1 lg:flex-none px-4 py-2 border border-gray-300 text-gray-700 text-sm hover:bg-gray-50">
                    Set Alert
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Pagination */}
          <div className="mt-6 bg-white border border-gray-300 p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0 text-sm">
              <div className="text-gray-600">
                Showing 1-8 of 127 hotspots
              </div>

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
