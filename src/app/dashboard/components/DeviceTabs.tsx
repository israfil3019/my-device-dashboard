"use client";

import React from "react";
import { useTabsContext } from "@/context/TabsContext";

interface DeviceTabsProps {
  devices: string[];
  setCompareMode: (value: boolean) => void; // For exit compare mode
}

export default function DeviceTabs({
  devices,
  setCompareMode,
}: DeviceTabsProps) {
  const { activeTab, setActiveTab } = useTabsContext();

  return (
    <div className="mb-4 flex flex-wrap justify-center gap-2 sm:gap-4">
      {devices.map((device) => (
        <button
          key={device}
          onClick={() => {
            setActiveTab(device);
            setCompareMode(false);
          }}
          className={`px-3 py-2 sm:px-4 rounded text-sm sm:text-base ${
            activeTab === device
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          {device === "all" ? "All Devices" : device}
        </button>
      ))}
    </div>
  );
}
