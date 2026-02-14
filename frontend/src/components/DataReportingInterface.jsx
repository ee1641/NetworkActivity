import React from "react";
import Sidebar from "./Sidebar";

const DataReportingInterface = () => {
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
              <span className="hidden sm:inline">Auto-refresh: 30s</span>
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

        {/* Main Report Content */}
        <main className="flex-1 p-4 md:p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Report Configuration Form */}
            <div className="flex-1 space-y-6">
              {/* Page Header */}
              <div className="bg-white border border-gray-300 p-4">
                <h1 className="text-xl font-semibold text-gray-900">
                  Generate Custom Report
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Configure parameters and generate detailed analytics reports
                </p>
              </div>

              {/* Report Type Selection */}
              <div className="bg-white border border-gray-300 p-5">
                <h2 className="text-sm font-semibold text-gray-900 mb-4">
                  Report Type
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <label className="flex items-center space-x-3 p-4 border-2 border-gray-900 bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name="reportType"
                      defaultChecked
                      className="w-4 h-4"
                    />
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        Transaction Aggregation
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        Summarize transaction data
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center space-x-3 p-4 border border-gray-300 hover:border-gray-400 cursor-pointer">
                    <input
                      type="radio"
                      name="reportType"
                      className="w-4 h-4"
                    />
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        Trend Analysis
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        Analyze patterns over time
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center space-x-3 p-4 border border-gray-300 hover:border-gray-400 cursor-pointer">
                    <input
                      type="radio"
                      name="reportType"
                      className="w-4 h-4"
                    />
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        Cluster Activity
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        Monitor cluster behavior
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Parameter Configuration */}
              <div className="bg-white border border-gray-300 p-5">
                <h2 className="text-sm font-semibold text-gray-900 mb-4">
                  Report Parameters
                </h2>

                <div className="space-y-4">
                  {/* Time Range */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-2">
                        Start Date
                      </label>
                      <div className="flex items-center border border-gray-300 px-3 py-2 bg-white">
                        <i className="fas fa-calendar text-gray-600 text-sm mr-2" />
                        <input
                          type="date"
                          className="flex-1 text-sm text-gray-700 bg-transparent border-none outline-none"
                          defaultValue="2024-01-01"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-2">
                        End Date
                      </label>
                      <div className="flex items-center border border-gray-300 px-3 py-2 bg-white">
                        <i className="fas fa-calendar text-gray-600 text-sm mr-2" />
                        <input
                          type="date"
                          className="flex-1 text-sm text-gray-700 bg-transparent border-none outline-none"
                          defaultValue="2024-01-31"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Token Selection */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">
                      Token Filter
                    </label>
                    <div className="flex items-center border border-gray-300 px-3 py-2 bg-white">
                      <i className="fas fa-coins text-gray-600 text-sm mr-2" />
                      <select className="flex-1 text-sm text-gray-700 bg-transparent border-none outline-none">
                        <option>All Tokens</option>
                        <option>ETH - Ethereum</option>
                        <option>BTC - Bitcoin</option>
                        <option>USDT - Tether</option>
                        <option>USDC - USD Coin</option>
                        <option>BNB - Binance Coin</option>
                      </select>
                    </div>
                  </div>

                  {/* Address Filter */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">
                      Address Filter (Optional)
                    </label>
                    <div className="flex items-center border border-gray-300 px-3 py-2 bg-white">
                      <i className="fas fa-wallet text-gray-600 text-sm mr-2" />
                      <input
                        type="text"
                        placeholder="Enter wallet address or leave blank for all"
                        className="flex-1 text-sm text-gray-700 bg-transparent border-none outline-none"
                      />
                    </div>
                  </div>

                  {/* Transaction Type */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">
                      Transaction Type
                    </label>
                    <div className="flex items-center border border-gray-300 px-3 py-2 bg-white">
                      <i className="fas fa-exchange-alt text-gray-600 text-sm mr-2" />
                      <select className="flex-1 text-sm text-gray-700 bg-transparent border-none outline-none">
                        <option>All Types</option>
                        <option>Transfers</option>
                        <option>Swaps</option>
                        <option>Deposits</option>
                        <option>Withdrawals</option>
                      </select>
                    </div>
                  </div>

                  {/* Value Range */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-2">
                        Min Value (USD)
                      </label>
                      <div className="flex items-center border border-gray-300 px-3 py-2 bg-white">
                        <i className="fas fa-dollar-sign text-gray-600 text-sm mr-2" />
                        <input
                          type="number"
                          placeholder="0"
                          className="flex-1 text-sm text-gray-700 bg-transparent border-none outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-2">
                        Max Value (USD)
                      </label>
                      <div className="flex items-center border border-gray-300 px-3 py-2 bg-white">
                        <i className="fas fa-dollar-sign text-gray-600 text-sm mr-2" />
                        <input
                          type="number"
                          placeholder="No limit"
                          className="flex-1 text-sm text-gray-700 bg-transparent border-none outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Preview */}
              <div className="bg-white border border-gray-300 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-gray-900">
                    Data Preview
                  </h2>
                  <span className="text-xs text-gray-600">
                    Sample structure based on selected parameters
                  </span>
                </div>

                <div className="border border-gray-300 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead className="bg-gray-100 border-b border-gray-300">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold text-gray-900">
                            Date
                          </th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-900">
                            Transaction ID
                          </th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-900">
                            Token
                          </th>
                          <th className="px-4 py-3 text-right font-semibold text-gray-900">
                            Amount
                          </th>
                          <th className="px-4 py-3 text-right font-semibold text-gray-900">
                            Value (USD)
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-gray-700">
                            2024-01-15
                          </td>
                          <td className="px-4 py-3 text-gray-700">
                            0x742d...3f8a
                          </td>
                          <td className="px-4 py-3 text-gray-700">ETH</td>
                          <td className="px-4 py-3 text-right text-gray-700">
                            125.50
                          </td>
                          <td className="px-4 py-3 text-right text-gray-700">
                            $284,625.00
                          </td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-gray-700">
                            2024-01-15
                          </td>
                          <td className="px-4 py-3 text-gray-700">
                            0x9c1e...7b2d
                          </td>
                          <td className="px-4 py-3 text-gray-700">BTC</td>
                          <td className="px-4 py-3 text-right text-gray-700">
                            2.35
                          </td>
                          <td className="px-4 py-3 text-right text-gray-700">
                            $98,750.00
                          </td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-gray-700">
                            2024-01-14
                          </td>
                          <td className="px-4 py-3 text-gray-700">
                            0x1a2b...4c5d
                          </td>
                          <td className="px-4 py-3 text-gray-700">USDT</td>
                          <td className="px-4 py-3 text-right text-gray-700">
                            50,000.00
                          </td>
                          <td className="px-4 py-3 text-right text-gray-700">
                            $50,000.00
                          </td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-gray-700">
                            2024-01-14
                          </td>
                          <td className="px-4 py-3 text-gray-700">
                            0x6e7f...8g9h
                          </td>
                          <td className="px-4 py-3 text-gray-700">ETH</td>
                          <td className="px-4 py-3 text-right text-gray-700">
                            78.25
                          </td>
                          <td className="px-4 py-3 text-right text-gray-700">
                            $177,467.50
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="mt-3 text-xs text-gray-600 text-center">
                  Showing 4 of ~1,247 matching records
                </div>
              </div>

              {/* Export Format Options */}
              <div className="bg-white border border-gray-300 p-5">
                <h2 className="text-sm font-semibold text-gray-900 mb-4">
                  Export Format
                </h2>

                <div className="space-y-3">
                  <label className="flex items-center space-x-3 p-3 border border-gray-300 hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-4 h-4"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <i className="fas fa-file-csv text-gray-600" />
                          <span className="text-sm font-semibold text-gray-900">
                            CSV (Comma-Separated Values)
                          </span>
                        </div>
                        <span className="text-xs text-gray-600">
                          Raw data export
                        </span>
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center space-x-3 p-3 border border-gray-300 hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-4 h-4"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <i className="fas fa-file-pdf text-gray-600" />
                          <span className="text-sm font-semibold text-gray-900">
                            PDF (Formatted Report)
                          </span>
                        </div>
                        <span className="text-xs text-gray-600">
                          Professional document
                        </span>
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center space-x-3 p-3 border border-gray-300 hover:bg-gray-50 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <i className="fas fa-chart-bar text-gray-600" />
                          <span className="text-sm font-semibold text-gray-900">
                            Chart Images (PNG)
                          </span>
                        </div>
                        <span className="text-xs text-gray-600">
                          Visual representations
                        </span>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Generate Button & Progress */}
              <div className="bg-white border border-gray-300 p-5">
                <button className="w-full bg-gray-900 text-white py-4 px-6 text-sm font-semibold hover:bg-gray-800 flex items-center justify-center space-x-3">
                  <i className="fas fa-play-circle" />
                  <span>Generate Report</span>
                </button>

                {/* Progress Indicator (hidden by default, shown during generation) */}
                <div className="mt-4 hidden">
                  <div className="flex items-center justify-between text-xs text-gray-700 mb-2">
                    <span>Generating report...</span>
                    <span>45%</span>
                  </div>
                  <div className="w-full bg-gray-200 h-2">
                    <div
                      className="bg-gray-900 h-2"
                      style={{ width: "45%" }}
                    />
                  </div>
                  <div className="mt-2 text-xs text-gray-600">
                    <i className="fas fa-spinner fa-spin mr-2" />
                    Processing 1,247 transactions...
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar - Report History */}
            <div className="w-full lg:w-80 space-y-6">
              {/* Report History */}
              <div className="bg-white border border-gray-300 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-gray-900">
                    Report History
                  </h2>
                  <button className="text-xs text-gray-600 hover:text-gray-900">
                    View All
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="border border-gray-300 p-3 hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-gray-200 border border-gray-300 flex-shrink-0 flex items-center justify-center">
                        <i className="fas fa-file-alt text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-gray-900 truncate">
                          Transaction Aggregation
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          Jan 1-31, 2024
                        </div>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="text-xs text-gray-500">
                            2 hours ago
                          </span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">2.4 MB</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border border-gray-300 p-3 hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-gray-200 border border-gray-300 flex-shrink-0 flex items-center justify-center">
                        <i className="fas fa-chart-line text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-gray-900 truncate">
                          Trend Analysis
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          Dec 2023
                        </div>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="text-xs text-gray-500">
                            1 day ago
                          </span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">1.8 MB</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border border-gray-300 p-3 hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-gray-200 border border-gray-300 flex-shrink-0 flex items-center justify-center">
                        <i className="fas fa-project-diagram text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-gray-900 truncate">
                          Cluster Activity
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          Q4 2023
                        </div>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="text-xs text-gray-500">
                            3 days ago
                          </span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">3.1 MB</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border border-gray-300 p-3 hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-gray-200 border border-gray-300 flex-shrink-0 flex items-center justify-center">
                        <i className="fas fa-file-alt text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-gray-900 truncate">
                          Transaction Aggregation
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          Nov 2023
                        </div>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="text-xs text-gray-500">
                            1 week ago
                          </span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">2.1 MB</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border border-gray-300 p-3 hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-gray-200 border border-gray-300 flex-shrink-0 flex items-center justify-center">
                        <i className="fas fa-chart-line text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-gray-900 truncate">
                          Trend Analysis
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          Oct 2023
                        </div>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="text-xs text-gray-500">
                            2 weeks ago
                          </span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">1.5 MB</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DataReportingInterface;
