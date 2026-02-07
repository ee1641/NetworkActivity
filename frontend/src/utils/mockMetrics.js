// Simple mock data generator for network KPIs
export function generateMockMetrics() {
  return {
    totalTransactions: Math.floor(Math.random() * 900000) + 100000,
    activeUsers: Math.floor(Math.random() * 50000) + 10000,
    activeNodes: Math.floor(Math.random() * 500) + 100,
  };
}

// Helper to format large numbers
export function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toLocaleString();
}

// Helper to get status color
export function getStatusColor(status) {
  switch (status) {
    case "healthy":
      return "text-green-400";
    case "degraded":
      return "text-yellow-400";
    case "down":
      return "text-red-400";
    default:
      return "text-gray-400";
  }
}
