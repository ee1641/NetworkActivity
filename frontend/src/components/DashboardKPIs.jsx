import { useState, useEffect } from "react";
import KPICard from "./KPICard";
import { generateMockMetrics } from "../utils/mockMetrics";

export default function DashboardKPIs() {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    setMetrics(generateMockMetrics());
  }, []);

  if (!metrics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-slate-800/30 border border-slate-700/30 rounded-lg p-6 h-32 animate-pulse"
          ></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <KPICard
        title="Total Transactions"
        value={metrics.totalTransactions.toLocaleString()}
        icon="📊"
      />

      <KPICard
        title="Active Users"
        value={metrics.activeUsers.toLocaleString()}
        icon="👥"
      />

      <KPICard title="Active Nodes" value={metrics.activeNodes} icon="🌐" />
    </div>
  );
}
