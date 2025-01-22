"use client";

import { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ValueFormatterParams } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import DeviceTabs from "./DeviceTabs";
import Filters from "./Filters";
import { useTabsContext } from "@/context/TabsContext";

export default function DataTable() {
  const [rawData, setRawData] = useState<any[]>([]);
  const [rowData, setRowData] = useState<any[]>([]);
  const { activeTab, interval, setInterval } = useTabsContext();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/mock/dataset.json");
        const data = await response.json();
        setRawData(data.data);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to load mock data");
        setIsLoading(false);
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (rawData.length === 0) return;

    let rowsToFetch = 0;
    if (interval === "daily") {
      rowsToFetch = 4;
    } else if (interval === "weekly") {
      rowsToFetch = 7 * 4;
    } else if (interval === "monthly") {
      rowsToFetch = 4 * 7 * 4;
    }

    const filteredData = rawData
      .slice(0, rowsToFetch)
      .filter((point: any) => activeTab === "all" || point.DID === activeTab);

    setRowData(filteredData);
  }, [rawData, interval, activeTab]);

  if (isLoading) return <p>Loading table data...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const columnDefs = [
    {
      headerName: "Date & Time",
      field: "TMS",
      valueFormatter: (params: ValueFormatterParams) =>
        new Date(params.value * 1000).toLocaleString(),
      sortable: true,
      filter: "agDateColumnFilter",
    },
    {
      headerName: "Device ID",
      field: "DID",
      sortable: true,
      filter: false,
      width: 150,
    },
    {
      headerName: "Temperature (°C)",
      field: "tem1",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Humidity (%)",
      field: "hum1",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Solar Radiation",
      field: "solr",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Wind Speed (m/s)",
      field: "wind",
      sortable: true,
      filter: true,
    },
  ];

  return (
    <div className="p-4">
      <Filters interval={interval} setInterval={setInterval} />
      <DeviceTabs
        devices={["all", "25_225", "25_226"]}
        setCompareMode={() => {}}
      />
      <div
        className="ag-theme-alpine mt-4"
        style={{ height: 600, width: "100%" }}
      >
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={{
            sortable: true,
            filter: true,
          }}
        />
      </div>
    </div>
  );
}
