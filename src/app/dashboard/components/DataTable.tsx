'use client';

import { useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

export default function DataTable() {
  const [rowData, setRowData] = useState<any[]>([]);

  useEffect(() => {
    // Fetch dataset from mock data
    const fetchData = async () => {
      const response = await fetch('/mock/dataset.json');
      const data = await response.json();
      setRowData(data.data);
    };

    fetchData();
  }, []);

  const columnDefs = [
    { headerName: 'Device ID', field: 'DID', sortable: true, filter: true },
    { headerName: 'Temperature', field: 'tem1', sortable: true, filter: true },
    { headerName: 'Humidity', field: 'hum1', sortable: true, filter: true },
    { headerName: 'Solar Radiation', field: 'solr', sortable: true, filter: true },
    { headerName: 'Wind Speed', field: 'wind', sortable: true, filter: true },
    { headerName: 'Precipitation', field: 'prec', sortable: true, filter: true },
    { headerName: 'Condition', field: 'condition', sortable: true, filter: true },
  ];

  return (
    <div className="ag-theme-alpine" style={{ height: 600, width: '100%' }}>
      <AgGridReact rowData={rowData} columnDefs={columnDefs} />
    </div>
  );
}
