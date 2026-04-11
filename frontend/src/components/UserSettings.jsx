import React, { useState } from "react";
import Sidebar from "./Sidebar";
import SidebarToggleButton from "./SidebarToggleButton";
import { useSidebarToggle } from "../hooks/useSidebarToggle";

const UserSettings = () => {
  const [activeTab, setActiveTab] = useState("account");
  const { isSidebarOpen, toggleSidebar } = useSidebarToggle();

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
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
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1">
        {/* Sidebar Navigation */}
        <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />

        {/* Main Settings Content */}
        <main className="flex-1 p-4 md:p-6">
          {/* Page Header */}
          <div className="bg-white border border-gray-300 p-4 mb-6">
            <h1 className="text-xl font-semibold text-gray-900">
              User Settings
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage your account preferences and security settings
            </p>
          </div>

          {/* Tabbed Navigation */}
          <div className="bg-white border border-gray-300 mb-6">
            <div className="flex flex-wrap border-b border-gray-300">
              <button
                onClick={() => setActiveTab("account")}
                className={`tab-button px-6 py-3 text-sm font-medium border-r border-gray-300 ${
                  activeTab === "account"
                    ? "bg-gray-900 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <i className="fas fa-user mr-2" />
                Account
              </button>
              
                
            </div>

            {/* Account Tab Content */}
            {activeTab === "account" && (
              <div id="account" className="tab-content p-6">
                <div className="max-w-3xl">
                  {/* Email Section */}
                  <div className="mb-8">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
                      Email Address
                      <i
                        className="fas fa-info-circle text-gray-400 ml-2 text-xs cursor-help"
                        title="Your primary email for account notifications"
                      />
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">
                          Current Email
                        </label>
                        <input
                          type="email"
                          defaultValue="user@example.com"
                          className="w-full px-4 py-2 border border-gray-300 bg-gray-50 text-gray-900 text-sm focus:outline-none focus:border-gray-900"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">
                          New Email
                        </label>
                        <input
                          type="email"
                          placeholder="Enter new email address"
                          className="w-full px-4 py-2 border border-gray-300 text-gray-900 text-sm focus:outline-none focus:border-gray-900"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          placeholder="Enter your password to confirm"
                          className="w-full px-4 py-2 border border-gray-300 text-gray-900 text-sm focus:outline-none focus:border-gray-900"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-300 my-8" />

                  {/* Password Change Section */}
                  <div className="mb-8">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
                      Change Password
                      <i
                        className="fas fa-info-circle text-gray-400 ml-2 text-xs cursor-help"
                        title="Password must be at least 8 characters with uppercase, lowercase, and numbers"
                      />
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">
                          Current Password
                        </label>
                        <input
                          type="password"
                          placeholder="Enter current password"
                          className="w-full px-4 py-2 border border-gray-300 text-gray-900 text-sm focus:outline-none focus:border-gray-900"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">
                          New Password
                        </label>
                        <input
                          type="password"
                          placeholder="Enter new password"
                          className="w-full px-4 py-2 border border-gray-300 text-gray-900 text-sm focus:outline-none focus:border-gray-900"
                        />
                        <div className="mt-2 flex items-center space-x-2">
                          <div className="flex-1 h-1 bg-gray-200" />
                          <div className="flex-1 h-1 bg-gray-200" />
                          <div className="flex-1 h-1 bg-gray-200" />
                          <div className="flex-1 h-1 bg-gray-200" />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Password strength: Not set
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          placeholder="Confirm new password"
                          className="w-full px-4 py-2 border border-gray-300 text-gray-900 text-sm focus:outline-none focus:border-gray-900"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-300 my-8" />

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-3 pt-6 border-t border-gray-300">
                    <button className="px-6 py-2 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800">
                      Save Changes
                    </button>
                    <button className="px-6 py-2 border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Preferences Tab Content */}
            {activeTab === "preferences" && (
              <div id="preferences" className="tab-content p-6">
                <div className="max-w-3xl">
                  {/* Dashboard Layout Section */}
                  <div className="mb-8">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
                      Dashboard Layout
                      <i
                        className="fas fa-info-circle text-gray-400 ml-2 text-xs cursor-help"
                        title="Choose your preferred dashboard layout style"
                      />
                    </h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <label className="cursor-pointer">
                        <input
                          type="radio"
                          name="layout"
                          value="compact"
                          className="hidden peer"
                        />
                        <div className="border-2 border-gray-300 p-4 peer-checked:border-gray-900 peer-checked:bg-gray-50 hover:border-gray-400">
                          <div className="text-center mb-3">
                            <i className="fas fa-th text-gray-600 text-2xl" />
                          </div>
                          <p className="text-sm font-medium text-gray-900 text-center">
                            Compact
                          </p>
                          <p className="text-xs text-gray-600 text-center mt-1">
                            Dense widget layout
                          </p>
                        </div>
                      </label>
                      <label className="cursor-pointer">
                        <input
                          type="radio"
                          name="layout"
                          value="comfortable"
                          defaultChecked
                          className="hidden peer"
                        />
                        <div className="border-2 border-gray-300 p-4 peer-checked:border-gray-900 peer-checked:bg-gray-50 hover:border-gray-400">
                          <div className="text-center mb-3">
                            <i className="fas fa-th-large text-gray-600 text-2xl" />
                          </div>
                          <p className="text-sm font-medium text-gray-900 text-center">
                            Comfortable
                          </p>
                          <p className="text-xs text-gray-600 text-center mt-1">
                            Balanced spacing
                          </p>
                        </div>
                      </label>
                      <label className="cursor-pointer">
                        <input
                          type="radio"
                          name="layout"
                          value="spacious"
                          className="hidden peer"
                        />
                        <div className="border-2 border-gray-300 p-4 peer-checked:border-gray-900 peer-checked:bg-gray-50 hover:border-gray-400">
                          <div className="text-center mb-3">
                            <i className="fas fa-border-all text-gray-600 text-2xl" />
                          </div>
                          <p className="text-sm font-medium text-gray-900 text-center">
                            Spacious
                          </p>
                          <p className="text-xs text-gray-600 text-center mt-1">
                            Maximum spacing
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="border-t border-gray-300 my-8" />

                  {/* Notification Settings Section */}
                  <div className="mb-8">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
                      Notification Settings
                      <i
                        className="fas fa-info-circle text-gray-400 ml-2 text-xs cursor-help"
                        title="Control which notifications you receive"
                      />
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-3 border-b border-gray-200">
                        <div>
                          <p className="text-sm text-gray-900 font-medium">
                            Email Notifications
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            Receive alerts and updates via email
                          </p>
                        </div>
                        <label className="relative inline-block w-12 h-6 cursor-pointer">
                          <input
                            type="checkbox"
                            defaultChecked
                            className="sr-only peer"
                          />
                          <div className="w-12 h-6 bg-gray-300 peer-checked:bg-gray-900 rounded-full peer transition-colors" />
                          <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-6 transition-transform" />
                        </label>
                      </div>

                      <div className="flex items-center justify-between py-3 border-b border-gray-200">
                        <div>
                          <p className="text-sm text-gray-900 font-medium">
                            High Volume Alerts
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            Get notified about unusual transaction volumes
                          </p>
                        </div>
                        <label className="relative inline-block w-12 h-6 cursor-pointer">
                          <input
                            type="checkbox"
                            defaultChecked
                            className="sr-only peer"
                          />
                          <div className="w-12 h-6 bg-gray-300 peer-checked:bg-gray-900 rounded-full peer transition-colors" />
                          <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-6 transition-transform" />
                        </label>
                      </div>

                      <div className="flex items-center justify-between py-3 border-b border-gray-200">
                        <div>
                          <p className="text-sm text-gray-900 font-medium">
                            New Cluster Notifications
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            Alert when new clusters are detected
                          </p>
                        </div>
                        <label className="relative inline-block w-12 h-6 cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-12 h-6 bg-gray-300 peer-checked:bg-gray-900 rounded-full peer transition-colors" />
                          <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-6 transition-transform" />
                        </label>
                      </div>

                      <div className="flex items-center justify-between py-3 border-b border-gray-200">
                        <div>
                          <p className="text-sm text-gray-900 font-medium">
                            Weekly Summary Reports
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            Receive weekly analytics summaries
                          </p>
                        </div>
                        <label className="relative inline-block w-12 h-6 cursor-pointer">
                          <input
                            type="checkbox"
                            defaultChecked
                            className="sr-only peer"
                          />
                          <div className="w-12 h-6 bg-gray-300 peer-checked:bg-gray-900 rounded-full peer transition-colors" />
                          <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-6 transition-transform" />
                        </label>
                      </div>

                      <div className="flex items-center justify-between py-3">
                        <div>
                          <p className="text-sm text-gray-900 font-medium">
                            Security Alerts
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            Important security notifications (always enabled)
                          </p>
                        </div>
                        <label className="relative inline-block w-12 h-6 cursor-not-allowed opacity-50">
                          <input
                            type="checkbox"
                            defaultChecked
                            disabled
                            className="sr-only peer"
                          />
                          <div className="w-12 h-6 bg-gray-900 rounded-full peer transition-colors" />
                          <div className="absolute left-7 top-1 w-4 h-4 bg-white rounded-full transition-transform" />
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-300 my-8" />

                  {/* Data Refresh Intervals Section */}
                  <div className="mb-8">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
                      Data Refresh Intervals
                      <i
                        className="fas fa-info-circle text-gray-400 ml-2 text-xs cursor-help"
                        title="Set how frequently dashboard data updates"
                      />
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">
                          Dashboard Auto-Refresh
                        </label>
                        <select className="w-full md:w-64 px-4 py-2 border border-gray-300 text-gray-900 text-sm focus:outline-none focus:border-gray-900">
                          <option value="10">Every 10 seconds</option>
                          <option value="30" defaultValue="selected">
                            Every 30 seconds
                          </option>
                          <option value="60">Every 1 minute</option>
                          <option value="300">Every 5 minutes</option>
                          <option value="0">Manual refresh only</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">
                          Chart Data Update
                        </label>
                        <select className="w-full md:w-64 px-4 py-2 border border-gray-300 text-gray-900 text-sm focus:outline-none focus:border-gray-900">
                          <option value="30">Every 30 seconds</option>
                          <option value="60" defaultValue="selected">
                            Every 1 minute
                          </option>
                          <option value="300">Every 5 minutes</option>
                          <option value="600">Every 10 minutes</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">
                          Activity Feed Refresh
                        </label>
                        <select className="w-full md:w-64 px-4 py-2 border border-gray-300 text-gray-900 text-sm focus:outline-none focus:border-gray-900">
                          <option value="10">Every 10 seconds</option>
                          <option value="30" defaultValue="selected">
                            Every 30 seconds
                          </option>
                          <option value="60">Every 1 minute</option>
                          <option value="120">Every 2 minutes</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Preferences Action Buttons */}
                  <div className="flex items-center space-x-3 pt-6 border-t border-gray-300">
                    <button className="px-6 py-2 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800">
                      Save Preferences
                    </button>
                    <button className="px-6 py-2 border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50">
                      Reset to Defaults
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab Content */}
            {activeTab === "security" && (
              <div id="security" className="tab-content p-6">
                <div className="max-w-4xl">
                  {/* Session Management Section */}
                  <div className="mb-8">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
                      Active Sessions
                      <i
                        className="fas fa-info-circle text-gray-400 ml-2 text-xs cursor-help"
                        title="Manage your active login sessions"
                      />
                    </h3>
                    <div className="bg-gray-50 border border-gray-300 p-4 mb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <i className="fas fa-desktop text-gray-600 mt-1" />
                          <div>
                            <p className="text-sm text-gray-900 font-medium">
                              Current Session
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                              Chrome on Windows • San Francisco, CA
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Last active: Just now
                            </p>
                          </div>
                        </div>
                        <span className="text-xs text-gray-600 bg-white border border-gray-300 px-2 py-1">
                          Active
                        </span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-white border border-gray-300 p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <i className="fas fa-mobile-alt text-gray-600 mt-1" />
                            <div>
                              <p className="text-sm text-gray-900 font-medium">
                                Mobile Session
                              </p>
                              <p className="text-xs text-gray-600 mt-1">
                                Safari on iOS • New York, NY
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Last active: 2 hours ago
                              </p>
                            </div>
                          </div>
                          <button className="text-xs text-gray-700 border border-gray-300 px-3 py-1 hover:bg-gray-50">
                            Revoke
                          </button>
                        </div>
                      </div>
                      <div className="bg-white border border-gray-300 p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <i className="fas fa-laptop text-gray-600 mt-1" />
                            <div>
                              <p className="text-sm text-gray-900 font-medium">
                                Laptop Session
                              </p>
                              <p className="text-xs text-gray-600 mt-1">
                                Firefox on macOS • Los Angeles, CA
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Last active: 1 day ago
                              </p>
                            </div>
                          </div>
                          <button className="text-xs text-gray-700 border border-gray-300 px-3 py-1 hover:bg-gray-50">
                            Revoke
                          </button>
                        </div>
                      </div>
                    </div>
                    <button className="mt-4 text-sm text-gray-700 border border-gray-300 px-4 py-2 hover:bg-gray-50">
                      Revoke All Other Sessions
                    </button>
                  </div>

                  <div className="border-t border-gray-300 my-8" />

                  {/* Login History Section */}
                  <div className="mb-8">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
                      Login History
                      <i
                        className="fas fa-info-circle text-gray-400 ml-2 text-xs cursor-help"
                        title="View your recent login activity"
                      />
                    </h3>
                    <div className="overflow-x-auto border border-gray-300">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-100 border-b border-gray-300">
                          <tr>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-900">
                              Date &amp; Time
                            </th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-900">
                              Device
                            </th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-900">
                              Location
                            </th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-900">
                              IP Address
                            </th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-900">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white">
                          <tr className="border-b border-gray-200">
                            <td className="px-4 py-3 text-gray-900">
                              Jan 15, 2025 10:30 AM
                            </td>
                            <td className="px-4 py-3 text-gray-700">
                              Chrome on Windows
                            </td>
                            <td className="px-4 py-3 text-gray-700">
                              San Francisco, CA
                            </td>
                            <td className="px-4 py-3 text-gray-700 font-mono text-xs">
                              192.168.1.1
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-xs bg-gray-900 text-white px-2 py-1">
                                Success
                              </span>
                            </td>
                          </tr>
                          <tr className="border-b border-gray-200">
                            <td className="px-4 py-3 text-gray-900">
                              Jan 15, 2025 08:15 AM
                            </td>
                            <td className="px-4 py-3 text-gray-700">
                              Safari on iOS
                            </td>
                            <td className="px-4 py-3 text-gray-700">
                              New York, NY
                            </td>
                            <td className="px-4 py-3 text-gray-700 font-mono text-xs">
                              10.0.0.1
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-xs bg-gray-900 text-white px-2 py-1">
                                Success
                              </span>
                            </td>
                          </tr>
                          <tr className="border-b border-gray-200">
                            <td className="px-4 py-3 text-gray-900">
                              Jan 14, 2025 11:45 PM
                            </td>
                            <td className="px-4 py-3 text-gray-700">
                              Firefox on macOS
                            </td>
                            <td className="px-4 py-3 text-gray-700">
                              Los Angeles, CA
                            </td>
                            <td className="px-4 py-3 text-gray-700 font-mono text-xs">
                              172.16.0.1
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-xs bg-gray-900 text-white px-2 py-1">
                                Success
                              </span>
                            </td>
                          </tr>
                          <tr className="border-b border-gray-200">
                            <td className="px-4 py-3 text-gray-900">
                              Jan 14, 2025 09:20 AM
                            </td>
                            <td className="px-4 py-3 text-gray-700">
                              Chrome on Android
                            </td>
                            <td className="px-4 py-3 text-gray-700">Unknown</td>
                            <td className="px-4 py-3 text-gray-700 font-mono text-xs">
                              203.0.113.0
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-xs bg-gray-600 text-white px-2 py-1">
                                Failed
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-gray-900">
                              Jan 13, 2025 03:30 PM
                            </td>
                            <td className="px-4 py-3 text-gray-700">
                              Chrome on Windows
                            </td>
                            <td className="px-4 py-3 text-gray-700">
                              San Francisco, CA
                            </td>
                            <td className="px-4 py-3 text-gray-700 font-mono text-xs">
                              192.168.1.1
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-xs bg-gray-900 text-white px-2 py-1">
                                Success
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <button className="mt-4 text-sm text-gray-700 border border-gray-300 px-4 py-2 hover:bg-gray-50">
                      View Full History
                    </button>
                  </div>

                  <div className="border-t border-gray-300 my-8" />

                  {/* Connected Devices Section */}
                  <div className="mb-8">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
                      Connected Devices
                      <i
                        className="fas fa-info-circle text-gray-400 ml-2 text-xs cursor-help"
                        title="Devices with saved login credentials"
                      />
                    </h3>
                    <div className="space-y-3">
                      <div className="bg-white border border-gray-300 p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <i className="fas fa-desktop text-gray-600 text-xl mt-1" />
                            <div>
                              <p className="text-sm text-gray-900 font-medium">
                                Windows Desktop
                              </p>
                              <p className="text-xs text-gray-600 mt-1">
                                Chrome Browser • Last used: Today
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Added: Jan 1, 2025
                              </p>
                            </div>
                          </div>
                          <button className="text-xs text-gray-700 border border-gray-300 px-3 py-1 hover:bg-gray-50">
                            Remove
                          </button>
                        </div>
                      </div>
                      <div className="bg-white border border-gray-300 p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <i className="fas fa-mobile-alt text-gray-600 text-xl mt-1" />
                            <div>
                              <p className="text-sm text-gray-900 font-medium">
                                iPhone 14 Pro
                              </p>
                              <p className="text-xs text-gray-600 mt-1">
                                Safari Browser • Last used: 2 hours ago
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Added: Dec 15, 2024
                              </p>
                            </div>
                          </div>
                          <button className="text-xs text-gray-700 border border-gray-300 px-3 py-1 hover:bg-gray-50">
                            Remove
                          </button>
                        </div>
                      </div>
                      <div className="bg-white border border-gray-300 p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <i className="fas fa-laptop text-gray-600 text-xl mt-1" />
                            <div>
                              <p className="text-sm text-gray-900 font-medium">
                                MacBook Pro
                              </p>
                              <p className="text-xs text-gray-600 mt-1">
                                Firefox Browser • Last used: Yesterday
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Added: Nov 20, 2024
                              </p>
                            </div>
                          </div>
                          <button className="text-xs text-gray-700 border border-gray-300 px-3 py-1 hover:bg-gray-50">
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* API Access Tab Content */}
            {activeTab === "api" && (
              <div id="api" className="tab-content p-6">
                <div className="max-w-3xl">
                  {/* API Key Generation Section */}
                  <div className="mb-8">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
                      API Key Management
                      <i
                        className="fas fa-info-circle text-gray-400 ml-2 text-xs cursor-help"
                        title="Generate and manage API keys for programmatic access"
                      />
                    </h3>
                    <div className="bg-gray-50 border border-gray-300 p-4 mb-4">
                      <div className="flex items-start space-x-3">
                        <i className="fas fa-key text-gray-600 mt-1" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-900 font-medium mb-1">
                            Generate New API Key
                          </p>
                          <p className="text-xs text-gray-600 mb-3">
                            Create a new API key to access the Blockchain Analytics
                            API. Keep your keys secure and never share them publicly.
                          </p>
                          <div className="flex items-center space-x-3">
                            <input
                              type="text"
                              placeholder="Key name (optional)"
                              className="flex-1 px-4 py-2 border border-gray-300 text-gray-900 text-sm focus:outline-none focus:border-gray-900"
                            />
                            <button className="px-4 py-2 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 whitespace-nowrap">
                              Generate Key
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Existing Keys */}
                    <div className="space-y-3">
                      <div className="bg-white border border-gray-300 p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <p className="text-sm text-gray-900 font-medium">
                                Production Key
                              </p>
                              <span className="text-xs bg-gray-900 text-white px-2 py-1">
                                Active
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 font-mono mb-2">
                              sk_prod_••••••••••••••••3f8a
                            </p>
                            <p className="text-xs text-gray-500">
                              Created: Jan 1, 2025 • Last used: 2 hours ago
                            </p>
                          </div>
                          <button className="text-xs text-gray-700 border border-gray-300 px-3 py-1 hover:bg-gray-50">
                            Revoke
                          </button>
                        </div>
                      </div>
                      <div className="bg-white border border-gray-300 p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <p className="text-sm text-gray-900 font-medium">
                                Development Key
                              </p>
                              <span className="text-xs bg-gray-600 text-white px-2 py-1">
                                Active
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 font-mono mb-2">
                              sk_dev_••••••••••••••••7b2d
                            </p>
                            <p className="text-xs text-gray-500">
                              Created: Dec 15, 2024 • Last used: Yesterday
                            </p>
                          </div>
                          <button className="text-xs text-gray-700 border border-gray-300 px-3 py-1 hover:bg-gray-50">
                            Revoke
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-300 my-8" />

                  {/* Usage Quotas Section */}
                  <div className="mb-8">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
                      API Usage &amp; Quotas
                      <i
                        className="fas fa-info-circle text-gray-400 ml-2 text-xs cursor-help"
                        title="Monitor your API usage and rate limits"
                      />
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                      <div className="bg-white border border-gray-300 p-4">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-sm text-gray-900 font-medium">
                            Requests This Month
                          </p>
                          <i className="fas fa-chart-line text-gray-600" />
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-2">
                          45,231
                        </div>
                        <div className="w-full bg-gray-200 h-2 mb-2">
                          <div
                            className="bg-gray-900 h-2"
                            style={{ width: "45%" }}
                          />
                        </div>
                        <p className="text-xs text-gray-600">
                          45% of 100,000 monthly limit
                        </p>
                      </div>
                      <div className="bg-white border border-gray-300 p-4">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-sm text-gray-900 font-medium">
                            Rate Limit Status
                          </p>
                          <i className="fas fa-tachometer-alt text-gray-600" />
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-2">
                          Normal
                        </div>
                        <div className="w-full bg-gray-200 h-2 mb-2">
                          <div
                            className="bg-gray-600 h-2"
                            style={{ width: "25%" }}
                          />
                        </div>
                        <p className="text-xs text-gray-600">
                          1,000 requests per hour
                        </p>
                      </div>
                    </div>
                    <div className="bg-gray-50 border border-gray-300 p-4">
                      <p className="text-sm text-gray-900 font-medium mb-3">
                        Usage Breakdown
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-700">
                            Transaction Queries
                          </span>
                          <span className="text-gray-900 font-medium">
                            28,450 (63%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 h-2">
                          <div
                            className="bg-gray-700 h-2"
                            style={{ width: "63%" }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-700">Cluster Analysis</span>
                          <span className="text-gray-900 font-medium">
                            12,340 (27%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 h-2">
                          <div
                            className="bg-gray-600 h-2"
                            style={{ width: "27%" }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-700">Token Data</span>
                          <span className="text-gray-900 font-medium">
                            4,441 (10%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 h-2">
                          <div
                            className="bg-gray-500 h-2"
                            style={{ width: "10%" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-300 my-8" />

                  {/* Documentation Links Section */}
                  <div className="mb-8">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
                      API Documentation &amp; Resources
                      <i
                        className="fas fa-info-circle text-gray-400 ml-2 text-xs cursor-help"
                        title="Access guides and documentation for API integration"
                      />
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <a
                        href="#"
                        className="bg-white border border-gray-300 p-4 hover:border-gray-900 transition-colors"
                      >
                        <div className="flex items-start space-x-3">
                          <i className="fas fa-book text-gray-600 text-xl mt-1" />
                          <div>
                            <p className="text-sm text-gray-900 font-medium mb-1">
                              API Documentation
                            </p>
                            <p className="text-xs text-gray-600">
                              Complete reference for all API endpoints and
                              parameters
                            </p>
                          </div>
                        </div>
                      </a>
                      <a
                        href="#"
                        className="bg-white border border-gray-300 p-4 hover:border-gray-900 transition-colors"
                      >
                        <div className="flex items-start space-x-3">
                          <i className="fas fa-graduation-cap text-gray-600 text-xl mt-1" />
                          <div>
                            <p className="text-sm text-gray-900 font-medium mb-1">
                              Getting Started Guide
                            </p>
                            <p className="text-xs text-gray-600">
                              Quick start tutorial for API integration
                            </p>
                          </div>
                        </div>
                      </a>
                      <a
                        href="#"
                        className="bg-white border border-gray-300 p-4 hover:border-gray-900 transition-colors"
                      >
                        <div className="flex items-start space-x-3">
                          <i className="fas fa-code text-gray-600 text-xl mt-1" />
                          <div>
                            <p className="text-sm text-gray-900 font-medium mb-1">
                              Code Examples
                            </p>
                            <p className="text-xs text-gray-600">
                              Sample code in Python, JavaScript, and more
                            </p>
                          </div>
                        </div>
                      </a>
                      <a
                        href="#"
                        className="bg-white border border-gray-300 p-4 hover:border-gray-900 transition-colors"
                      >
                        <div className="flex items-start space-x-3">
                          <i className="fas fa-life-ring text-gray-600 text-xl mt-1" />
                          <div>
                            <p className="text-sm text-gray-900 font-medium mb-1">
                              API Support
                            </p>
                            <p className="text-xs text-gray-600">
                              Get help from our developer support team
                            </p>
                          </div>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserSettings;
