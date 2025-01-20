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
  const [activeTab, setActiveTab] = useState<string>("all");
  const { startDate, setStartDate, interval, setInterval } = useTabsContext();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/mock/dataset.json");
      const data = await response.json();
      setRawData(data.data);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const start = new Date(startDate);

    const filteredData = rawData.filter((point: any) => {
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

      const isDeviceMatch = activeTab === "all" || point.DID === activeTab;

      return isInInterval && isDeviceMatch;
    });

    setRowData(filteredData);
  }, [rawData, startDate, interval, activeTab]);

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
    },
    {
      headerName: "Temperature (°C)",
      field: "tem1",
      sortable: true,
      filter: true,
    },
    { headerName: "Humidity (%)", field: "hum1", sortable: true, filter: true },
    {
      headerName: "Solar Radiation",
      field: "solr",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Precipitation (mm)",
      field: "prec",
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
      <Filters
        startDate={startDate}
        setStartDate={setStartDate}
        interval={interval}
        setInterval={setInterval}
      />

      <DeviceTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        devices={["all", "25_225", "25_226"]}
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
