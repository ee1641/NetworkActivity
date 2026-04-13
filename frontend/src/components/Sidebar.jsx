import React from "react";
import { useLocation } from "react-router-dom";

const Sidebar = ({ isOpen = true, onToggle }) => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <aside
      className="fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-300 flex-col shadow-lg"
      style={{ display: isOpen ? "flex" : "none" }}
    >
      <div className="px-3 py-2 border-b border-gray-300">
        <button
          type="button"
          onClick={onToggle}
          aria-label="Collapse sidebar"
          className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-100"
        >
          <i className="fas fa-chevron-left text-xs" />
        </button>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        <a
          href="/dashboard"
          className={`flex items-center space-x-3 px-3 py-2 ${
            isActive("/dashboard")
              ? "bg-gray-900 text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <i className="fas fa-chart-line w-5" />
          <span>Dashboard</span>
        </a>
        <a
          href="/explorer"
          className={`flex items-center space-x-3 px-3 py-2 ${
            isActive("/explorer")
              ? "bg-gray-900 text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <i className="fas fa-search w-5" />
          <span>Explorer</span>
        </a>
        <a
          href="/hotspots"
          className={`flex items-center space-x-3 px-3 py-2 ${
            isActive("/hotspots")
              ? "bg-gray-900 text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <i className="fas fa-fire w-5" />
          <span>Top Hotspots</span>
        </a>
        <a
          href="/clusters"
          className={`flex items-center space-x-3 px-3 py-2 ${
            isActive("/clusters")
              ? "bg-gray-900 text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <i className="fas fa-project-diagram w-5" />
          <span>Clusters</span>
        </a>
        <a
          href="/reports"
          className={`flex items-center space-x-3 px-3 py-2 ${
            isActive("/reports")
              ? "bg-gray-900 text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <i className="fas fa-file-alt w-5" />
          <span>Reports</span>
        </a>
        <a
          href="/labels"
          className={`flex items-center space-x-3 px-3 py-2 ${
            isActive("/labels")
              ? "bg-gray-900 text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <i className="fas fa-tags w-5" />
          <span>Labels</span>
        </a>
        
        <a
          href="/transaction-flow"
          className={`flex items-center space-x-3 px-3 py-2 ${
            isActive("/transaction-flow")
              ? "bg-gray-900 text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <i className="fas fa-random w-5" />
          <span>Transaction Flow</span>
        </a>
        <a
          href="/risk-monitor"
          className={`flex items-center space-x-3 px-3 py-2 ${
            isActive("/risk-monitor")
              ? "bg-gray-900 text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <i className="fas fa-exclamation-triangle w-5" />
          <span>Risk Monitor</span>
        </a>
        <a
          href="/settings"
          className={`flex items-center space-x-3 px-3 py-2 ${
            isActive("/settings")
              ? "bg-gray-900 text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <i className="fas fa-cog w-5" />
          <span>Settings</span>
        </a>
      </nav>
    </aside>
  );
};

export default Sidebar;
