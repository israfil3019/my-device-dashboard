"use client";

import React, { useState } from "react";

interface Tab {
  label: string;
  content: React.ReactNode;
}
interface TabsProps {
  tabs: Tab[];
}

export default function Tabs({ tabs }: TabsProps) {
  const [localActiveTab, setLocalActiveTab] = useState<string>(tabs[0]?.label); // Local state for tabs

  return (
    <div>
      {/* Tab Buttons */}
      <div className="flex justify-center gap-4 mb-6 px-4">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`px-4 py-2 rounded w-full text-2xl ${
              localActiveTab === tab.label
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setLocalActiveTab(tab.label)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Active Tab Content */}
      <div>{tabs.find((tab) => tab.label === localActiveTab)?.content}</div>
    </div>
  );
}
