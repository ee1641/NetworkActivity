const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "Unknown error" }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const fetchAggregate = async (
  start,
  end,
  address,
  minVolume,
  maxVolume,
) => {
  const params = new URLSearchParams();
  if (start) params.append("start", start);
  if (end) params.append("end", end);
  if (address) params.append("address", address);
  if (minVolume) params.append("minVolume", minVolume);
  if (maxVolume) params.append("maxVolume", maxVolume);

  const response = await fetch(
    `${API_BASE_URL}/api/flows/aggregate?${params.toString()}`,
  );
  return handleResponse(response);
};

export const fetchHotspots = async ({
  start,
  end,
  category,
  sortBy = "transactions",
  page = 0,
  pageSize = 8,
} = {}) => {
  const params = new URLSearchParams();
  if (start) params.append("start", start);
  if (end) params.append("end", end);
  if (category && category !== "All Categories")
    params.append("category", category);
  params.append("sortBy", sortBy);
  params.append("page", page);
  params.append("pageSize", pageSize);

  const response = await fetch(
    `${API_BASE_URL}/api/flows/hotspots?${params.toString()}`,
  );
  return handleResponse(response);
};

export const fetchLargeTransactions = async (
  minValue,
  start,
  end,
  limit = 10,
) => {
  const params = new URLSearchParams();
  if (minValue) params.append("minValue", minValue);
  if (start) params.append("start", start);
  if (end) params.append("end", end);
  params.append("limit", limit);

  const response = await fetch(
    `${API_BASE_URL}/api/flows/large-transactions?${params.toString()}`,
  );
  return handleResponse(response);
};

export const fetchAddressTransactions = async (address, start, end) => {
  const params = new URLSearchParams();
  if (start) params.append("start", start);
  if (end) params.append("end", end);

  const response = await fetch(
    `${API_BASE_URL}/api/flows/address/${address}?${params.toString()}`,
  );
  return handleResponse(response);
};

export const fetchTransaction = async (txId) => {
  const response = await fetch(`${API_BASE_URL}/api/vechain/tx/${txId}`);
  return handleResponse(response);
};

export const fetchAddressSummary = async (address, start, end) => {
  const params = new URLSearchParams();
  if (start) params.append("start", start);
  if (end) params.append("end", end);

  const response = await fetch(
    `${API_BASE_URL}/api/flows/address/${address}/summary?${params.toString()}`,
  );
  return handleResponse(response);
};

export const fetchVolumeTimeSeries = async (start, end) => {
  const params = new URLSearchParams();
  if (start) params.append("start", start);
  if (end) params.append("end", end);

  const response = await fetch(
    `${API_BASE_URL}/api/flows/volume-timeseries?${params.toString()}`,
  );
  return handleResponse(response);
};

export const fetchClusterStats = async (start, end) => {
  const params = new URLSearchParams();
  if (start) params.append("start", start);
  if (end) params.append("end", end);

  const response = await fetch(
    `${API_BASE_URL}/api/flows/cluster-stats?${params.toString()}`,
  );
  return handleResponse(response);
};

export const fetchRiskSummary = async (
  start,
  end,
  anomalyThreshold,
  largeTxThreshold,
  activitySpikePercent,
) => {
  const params = new URLSearchParams();
  if (start) params.append("start", start);
  if (end) params.append("end", end);
  if (anomalyThreshold != null) params.append("anomalyThreshold", anomalyThreshold);
  if (largeTxThreshold != null) params.append("largeTxThreshold", largeTxThreshold);
  if (activitySpikePercent != null) params.append("activitySpikePercent", activitySpikePercent);

  const response = await fetch(
    `${API_BASE_URL}/api/risk/summary?${params.toString()}`,
  );
  return handleResponse(response);
};

export const fetchRiskAnomalyTimeSeries = async (start, end) => {
  const params = new URLSearchParams();
  if (start) params.append("start", start);
  if (end) params.append("end", end);

  const response = await fetch(
    `${API_BASE_URL}/api/risk/anomaly-timeseries?${params.toString()}`,
  );
  return handleResponse(response);
};

export const fetchRiskIncidents = async (start, end, largeTxThreshold, limit = 20) => {
  const params = new URLSearchParams();
  if (start) params.append("start", start);
  if (end) params.append("end", end);
  if (largeTxThreshold != null) params.append("largeTxThreshold", largeTxThreshold);
  params.append("limit", limit);

  const response = await fetch(
    `${API_BASE_URL}/api/risk/incidents?${params.toString()}`,
  );
  return handleResponse(response);
};

export const fetchRiskAlertConfig = async () => {
  const response = await fetch(`${API_BASE_URL}/api/risk/alert-config`);
  return handleResponse(response);
};

export const saveRiskAlertConfig = async (cfg) => {
  const response = await fetch(`${API_BASE_URL}/api/risk/alert-config`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cfg),
  });
  return handleResponse(response);
};

export const fetchClusters = async ({
  search,
  entityType,
  sortBy,
} = {}) => {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (entityType) params.append("entityType", entityType);
  if (sortBy) params.append("sortBy", sortBy);

  const qs = params.toString();
  const response = await fetch(`${API_BASE_URL}/api/clusters${qs ? `?${qs}` : ""}`);
  return handleResponse(response);
};

export const fetchCluster = async (clusterId) => {
  const response = await fetch(`${API_BASE_URL}/api/clusters/${clusterId}`);
  return handleResponse(response);
};

export const updateCluster = async (clusterId, update) => {
  const response = await fetch(`${API_BASE_URL}/api/clusters/${clusterId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(update ?? {}),
  });
  return handleResponse(response);
};

export const createCluster = async (create) => {
  const response = await fetch(`${API_BASE_URL}/api/clusters`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(create ?? {}),
  });
  return handleResponse(response);
};

export const fetchClusterEvents = async (clusterId) => {
  const response = await fetch(`${API_BASE_URL}/api/clusters/${clusterId}/events`);
  return handleResponse(response);
};

export const mergeClusters = async ({ sourceClusterId, targetClusterId }) => {
  const response = await fetch(`${API_BASE_URL}/api/clusters/merge`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ sourceClusterId, targetClusterId }),
  });
  return handleResponse(response);
};
