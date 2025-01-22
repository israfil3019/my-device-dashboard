"use client";

import React from "react";
import { useTabsContext } from "@/context/TabsContext";

interface DeviceTabsProps {
  devices: string[];
  setCompareMode: (value: boolean) => void; // Add setCompareMode prop
}

export default function DeviceTabs({
  devices,
  setCompareMode,
}: DeviceTabsProps) {
  const { activeTab, setActiveTab } = useTabsContext();

  return (
    <div className="mb-4 flex justify-center gap-4">
      {devices.map((device) => (
        <button
          key={device}
          onClick={() => {
            setActiveTab(device);
            setCompareMode(false);
          }}
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
