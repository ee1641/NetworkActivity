import React from "react";
import { useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-64 bg-white border-r border-gray-300 hidden lg:flex lg:flex-col">
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
          href="#"
          className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100"
        >
          <i className="fas fa-exchange-alt w-5" />
          <span>Transactions</span>
        </a>
        <a
          href="#"
          className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100"
        >
          <i className="fas fa-coins w-5" />
          <span>Tokens</span>
        </a>
        <a
          href="#"
          className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100"
        >
          <i className="fas fa-project-diagram w-5" />
          <span>Clusters</span>
        </a>
        <a
          href="#"
          className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100"
        >
          <i className="fas fa-bell w-5" />
          <span>Alerts</span>
        </a>
        <a
          href="#"
          className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100"
        >
          <i className="fas fa-history w-5" />
          <span>Activity Log</span>
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

      <div className="px-4 py-4 border-t border-gray-300">
        <div className="flex items-center space-x-3 px-3 py-2">
          <i className="fas fa-question-circle text-gray-600" />
          <span className="text-sm text-gray-700">Help &amp; Support</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
