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

export const fetchAggregate = async (start, end, address) => {
  const params = new URLSearchParams();
  if (start) params.append("start", start);
  if (end) params.append("end", end);
  if (address) params.append("address", address);

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
