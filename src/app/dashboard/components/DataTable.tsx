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
import { formatDateTime } from "@/lib/utils/dateFormatter";

export default function DataTable() {
  const { activeTab, interval, setInterval } = useTabsContext();

  const { data: rawData = [], isLoading, isError } = useChartData(interval);

  const rowData = rawData.filter(
    (point) => activeTab === "all" || point.DID === activeTab
  );

  const columnDefs: ColDef<ChartData>[] = [
    {
      headerName: "Date/Time",
      field: "TMS",
      valueFormatter: (params: ValueFormatterParams<ChartData>) =>
        formatDateTime(params.value), // Use utility function
      sortable: true,
      filter: "agDateColumnFilter",
      width: 130,
      cellStyle: { "background-color": "aliceblue", "font-weight": "600" },
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
      width: 180,
      cellStyle: (params) => {
        if (params.value >= 30 && params.value <= 50) {
          return { fontWeight: 600, backgroundColor: "rgba(255, 0, 0, 0.20)" };
        } else if (params.value > 50) {
          return { fontWeight: 600, backgroundColor: "rgba(255, 0, 0, 0.35)" };
        } else {
          return { fontWeight: 600, backgroundColor: "aliceblue" };
        }
      },
    },
    {
      headerName: "Humidity (%)",
      field: "hum1",
      sortable: true,
      filter: true,
      width: 180,
      cellStyle: { "font-weight": "600" },
    },
    {
      headerName: "Solar Radiation",
      field: "solr",
      sortable: true,
      filter: true,
      width: 180,
      cellStyle: { "background-color": "aliceblue" },
    },
    {
      headerName: "Wind Direction",
      field: "wins",
      cellRenderer: (params: any) => {
        const direction = params.value;
        const rotation = direction || 0;

        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{ fontSize: "16px", transform: `rotate(${rotation}deg)` }}
            >
              ↑
            </span>
          </div>
        );
      },
      sortable: false,
      filter: false,
      width: 140,
    },
    {
      headerName: "Wind Speed (m/s)",
      field: "wind",
      sortable: true,
      filter: true,
      width: 180,
      cellStyle: { "background-color": "aliceblue" },
    },
  ];

  return (
    <div className="p-2 sm:p-4">
      <Filters interval={interval} setInterval={setInterval} />
      <DeviceTabs
        devices={["all", "25_225", "25_226"]}
        setCompareMode={() => {}}
      />
      {isLoading ? (
        <div className="flex items-center justify-center h-64 col-span-full">
          <Spinner />
        </div>
      ) : isError ? (
        <div className="text-red-500 p-4 bg-white shadow rounded">
          <h2 className="text-lg font-semibold">Error</h2>
          <p>Failed to load table data. Please try again later.</p>
        </div>
      ) : (
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
      )}
    </div>
  );
}
