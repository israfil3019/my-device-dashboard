"use client";

import { AgGridReact } from "ag-grid-react";
import { ColDef, ValueFormatterParams } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import DeviceTabs from "./DeviceTabs";
import Filters from "./Filters";
import { useTabsContext } from "@/context/TabsContext";
import Spinner from "@/app/loading/Spinner";
import { useChartData } from "@/lib/hooks/useChartData";
import { ChartData } from "@/lib/types/chart.types";

export default function DataTable() {
  const { activeTab, interval, setInterval } = useTabsContext();

  const { data: rawData = [], isLoading, isError } = useChartData(interval);

  const rowData = rawData.filter(
    (point) => activeTab === "all" || point.DID === activeTab
  );

  if (isError) {
    return (
      <div className="text-red-500 p-4 bg-white shadow rounded">
        <h2 className="text-lg font-semibold">Error</h2>
        <p>Failed to load table data. Please try again later.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner />
      </div>
    );
  }

  const columnDefs: ColDef<ChartData>[] = [
    {
      headerName: "Date & Time",
      field: "TMS",
      valueFormatter: (params: ValueFormatterParams<ChartData>) =>
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
    <div className="p-2 sm:p-4">
      <Filters interval={interval} setInterval={setInterval} />
      <DeviceTabs
        devices={["all", "25_225", "25_226"]}
        setCompareMode={() => {}}
      />
      <div
        className="ag-theme-alpine mt-4"
        style={{ height: 600, width: "100%" }}
      >
        <AgGridReact<ChartData>
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
