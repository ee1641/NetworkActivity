import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "./Sidebar";
import SidebarToggleButton from "./SidebarToggleButton";
import { useSidebarToggle } from "../hooks/useSidebarToggle";

const API_BASE_URL = "http://localhost:8080/api/labels";
const ITEMS_PER_PAGE = 10;

const LabelManagement = () => {
  const { isSidebarOpen, toggleSidebar } = useSidebarToggle();

  const [isLabelModalOpen, setIsLabelModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingOriginalAddress, setEditingOriginalAddress] = useState("");

  const [labels, setLabels] = useState([]);
  const [history, setHistory] = useState([]);

  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [error, setError] = useState("");
  const [historyError, setHistoryError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Entity Types");

  const [submitting, setSubmitting] = useState(false);
  const [deletingAddress, setDeletingAddress] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const emptyLabelForm = {
    address: "",
    labelName: "",
    category: "",
    entityName: "",
    source: "manual",
    createdBy: "User Name",
  };

  const [labelForm, setLabelForm] = useState(emptyLabelForm);

  const fetchLabels = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error(`Failed to fetch labels: ${response.status}`);
      }

      const data = await response.json();
      setLabels(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load labels");
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      setHistoryLoading(true);
      setHistoryError("");

      const response = await fetch(`${API_BASE_URL}/history`);
      if (!response.ok) {
        throw new Error(`Failed to fetch label history: ${response.status}`);
      }

      const data = await response.json();
      setHistory(Array.isArray(data) ? data : []);
    } catch (err) {
      setHistoryError(err.message || "Failed to load label history");
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchLabels();
    fetchHistory();
  }, []);

  const filteredLabels = useMemo(() => {
    return labels.filter((label) => {
      const term = searchTerm.trim().toLowerCase();

      const matchesSearch =
        !term ||
        label.address?.toLowerCase().includes(term) ||
        label.labelName?.toLowerCase().includes(term) ||
        label.entityName?.toLowerCase().includes(term) ||
        label.category?.toLowerCase().includes(term);

      const matchesCategory =
        selectedCategory === "All Entity Types" ||
        label.category?.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [labels, searchTerm, selectedCategory]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  const totalPages = Math.max(1, Math.ceil(filteredLabels.length / ITEMS_PER_PAGE));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedLabels = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredLabels.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredLabels, currentPage]);

  const visiblePageNumbers = useMemo(() => {
    const pages = [];
    const maxVisible = 5;

    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i += 1) {
      pages.push(i);
    }

    return pages;
  }, [currentPage, totalPages]);

  const handleFormChange = (field, value) => {
    setLabelForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetLabelForm = () => {
    setLabelForm(emptyLabelForm);
    setIsEditMode(false);
    setEditingOriginalAddress("");
  };

  const openAddModal = () => {
    resetLabelForm();
    setIsEditMode(false);
    setIsLabelModalOpen(true);
  };

  const openEditModal = (label) => {
    setLabelForm({
      address: label.address || "",
      labelName: label.labelName || "",
      category: label.category || "",
      entityName: label.entityName || "",
      source: label.source || "manual",
      createdBy: label.createdBy || "User Name",
    });
    setEditingOriginalAddress(label.address);
    setIsEditMode(true);
    setIsLabelModalOpen(true);
  };

  const closeModal = () => {
    resetLabelForm();
    setIsLabelModalOpen(false);
  };

  const handleSubmit = async () => {
    if (
      !labelForm.address.trim() ||
      !labelForm.labelName.trim() ||
      !labelForm.category.trim()
    ) {
      setError("Address, label name, and entity type are required.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      let response;

      if (isEditMode) {
        response = await fetch(
          `${API_BASE_URL}/${encodeURIComponent(editingOriginalAddress)}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(labelForm),
          }
        );
      } else {
        response = await fetch(API_BASE_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(labelForm),
        });
      }

      if (!response.ok) {
        let message = `Failed to ${isEditMode ? "update" : "create"} label: ${response.status}`;
        try {
          const text = await response.text();
          if (text) message = text;
        } catch (_) {
          // ignore
        }
        throw new Error(message);
      }

      await fetchLabels();
      await fetchHistory();
      closeModal();
    } catch (err) {
      setError(err.message || `Failed to ${isEditMode ? "update" : "create"} label`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (address) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the label for ${address}?`
    );

    if (!confirmed) return;

    try {
      setDeletingAddress(address);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/${encodeURIComponent(address)}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        let message = `Failed to delete label: ${response.status}`;
        try {
          const text = await response.text();
          if (text) message = text;
        } catch (_) {
          // ignore
        }
        throw new Error(message);
      }

      await fetchLabels();
      await fetchHistory();
    } catch (err) {
      setError(err.message || "Failed to delete label");
    } finally {
      setDeletingAddress("");
    }
  };

  const formatDateTime = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleString();
  };

  const formatRelativeTime = (value) => {
    if (!value) return "-";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();

    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;

    if (diffMs < minute) return "Just now";
    if (diffMs < hour) {
      const minutes = Math.floor(diffMs / minute);
      return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    }
    if (diffMs < day) {
      const hours = Math.floor(diffMs / hour);
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    }

    const days = Math.floor(diffMs / day);
    return `${days} day${days !== 1 ? "s" : ""} ago`;
  };

  const getHistoryTitle = (item) => {
    switch (item.action) {
      case "CREATED":
        return "New Label Added";
      case "DELETED":
        return "Label Deleted";
      default:
        return "Label Updated";
    }
  };

  const getHistoryDescription = (item) => {
    if (item.action === "CREATED") {
      return `Created "${item.newValue || "-"}"`;
    }

    if (item.action === "DELETED") {
      return `Removed "${item.oldValue || "-"}"`;
    }

    return `Changed from "${item.oldValue || "-"}" to "${item.newValue || "-"}"`;
  };

  const getHistoryBorderClass = (item) => {
    switch (item.action) {
      case "CREATED":
        return "border-gray-700";
      case "DELETED":
        return "border-gray-500";
      default:
        return "border-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
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
            <button
              onClick={() => {
                fetchLabels();
                fetchHistory();
              }}
              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100"
              title="Refresh"
            >
              <i className="fas fa-sync-alt" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />

        <main className="flex-1 p-4 md:p-6">
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
                onClick={openAddModal}
                className="bg-gray-900 text-white px-4 py-2 text-sm font-semibold hover:bg-gray-800 flex items-center space-x-2"
              >
                <i className="fas fa-plus" />
                <span>Add New Label</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 mb-6 text-sm">
              {error}
            </div>
          )}

          <div className="bg-white border border-gray-300 p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <div className="flex items-center space-x-2 border border-gray-300 px-3 py-2 bg-white">
                  <i className="fas fa-search text-gray-600 text-sm" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by address, label, or entity type..."
                    className="flex-1 text-sm text-gray-700 bg-transparent border-none outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 border border-gray-300 px-3 py-2 bg-white">
                <i className="fas fa-filter text-gray-600 text-sm" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="flex-1 text-sm text-gray-700 bg-transparent border-none outline-none"
                >
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

          <div className="bg-white border border-gray-300 mb-6">
            <div className="p-4 border-b border-gray-300 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900">
                Entity Labels
              </h2>
              <div className="flex items-center space-x-2 text-xs text-gray-600">
                <span>
                  Showing {filteredLabels.length} of {labels.length} labels
                </span>
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
                  {loading && (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-4 py-6 text-center text-gray-500"
                      >
                        Loading labels...
                      </td>
                    </tr>
                  )}

                  {!loading && !error && paginatedLabels.length === 0 && (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-4 py-6 text-center text-gray-500"
                      >
                        No labels found.
                      </td>
                    </tr>
                  )}

                  {!loading &&
                    paginatedLabels.map((label) => (
                      <tr key={label.address} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-900 font-mono">
                          {label.address}
                        </td>
                        <td className="px-4 py-3 text-gray-900 font-semibold">
                          {label.labelName || "-"}
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          {label.category || "-"}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {formatDateTime(label.createdAt)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => openEditModal(label)}
                              className="text-gray-600 hover:text-gray-900"
                              title="Edit label"
                            >
                              <i className="fas fa-edit" />
                            </button>
                            <button
                              onClick={() => handleDelete(label.address)}
                              disabled={deletingAddress === label.address}
                              className="text-red-600 hover:text-red-800 disabled:opacity-50"
                              title="Delete label"
                            >
                              <i className="fas fa-trash" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-gray-300 flex items-center justify-between">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-xs text-gray-600 border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>

              <div className="flex items-center space-x-1">
                {visiblePageNumbers[0] > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentPage(1)}
                      className="px-3 py-1 text-xs text-gray-600 hover:bg-gray-100"
                    >
                      1
                    </button>
                    {visiblePageNumbers[0] > 2 && (
                      <span className="px-2 text-xs text-gray-600">...</span>
                    )}
                  </>
                )}

                {visiblePageNumbers.map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 text-xs ${
                      currentPage === page
                        ? "bg-gray-900 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                {visiblePageNumbers[visiblePageNumbers.length - 1] < totalPages && (
                  <>
                    {visiblePageNumbers[visiblePageNumbers.length - 1] < totalPages - 1 && (
                      <span className="px-2 text-xs text-gray-600">...</span>
                    )}
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      className="px-3 py-1 text-xs text-gray-600 hover:bg-gray-100"
                    >
                      {totalPages}
                    </button>
                  </>
                )}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-xs text-gray-600 border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>

          <div className="bg-white border border-gray-300">
            <div className="p-4 border-b border-gray-300">
              <h2 className="text-sm font-semibold text-gray-900 flex items-center space-x-2">
                <i className="fas fa-history text-gray-600" />
                <span>Label History (Audit Log)</span>
              </h2>
            </div>

            <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto text-xs">
              {historyLoading && (
                <div className="text-gray-500">Loading history...</div>
              )}

              {!historyLoading && historyError && (
                <div className="text-red-600">{historyError}</div>
              )}

              {!historyLoading && !historyError && history.length === 0 && (
                <div className="text-gray-500">No history found.</div>
              )}

              {!historyLoading &&
                !historyError &&
                history.map((item) => (
                  <div
                    key={item.id}
                    className={`border-l-4 ${getHistoryBorderClass(
                      item
                    )} pl-3 pb-3`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div className="font-semibold text-gray-900">
                        {getHistoryTitle(item)}
                      </div>
                      <div className="text-gray-500">
                        {formatRelativeTime(item.changedAt)}
                      </div>
                    </div>

                    <div className="text-gray-600 mb-1">
                      <span className="font-semibold">
                        {item.changedBy || "System"}
                      </span>{" "}
                      {item.action === "CREATED" && "added label for "}
                      {item.action === "UPDATED" && "updated label for "}
                      {item.action === "DELETED" && "deleted label for "}
                      {item.address || "-"}
                    </div>

                    <div className="text-gray-500">
                      {getHistoryDescription(item)}
                    </div>
                  </div>
                ))}
            </div>

            <div className="p-4 border-t border-gray-300">
              <button
                onClick={fetchHistory}
                className="w-full text-xs text-gray-700 py-2 border border-gray-300 hover:bg-gray-50"
              >
                Refresh Audit Log
              </button>
            </div>
          </div>
        </main>
      </div>

      {isLabelModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="bg-white border border-gray-300 w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="p-4 border-b border-gray-300 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {isEditMode ? "Edit Label" : "Add New Label"}
              </h2>
              <button
                onClick={closeModal}
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
                  value={labelForm.address}
                  onChange={(e) => handleFormChange("address", e.target.value)}
                  placeholder="0x..."
                  disabled={isEditMode}
                  className="w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:border-gray-500 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-900 mb-2">
                  Label Name *
                </label>
                <input
                  type="text"
                  value={labelForm.labelName}
                  onChange={(e) =>
                    handleFormChange("labelName", e.target.value)
                  }
                  placeholder="e.g., Binance Hot Wallet"
                  className="w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:border-gray-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-900 mb-2">
                  Entity Type *
                </label>
                <select
                  value={labelForm.category}
                  onChange={(e) => handleFormChange("category", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:border-gray-500"
                >
                  <option value="">Select entity type...</option>
                  <option value="Wallet">Wallet</option>
                  <option value="Smart Contract">Smart Contract</option>
                  <option value="DEX">DEX</option>
                  <option value="Bridge">Bridge</option>
                  <option value="Exchange">Exchange</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-900 mb-2">
                  Entity Name (Optional)
                </label>
                <input
                  type="text"
                  value={labelForm.entityName}
                  onChange={(e) =>
                    handleFormChange("entityName", e.target.value)
                  }
                  placeholder="e.g., Binance"
                  className="w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:border-gray-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-900 mb-2">
                  Created By
                </label>
                <input
                  type="text"
                  value={labelForm.createdBy}
                  onChange={(e) =>
                    handleFormChange("createdBy", e.target.value)
                  }
                  placeholder="User Name"
                  className="w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:border-gray-500"
                />
              </div>
            </div>

            <div className="p-4 border-t border-gray-300 flex items-center justify-end space-x-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm text-gray-700 border border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-4 py-2 text-sm bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50"
              >
                {submitting
                  ? isEditMode
                    ? "Saving..."
                    : "Adding..."
                  : isEditMode
                  ? "Save Changes"
                  : "Add Label"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LabelManagement;