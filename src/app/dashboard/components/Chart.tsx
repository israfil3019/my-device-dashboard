import ReactECharts from "echarts-for-react";
import { useQuery } from "react-query";
import { fetchData } from "@/utils/api";

interface Props {
  DID: string;
  interval: string;
  startDate: string;
}

export default function Chart({ DID, interval, startDate }: Props) {
  const { data, isLoading, error } = useQuery(
    ["dataset"],
    () => fetchData(10, 1000),
    {
      refetchOnWindowFocus: false,
    }
  );

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading data</p>;

  const filteredData = data.data.filter((point: any) => {
    const pointDate = new Date(point.TMS * 1000);
    const start = new Date(startDate);

    if (point.DID !== DID) return false;

    if (interval === "daily") {
      return pointDate.toDateString() === start.toDateString();
    } else if (interval === "weekly") {
      const diff =
        (pointDate.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
      return diff >= 0 && diff < 7;
    } else if (interval === "monthly") {
      const diff =
        (pointDate.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
      return diff >= 0 && diff < 30;
    }

    return false;
  });

  if (filteredData.length === 0) {
    return (
      <p>No data available for Device ID: {DID} and the selected filters.</p>
    );
  }

  const chartOptions = {
    tooltip: {
      trigger: "axis",
    },
    legend: {
      data: ["Temperature", "Humidity"],
    },
    xAxis: {
      type: "category",
      data: filteredData.map((point: any) =>
        new Date(point.TMS * 1000).toLocaleString()
      ),
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        name: "Temperature",
        type: "line",
        data: filteredData.map((point: any) => point.tem1),
      },
      {
        name: "Humidity",
        type: "line",
        data: filteredData.map((point: any) => point.hum1),
      },
    ],
  };

  return (
    <div className="p-4 bg-white shadow rounded">
      <h3 className="text-lg font-bold mb-4">Device ID: {DID}</h3>
      <ReactECharts
        option={chartOptions}
        style={{ height: "400px", width: "100%" }}
      />
    </div>
  );
}
