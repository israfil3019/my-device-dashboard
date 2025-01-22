"use client";

import { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import DeviceTabs from "./DeviceTabs";
import Filters from "./Filters";
import { useTabsContext } from "@/context/TabsContext";

export default function ChartPage() {
  const [chartData, setChartData] = useState<any[]>([]);
  const [compareMode, setCompareMode] = useState<boolean>(false);
  const { activeTab, setActiveTab, interval, setInterval } = useTabsContext();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMockData = async () => {
      try {
        setIsLoading(true);

        const response = await fetch("/mock/dataset.json");
        const jsonResponse = await response.json();

        const mockData = jsonResponse.data;
        let rowsToFetch = 0;
        if (interval === "daily") {
          rowsToFetch = 4;
        } else if (interval === "weekly") {
          rowsToFetch = 7 * 4;
        } else if (interval === "monthly") {
          rowsToFetch = 4 * 7 * 4;
        }
        const filteredData = mockData.slice(0, rowsToFetch);
        setChartData(filteredData);
      } catch (err) {
        setError("Failed to load mock data");
        console.error("Error loading mock data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMockData();
  }, [activeTab, interval]);

  if (isLoading) return <p>Loading chart data...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const getFilteredData = (deviceId: string) => {
    console.log("deviceId", deviceId);
    return chartData.filter((point: any) => {
      const isDeviceMatch = deviceId === "all" || point.DID === deviceId;
      return isDeviceMatch;
    });
  };

  const getChartOptions = (data: any[], deviceId?: string) => {
    const sortedData = data.sort((a: any, b: any) => a.TMS - b.TMS);

    const groupedData = sortedData.reduce((acc: any, point: any) => {
      const pointDate = new Date(point.TMS * 1000);
      const formattedDate = new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
      }).format(pointDate);

      if (!acc[formattedDate]) {
        acc[formattedDate] = { tem1: point.tem1, hum1: point.hum1 };
      }
      return acc;
    }, {});

    const xAxisData = Object.keys(groupedData);
    const temperatureData = Object.values(groupedData).map((d: any) => d.tem1);
    const humidityData = Object.values(groupedData).map((d: any) => d.hum1);

    return {
      tooltip: { trigger: "axis" },
      legend: { data: ["Temperature", "Humidity"] },
      xAxis: {
        type: "category",
        data: xAxisData,
      },
      yAxis: { type: "value" },
      series: [
        {
          name: `${deviceId || "All"} Temperature`,
          type: "line",
          data: temperatureData,
          markPoint: {
            data: [
              { type: "max", name: "Max" },
              { type: "min", name: "Min" },
            ],
            label: {
              show: true,
              formatter: "{c}",
            },
          },
        },
        {
          name: `${deviceId || "All"} Humidity`,
          type: "line",
          data: humidityData,
        },
      ],
    };
  };

  const getCombinedChartOptions = () => {
    const allTimestamps = [
      ...new Set([
        ...getFilteredData("25_225").map((point: any) => point.TMS),
        ...getFilteredData("25_226").map((point: any) => point.TMS),
      ]),
    ].sort((a, b) => a - b);

    const data225 = allTimestamps.map((timestamp) => {
      const point = getFilteredData("25_225").find(
        (p: any) => p.TMS === timestamp
      );
      return point ? point.tem1 : null;
    });

    const humidity225 = allTimestamps.map((timestamp) => {
      const point = getFilteredData("25_225").find(
        (p: any) => p.TMS === timestamp
      );
      return point ? point.hum1 : null;
    });

    const data226 = allTimestamps.map((timestamp) => {
      const point = getFilteredData("25_226").find(
        (p: any) => p.TMS === timestamp
      );
      return point ? point.tem1 : null;
    });

    const humidity226 = allTimestamps.map((timestamp) => {
      const point = getFilteredData("25_226").find(
        (p: any) => p.TMS === timestamp
      );
      return point ? point.hum1 : null;
    });

    return {
      tooltip: { trigger: "axis" },
      legend: {
        data: [
          "25_225 Temperature",
          "25_225 Humidity",
          "25_226 Temperature",
          "25_226 Humidity",
        ],
      },
      xAxis: {
        type: "category",
        data: allTimestamps.map((timestamp) =>
          new Date(timestamp * 1000).toLocaleString()
        ),
      },
      yAxis: { type: "value" },
      series: [
        {
          name: "25_225 Temperature",
          type: "line",
          data: data225,
          markPoint: {
            data: [
              { type: "max", name: "Max Temperature" },
              { type: "min", name: "Min Temperature" },
            ],
          },
        },
        {
          name: "25_225 Humidity",
          type: "line",
          data: humidity225,
        },
        {
          name: "25_226 Temperature",
          type: "line",
          data: data226,
          markPoint: {
            data: [
              { type: "max", name: "Max Temperature" },
              { type: "min", name: "Min Temperature" },
            ],
          },
        },
        {
          name: "25_226 Humidity",
          type: "line",
          data: humidity226,
        },
      ],
    };
  };

  return (
    <div className="p-4">
      <Filters interval={interval} setInterval={setInterval} />

      <div className="flex items-center gap-4 mb-4">
        <DeviceTabs devices={["all", "25_225", "25_226"]} />
        <div className="mb-4 flex gap-4">
          <button
            onClick={() => setCompareMode(true)}
            className={`px-4 py-2 rounded ${
              compareMode
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            Compare Devices
          </button>
        </div>
      </div>

      {compareMode ? (
        <div className="p-4 bg-white shadow rounded">
          <ReactECharts
            option={getCombinedChartOptions()}
            style={{ height: "400px", width: "100%" }}
          />
        </div>
      ) : (
        <div
          className={`grid ${
            activeTab === "all"
              ? "grid-cols-1 md:grid-cols-2 gap-6"
              : "grid-cols-1"
          }`}
        >
          {activeTab === "all" ? (
            <>
              <div className="p-4 bg-white shadow rounded">
                <ReactECharts
                  option={getChartOptions(getFilteredData("25_225"), "25_225")}
                  style={{ height: "400px", width: "100%" }}
                />
              </div>

              <div className="p-4 bg-white shadow rounded">
                <ReactECharts
                  option={getChartOptions(getFilteredData("25_226"), "25_226")}
                  style={{ height: "400px", width: "100%" }}
                />
              </div>
            </>
          ) : (
            <div className="p-4 bg-white shadow rounded">
              <ReactECharts
                option={getChartOptions(getFilteredData(activeTab), activeTab)}
                style={{ height: "400px", width: "100%" }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
