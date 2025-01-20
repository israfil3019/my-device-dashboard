'use client';

import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useRouter } from 'next/navigation';
import DeviceSelector from './components/DeviceSelector';
import Chart from './components/Chart';
import DataTable from './components/DataTable';
import Tabs from './components/Tabs';

const queryClient = new QueryClient();

export default function DashboardPage() {
  const router = useRouter();
  const [interval, setInterval] = useState<string>('daily');
  const [startDate, setStartDate] = useState<string>('2024-12-31');
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const tabs = [
    {
      label: 'Charts',
      content: (
        <>
          <DeviceSelector
            interval={interval}
            setInterval={setInterval}
            startDate={startDate}
            setStartDate={setStartDate}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Chart DID="25_225" interval={interval} startDate={startDate} />
            <Chart DID="25_226" interval={interval} startDate={startDate} />
          </div>
        </>
      ),
    },
    {
      label: 'AG Grid',
      content: <DataTable />,
    },
  ];

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-100 p-6">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Device Dashboard</h1>
            {user && (
              <p className="text-gray-600">
                Logged in as: <strong>{user.name}</strong> ({user.email})
              </p>
            )}
          </div>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={handleLogout}
          >
            Logout
          </button>
        </header>

        {/* Tabs */}
        <Tabs tabs={tabs} />
      </div>
    </QueryClientProvider>
  );
}
