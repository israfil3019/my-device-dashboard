"use client";

import { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import DeviceTabs from "./DeviceTabs";
import Filters from "./Filters";
import { useTabsContext } from "@/context/TabsContext";

export default function ChartPage() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [chartData, setChartData] = useState<any[]>([]);
  const [compareMode, setCompareMode] = useState<boolean>(false);
  const { startDate, setStartDate, interval, setInterval } = useTabsContext();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/mock/dataset.json");
      const data = await response.json();
      setChartData(data.data);
    };

    fetchData();
  }, []);

  const getFilteredData = (deviceId: string) => {
    const start = new Date(startDate);
    return chartData.filter((point: any) => {
      const pointDate = new Date(point.TMS * 1000);

      let isInInterval = false;
      if (interval === "daily") {
        isInInterval = pointDate.toDateString() === start.toDateString();
      } else if (interval === "weekly") {
        const diff =
          (pointDate.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
        isInInterval = diff >= 0 && diff < 7;
      } else if (interval === "monthly") {
        const diff =
          (pointDate.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
        isInInterval = diff >= 0 && diff < 30;
      }

      const isDeviceMatch = deviceId === "all" || point.DID === deviceId;

      return isInInterval && isDeviceMatch;
    });
  };

  const getChartOptions = (data: any[], deviceId?: string) => ({
    tooltip: { trigger: "axis" },
    legend: { data: ["Temperature", "Humidity"] },
    xAxis: {
      type: "category",
      data: data.map((point: any) =>
        new Date(point.TMS * 1000).toLocaleString()
      ),
    },
    yAxis: { type: "value" },
    series: [
      {
        name: `${deviceId || "All"} Temperature`,
        type: "line",
        data: data.map((point: any) => point.tem1),
        markPoint: {
          data: [
            { type: "max", name: "Max" },
            { type: "min", name: "Min" },
          ],
          label: {
            show: true,
            // formatter: '{b}: {c}',
            formatter: "{c}",
          },
        },
      },
      {
        name: `${deviceId || "All"} Humidity`,
        type: "line",
        data: data.map((point: any) => point.hum1),
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
    ],
  });

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
          markPoint: {
            data: [
              { type: "max", name: "Max Humidity" },
              { type: "min", name: "Min Humidity" },
            ],
          },
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
          markPoint: {
            data: [
              { type: "max", name: "Max Humidity" },
              { type: "min", name: "Min Humidity" },
            ],
          },
        },
      ],
    };
  };

  return (
    <div className="p-4">
      <Filters
        startDate={startDate}
        setStartDate={setStartDate}
        interval={interval}
        setInterval={setInterval}
      />

      <div className="flex items-center gap-4 mb-4">
        <DeviceTabs
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setCompareMode(false);
          }}
          devices={["all", "25_225", "25_226"]}
        />
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
