'use client';

import { QueryClient, QueryClientProvider } from 'react-query';
import Tabs from './components/Tabs';
import DataTable from './components/DataTable';
import ChartPage from './components/ChartPage'; 
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { TabsProvider } from '@/context/TabsContext';

const queryClient = new QueryClient();

export default function DashboardPage() {
  const tabs = [
    {
      label: 'Charts',
      content: <ChartPage />,
    },
    {
      label: 'AG Grid',
      content: <DataTable />,
    },
  ];

  return (
    <ProtectedRoute>
      <QueryClientProvider client={queryClient}>
        <TabsProvider>
          <Navbar />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="min-h-screen bg-gray-50 pt-20">
              <Tabs tabs={tabs} />
            </div>
          </div>
        </TabsProvider>
      </QueryClientProvider>
    </ProtectedRoute>
  );
}
