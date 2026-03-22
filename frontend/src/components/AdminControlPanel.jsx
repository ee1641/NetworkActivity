import React from "react";
import Sidebar from "./Sidebar";
import SidebarToggleButton from "./SidebarToggleButton";
import { useSidebarToggle } from "../hooks/useSidebarToggle";

const AdminControlPanel = () => {
  const { isSidebarOpen, toggleSidebar } = useSidebarToggle();

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
              <i className="fas fa-shield-alt text-white text-sm" />
            </div>
            <div>
              <span className="text-lg font-semibold text-gray-900 hidden sm:block">
                Admin Control Panel
              </span>
              <span className="text-xs text-gray-600 hidden sm:block">
                System Administration
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3 md:space-x-6">
            <div className="flex items-center space-x-2 text-xs text-gray-600">
              <div className="w-2 h-2 bg-gray-400 rounded-full" />
              <span className="hidden sm:inline">System Status: Active</span>
            </div>
            <button className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100">
              <i className="fas fa-cog" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1">
        {/* Sidebar Navigation */}
        <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />

        {/* Main Admin Content */}
        <main className="flex-1 p-4 md:p-6">
          {/* Page Header */}
          <div className="bg-white border border-gray-300 p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
              <h1 className="text-xl font-semibold text-gray-900">
                Administration
              </h1>
              <div className="flex items-center space-x-3">
                <span className="text-xs text-gray-500">
                  Last updated: 2 min ago
                </span>
                <button className="px-3 py-1.5 bg-gray-900 text-white text-sm hover:bg-gray-800">
                  Refresh
                </button>
              </div>
            </div>
          </div>

          {/* Admin Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              {
                title: "Total Users",
                value: "1,247",
                change: "+12.5%",
                icon: "fas fa-users",
              },
              {
                title: "Active Sessions",
                value: "342",
                change: "+8.3%",
                icon: "fas fa-signal",
              },
              {
                title: "System Uptime",
                value: "99.9%",
                change: "+0.1%",
                icon: "fas fa-server",
              },
              {
                title: "Pending Actions",
                value: "18",
                change: "-3.2%",
                icon: "fas fa-tasks",
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-white border border-gray-300 p-5 relative group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-gray-100 flex items-center justify-center">
                    <i className={`${stat.icon} text-gray-700`} />
                  </div>
                  <span className="text-xs text-gray-500">{stat.change}</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-xs text-gray-600">{stat.title}</div>
              </div>
            ))}
          </div>

          {/* Admin Sections Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Management Section */}
            <div className="bg-white border border-gray-300 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-900">
                  User Management
                </h3>
                <button className="text-xs text-gray-600 hover:text-gray-900 border border-gray-300 px-3 py-1">
                  View All
                </button>
              </div>

              <div className="space-y-3">
                {[
                  {
                    name: "John Doe",
                    role: "Admin",
                    status: "Active",
                    email: "john@example.com",
                  },
                  {
                    name: "Jane Smith",
                    role: "Analyst",
                    status: "Active",
                    email: "jane@example.com",
                  },
                  {
                    name: "Bob Wilson",
                    role: "Viewer",
                    status: "Inactive",
                    email: "bob@example.com",
                  },
                  {
                    name: "Alice Brown",
                    role: "Analyst",
                    status: "Active",
                    email: "alice@example.com",
                  },
                ].map((user, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-200 flex items-center justify-center">
                        <i className="fas fa-user text-gray-500 text-xs" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-xs bg-gray-100 px-2 py-1 text-gray-700">
                        {user.role}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 ${
                          user.status === "Active"
                            ? "bg-gray-800 text-white"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {user.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* System Configuration */}
            <div className="bg-white border border-gray-300 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-900">
                  System Configuration
                </h3>
                <i className="fas fa-ellipsis-v text-gray-400" />
              </div>

              <div className="space-y-4">
                {[
                  {
                    label: "API Rate Limiting",
                    description: "Max requests per minute",
                    value: "1000",
                  },
                  {
                    label: "Session Timeout",
                    description: "Auto-logout duration",
                    value: "30 min",
                  },
                  {
                    label: "Data Retention",
                    description: "Transaction data storage period",
                    value: "90 days",
                  },
                  {
                    label: "Alert Threshold",
                    description: "Minimum anomaly score for alerts",
                    value: "75",
                  },
                ].map((config, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0"
                  >
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {config.label}
                      </div>
                      <div className="text-xs text-gray-500">
                        {config.description}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-semibold text-gray-900 bg-gray-100 px-3 py-1">
                        {config.value}
                      </span>
                      <button className="text-xs text-gray-500 hover:text-gray-900">
                        <i className="fas fa-pencil-alt" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-4 px-4 py-2 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800">
                Save Configuration
              </button>
            </div>

            {/* Audit Log */}
            <div className="bg-white border border-gray-300 p-5 lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-900">
                  Recent Audit Log
                </h3>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 border border-gray-300 px-3 py-1.5">
                    <i className="fas fa-filter text-gray-500 text-xs" />
                    <select className="text-xs text-gray-700 bg-transparent border-none outline-none">
                      <option>All Events</option>
                      <option>Login</option>
                      <option>Config Change</option>
                      <option>Data Export</option>
                    </select>
                  </div>
                  <button className="text-xs text-gray-600 hover:text-gray-900 border border-gray-300 px-3 py-1.5">
                    Export
                  </button>
                </div>
              </div>

              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-left text-xs font-semibold text-gray-700">
                      Timestamp
                    </th>
                    <th className="p-2 text-left text-xs font-semibold text-gray-700">
                      User
                    </th>
                    <th className="p-2 text-left text-xs font-semibold text-gray-700">
                      Action
                    </th>
                    <th className="p-2 text-left text-xs font-semibold text-gray-700">
                      Details
                    </th>
                    <th className="p-2 text-left text-xs font-semibold text-gray-700">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      time: "12:45:30",
                      user: "admin@system",
                      action: "Config Update",
                      details: "Changed rate limit to 1000",
                      status: "Success",
                    },
                    {
                      time: "12:40:15",
                      user: "jane@example.com",
                      action: "Data Export",
                      details: "Exported transaction report",
                      status: "Success",
                    },
                    {
                      time: "12:35:22",
                      user: "john@example.com",
                      action: "Login",
                      details: "IP: 192.168.1.45",
                      status: "Success",
                    },
                    {
                      time: "12:30:08",
                      user: "bob@example.com",
                      action: "Login",
                      details: "IP: 10.0.0.125",
                      status: "Failed",
                    },
                    {
                      time: "12:25:44",
                      user: "admin@system",
                      action: "User Update",
                      details: "Modified role for Bob Wilson",
                      status: "Success",
                    },
                  ].map((log, i) => (
                    <tr key={i} className="border-t border-gray-200">
                      <td className="p-2 text-xs text-gray-600">{log.time}</td>
                      <td className="p-2 text-xs text-gray-900">{log.user}</td>
                      <td className="p-2 text-xs text-gray-700">
                        {log.action}
                      </td>
                      <td className="p-2 text-xs text-gray-600">
                        {log.details}
                      </td>
                      <td className="p-2">
                        <span
                          className={`text-xs px-2 py-0.5 ${
                            log.status === "Success"
                              ? "bg-gray-800 text-white"
                              : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
                <span className="text-xs text-gray-500">
                  Showing 5 of 1,247 events
                </span>
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 text-xs border border-gray-300 text-gray-600 hover:bg-gray-50">
                    Previous
                  </button>
                  <button className="px-3 py-1 text-xs border border-gray-300 text-gray-600 hover:bg-gray-50">
                    Next
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

export default AdminControlPanel;
