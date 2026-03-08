import React, { useState } from "react";
import Sidebar from "./Sidebar";
import SidebarToggleButton from "./SidebarToggleButton";
import { useSidebarToggle } from "../hooks/useSidebarToggle";

const DataReportingInterface = () => {
  const { isSidebarOpen, toggleSidebar } = useSidebarToggle();
  const [reportType, setReportType] = useState("tx_count"); // Default to Transaction Count
  const [startDate, setStartDate] = useState(
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);

  const generateReport = async () => {
    setLoading(true);
    try {
      const metricParam = reportType === "all" ? "all" : reportType;

      const startDateTime = `${startDate}T00:00:00Z`;
      const endDateTime = `${endDate}T23:59:59Z`;

      const response = await fetch(
        `http://localhost:8080/api/metrics/report?metric=${metricParam}&start=${startDateTime}&end=${endDateTime}`
      );
      if (!response.ok) throw new Error("Failed to fetch report");
      const data = await response.json();
      setReportData(data);
    } catch (error) {
      console.error("Error generating report:", error);
      alert("Error generating report. Ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    if (!reportData || reportData.length === 0) return;

    const headers = ["ID", "Timestamp", "Metric Name", "Value", "Source"];
    const rows = reportData.map((item) => [
      item.id,
      item.ts,
      item.metricName,
      item.value,
      item.source,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `report_${reportType}_${startDate}_${endDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
              <span className="hidden sm:inline">Status: {loading ? "Fetching..." : "Ready"}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1">
        {/* Sidebar Navigation */}
        <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />

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
                  <label className={`flex items-center space-x-3 p-4 border-2 cursor-pointer ${reportType === 'tx_count' ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-400'}`}>
                    <input
                      type="radio"
                      name="reportType"
                      checked={reportType === "tx_count"}
                      onChange={() => setReportType("tx_count")}
                      className="w-4 h-4"
                    />
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        Transactions
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        Transaction counts
                      </div>
                    </div>
                  </label>

                  <label className={`flex items-center space-x-3 p-4 border-2 cursor-pointer ${reportType === 'vtho_burn' ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-400'}`}>
                    <input
                      type="radio"
                      name="reportType"
                      checked={reportType === "vtho_burn"}
                      onChange={() => setReportType("vtho_burn")}
                      className="w-4 h-4"
                    />
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        VTHO Burn
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        Gas usage analysis
                      </div>
                    </div>
                  </label>

                  <label className={`flex items-center space-x-3 p-4 border-2 cursor-pointer ${reportType === 'all' ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-400'}`}>
                    <input
                      type="radio"
                      name="reportType"
                      checked={reportType === "all"}
                      onChange={() => setReportType("all")}
                      className="w-4 h-4"
                    />
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        All Metrics
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        Complete dataset
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
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="flex-1 text-sm text-gray-700 bg-transparent border-none outline-none"
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
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="flex-1 text-sm text-gray-700 bg-transparent border-none outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Generate Button & Progress */}
              <div className="bg-white border border-gray-300 p-5">
                <button
                  onClick={generateReport}
                  disabled={loading}
                  className="w-full bg-gray-900 text-white py-4 px-6 text-sm font-semibold hover:bg-gray-800 flex items-center justify-center space-x-3 disabled:bg-gray-400"
                >
                  {loading ? (
                    <i className="fas fa-spinner fa-spin" />
                  ) : (
                    <i className="fas fa-play-circle" />
                  )}
                  <span>{loading ? "Generating..." : "Generate Report"}</span>
                </button>
              </div>

              {/* Data Preview */}
              {reportData && (
                <div className="bg-white border border-gray-300 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-semibold text-gray-900">
                      Report Results
                    </h2>
                    <span className="text-xs text-gray-600">
                      {reportData.length} records found
                    </span>
                    <button
                      onClick={downloadCSV}
                      className="text-xs bg-green-600 text-white px-3 py-1 hover:bg-green-700 rounded"
                    >
                      Export CSV
                    </button>
                  </div>

                  <div className="border border-gray-300 overflow-hidden max-h-96 overflow-y-auto">
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead className="bg-gray-100 border-b border-gray-300">
                          <tr>
                            <th className="px-4 py-3 text-left font-semibold text-gray-900">
                              Timestamp
                            </th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-900">
                              Metric
                            </th>
                            <th className="px-4 py-3 text-right font-semibold text-gray-900">
                              Value
                            </th>
                            <th className="px-4 py-3 text-right font-semibold text-gray-900">
                              Source
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {reportData.length === 0 ? (
                            <tr>
                              <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                                No data found for this range.
                              </td>
                            </tr>
                          ) : (
                            reportData.map((item) => (
                              <tr key={item.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-gray-700">
                                  {new Date(item.ts).toLocaleString()}
                                </td>
                                <td className="px-4 py-3 text-gray-700">
                                  {item.metricName}
                                </td>
                                <td className="px-4 py-3 text-right text-gray-700 font-mono">
                                  {item.value.toLocaleString()}
                                </td>
                                <td className="px-4 py-3 text-right text-gray-500">
                                  {item.source}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DataReportingInterface;

