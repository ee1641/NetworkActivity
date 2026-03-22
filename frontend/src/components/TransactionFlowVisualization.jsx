import React from "react";
import Sidebar from "./Sidebar";
import SidebarToggleButton from "./SidebarToggleButton";
import { useSidebarToggle } from "../hooks/useSidebarToggle";

const TransactionFlowVisualization = () => {
  const { isSidebarOpen, toggleSidebar } = useSidebarToggle();

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
              <button className="px-3 py-1 bg-gray-900 text-white text-xs">
                Live
              </button>
              <button className="px-3 py-1 text-gray-400 hover:bg-gray-600 text-xs">
                Historical
              </button>
            </div>

            {/* Export Options */}
            <div className="relative">
              <button className="flex items-center space-x-2 px-3 py-1.5 bg-gray-700 border border-gray-600 text-white text-xs hover:bg-gray-600">
                <i className="fas fa-download" />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>

            {/* Settings */}
            <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:bg-gray-700">
              <i className="fas fa-cog" />
            </button>
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
            {/* Filters Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">
                Filters & Controls
              </h2>
              <button className="text-xs text-gray-400 hover:text-white">
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
                  type="text"
                  placeholder="Start Date"
                  className="flex-1 bg-transparent text-xs text-white border-none outline-none"
                />
              </div>
              <div className="flex items-center space-x-2 bg-gray-900 border border-gray-700 px-3 py-2">
                <i className="fas fa-calendar text-gray-400 text-xs" />
                <input
                  type="text"
                  placeholder="End Date"
                  className="flex-1 bg-transparent text-xs text-white border-none outline-none"
                />
              </div>
              <div className="flex space-x-2">
                <button className="flex-1 px-2 py-1 bg-gray-700 text-white text-xs hover:bg-gray-600">
                  24H
                </button>
                <button className="flex-1 px-2 py-1 bg-gray-700 text-white text-xs hover:bg-gray-600">
                  7D
                </button>
                <button className="flex-1 px-2 py-1 bg-gray-700 text-white text-xs hover:bg-gray-600">
                  30D
                </button>
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
                    max="100"
                    defaultValue="50"
                    className="w-full h-2 bg-gray-700 appearance-none"
                  />
                  <div className="flex items-center justify-between mt-2">
                    <input
                      type="text"
                      placeholder="$0"
                      className="w-20 px-2 py-1 bg-gray-900 border border-gray-700 text-xs text-white"
                    />
                    <span className="text-gray-500">to</span>
                    <input
                      type="text"
                      placeholder="$5M"
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
                      className="w-4 h-4 bg-gray-700 border-gray-600"
                    />
                    <span className="text-xs text-white">{actor}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Apply Filters Button */}
            <button className="w-full px-4 py-2 bg-gray-700 text-white text-sm font-medium hover:bg-gray-600 border border-gray-600">
              Apply Filters
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
            <div className="flex items-center space-x-4">
              {/* Zoom Controls */}
              <div className="flex items-center space-x-2 bg-gray-900 border border-gray-700 px-2 py-1">
                <button className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700">
                  <i className="fas fa-minus text-xs" />
                </button>
                <span className="text-xs text-white px-2">100%</span>
                <button className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700">
                  <i className="fas fa-plus text-xs" />
                </button>
                <button className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 border-l border-gray-700 ml-1 pl-2">
                  <i className="fas fa-expand text-xs" />
                </button>
              </div>

              {/* View Options */}
              <div className="flex items-center space-x-2">
                <button className="px-3 py-1.5 bg-gray-700 text-white text-xs border border-gray-600">
                  Sankey
                </button>
                <button className="px-3 py-1.5 bg-gray-900 text-gray-400 text-xs border border-gray-700 hover:bg-gray-700">
                  Network
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Export Format Dropdown */}
              <div className="flex items-center space-x-2 bg-gray-900 border border-gray-700 px-3 py-1.5">
                <i className="fas fa-file-export text-gray-400 text-xs" />
                <select className="bg-transparent text-xs text-white border-none outline-none">
                  <option>Export as CSV</option>
                  <option>Export as JSON</option>
                  <option>Export as PNG</option>
                </select>
              </div>

              {/* Screenshot */}
              <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 border border-gray-700">
                <i className="fas fa-camera text-xs" />
              </button>
            </div>
          </div>

          {/* Canvas Area with Mini-map */}
          <div className="flex-1 relative bg-gray-950">
            {/* Main Canvas */}
            <div className="absolute inset-0 overflow-hidden">
              {/* Sankey Diagram Placeholder */}
              <div className="w-full h-full flex items-center justify-center p-8">
                <div className="w-full h-full border-2 border-dashed border-gray-700 flex items-center justify-center">
                  {/* Flow Visualization Mockup */}
                  <div className="w-full h-full relative">
                    {/* Left Nodes */}
                    <div className="absolute left-12 top-1/4 space-y-8">
                      <div className="w-16 h-16 bg-gray-700 border-2 border-gray-500 flex items-center justify-center">
                        <span className="text-xs text-gray-400">W1</span>
                      </div>
                      <div className="w-16 h-16 bg-gray-700 border-2 border-gray-500 flex items-center justify-center">
                        <span className="text-xs text-gray-400">W2</span>
                      </div>
                      <div className="w-16 h-16 bg-gray-700 border-2 border-gray-500 flex items-center justify-center">
                        <span className="text-xs text-gray-400">W3</span>
                      </div>
                    </div>

                    {/* Middle Nodes */}
                    <div className="absolute left-1/2 top-1/3 -translate-x-1/2 space-y-12">
                      <div className="w-20 h-20 bg-gray-600 border-2 border-gray-500 flex items-center justify-center">
                        <span className="text-xs text-gray-400">DEX</span>
                      </div>
                      <div className="w-20 h-20 bg-gray-600 border-2 border-gray-500 flex items-center justify-center">
                        <span className="text-xs text-gray-400">CEX</span>
                      </div>
                    </div>

                    {/* Right Nodes */}
                    <div className="absolute right-12 top-1/4 space-y-8">
                      <div className="w-16 h-16 bg-gray-700 border-2 border-gray-500 flex items-center justify-center">
                        <span className="text-xs text-gray-400">D1</span>
                      </div>
                      <div className="w-16 h-16 bg-gray-700 border-2 border-gray-500 flex items-center justify-center">
                        <span className="text-xs text-gray-400">D2</span>
                      </div>
                      <div className="w-16 h-16 bg-gray-700 border-2 border-gray-500 flex items-center justify-center">
                        <span className="text-xs text-gray-400">D3</span>
                      </div>
                    </div>

                    {/* Flow Lines */}
                    <div className="absolute left-28 top-1/4 w-32 h-2 bg-gray-500 opacity-50" />
                    <div className="absolute left-28 top-1/3 w-32 h-3 bg-gray-600 opacity-50" />
                    <div
                      className="absolute left-28 w-32 h-1 bg-gray-400 opacity-50"
                      style={{ top: "40%" }}
                    />
                    <div className="absolute right-28 top-1/4 w-32 h-2 bg-gray-500 opacity-50" />
                    <div className="absolute right-28 top-1/3 w-32 h-3 bg-gray-600 opacity-50" />
                    <div
                      className="absolute right-28 w-32 h-1 bg-gray-400 opacity-50"
                      style={{ top: "40%" }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Mini-map */}
            <div className="absolute bottom-4 right-4 w-48 h-32 bg-gray-900 border-2 border-gray-700 overflow-hidden">
              <div className="w-full h-full relative">
                <div className="absolute inset-0 bg-gray-800 opacity-50" />
                <div className="absolute inset-2 border border-gray-500" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-2 border-white opacity-50" />
              </div>
            </div>

            {/* Stats Overlay */}
            <div className="absolute top-4 left-4 bg-gray-900 border border-gray-700 px-4 py-3 space-y-2">
              <div className="flex items-center justify-between space-x-8">
                <span className="text-xs text-gray-400">Total Nodes:</span>
                <span className="text-sm font-semibold text-white">847</span>
              </div>
              <div className="flex items-center justify-between space-x-8">
                <span className="text-xs text-gray-400">Total Flows:</span>
                <span className="text-sm font-semibold text-white">2,341</span>
              </div>
              <div className="flex items-center justify-between space-x-8">
                <span className="text-xs text-gray-400">Total Volume:</span>
                <span className="text-sm font-semibold text-white">$12.4M</span>
              </div>
            </div>
          </div>

          {/* Timeline Scrubber */}
          <div className="bg-gray-800 border-t border-gray-700 px-4 py-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 border border-gray-700">
                    <i className="fas fa-play text-xs" />
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 border border-gray-700">
                    <i className="fas fa-pause text-xs" />
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 border border-gray-700">
                    <i className="fas fa-step-forward text-xs" />
                  </button>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="text-xs text-gray-400">Speed:</span>
                  <div className="flex space-x-1">
                    <button className="px-2 py-1 bg-gray-700 text-white text-xs">
                      1x
                    </button>
                    <button className="px-2 py-1 bg-gray-900 text-gray-400 text-xs hover:bg-gray-700">
                      2x
                    </button>
                    <button className="px-2 py-1 bg-gray-900 text-gray-400 text-xs hover:bg-gray-700">
                      5x
                    </button>
                  </div>
                </div>

                <div className="text-xs text-white">
                  <span>12:45:30 PM</span>
                  <span className="text-gray-500 mx-2">|</span>
                  <span className="text-gray-400">Jan 15, 2024</span>
                </div>
              </div>

              {/* Timeline Slider */}
              <div className="relative">
                <div className="w-full h-12 bg-gray-900 border border-gray-700 relative overflow-hidden">
                  {/* Timeline markers */}
                  <div className="absolute inset-0 flex items-end justify-around px-2 pb-2">
                    <div className="w-1 h-4 bg-gray-600" />
                    <div className="w-1 h-6 bg-gray-600" />
                    <div className="w-1 h-4 bg-gray-600" />
                    <div className="w-1 h-8 bg-gray-600" />
                    <div className="w-1 h-5 bg-gray-600" />
                    <div className="w-1 h-7 bg-gray-600" />
                    <div className="w-1 h-4 bg-gray-600" />
                    <div className="w-1 h-6 bg-gray-600" />
                    <div className="w-1 h-4 bg-gray-600" />
                  </div>
                  {/* Current position indicator */}
                  <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white" />
                </div>

                {/* Time labels */}
                <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                  <span>00:00</span>
                  <span>06:00</span>
                  <span>12:00</span>
                  <span>18:00</span>
                  <span>24:00</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TransactionFlowVisualization;
