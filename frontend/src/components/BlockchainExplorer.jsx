import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import SidebarToggleButton from "./SidebarToggleButton";
import { useSidebarToggle } from "../hooks/useSidebarToggle";
import * as api from "../utils/api";

const RESULTS_PER_PAGE = 10;

const formatTs = (ts) => {
  if (!ts) return "—";
  const d = new Date(ts);
  return d.toISOString().replace("T", " ").substring(0, 19) + " UTC";
};

const formatVet = (v) => {
  if (v == null) return "—";
  if (v >= 1e6) return `${(v / 1e6).toFixed(2)}M VET`;
  if (v >= 1e3) return `${(v / 1e3).toFixed(2)}K VET`;
  return `${v.toFixed(4)} VET`;
};

const shortAddr = (addr) => {
  if (!addr) return "—";
  if (addr.length <= 12) return addr;
  return addr.slice(0, 8) + "..." + addr.slice(-6);
};

const BlockchainExplorer = () => {
  const { isSidebarOpen, toggleSidebar } = useSidebarToggle();
  const [searchParams] = useSearchParams();

  const [searchInput, setSearchInput] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [singleTx, setSingleTx] = useState(null);
  const [summary, setSummary] = useState(null);
  const [searchMode, setSearchMode] = useState("address"); // "address" | "tx"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);
  const [page, setPage] = useState(0);
  const [copiedAddr, setCopiedAddr] = useState(null);

  const inputRef = useRef(null);

  // Auto-search when ?address= is provided in URL
  useEffect(() => {
    const addr = searchParams.get("address");
    if (addr) {
      setSearchInput(addr);
      runSearch(addr);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Address = 0x + 40 hex chars (42 total), Tx hash = 0x + 64 hex chars (66 total)
  const detectInputType = (q) => q.length === 66 ? "tx" : "address";

  const runSearch = async (query) => {
    const q = (query || searchInput).trim();
    if (!q) return;

    const mode = detectInputType(q);
    setSearchMode(mode);
    setLoading(true);
    setError(null);
    setTransactions([]);
    setSingleTx(null);
    setSummary(null);
    setPage(0);
    setSearched(true);

    try {
      if (mode === "tx") {
        const tx = await api.fetchTransaction(q);
        setSingleTx(tx);
      } else {
        const now = new Date();
        const start = new Date(now - 30 * 24 * 3600000).toISOString();
        const end = now.toISOString();

        const [txs, sum] = await Promise.all([
          api.fetchAddressTransactions(q, start, end),
          api.fetchAddressSummary(q, start, end),
        ]);

        setTransactions(txs || []);
        setSummary(sum || null);
      }
    } catch (err) {
      console.error("Explorer search error:", err);
      setError(
        mode === "tx"
          ? "Transaction not found. It may be too old or not on VeChain mainnet."
          : "No data found for this address, or it is not in our database yet.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") runSearch();
  };

  const handleCopy = (addr) => {
    navigator.clipboard.writeText(addr).catch(() => {});
    setCopiedAddr(addr);
    setTimeout(() => setCopiedAddr(null), 1500);
  };

  const totalPages = Math.ceil(transactions.length / RESULTS_PER_PAGE);
  const visibleTxs = transactions.slice(
    page * RESULTS_PER_PAGE,
    (page + 1) * RESULTS_PER_PAGE,
  );

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />

      {/* Header */}
      <header className="bg-white border-b border-gray-300 px-4 md:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <SidebarToggleButton
              isSidebarOpen={isSidebarOpen}
              onToggle={toggleSidebar}
            />
            <h1 className="text-xl font-semibold text-gray-900">
              Blockchain Explorer
            </h1>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Side Panel */}
        <aside className="w-64 bg-white border-r border-gray-300 hidden lg:flex lg:flex-col">
          <div className="flex-1 px-4 py-6">
            {summary && (
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">
                  Address Summary
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="text-xs text-gray-500">Total Inflow</div>
                    <div className="font-semibold text-gray-900">
                      {formatVet(summary.totalInflow)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Total Outflow</div>
                    <div className="font-semibold text-gray-900">
                      {formatVet(summary.totalOutflow)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Incoming Txs</div>
                    <div className="font-semibold text-gray-900">
                      {summary.incomingTxCount?.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Outgoing Txs</div>
                    <div className="font-semibold text-gray-900">
                      {summary.outgoingTxCount?.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Gas Fees (VTHO)</div>
                    <div className="font-semibold text-gray-900">
                      {summary.totalGasFees?.toFixed(4)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">
                Tips
              </h3>
              <div className="text-xs text-gray-600 space-y-2">
                <div>• Enter a VeChain wallet or contract address to see its transaction history</div>
                <div>• Results show the last 30 days of activity</div>
                <div>• New data appears as the ingestion service collects blocks</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="p-4 md:p-6">
            {/* Search Bar */}
            <div className="bg-white border border-gray-300 p-6 mb-6">
              <div className="mb-4">
                <div className="flex items-center space-x-2 border-2 border-gray-900 bg-white">
                  <i className="fas fa-search text-gray-600 ml-4" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter a wallet address (0x...40 chars) or transaction hash (0x...64 chars)"
                    className="flex-1 px-2 py-3 text-sm text-gray-900 placeholder-gray-400 bg-white outline-none font-mono"
                  />
                  <button
                    onClick={() => runSearch()}
                    disabled={loading || !searchInput.trim()}
                    className="px-6 py-3 bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <i className="fas fa-spinner fa-spin" />
                    ) : (
                      "Search"
                    )}
                  </button>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                Paste a <strong>wallet address</strong> (42 chars) to see its transaction history, or a <strong>transaction hash</strong> (66 chars) to inspect a specific transaction.
              </div>
            </div>

            {/* Results */}
            {!searched && !loading && (
              <div className="bg-white border border-gray-300 p-12 text-center text-gray-400">
                <i className="fas fa-search text-4xl mb-4 block" />
                <div className="text-sm">Enter a VeChain address above to explore transactions</div>
              </div>
            )}

            {loading && (
              <div className="bg-white border border-gray-300 p-12 text-center text-gray-500">
                <i className="fas fa-spinner fa-spin text-2xl mb-3 block" />
                <div className="text-sm">Searching...</div>
              </div>
            )}

            {error && !loading && (
              <div className="bg-white border border-gray-300 p-8 text-center">
                <div className="text-red-500 mb-2">{error}</div>
                <div className="text-xs text-gray-400">
                  Make sure the address is correct and has activity within the last 30 days.
                </div>
              </div>
            )}

            {searched && !loading && !error && searchMode === "address" && transactions.length === 0 && (
              <div className="bg-white border border-gray-300 p-8 text-center text-gray-500">
                <div>No transactions found for this address in the last 30 days.</div>
                <div className="text-xs text-gray-400 mt-2">
                  This address may not have any activity in our database yet. Data is collected as new blocks arrive.
                </div>
              </div>
            )}

            {singleTx && !loading && !error && (
              <div className="bg-white border border-gray-300">
                <div className="px-6 py-4 border-b border-gray-300">
                  <h2 className="text-lg font-semibold text-gray-900">Transaction Details</h2>
                  <p className="text-xs text-gray-500 font-mono mt-1 break-all">{singleTx.id}</p>
                </div>
                <div className="p-6 space-y-4 text-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Origin (From)</div>
                      <div className="font-mono text-gray-900 break-all flex items-center gap-2">
                        {singleTx.origin ?? "—"}
                        {singleTx.origin && (
                          <button onClick={() => handleCopy(singleTx.origin)} title="Copy">
                            <i className={`fas ${copiedAddr === singleTx.origin ? "fa-check text-gray-900" : "fa-copy text-gray-400 hover:text-gray-600"}`} />
                          </button>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Gas Used</div>
                      <div className="text-gray-900">{singleTx.gasUsed?.toLocaleString() ?? "—"}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Status</div>
                      <span className={`px-2 py-1 text-white text-xs font-semibold ${singleTx.reverted ? "bg-red-600" : "bg-gray-900"}`}>
                        {singleTx.reverted ? "Reverted" : "Success"}
                      </span>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Gas Fee (VTHO)</div>
                      <div className="text-gray-900">{singleTx.paid ? (parseInt(singleTx.paid, 16) / 1e18).toFixed(6) + " VTHO" : "—"}</div>
                    </div>
                  </div>

                  {Array.isArray(singleTx.clauses) && singleTx.clauses.length > 0 && (
                    <div>
                      <div className="text-xs font-semibold text-gray-500 uppercase mb-2">
                        Clauses ({singleTx.clauses.length})
                      </div>
                      <div className="space-y-2">
                        {singleTx.clauses.map((clause, i) => (
                          <div key={i} className="border border-gray-200 p-3 bg-gray-50">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                              <div>
                                <div className="text-gray-500 mb-1">To</div>
                                <div className="font-mono text-gray-900 break-all">{clause.to ?? "Contract Deploy"}</div>
                              </div>
                              <div>
                                <div className="text-gray-500 mb-1">Value (VET)</div>
                                <div className="text-gray-900">
                                  {clause.value && clause.value !== "0x0"
                                    ? (parseInt(clause.value, 16) / 1e18).toFixed(4) + " VET"
                                    : "0 VET"}
                                </div>
                              </div>
                              <div>
                                <div className="text-gray-500 mb-1">Data</div>
                                <div className="font-mono text-gray-900 truncate" title={clause.data || "0x"}>
                                  {!clause.data || clause.data === "0x"
                                    ? <span className="text-gray-400">0x (empty)</span>
                                    : clause.data.slice(0, 22) + "…"}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {transactions.length > 0 && !loading && (
              <div className="bg-white border border-gray-300">
                {/* Results Header */}
                <div className="px-6 py-4 border-b border-gray-300 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Transaction History
                    </h2>
                    <p className="text-xs text-gray-600 mt-1">
                      {transactions.length.toLocaleString()} transactions found (last 30 days)
                    </p>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-300">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                          Timestamp
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                          Tx Hash
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                          From
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                          To
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                          Value (VET)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {visibleTxs.map((tx) => (
                        <tr
                          key={tx.id ?? tx.txHash}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-6 py-4 text-xs text-gray-900 whitespace-nowrap">
                            {formatTs(tx.timestamp)}
                          </td>
                          <td className="px-6 py-4 text-xs font-mono text-gray-900">
                            <div className="flex items-center space-x-2">
                              <span className="truncate max-w-[100px]">
                                {shortAddr(tx.txHash)}
                              </span>
                              {tx.txHash && (
                                <button
                                  onClick={() => handleCopy(tx.txHash)}
                                  title="Copy"
                                >
                                  <i
                                    className={`fas ${copiedAddr === tx.txHash ? "fa-check text-gray-900" : "fa-copy text-gray-400 hover:text-gray-600"}`}
                                  />
                                </button>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-xs font-mono text-gray-900">
                            <div className="flex items-center space-x-2">
                              <span className="truncate max-w-[100px]">
                                {shortAddr(tx.fromAddress)}
                              </span>
                              {tx.fromAddress && (
                                <button
                                  onClick={() => handleCopy(tx.fromAddress)}
                                  title="Copy"
                                >
                                  <i
                                    className={`fas ${copiedAddr === tx.fromAddress ? "fa-check text-gray-900" : "fa-copy text-gray-400 hover:text-gray-600"}`}
                                  />
                                </button>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-xs font-mono text-gray-900">
                            <div className="flex items-center space-x-2">
                              <span className="truncate max-w-[100px]">
                                {shortAddr(tx.toAddress)}
                              </span>
                              {tx.toAddress && (
                                <button
                                  onClick={() => handleCopy(tx.toAddress)}
                                  title="Copy"
                                >
                                  <i
                                    className={`fas ${copiedAddr === tx.toAddress ? "fa-check text-gray-900" : "fa-copy text-gray-400 hover:text-gray-600"}`}
                                  />
                                </button>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-xs text-gray-900">
                            {formatVet(tx.value)}
                          </td>
                          <td className="px-6 py-4 text-xs">
                            <span
                              className={`px-2 py-1 text-white font-semibold ${
                                tx.status === "reverted"
                                  ? "bg-red-600"
                                  : "bg-gray-900"
                              }`}
                            >
                              {tx.status ?? "—"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="px-6 py-4 border-t border-gray-300 flex items-center justify-between text-xs">
                    <div className="text-gray-600">
                      Showing {page * RESULTS_PER_PAGE + 1}–{Math.min((page + 1) * RESULTS_PER_PAGE, transactions.length)} of{" "}
                      {transactions.length.toLocaleString()} results
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        disabled={page === 0}
                        onClick={() => setPage((p) => p - 1)}
                        className="px-3 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <i className="fas fa-chevron-left" />
                      </button>
                      <span className="px-3 py-2 text-gray-700">
                        Page {page + 1} of {totalPages}
                      </span>
                      <button
                        disabled={page >= totalPages - 1}
                        onClick={() => setPage((p) => p + 1)}
                        className="px-3 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <i className="fas fa-chevron-right" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default BlockchainExplorer;
