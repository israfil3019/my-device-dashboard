"use client";

import ReactECharts from "echarts-for-react";
import DeviceTabs from "./DeviceTabs";
import Filters from "./Filters";
import { useTabsContext } from "@/context/TabsContext";
import Spinner from "@/app/loading/Spinner";
import { useChartData } from "@/lib/hooks/useChartData";
import { useState } from "react";
import { formatDateTime } from "@/lib/utils/dateFormatter";

export default function ChartPage() {
  const [compareMode, setCompareMode] = useState<boolean>(false);
  const { activeTab, setActiveTab, interval, setInterval } = useTabsContext();

  const { data: chartData = [], isLoading, isError } = useChartData(interval);

  const getFilteredData = (deviceId: string) => {
    return chartData.filter((point: any) => {
      const isDeviceMatch = deviceId === "all" || point.DID === deviceId;
      return isDeviceMatch;
    });
  };

  const getChartOptions = (data: any[], deviceId?: string) => {
    const sortedData = data.sort((a: any, b: any) => a.TMS - b.TMS);

    const groupedData = sortedData.reduce((acc: any, point: any) => {
      const formattedDate = formatDateTime(point.TMS);

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
      legend: {
        data: [
          `${deviceId || "All"} Temperature`,
          `${deviceId || "All"} Humidity`,
        ],
      },
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
      ...new Set(
        chartData.map((point: any) => point.TMS) // Collect unique timestamps from all data
      ),
    ].sort((a, b) => a - b);

    const dateFormatter = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
    });

    const formattedTimestamps = allTimestamps.map((timestamp) =>
      dateFormatter.format(new Date(timestamp * 1000))
    );

    const createSeries = (
      deviceId: string,
      metric: "tem1" | "hum1",
      name: string
    ) => {
      return allTimestamps.map((timestamp) => {
        const point = chartData.find(
          (p: any) => p.DID === deviceId && p.TMS === timestamp
        );
        return point ? point[metric] : null;
      });
    };

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
        data: formattedTimestamps,
      },
      yAxis: { type: "value" },
      series: [
        {
          name: "25_225 Temperature",
          type: "line",
          data: createSeries("25_225", "tem1", "Temperature"),
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
          data: createSeries("25_225", "hum1", "Humidity"),
        },
        {
          name: "25_226 Temperature",
          type: "line",
          data: createSeries("25_226", "tem1", "Temperature"),
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
          data: createSeries("25_226", "hum1", "Humidity"),
        },
      ],
    };
  };

  return (
    <div className="p-2 sm:p-4">
      <Filters interval={interval} setInterval={setInterval} />

      <div className="flex items-center justify-center gap-2 sm:gap-4 mb-4">
        <DeviceTabs
          devices={["all", "25_225", "25_226"]}
          setCompareMode={setCompareMode}
        />
        <div className="mb-4 flex gap-2 sm:gap-4">
          <button
            onClick={() => {
              setCompareMode((prevMode) => {
                if (!prevMode) {
                  if (activeTab !== "all") {
                    setActiveTab("all");
                  }
                }
                return !prevMode;
              });
            }}
            className={`px-3 py-2 sm:px-4 rounded text-sm sm:text-base ${
              compareMode
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            Compare Mode
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64 col-span-full">
          <Spinner />
        </div>
      ) : isError ? (
        <div className="text-red-500 p-4 bg-white shadow rounded">
          <h2 className="text-lg font-semibold">Error</h2>
          <p>Failed to load chart data. Please try again later.</p>
        </div>
      ) : compareMode ? (
        <div className="p-4 bg-white shadow rounded">
          <ReactECharts
            option={getCombinedChartOptions()}
            style={{ height: "400px", width: "100%" }}
            data-testid="echarts-mock"
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
                  data-testid="echarts-mock"
                />
              </div>
              <div className="p-4 bg-white shadow rounded">
                <ReactECharts
                  option={getChartOptions(getFilteredData("25_226"), "25_226")}
                  style={{ height: "400px", width: "100%" }}
                  data-testid="echarts-mock"
                />
              </div>
            </>
          ) : (
            <div className="p-4 bg-white shadow rounded">
              <ReactECharts
                option={getChartOptions(getFilteredData(activeTab), activeTab)}
                style={{ height: "400px", width: "100%" }}
                data-testid="echarts-mock"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
