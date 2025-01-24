"use client";

import Tabs from "./components/Tabs";
import DataTable from "./components/DataTable";
import ChartPage from "./components/ChartPage";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { TabsProvider } from "@/context/TabsContext"; // Use it to prevent unnecessary api calls

export default function DashboardPage() {
  const tabs = [
    {
      label: "Charts",
      content: <ChartPage />,
    },
    {
      label: "AG Grid",
      content: <DataTable />,
    },
  ];

  return (
    <ProtectedRoute>
      <TabsProvider>
        <Navbar />
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="min-h-screen bg-gray-50 pt-20">
            <Tabs tabs={tabs} />
          </div>
        </div>
      </TabsProvider>
    </ProtectedRoute>
  );
}
