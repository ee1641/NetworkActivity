import React, { useState } from "react";
import Sidebar from "./Sidebar";
import SidebarToggleButton from "./SidebarToggleButton";
import { useSidebarToggle } from "../hooks/useSidebarToggle";

const LabelManagement = () => {
  const { isSidebarOpen, toggleSidebar } = useSidebarToggle();
  const [isAddLabelOpen, setIsAddLabelOpen] = useState(false);

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
        <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />

        {/* Main Label Management Content */}
        <main className="flex-1 p-4 md:p-6">
          {/* Page Header */}
          <div className="bg-white border border-gray-300 p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
              <div>
                <h1 className="text-xl font-semibold text-gray-900 mb-1">
                  Label Management
                </h1>
                <p className="text-sm text-gray-600">
                  Manage labels for blockchain entities including wallets,
                  contracts, DEXs, and bridges
                </p>
              </div>

              <button
                onClick={() => setIsAddLabelOpen(true)}
                className="bg-gray-900 text-white px-4 py-2 text-sm font-semibold hover:bg-gray-800 flex items-center space-x-2"
              >
                <i className="fas fa-plus" />
                <span>Add New Label</span>
              </button>
            </div>
          </div>

          {/* Search and Filter Controls */}
          <div className="bg-white border border-gray-300 p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <div className="flex items-center space-x-2 border border-gray-300 px-3 py-2 bg-white">
                  <i className="fas fa-search text-gray-600 text-sm" />
                  <input
                    type="text"
                    placeholder="Search by address, label, or entity type..."
                    className="flex-1 text-sm text-gray-700 bg-transparent border-none outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 border border-gray-300 px-3 py-2 bg-white">
                <i className="fas fa-filter text-gray-600 text-sm" />
                <select className="flex-1 text-sm text-gray-700 bg-transparent border-none outline-none">
                  <option>All Entity Types</option>
                  <option>Wallet</option>
                  <option>Smart Contract</option>
                  <option>DEX</option>
                  <option>Bridge</option>
                  <option>Exchange</option>
                </select>
              </div>
            </div>
          </div>

          {/* Main Labels Table */}
          <div className="bg-white border border-gray-300 mb-6">
            <div className="p-4 border-b border-gray-300 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900">
                Entity Labels
              </h2>
              <div className="flex items-center space-x-2 text-xs text-gray-600">
                <span>Showing 1-10 of 247 labels</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b border-gray-300">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                      <div className="flex items-center space-x-1">
                        <span>Entity Address</span>
                        <i className="fas fa-sort text-gray-500" />
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                      <div className="flex items-center space-x-1">
                        <span>Current Label</span>
                        <i className="fas fa-sort text-gray-500" />
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                      <div className="flex items-center space-x-1">
                        <span>Entity Type</span>
                        <i className="fas fa-sort text-gray-500" />
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                      <div className="flex items-center space-x-1">
                        <span>Last Modified</span>
                        <i className="fas fa-sort text-gray-500" />
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-xs">
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-900 font-mono">
                      0x742d35Cc6634C0532925a3b844Bc9e7595f3f8a
                    </td>
                    <td className="px-4 py-3 text-gray-900 font-semibold">
                      Binance Hot Wallet
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <i className="fas fa-wallet text-gray-600" />
                        <span className="text-gray-700">Wallet</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      2024-01-15 14:32
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <button className="text-gray-600 hover:text-gray-900">
                          <i className="fas fa-edit" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          <i className="fas fa-trash" />
                        </button>
                      </div>
                    </td>
                  </tr>

                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-900 font-mono">
                      0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984
                    </td>
                    <td className="px-4 py-3 text-gray-900 font-semibold">
                      Uniswap V3 Router
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <i className="fas fa-exchange-alt text-gray-600" />
                        <span className="text-gray-700">DEX</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      2024-01-14 09:18
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <button className="text-gray-600 hover:text-gray-900">
                          <i className="fas fa-edit" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          <i className="fas fa-trash" />
                        </button>
                      </div>
                    </td>
                  </tr>

                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-900 font-mono">
                      0xa0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48
                    </td>
                    <td className="px-4 py-3 text-gray-900 font-semibold">
                      USDC Token Contract
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <i className="fas fa-file-contract text-gray-600" />
                        <span className="text-gray-700">Smart Contract</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      2024-01-13 16:45
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <button className="text-gray-600 hover:text-gray-900">
                          <i className="fas fa-edit" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          <i className="fas fa-trash" />
                        </button>
                      </div>
                    </td>
                  </tr>

                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-900 font-mono">
                      0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640
                    </td>
                    <td className="px-4 py-3 text-gray-900 font-semibold">
                      Arbitrum Bridge Contract
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <i className="fas fa-bridge text-gray-600" />
                        <span className="text-gray-700">Bridge</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      2024-01-12 11:22
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <button className="text-gray-600 hover:text-gray-900">
                          <i className="fas fa-edit" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          <i className="fas fa-trash" />
                        </button>
                      </div>
                    </td>
                  </tr>

                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-900 font-mono">
                      0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD
                    </td>
                    <td className="px-4 py-3 text-gray-900 font-semibold">
                      Coinbase Custody Wallet
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <i className="fas fa-wallet text-gray-600" />
                        <span className="text-gray-700">Wallet</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      2024-01-11 08:55
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <button className="text-gray-600 hover:text-gray-900">
                          <i className="fas fa-edit" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          <i className="fas fa-trash" />
                        </button>
                      </div>
                    </td>
                  </tr>

                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-900 font-mono">
                      0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D
                    </td>
                    <td className="px-4 py-3 text-gray-900 font-semibold">
                      Uniswap V2 Router
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <i className="fas fa-exchange-alt text-gray-600" />
                        <span className="text-gray-700">DEX</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      2024-01-10 15:30
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <button className="text-gray-600 hover:text-gray-900">
                          <i className="fas fa-edit" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          <i className="fas fa-trash" />
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-gray-300 flex items-center justify-between">
              <button className="px-3 py-1 text-xs text-gray-600 border border-gray-300 hover:bg-gray-50">
                Previous
              </button>
              <div className="flex items-center space-x-1">
                <button className="px-3 py-1 text-xs bg-gray-900 text-white">
                  1
                </button>
                <button className="px-3 py-1 text-xs text-gray-600 hover:bg-gray-100">
                  2
                </button>
                <button className="px-3 py-1 text-xs text-gray-600 hover:bg-gray-100">
                  3
                </button>
                <span className="px-2 text-xs text-gray-600">...</span>
                <button className="px-3 py-1 text-xs text-gray-600 hover:bg-gray-100">
                  25
                </button>
              </div>
              <button className="px-3 py-1 text-xs text-gray-600 border border-gray-300 hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>

          {/* Two Column Layout for Label History and Bulk Import/Export */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Label History Panel */}
            <div className="bg-white border border-gray-300">
              <div className="p-4 border-b border-gray-300">
                <h2 className="text-sm font-semibold text-gray-900 flex items-center space-x-2">
                  <i className="fas fa-history text-gray-600" />
                  <span>Label History (Audit Log)</span>
                </h2>
              </div>

              <div className="p-4 space-y-3 max-h-96 overflow-y-auto text-xs">
                <div className="border-l-4 border-gray-700 pl-3 pb-3">
                  <div className="flex items-start justify-between mb-1">
                    <div className="font-semibold text-gray-900">
                      Label Updated
                    </div>
                    <div className="text-gray-500">2 hours ago</div>
                  </div>
                  <div className="text-gray-600 mb-1">
                    <span className="font-semibold">John Smith</span> updated
                    label for 0x742d...3f8a
                  </div>
                  <div className="text-gray-500">
                    Changed from &quot;Binance Wallet&quot; to &quot;Binance
                    Hot Wallet&quot;
                  </div>
                </div>

                <div className="border-l-4 border-gray-500 pl-3 pb-3">
                  <div className="flex items-start justify-between mb-1">
                    <div className="font-semibold text-gray-900">
                      New Label Added
                    </div>
                    <div className="text-gray-500">5 hours ago</div>
                  </div>
                  <div className="text-gray-600 mb-1">
                    <span className="font-semibold">Sarah Johnson</span> added
                    label for 0x1f98...F984
                  </div>
                  <div className="text-gray-500">
                    Created &quot;Uniswap V3 Router&quot; (DEX)
                  </div>
                </div>

                <div className="border-l-4 border-gray-500 pl-3 pb-3">
                  <div className="flex items-start justify-between mb-1">
                    <div className="font-semibold text-gray-900">
                      Label Deleted
                    </div>
                    <div className="text-gray-500">1 day ago</div>
                  </div>
                  <div className="text-gray-600 mb-1">
                    <span className="font-semibold">Mike Chen</span> deleted
                    label for 0x9c1e...7b2d
                  </div>
                  <div className="text-gray-500">
                    Removed &quot;Old Exchange Wallet&quot; (Wallet)
                  </div>
                </div>

                <div className="border-l-4 border-gray-500 pl-3 pb-3">
                  <div className="flex items-start justify-between mb-1">
                    <div className="font-semibold text-gray-900">
                      Bulk Import
                    </div>
                    <div className="text-gray-500">2 days ago</div>
                  </div>
                  <div className="text-gray-600 mb-1">
                    <span className="font-semibold">Admin User</span> imported
                    45 labels from CSV
                  </div>
                  <div className="text-gray-500">
                    File: exchange_wallets_2024.csv
                  </div>
                </div>

                <div className="border-l-4 border-gray-500 pl-3 pb-3">
                  <div className="flex items-start justify-between mb-1">
                    <div className="font-semibold text-gray-900">
                      Label Updated
                    </div>
                    <div className="text-gray-500">3 days ago</div>
                  </div>
                  <div className="text-gray-600 mb-1">
                    <span className="font-semibold">John Smith</span> updated
                    entity type for 0xa0b8...eB48
                  </div>
                  <div className="text-gray-500">
                    Changed from &quot;Wallet&quot; to &quot;Smart
                    Contract&quot;
                  </div>
                </div>

                <div className="border-l-4 border-gray-500 pl-3 pb-3">
                  <div className="flex items-start justify-between mb-1">
                    <div className="font-semibold text-gray-900">
                      New Label Added
                    </div>
                    <div className="text-gray-500">4 days ago</div>
                  </div>
                  <div className="text-gray-600 mb-1">
                    <span className="font-semibold">Sarah Johnson</span> added
                    label for 0x88e6...5640
                  </div>
                  <div className="text-gray-500">
                    Created &quot;Arbitrum Bridge Contract&quot; (Bridge)
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-gray-300">
                <button className="w-full text-xs text-gray-700 py-2 border border-gray-300 hover:bg-gray-50">
                  View Full Audit Log
                </button>
              </div>
            </div>

            {/* Bulk Import/Export Section */}
            <div className="bg-white border border-gray-300">
              <div className="p-4 border-b border-gray-300">
                <h2 className="text-sm font-semibold text-gray-900 flex items-center space-x-2">
                  <i className="fas fa-file-import text-gray-600" />
                  <span>Bulk Import/Export</span>
                </h2>
              </div>

              <div className="p-4 space-y-4 text-xs">
                {/* Import Section */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Import Labels from CSV
                  </h3>
                  <div className="border-2 border-dashed border-gray-300 p-6 text-center bg-gray-50 hover:bg-gray-100 cursor-pointer">
                    <i className="fas fa-cloud-upload-alt text-gray-400 text-3xl mb-2" />
                    <p className="text-sm text-gray-700 mb-1">
                      Drop CSV file here or click to browse
                    </p>
                    <p className="text-gray-500">
                      Maximum file size: 10MB
                    </p>
                  </div>

                  <div className="mt-3 flex items-center space-x-2">
                    <i className="fas fa-info-circle text-gray-500" />
                    <p className="text-gray-600">
                      CSV must include: address, label, entity_type columns
                    </p>
                  </div>
                </div>

                {/* Template Download */}
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    CSV Template
                  </h3>
                  <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 text-sm text-gray-700 hover:bg-gray-50">
                    <i className="fas fa-download" />
                    <span>Download CSV Template</span>
                  </button>
                  <p className="text-gray-500 mt-2">
                    Use this template to ensure proper formatting for bulk
                    imports
                  </p>
                </div>

                {/* Export Section */}
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Export Current Labels
                  </h3>
                  <div className="space-y-2">
                    <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-900 text-white text-sm hover:bg-gray-800">
                      <i className="fas fa-file-csv" />
                      <span>Export All Labels to CSV</span>
                    </button>
                    <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 text-sm text-gray-700 hover:bg-gray-50">
                      <i className="fas fa-filter" />
                      <span>Export Filtered Results</span>
                    </button>
                  </div>
                </div>

                {/* Recent Import History */}
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Recent Imports
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-gray-50 border border-gray-200">
                      <div className="flex items-center space-x-2">
                        <i className="fas fa-file-csv text-gray-600" />
                        <div>
                          <div className="font-semibold text-gray-900">
                            exchange_wallets_2024.csv
                          </div>
                          <div className="text-gray-500">
                            45 labels imported
                          </div>
                        </div>
                      </div>
                      <div className="text-gray-500">2 days ago</div>
                    </div>

                    <div className="flex items-center justify-between p-2 bg-gray-50 border border-gray-200">
                      <div className="flex items-center space-x-2">
                        <i className="fas fa-file-csv text-gray-600" />
                        <div>
                          <div className="font-semibold text-gray-900">
                            dex_contracts.csv
                          </div>
                          <div className="text-gray-500">
                            23 labels imported
                          </div>
                        </div>
                      </div>
                      <div className="text-gray-500">1 week ago</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Add New Label Modal */}
      {isAddLabelOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsAddLabelOpen(false);
          }}
        >
          <div className="bg-white border border-gray-300 w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="p-4 border-b border-gray-300 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Add New Label
              </h2>
              <button
                onClick={() => setIsAddLabelOpen(false)}
                className="text-gray-600 hover:text-gray-900"
              >
                <i className="fas fa-times" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-sm">
              <div>
                <label className="block font-semibold text-gray-900 mb-2">
                  Entity Address *
                </label>
                <input
                  type="text"
                  placeholder="0x..."
                  className="w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:border-gray-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter the blockchain address (wallet, contract, etc.)
                </p>
              </div>

              <div>
                <label className="block font-semibold text-gray-900 mb-2">
                  Label Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Binance Hot Wallet"
                  className="w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:border-gray-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Provide a descriptive name for this entity
                </p>
              </div>

              <div>
                <label className="block font-semibold text-gray-900 mb-2">
                  Entity Type *
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:border-gray-500">
                  <option value="">Select entity type...</option>
                  <option value="wallet">Wallet</option>
                  <option value="contract">Smart Contract</option>
                  <option value="dex">
                    DEX (Decentralized Exchange)
                  </option>
                  <option value="bridge">Bridge</option>
                  <option value="exchange">Centralized Exchange</option>
                  <option value="defi">DeFi Protocol</option>
                  <option value="nft">NFT Contract</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-900 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  rows={4}
                  placeholder="Add any additional information or context about this entity..."
                  className="w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:border-gray-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Include relevant details, transaction patterns, or risk
                  indicators
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="verifiedEntity"
                  className="w-4 h-4 border-gray-300"
                />
                <label
                  htmlFor="verifiedEntity"
                  className="text-gray-700"
                >
                  Mark as verified entity
                </label>
              </div>
            </div>

            <div className="p-4 border-t border-gray-300 flex items-center justify-end space-x-3">
              <button
                onClick={() => setIsAddLabelOpen(false)}
                className="px-4 py-2 text-sm text-gray-700 border border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button className="px-4 py-2 text-sm bg-gray-900 text-white hover:bg-gray-800">
                Add Label
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LabelManagement;
