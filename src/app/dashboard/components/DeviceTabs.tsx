"use client";

import React from "react";
import { useTabsContext } from "@/context/TabsContext";

interface DeviceTabsProps {
  devices: string[];
}

export default function DeviceTabs({ devices }: DeviceTabsProps) {
  const { activeTab, setActiveTab } = useTabsContext();

  return (
    <div className="mb-4 flex gap-4">
      {devices.map((device) => (
        <button
          key={device}
          onClick={() => setActiveTab(device)}
          className={`px-4 py-2 rounded ${
            activeTab === device
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          {device === "all" ? "All Devices" : device}
        </button>
      ))}
    </div>
  );
}
