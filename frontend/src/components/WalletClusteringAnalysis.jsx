import React from "react";

const WalletClusteringAnalysis = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-gray-300 px-4 md:px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gray-800 flex items-center justify-center">
              <i className="fas fa-project-diagram text-white text-sm" />
            </div>
            <span className="text-lg font-semibold text-gray-900 hidden sm:block">
              Wallet Clustering Analysis
            </span>
          </div>

          <div className="flex items-center space-x-3 md:space-x-6">
            <button className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100">
              <i className="fas fa-cog" />
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-300 rounded-full" />
              <span className="text-sm text-gray-700 hidden md:block">
                Analyst
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Filter and Action Bar */}
      <div className="bg-white border-b border-gray-300 px-4 md:px-6 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <div className="flex items-center space-x-2 border border-gray-300 px-3 py-2 bg-white flex-1 sm:max-w-xs">
              <i className="fas fa-search text-gray-600 text-sm" />
              <input
                type="text"
                placeholder="Search clusters..."
                className="text-sm text-gray-700 bg-transparent border-none outline-none w-full"
              />
            </div>

            <div className="flex items-center space-x-2 border border-gray-300 px-3 py-2 bg-white">
              <i className="fas fa-filter text-gray-600 text-sm" />
              <select className="text-sm text-gray-700 bg-transparent border-none outline-none">
                <option>All Activity Levels</option>
                <option>High Activity</option>
                <option>Medium Activity</option>
                <option>Low Activity</option>
              </select>
            </div>

            <div className="flex items-center space-x-2 border border-gray-300 px-3 py-2 bg-white">
              <i className="fas fa-sort text-gray-600 text-sm" />
              <select className="text-sm text-gray-700 bg-transparent border-none outline-none">
                <option>Sort by Volume</option>
                <option>Sort by Wallet Count</option>
                <option>Sort by Activity</option>
                <option>Sort by Date</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
              <i className="fas fa-plus" />
              <span>New Cluster</span>
            </button>
            <button className="px-4 py-2 bg-gray-900 text-white text-sm hover:bg-gray-800 flex items-center space-x-2">
              <i className="fas fa-code-branch" />
              <span>Split Cluster</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col lg:flex-row flex-1">
        {/* Left Panel - Cluster List */}
        <aside className="w-full lg:w-96 bg-white border-r border-gray-300 flex flex-col">
          <div className="px-4 py-3 border-b border-gray-300 bg-gray-50">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900">
                Identified Clusters
              </h2>
              <span className="text-xs text-gray-600 bg-gray-200 px-2 py-1">
                847 total
              </span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* Cluster Item 1 - Expanded */}
            <div className="border-b border-gray-300">
              <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer bg-gray-100">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2 flex-1">
                    <button className="text-gray-600 hover:text-gray-900">
                      <i className="fas fa-chevron-down text-xs" />
                    </button>
                    <div className="w-3 h-3 bg-gray-700" />
                    <span className="text-sm font-semibold text-gray-900">
                      Exchange Cluster A
                    </span>
                  </div>
                  <span className="text-xs text-white bg-gray-800 px-2 py-1">
                    High
                  </span>
                </div>

                <div className="ml-5 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Wallets</span>
                    <span className="font-semibold text-gray-900 bg-gray-200 px-2 py-1">
                      1,247
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Volume</span>
                    <span className="font-semibold text-gray-900">
                      $45.2M
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="flex-1 bg-gray-200 h-1">
                      <div
                        className="bg-gray-800 h-1"
                        style={{ width: "85%" }}
                      />
                    </div>
                    <span className="text-gray-600">85%</span>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                <div className="ml-5 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Last Activity</span>
                    <span className="text-gray-900">2 min ago</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Avg Transaction</span>
                    <span className="text-gray-900">$36.2K</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Created</span>
                    <span className="text-gray-900">Jan 15, 2024</span>
                  </div>
                  <button className="w-full mt-2 px-3 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50">
                    View Details
                  </button>
                </div>
              </div>
            </div>

            {/* Cluster Item 2 - Collapsed */}
            <div className="border-b border-gray-300">
              <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2 flex-1">
                    <button className="text-gray-600 hover:text-gray-900">
                      <i className="fas fa-chevron-right text-xs" />
                    </button>
                    <div className="w-3 h-3 bg-gray-600" />
                    <span className="text-sm font-semibold text-gray-900">
                      DeFi Protocol Users
                    </span>
                  </div>
                  <span className="text-xs text-white bg-gray-600 px-2 py-1">
                    High
                  </span>
                </div>

                <div className="ml-5 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Wallets</span>
                    <span className="font-semibold text-gray-900 bg-gray-200 px-2 py-1">
                      892
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Volume</span>
                    <span className="font-semibold text-gray-900">
                      $32.8M
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="flex-1 bg-gray-200 h-1">
                      <div
                        className="bg-gray-600 h-1"
                        style={{ width: "78%" }}
                      />
                    </div>
                    <span className="text-gray-600">78%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Right Panel - Cluster Details */}
        <main className="flex-1 p-4 md:p-6">
          {/* Cluster Header */}
          <div className="bg-white border border-gray-300 p-4 mb-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-gray-700" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Exchange Cluster A
                </h2>
                <span className="text-xs text-white bg-gray-800 px-2 py-1">
                  High Activity
                </span>
              </div>

              <div className="flex gap-2">
                <button className="px-3 py-2 bg-white border border-gray-300 text-sm text-gray-700 hover:bg-gray-50">
                  <i className="fas fa-edit mr-2" />
                  Re-label
                </button>
                <button className="px-3 py-2 bg-white border border-gray-300 text-sm text-gray-700 hover:bg-gray-50">
                  <i className="fas fa-object-group mr-2" />
                  Merge
                </button>
                <button className="px-3 py-2 bg-white border border-gray-300 text-sm text-gray-700 hover:bg-gray-50">
                  <i className="fas fa-download mr-2" />
                  Export
                </button>
              </div>
            </div>
          </div>

          {/* Placeholder for Network Graph */}
          <div>{/* Network Graph goes here */}</div>

          {/* Statistics and Controls Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            {/* Cluster Statistics Panel */}
            <div className="bg-white border border-gray-300 p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">
                Cluster Statistics
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                  <span className="text-gray-600">Total Wallets</span>
                  <span className="text-sm font-semibold text-gray-900">
                    1,247
                  </span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                  <span className="text-gray-600">Total Volume</span>
                  <span className="text-sm font-semibold text-gray-900">
                    $45.2M
                  </span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                  <span className="text-gray-600">Avg Transaction Size</span>
                  <span className="text-sm font-semibold text-gray-900">
                    $36.2K
                  </span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                  <span className="text-gray-600">Transaction Count</span>
                  <span className="text-sm font-semibold text-gray-900">
                    15,847
                  </span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                  <span className="text-gray-600">Activity Score</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 h-2">
                      <div
                        className="bg-gray-800 h-2"
                        style={{ width: "85%" }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      85%
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                  <span className="text-gray-600">Last Activity</span>
                  <span className="text-sm font-semibold text-gray-900">
                    2 min ago
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Created Date</span>
                  <span className="text-sm font-semibold text-gray-900">
                    Jan 15, 2024
                  </span>
                </div>
              </div>
            </div>

            {/* Manual Annotation */}
            <div className="bg-white border border-gray-300 p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">
                Manual Annotations
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-gray-600 mb-1 block">
                    Cluster Label
                  </label>
                  <input
                    type="text"
                    defaultValue="Exchange Cluster A"
                    className="w-full px-3 py-2 border border-gray-300 text-sm text-gray-900 focus:outline-none focus:border-gray-500"
                  />
                </div>

                <div>
                  <label className="text-gray-600 mb-1 block">Category</label>
                  <select className="w-full px-3 py-2 border border-gray-300 text-sm text-gray-900 focus:outline-none focus:border-gray-500">
                    <option>Exchange</option>
                    <option>DeFi Protocol</option>
                    <option>NFT Marketplace</option>
                    <option>Whale Group</option>
                    <option>Retail Investors</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-gray-600 mb-1 block">Notes</label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 text-sm text-gray-900 focus:outline-none focus:border-gray-500"
                    defaultValue="High-frequency trading pattern detected. Possible centralized exchange hot wallet cluster with multiple sub-wallets for liquidity management."
                  />
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 px-4 py-2 bg-gray-900 text-white text-sm hover:bg-gray-800">
                    Save Changes
                  </button>
                  <button className="px-4 py-2 bg-white border border-gray-300 text-sm text-gray-700 hover:bg-gray-50">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* History Timeline */}
          <div className="bg-white border border-gray-300 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              Cluster Change History
            </h3>

            <div className="space-y-4 text-xs">
              {/* Timeline Item 1 */}
              <div className="flex items-start space-x-3">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-gray-800 rounded-full" />
                  <div className="w-0.5 h-full bg-gray-300 mt-1" />
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-gray-900">
                      Cluster Created
                    </span>
                    <span className="text-gray-500">
                      Jan 15, 2024 10:30 AM
                    </span>
                  </div>
                  <p className="text-gray-600">
                    Initial cluster identified with 1,247 wallets based on
                    transaction patterns.
                  </p>
                  <span className="text-gray-500 mt-1 inline-block">
                    by Analyst User
                  </span>
                </div>
              </div>

              {/* Timeline Item 2 */}
              <div className="flex items-start space-x-3">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-gray-600 rounded-full" />
                  <div className="w-0.5 h-full bg-gray-300 mt-1" />
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-gray-900">
                      Label Updated
                    </span>
                    <span className="text-gray-500">
                      Jan 16, 2024 2:15 PM
                    </span>
                  </div>
                  <p className="text-gray-600">
                    Cluster renamed from "Cluster #4521" to "Exchange Cluster
                    A".
                  </p>
                  <span className="text-gray-500 mt-1 inline-block">
                    by Analyst User
                  </span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default WalletClusteringAnalysis;
