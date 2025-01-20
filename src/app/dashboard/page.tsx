'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import DeviceSelector from './components/DeviceSelector';
import Chart from './components/Chart';

const queryClient = new QueryClient();

export default function DashboardPage() {
  const [interval, setInterval] = useState<string>('daily');
  const [startDate, setStartDate] = useState<string>('2024-12-31');

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-100 p-6">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Device Dashboard</h1>
        </header>

        <DeviceSelector
          interval={interval}
          setInterval={setInterval}
          startDate={startDate}
          setStartDate={setStartDate}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Chart for Device 25_225 */}
          <Chart DID="25_225" interval={interval} startDate={startDate} />

          {/* Chart for Device 25_226 */}
          <Chart DID="25_226" interval={interval} startDate={startDate} />
        </div>
      </div>
    </QueryClientProvider>
  );
}
