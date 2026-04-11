import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "./Sidebar";
import SidebarToggleButton from "./SidebarToggleButton";
import { useSidebarToggle } from "../hooks/useSidebarToggle";
import {
  createCluster,
  addWalletToCluster,
  deleteCluster,
  fetchClusterEvents,
  fetchClusters,
  mergeClusters,
  updateCluster,
} from "../utils/api";

const WalletClusteringAnalysis = () => {
  const { isSidebarOpen, toggleSidebar } = useSidebarToggle();
  const [clusters, setClusters] = useState([]);
  const [selectedClusterId, setSelectedClusterId] = useState(null);
  const [loadingClusters, setLoadingClusters] = useState(false);
  const [clustersError, setClustersError] = useState(null);

  const [search, setSearch] = useState("");
  const [activityFilter, setActivityFilter] = useState("All Activity Levels");
  const [sortBy, setSortBy] = useState("Sort by Name");

  const [draftName, setDraftName] = useState("");
  const [draftEntityType, setDraftEntityType] = useState("Other");
  const [draftRiskLevel, setDraftRiskLevel] = useState(0.5);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [eventsError, setEventsError] = useState(null);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createEntityType, setCreateEntityType] = useState("Other");
  const [createRiskLevel, setCreateRiskLevel] = useState(0.5);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState(null);

  const [isMergeOpen, setIsMergeOpen] = useState(false);
  const [mergeSourceId, setMergeSourceId] = useState("");
  const [merging, setMerging] = useState(false);
  const [mergeError, setMergeError] = useState(null);

  const [walletToAdd, setWalletToAdd] = useState("");
  const [addingWallet, setAddingWallet] = useState(false);
  const [addWalletError, setAddWalletError] = useState(null);
  const [addWalletSuccess, setAddWalletSuccess] = useState(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const selectedCluster = useMemo(() => {
    if (selectedClusterId == null) return null;
    return clusters.find((c) => String(c.clusterId) === String(selectedClusterId)) ?? null;
  }, [clusters, selectedClusterId]);

  const riskToActivity = (riskLevel) => {
    const r = Number.isFinite(Number(riskLevel)) ? Number(riskLevel) : 0;
    if (r >= 0.67) return "High Activity";
    if (r >= 0.34) return "Medium Activity";
    return "Low Activity";
  };

  const riskToBadge = (riskLevel) => {
    const activity = riskToActivity(riskLevel);
    if (activity === "High Activity") return { label: "High", className: "bg-gray-800" };
    if (activity === "Medium Activity") return { label: "Medium", className: "bg-gray-700" };
    return { label: "Low", className: "bg-gray-600" };
  };

  const uiSortKeyToApi = (ui) => {
    switch (ui) {
      case "Sort by Risk":
        return "risk";
      case "Sort by Type":
        return "type";
      case "Sort by Name":
      default:
        return "name";
    }
  };

  useEffect(() => {
    let cancelled = false;
    setLoadingClusters(true);
    setClustersError(null);

    fetchClusters({
      search: search?.trim() || undefined,
      sortBy: uiSortKeyToApi(sortBy),
    })
      .then((data) => {
        if (cancelled) return;
        setClusters(Array.isArray(data) ? data : []);
        if ((Array.isArray(data) ? data : []).length > 0 && selectedClusterId == null) {
          setSelectedClusterId((Array.isArray(data) ? data : [])[0].clusterId);
        }
      })
      .catch((e) => {
        if (cancelled) return;
        setClustersError(e?.message || "Failed to load clusters");
        setClusters([]);
      })
      .finally(() => {
        if (cancelled) return;
        setLoadingClusters(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, sortBy]);

  const filteredClusters = useMemo(() => {
    if (activityFilter === "All Activity Levels") return clusters;
    return clusters.filter((c) => riskToActivity(c.riskLevel) === activityFilter);
  }, [clusters, activityFilter]);

  useEffect(() => {
    if (!selectedCluster) return;
    setDraftName(selectedCluster.name ?? "");
    setDraftEntityType(selectedCluster.entityType ?? "Other");
    setDraftRiskLevel(
      Number.isFinite(Number(selectedCluster.riskLevel)) ? Number(selectedCluster.riskLevel) : 0.5,
    );
    setSaveError(null);
  }, [selectedCluster]);

  useEffect(() => {
    let cancelled = false;
    if (!selectedClusterId) {
      setEvents([]);
      setEventsError(null);
      setLoadingEvents(false);
      return undefined;
    }

    setLoadingEvents(true);
    setEventsError(null);
    fetchClusterEvents(selectedClusterId)
      .then((data) => {
        if (cancelled) return;
        setEvents(Array.isArray(data) ? data : []);
      })
      .catch((e) => {
        if (cancelled) return;
        setEvents([]);
        setEventsError(e?.message || "Failed to load history");
      })
      .finally(() => {
        if (cancelled) return;
        setLoadingEvents(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedClusterId]);

  const onSave = async () => {
    if (!selectedCluster) return;
    setSaving(true);
    setSaveError(null);
    try {
      const updated = await updateCluster(selectedCluster.clusterId, {
        name: draftName,
        entityType: draftEntityType,
        riskLevel: Number(draftRiskLevel),
      });

      setClusters((prev) =>
        prev.map((c) =>
          String(c.clusterId) === String(updated.clusterId) ? updated : c,
        ),
      );

      const ev = await fetchClusterEvents(selectedCluster.clusterId);
      setEvents(Array.isArray(ev) ? ev : []);
    } catch (e) {
      setSaveError(e?.message || "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const onCancel = () => {
    if (!selectedCluster) return;
    setDraftName(selectedCluster.name ?? "");
    setDraftEntityType(selectedCluster.entityType ?? "Other");
    setDraftRiskLevel(
      Number.isFinite(Number(selectedCluster.riskLevel)) ? Number(selectedCluster.riskLevel) : 0.5,
    );
    setSaveError(null);
  };

  const openCreate = () => {
    setCreateName("");
    setCreateEntityType("Other");
    setCreateRiskLevel(0.5);
    setCreateError(null);
    setIsCreateOpen(true);
  };

  const onCreate = async () => {
    setCreating(true);
    setCreateError(null);
    try {
      const created = await createCluster({
        name: createName?.trim() || null,
        entityType: createEntityType,
        riskLevel: Number(createRiskLevel),
      });

      const refreshed = await fetchClusters({
        search: search?.trim() || undefined,
        sortBy: uiSortKeyToApi(sortBy),
      });
      setClusters(Array.isArray(refreshed) ? refreshed : []);
      setSelectedClusterId(created.clusterId);
      setIsCreateOpen(false);
    } catch (e) {
      setCreateError(e?.message || "Failed to create cluster");
    } finally {
      setCreating(false);
    }
  };

  const openMerge = () => {
    setMergeSourceId("");
    setMergeError(null);
    setIsMergeOpen(true);
  };

  const onMerge = async () => {
    if (!selectedCluster) return;
    if (!mergeSourceId) {
      setMergeError("Pick a source cluster to merge into this one.");
      return;
    }
    setMerging(true);
    setMergeError(null);
    try {
      const merged = await mergeClusters({
        sourceClusterId: Number(mergeSourceId),
        targetClusterId: Number(selectedCluster.clusterId),
      });

      const refreshed = await fetchClusters({
        search: search?.trim() || undefined,
        sortBy: uiSortKeyToApi(sortBy),
      });
      setClusters(Array.isArray(refreshed) ? refreshed : []);
      setSelectedClusterId(merged.clusterId);
      setIsMergeOpen(false);
    } catch (e) {
      setMergeError(e?.message || "Failed to merge clusters");
    } finally {
      setMerging(false);
    }
  };

  const onExportJson = () => {
    if (!selectedCluster) return;
    const payload = {
      cluster: selectedCluster,
      events,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cluster-${selectedCluster.clusterId}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const onAddWallet = async () => {
    if (!selectedCluster) return;
    setAddingWallet(true);
    setAddWalletError(null);
    setAddWalletSuccess(null);
    try {
      await addWalletToCluster(selectedCluster.clusterId, walletToAdd);
      setAddWalletSuccess("Wallet added to cluster.");
      setWalletToAdd("");
      const ev = await fetchClusterEvents(selectedCluster.clusterId);
      setEvents(Array.isArray(ev) ? ev : []);
    } catch (e) {
      setAddWalletError(e?.message || "Failed to add wallet");
    } finally {
      setAddingWallet(false);
    }
  };

  const openDelete = () => {
    setDeleteError(null);
    setIsDeleteOpen(true);
  };

  const onConfirmDelete = async () => {
    if (!selectedCluster) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteCluster(selectedCluster.clusterId);
      const refreshed = await fetchClusters({
        search: search?.trim() || undefined,
        sortBy: uiSortKeyToApi(sortBy),
      });
      const nextClusters = Array.isArray(refreshed) ? refreshed : [];
      setClusters(nextClusters);

      const nextSelected =
        nextClusters.length > 0 ? nextClusters[0].clusterId : null;
      setSelectedClusterId(nextSelected);
      setIsDeleteOpen(false);
    } catch (e) {
      setDeleteError(e?.message || "Failed to delete cluster");
    } finally {
      setDeleting(false);
    }
  };

  const formatEventTs = (iso) => {
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return String(iso ?? "");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />

      <div className="flex-1 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-gray-300 px-4 md:px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <SidebarToggleButton
              isSidebarOpen={isSidebarOpen}
              onToggle={toggleSidebar}
            />
            <div className="w-8 h-8 bg-gray-800 flex items-center justify-center">
              <i className="fas fa-project-diagram text-white text-sm" />
            </div>
            <span className="text-lg font-semibold text-gray-900 hidden sm:block">
              Wallet Clustering Analysis
            </span>
          </div>

          <div className="flex items-center space-x-3 md:space-x-6">
            
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
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2 border border-gray-300 px-3 py-2 bg-white">
              <i className="fas fa-filter text-gray-600 text-sm" />
              <select
                className="text-sm text-gray-700 bg-transparent border-none outline-none"
                value={activityFilter}
                onChange={(e) => setActivityFilter(e.target.value)}
              >
                <option>All Activity Levels</option>
                <option>High Activity</option>
                <option>Medium Activity</option>
                <option>Low Activity</option>
              </select>
            </div>

            <div className="flex items-center space-x-2 border border-gray-300 px-3 py-2 bg-white">
              <i className="fas fa-sort text-gray-600 text-sm" />
              <select
                className="text-sm text-gray-700 bg-transparent border-none outline-none"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option>Sort by Name</option>
                <option>Sort by Type</option>
                <option>Sort by Risk</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              className="px-4 py-2 bg-white border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
              onClick={openCreate}
            >
              <i className="fas fa-plus" />
              <span>New Cluster</span>
            </button>
          </div>
        </div>
      </div>

      {isCreateOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-gray-300 w-full max-w-lg p-5">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">Create New Cluster</h3>
              <button
                className="text-gray-600 hover:text-gray-900"
                onClick={() => setIsCreateOpen(false)}
                disabled={creating}
                aria-label="Close"
              >
                <i className="fas fa-times" />
              </button>
            </div>

            {createError && (
              <div className="text-sm text-red-700 bg-red-50 border border-red-200 px-3 py-2 mb-3">
                {createError}
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-gray-600 mb-1 block">Cluster Label</label>
                <input
                  type="text"
                  value={createName}
                  onChange={(e) => setCreateName(e.target.value)}
                  disabled={creating}
                  className="w-full px-3 py-2 border border-gray-300 text-sm text-gray-900 focus:outline-none focus:border-gray-500"
                  placeholder="e.g. Exchange Cluster A"
                />
              </div>

              <div>
                <label className="text-gray-600 mb-1 block">Category</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 text-sm text-gray-900 focus:outline-none focus:border-gray-500"
                  value={createEntityType}
                  onChange={(e) => setCreateEntityType(e.target.value)}
                  disabled={creating}
                >
                  <option>Exchange</option>
                  <option>DeFi Protocol</option>
                  <option>NFT Marketplace</option>
                  <option>Whale Group</option>
                  <option>Retail Investors</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="text-gray-600 mb-1 block">Initial Risk (0–100%)</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={createRiskLevel}
                  onChange={(e) => setCreateRiskLevel(e.target.value)}
                  disabled={creating}
                  className="w-full"
                />
                <div className="flex items-center justify-between text-gray-600 mt-1">
                  <span>{riskToActivity(createRiskLevel)}</span>
                  <span className="font-semibold text-gray-900">
                    {Math.round(Number(createRiskLevel) * 100)}%
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  className="flex-1 px-4 py-2 bg-gray-900 text-white text-sm hover:bg-gray-800 disabled:opacity-50"
                  onClick={onCreate}
                  disabled={creating}
                >
                  {creating ? "Creating…" : "Create"}
                </button>
                <button
                  className="px-4 py-2 bg-white border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  onClick={() => setIsCreateOpen(false)}
                  disabled={creating}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isMergeOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-gray-300 w-full max-w-lg p-5">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">Merge Clusters</h3>
              <button
                className="text-gray-600 hover:text-gray-900"
                onClick={() => setIsMergeOpen(false)}
                disabled={merging}
                aria-label="Close"
              >
                <i className="fas fa-times" />
              </button>
            </div>

            <div className="text-xs text-gray-700 mb-3">
              Target cluster:{" "}
              <span className="font-semibold">
                {selectedCluster?.name || `Cluster #${selectedCluster?.clusterId}`}
              </span>
            </div>

            {mergeError && (
              <div className="text-sm text-red-700 bg-red-50 border border-red-200 px-3 py-2 mb-3">
                {mergeError}
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-gray-600 mb-1 block">
                  Source cluster (will be deleted)
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 text-sm text-gray-900 focus:outline-none focus:border-gray-500"
                  value={mergeSourceId}
                  onChange={(e) => setMergeSourceId(e.target.value)}
                  disabled={merging}
                >
                  <option value="">Select…</option>
                  {clusters
                    .filter((c) => String(c.clusterId) !== String(selectedCluster?.clusterId))
                    .map((c) => (
                      <option key={c.clusterId} value={c.clusterId}>
                        {c.name || `Cluster #${c.clusterId}`} (#{c.clusterId})
                      </option>
                    ))}
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  className="flex-1 px-4 py-2 bg-gray-900 text-white text-sm hover:bg-gray-800 disabled:opacity-50"
                  onClick={onMerge}
                  disabled={merging || !selectedCluster}
                >
                  {merging ? "Merging…" : "Merge"}
                </button>
                <button
                  className="px-4 py-2 bg-white border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  onClick={() => setIsMergeOpen(false)}
                  disabled={merging}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isDeleteOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-gray-300 w-full max-w-lg p-5">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">Delete Cluster</h3>
              <button
                className="text-gray-600 hover:text-gray-900"
                onClick={() => setIsDeleteOpen(false)}
                disabled={deleting}
                aria-label="Close"
              >
                <i className="fas fa-times" />
              </button>
            </div>

            <div className="text-sm text-gray-700 mb-3">
              This will permanently delete{" "}
              <span className="font-semibold">
                {selectedCluster?.name || `Cluster #${selectedCluster?.clusterId}`}
              </span>{" "}
              and its wallet links.
            </div>

            {deleteError && (
              <div className="text-sm text-red-700 bg-red-50 border border-red-200 px-3 py-2 mb-3">
                {deleteError}
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                className="flex-1 px-4 py-2 bg-red-700 text-white text-sm hover:bg-red-800 disabled:opacity-50"
                onClick={onConfirmDelete}
                disabled={deleting || !selectedCluster}
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
              <button
                className="px-4 py-2 bg-white border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                onClick={() => setIsDeleteOpen(false)}
                disabled={deleting}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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
                {filteredClusters.length} total
              </span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loadingClusters && (
              <div className="px-4 py-3 text-sm text-gray-600">Loading clusters…</div>
            )}
            {clustersError && (
              <div className="px-4 py-3 text-sm text-red-700 bg-red-50 border-b border-red-200">
                {clustersError}
              </div>
            )}
            {!loadingClusters && !clustersError && filteredClusters.length === 0 && (
              <div className="px-4 py-3 text-sm text-gray-600">No clusters found.</div>
            )}
            {filteredClusters.map((cluster) => {
              const isSelected =
                selectedClusterId != null &&
                String(cluster.clusterId) === String(selectedClusterId);
              const badge = riskToBadge(cluster.riskLevel);
              return (
                <div key={cluster.clusterId} className="border-b border-gray-300">
                  <div
                    className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${isSelected ? "bg-gray-100" : ""}`}
                    onClick={() => setSelectedClusterId(cluster.clusterId)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        setSelectedClusterId(cluster.clusterId);
                      }
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2 flex-1">
                        <div className="w-3 h-3 bg-gray-700" />
                        <span className="text-sm font-semibold text-gray-900">
                          {cluster.name || `Cluster #${cluster.clusterId}`}
                        </span>
                      </div>
                      <span className={`text-xs text-white px-2 py-1 ${badge.className}`}>
                        {badge.label}
                      </span>
                    </div>

                    <div className="ml-5 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Type</span>
                        <span className="font-semibold text-gray-900 bg-gray-200 px-2 py-1">
                          {cluster.entityType || "Other"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Risk</span>
                        <span className="font-semibold text-gray-900">
                          {Math.round(
                            (Number.isFinite(Number(cluster.riskLevel))
                              ? Number(cluster.riskLevel)
                              : 0) * 100,
                          )}
                          %
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="flex-1 bg-gray-200 h-1">
                          <div
                            className="bg-gray-800 h-1"
                            style={{
                              width: `${Math.round(
                                (Number.isFinite(Number(cluster.riskLevel))
                                  ? Number(cluster.riskLevel)
                                  : 0) * 100,
                              )}%`,
                            }}
                          />
                        </div>
                        <span className="text-gray-600">
                          {Math.round(
                            (Number.isFinite(Number(cluster.riskLevel))
                              ? Number(cluster.riskLevel)
                              : 0) * 100,
                          )}
                          %
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
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
                  {selectedCluster?.name || "Select a cluster"}
                </h2>
                <span className="text-xs text-white bg-gray-800 px-2 py-1">
                  {selectedCluster ? riskToActivity(selectedCluster.riskLevel) : "—"}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  className="px-3 py-2 bg-white border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  onClick={openMerge}
                  disabled={!selectedCluster}
                >
                  <i className="fas fa-object-group mr-2" />
                  Merge
                </button>
                <button
                  className="px-3 py-2 bg-white border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  onClick={onExportJson}
                  disabled={!selectedCluster}
                >
                  <i className="fas fa-download mr-2" />
                  Export
                </button>
                <button
                  className="px-3 py-2 bg-white border border-red-300 text-sm text-red-700 hover:bg-red-50 disabled:opacity-50"
                  onClick={openDelete}
                  disabled={!selectedCluster}
                >
                  <i className="fas fa-trash mr-2" />
                  Delete
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
                <div className="pb-3 border-b border-gray-200">
                  <label className="text-gray-600 mb-1 block">
                    Add Wallet Address to Cluster
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={walletToAdd}
                      onChange={(e) => setWalletToAdd(e.target.value)}
                      disabled={!selectedCluster || addingWallet}
                      placeholder="0x..."
                      className="flex-1 px-3 py-2 border border-gray-300 text-sm text-gray-900 focus:outline-none focus:border-gray-500"
                    />
                    <button
                      className="px-4 py-2 bg-gray-900 text-white text-sm hover:bg-gray-800 disabled:opacity-50"
                      onClick={onAddWallet}
                      disabled={!selectedCluster || addingWallet || !walletToAdd.trim()}
                    >
                      {addingWallet ? "Adding…" : "Add"}
                    </button>
                  </div>
                  {addWalletError && (
                    <div className="mt-2 text-sm text-red-700 bg-red-50 border border-red-200 px-3 py-2">
                      {addWalletError}
                    </div>
                  )}
                  {addWalletSuccess && (
                    <div className="mt-2 text-sm text-green-700 bg-green-50 border border-green-200 px-3 py-2">
                      {addWalletSuccess}
                    </div>
                  )}
                </div>
                {saveError && (
                  <div className="text-sm text-red-700 bg-red-50 border border-red-200 px-3 py-2">
                    {saveError}
                  </div>
                )}
                <div>
                  <label className="text-gray-600 mb-1 block">
                    Cluster Label
                  </label>
                  <input
                    type="text"
                    value={draftName}
                    onChange={(e) => setDraftName(e.target.value)}
                    disabled={!selectedCluster || saving}
                    className="w-full px-3 py-2 border border-gray-300 text-sm text-gray-900 focus:outline-none focus:border-gray-500"
                  />
                </div>

                <div>
                  <label className="text-gray-600 mb-1 block">Category</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 text-sm text-gray-900 focus:outline-none focus:border-gray-500"
                    value={draftEntityType}
                    onChange={(e) => setDraftEntityType(e.target.value)}
                    disabled={!selectedCluster || saving}
                  >
                    <option>Exchange</option>
                    <option>DeFi Protocol</option>
                    <option>NFT Marketplace</option>
                    <option>Whale Group</option>
                    <option>Retail Investors</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-gray-600 mb-1 block">
                    Activity / Risk (0–100%)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={draftRiskLevel}
                    onChange={(e) => setDraftRiskLevel(e.target.value)}
                    disabled={!selectedCluster || saving}
                    className="w-full"
                  />
                  <div className="flex items-center justify-between text-gray-600 mt-1">
                    <span>{riskToActivity(draftRiskLevel)}</span>
                    <span className="font-semibold text-gray-900">
                      {Math.round(Number(draftRiskLevel) * 100)}%
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    className="flex-1 px-4 py-2 bg-gray-900 text-white text-sm hover:bg-gray-800 disabled:opacity-50"
                    onClick={onSave}
                    disabled={!selectedCluster || saving}
                  >
                    {saving ? "Saving…" : "Save Changes"}
                  </button>
                  <button
                    className="px-4 py-2 bg-white border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    onClick={onCancel}
                    disabled={!selectedCluster || saving}
                  >
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
              {!selectedCluster && (
                <div className="text-sm text-gray-600">Select a cluster to view history.</div>
              )}
              {selectedCluster && loadingEvents && (
                <div className="text-sm text-gray-600">Loading history…</div>
              )}
              {selectedCluster && eventsError && (
                <div className="text-sm text-red-700 bg-red-50 border border-red-200 px-3 py-2">
                  {eventsError}
                </div>
              )}
              {selectedCluster && !loadingEvents && !eventsError && events.length === 0 && (
                <div className="text-sm text-gray-600">No history yet.</div>
              )}
              {selectedCluster &&
                events.map((ev, idx) => {
                  const isFirst = idx === 0;
                  return (
                    <div key={ev.id ?? `${ev.eventType}-${ev.eventTs}-${idx}`} className="flex items-start space-x-3">
                      <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full ${ev.eventType === "CREATED" ? "bg-gray-800" : "bg-gray-600"}`} />
                        {!isFirst && <div className="w-0.5 h-full bg-gray-300 mt-1" />}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-gray-900">
                            {ev.eventType === "CREATED" ? "Cluster Created" : "Cluster Updated"}
                          </span>
                          <span className="text-gray-500">{formatEventTs(ev.eventTs)}</span>
                        </div>
                        <p className="text-gray-600">{ev.summary}</p>
                        {ev.actor && (
                          <span className="text-gray-500 mt-1 inline-block">by {ev.actor}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </main>
      </div>
      </div>
    </div>
  );
};

export default WalletClusteringAnalysis;
