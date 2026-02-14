import React from "react";

const BlockchainExplorer = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-300 hidden lg:flex lg:flex-col">
          <div className="px-4 py-6 border-b border-gray-300">
            <a href="/dashboard" className="flex items-center space-x-3 mb-6 hover:opacity-80 cursor-pointer">
              <div className="w-8 h-8 bg-gray-800 flex items-center justify-center">
                <i className="fas fa-arrow-left text-white text-sm" />
              </div>
              <span className="text-lg font-semibold text-gray-900">
                Back
              </span>
            </a>
          </div>

          <div className="flex-1 px-4 py-6">
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">
                Saved Searches
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-gray-50 border border-gray-200 hover:bg-gray-100 cursor-pointer">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-gray-900 truncate">
                      High Value Transfers
                    </div>
                    <div className="text-xs text-gray-500">Value &gt; $100K</div>
                  </div>
                  <i className="fas fa-star text-gray-600 text-xs ml-2" />
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 border border-gray-200 hover:bg-gray-100 cursor-pointer">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-gray-900 truncate">
                      My Wallet Activity
                    </div>
                    <div className="text-xs text-gray-500">0x742d...3f8a</div>
                  </div>
                  <i className="fas fa-star text-gray-600 text-xs ml-2" />
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 border border-gray-200 hover:bg-gray-100 cursor-pointer">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-gray-900 truncate">
                      Failed Transactions
                    </div>
                    <div className="text-xs text-gray-500">Last 7 days</div>
                  </div>
                  <i className="fas fa-star text-gray-600 text-xs ml-2" />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">
                Recent Queries
              </h3>
              <div className="space-y-2">
                <div className="p-2 hover:bg-gray-50 cursor-pointer">
                  <div className="text-xs text-gray-900 font-mono truncate">
                    0x742d35cc7...3f8a
                  </div>
                  <div className="text-xs text-gray-500">2 min ago</div>
                </div>
                <div className="p-2 hover:bg-gray-50 cursor-pointer">
                  <div className="text-xs text-gray-900 font-mono truncate">
                    Block #18547892
                  </div>
                  <div className="text-xs text-gray-500">15 min ago</div>
                </div>
                <div className="p-2 hover:bg-gray-50 cursor-pointer">
                  <div className="text-xs text-gray-900 font-mono truncate">
                    0x9c1e8f2b...7b2d
                  </div>
                  <div className="text-xs text-gray-500">1 hour ago</div>
                </div>
                <div className="p-2 hover:bg-gray-50 cursor-pointer">
                  <div className="text-xs text-gray-900 font-mono truncate">
                    0x1a2b3c4d...8g9h
                  </div>
                  <div className="text-xs text-gray-500">3 hours ago</div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 py-4 border-t border-gray-300">
            <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-900 text-white text-sm hover:bg-gray-800">
              <i className="fas fa-plus" />
              <span>Save Current Search</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Header */}
          <header className="bg-white border-b border-gray-300 px-4 md:px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold text-gray-900">
                Blockchain Explorer
              </h1>
              <div className="flex items-center space-x-4">
                <button className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 lg:hidden">
                  <i className="fas fa-bars" />
                </button>
                <button className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100">
                  <i className="fas fa-cog" />
                </button>
              </div>
            </div>
          </header>

          {/* Search Section */}
          <div className="p-4 md:p-6">
            <div className="bg-white border border-gray-300 p-6 mb-6">
              {/* Search Bar */}
              <div className="mb-4">
                <div className="flex items-center space-x-2 border-2 border-gray-900 bg-white">
                  <i className="fas fa-search text-gray-600 ml-4" />
                  <input
                    type="text"
                    placeholder="Search by transaction hash, wallet address, contract address, block number..."
                    className="flex-1 px-2 py-3 text-sm outline-none font-mono"
                  />
                  <button className="px-6 py-3 bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800">
                    Search
                  </button>
                </div>
              </div>

              {/* Search Type Tabs */}
              <div className="flex flex-wrap gap-2">
                <button className="px-4 py-2 bg-gray-900 text-white text-xs font-semibold">
                  <i className="fas fa-exchange-alt mr-2" />
                  Transaction Hash
                </button>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 text-xs font-semibold hover:bg-gray-200">
                  <i className="fas fa-wallet mr-2" />
                  Wallet Address
                </button>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 text-xs font-semibold hover:bg-gray-200">
                  <i className="fas fa-file-contract mr-2" />
                  Contract Address
                </button>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 text-xs font-semibold hover:bg-gray-200">
                  <i className="fas fa-cube mr-2" />
                  Block Number
                </button>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 text-xs font-semibold hover:bg-gray-200">
                  <i className="fas fa-calendar-alt mr-2" />
                  Date Range
                </button>
              </div>
            </div>

            {/* Results Section */}
            <div className="bg-white border border-gray-300">
              {/* Results Header */}
              <div className="px-6 py-4 border-b border-gray-300 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Search Results
                  </h2>
                  <p className="text-xs text-gray-600 mt-1">
                    Found 1,247 transactions
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <select className="text-xs border border-gray-300 px-3 py-2 bg-white text-gray-700">
                    <option>Sort by: Latest</option>
                    <option>Sort by: Value (High to Low)</option>
                    <option>Sort by: Value (Low to High)</option>
                    <option>Sort by: Oldest</option>
                  </select>
                  <button className="px-3 py-2 border border-gray-300 text-xs text-gray-700 hover:bg-gray-50">
                    <i className="fas fa-download mr-2" />
                    Export
                  </button>
                </div>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-300">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                        Timestamp
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                        From
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                        To
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                        Token
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                        Value
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {/* Row 1 */}
                    <tr className="hover:bg-gray-50 cursor-pointer">
                      <td className="px-6 py-4 text-xs text-gray-900">
                        <div>2024-01-15</div>
                        <div className="text-gray-500">14:32:18 UTC</div>
                      </td>
                      <td className="px-6 py-4 text-xs font-mono text-gray-900">
                        <div className="flex items-center space-x-2">
                          <span className="truncate max-w-[120px]">
                            0x742d35cc7...3f8a
                          </span>
                          <i className="fas fa-copy text-gray-400 hover:text-gray-600 cursor-pointer" />
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-mono text-gray-900">
                        <div className="flex items-center space-x-2">
                          <span className="truncate max-w-[120px]">
                            0x9c1e8f2b...7b2d
                          </span>
                          <i className="fas fa-copy text-gray-400 hover:text-gray-600 cursor-pointer" />
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs">
                        <div className="flex items-center space-x-2">
                          <div className="w-5 h-5 bg-gray-700 rounded-full flex items-center justify-center text-white text-xs">
                            Ξ
                          </div>
                          <span className="font-semibold text-gray-900">
                            ETH
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs">
                        <div className="font-semibold text-gray-900">
                          125.5 ETH
                        </div>
                        <div className="text-gray-500">$234,567.89</div>
                      </td>
                      <td className="px-6 py-4 text-xs">
                        <span className="px-2 py-1 bg-gray-900 text-white font-semibold">
                          Success
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs">
                        <div className="flex items-center space-x-3">
                          <i className="fas fa-bookmark text-gray-400 hover:text-gray-900 cursor-pointer" />
                          <i className="fas fa-chevron-down text-gray-400" />
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-6 py-4 border-t border-gray-300 flex items-center justify-between">
                <div className="text-xs text-gray-600">
                  Showing 1-10 of 1,247 results
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    className="px-3 py-2 border border-gray-300 text-xs text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled
                  >
                    <i className="fas fa-chevron-left" />
                  </button>
                  <button className="px-3 py-2 bg-gray-900 text-white text-xs font-semibold">
                    1
                  </button>
                  <button className="px-3 py-2 border border-gray-300 text-xs text-gray-700 hover:bg-gray-50">
                    2
                  </button>
                  <button className="px-3 py-2 border border-gray-300 text-xs text-gray-700 hover:bg-gray-50">
                    3
                  </button>
                  <button className="px-3 py-2 border border-gray-300 text-xs text-gray-700 hover:bg-gray-50">
                    4
                  </button>
                  <button className="px-3 py-2 border border-gray-300 text-xs text-gray-700 hover:bg-gray-50">
                    5
                  </button>
                  <span className="px-2 text-gray-600">...</span>
                  <button className="px-3 py-2 border border-gray-300 text-xs text-gray-700 hover:bg-gray-50">
                    125
                  </button>
                  <button className="px-3 py-2 border border-gray-300 text-xs text-gray-700 hover:bg-gray-50">
                    <i className="fas fa-chevron-right" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default BlockchainExplorer;
