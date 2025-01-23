import { useQuery } from "@tanstack/react-query";

type ChartData = {
  TMS: number;
  DID: string;
  tem1: number;
  hum1: number;
};

type FetchChartParams = {
  interval: string;
  activeTab: string;
};

const fetchChartData = async (
  params: FetchChartParams
): Promise<ChartData[]> => {
  // Define a default fallback for rowsToFetch
  const limitMap: { [key: string]: number } = {
    daily: 48,
    weekly: 336,
    monthly: 1344,
  };

  // Use a fallback in case `interval` does not match predefined keys
  const rowsToFetch = limitMap[params.interval] || 48;

  const response = await fetch("/api/proxy/data", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
    // body: JSON.stringify({
    //   location_id: 10,
    //   limit: rowsToFetch,
    // }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch chart data");
  }

  const data = await response.json();

  // Filter data based on activeTab
  return data.data.filter((point: ChartData) => {
    return params.activeTab === "all" || point.DID === params.activeTab;
  });
};

export const useChartData = (interval: string, activeTab: string) => {
  return useQuery<ChartData[], Error>({
    queryKey: ["chartData", interval, activeTab],
    queryFn: () => fetchChartData({ interval, activeTab }),
    refetchOnWindowFocus: false, // Prevent refetching when window is focused
    retry: 1, // Retry once on failure
  });
};
