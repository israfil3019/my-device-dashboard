import { useQuery } from "@tanstack/react-query";
import { ChartData } from "../types/chart.types";

type FetchChartParams = {
  interval: string;
};

const fetchChartData = async (
  params: FetchChartParams
): Promise<ChartData[]> => {
  // Map intervals to fetch limits
  const limitMap: { [key: string]: number } = {
    daily: 48,
    weekly: 336,
    monthly: 1344,
  };

  const rowsToFetch = limitMap[params.interval] || 48;

  const response = await fetch("/api/proxy/data", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      location_id: 10,
      limit: rowsToFetch,
    }),
    credentials: "include", // Include cookies in the request
  });

  if (!response.ok) {
    throw new Error("Failed to fetch chart data");
  }

  const data = await response.json();
  return data.data;
};

export const useChartData = (interval: string) => {
  return useQuery<ChartData[], Error>({
    queryKey: ["chartData", interval],
    queryFn: () => fetchChartData({ interval }),
    enabled: !!interval, // Fetch only when interval is defined
    staleTime: 5 * 60 * 1000, // Data is fresh for 5 minutes
    refetchOnWindowFocus: false, // Disable refetching on window focus
    retry: 1, // Retry once on failure
  });
};
