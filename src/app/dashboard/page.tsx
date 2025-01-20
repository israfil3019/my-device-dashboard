'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import DeviceSelector from './components/DeviceSelector';
import Chart from './components/Chart';

const queryClient = new QueryClient();

export default function DashboardPage() {
  const [deviceType, setDeviceType] = useState<string>('25_225');
  const [interval, setInterval] = useState<string>('daily');
  const [startDate, setStartDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-100 p-6">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Device Dashboard</h1>
        </header>

        <DeviceSelector
          deviceType={deviceType}
          setDeviceType={setDeviceType}
          interval={interval}
          setInterval={setInterval}
          startDate={startDate}
          setStartDate={setStartDate}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Chart DID={deviceType} interval={interval} startDate={startDate} />
        </div>
      </div>
    </QueryClientProvider>
  );
}
