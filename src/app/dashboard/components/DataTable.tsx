'use client';

import { useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ValueFormatterParams } from 'ag-grid-community'; // Import the interface
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

export default function DataTable() {
  const [rowData, setRowData] = useState<any[]>([]);
  const [startDate, setStartDate] = useState<string>('2024-12-31');
  const [interval, setInterval] = useState<string>('daily');

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/mock/dataset.json');
      const data = await response.json();

      // Filter the data based on the interval and start date
      const filteredData = data.data.filter((point: any) => {
        const pointDate = new Date(point.TMS * 1000);
        const start = new Date(startDate);

        if (interval === 'daily') {
          return pointDate.toDateString() === start.toDateString();
        } else if (interval === 'weekly') {
          const diff = (pointDate.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
          return diff >= 0 && diff < 7;
        } else if (interval === 'monthly') {
          const diff = (pointDate.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
          return diff >= 0 && diff < 30;
        }
        return false;
      });

      setRowData(filteredData);
    };

    fetchData();
  }, [startDate, interval]);

  const columnDefs = [
    {
      headerName: 'Date & Time',
      field: 'TMS',
      valueFormatter: (params: ValueFormatterParams) =>
        new Date(params.value * 1000).toLocaleString(),
      sortable: true,
      filter: 'agDateColumnFilter',
    },
    {
      headerName: 'Device ID',
      field: 'DID',
      sortable: true,
      filter: 'agSetColumnFilter', // Allow filtering by Device ID
    },
    { headerName: 'Temperature (°C)', field: 'tem1', sortable: true, filter: true },
    { headerName: 'Humidity (%)', field: 'hum1', sortable: true, filter: true },
    { headerName: 'Solar Radiation', field: 'solr', sortable: true, filter: true },
    { headerName: 'Precipitation (mm)', field: 'prec', sortable: true, filter: true },
    { headerName: 'Wind Speed (m/s)', field: 'wind', sortable: true, filter: true },
  ];

  return (
    <div className="p-4">
      {/* Filters Above the Table */}
      <div className="mb-4 flex gap-4 items-center">
        <div>
          <label className="block text-sm font-medium">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Interval</label>
          <select
            value={interval}
            onChange={(e) => setInterval(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      </div>

      {/* AG Grid Table */}
      <div className="ag-theme-alpine" style={{ height: 600, width: '100%' }}>
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
