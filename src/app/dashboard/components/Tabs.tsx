"use client";

import React from "react";
import { useTabsContext } from "@/context/TabsContext";

interface Tab {
  label: string;
  content: React.ReactNode;
}
interface TabsProps {
  tabs: Tab[];
}

export default function Tabs({ tabs }: TabsProps) {
  const { activeTab, setActiveTab } = useTabsContext();

  return (
    <div>
      <div className="flex justify-center gap-4 mb-6 px-4">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`px-4 py-2 rounded w-full text-2xl ${
              activeTab === tab.label ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setActiveTab(tab.label)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div>{tabs.find((tab) => tab.label === activeTab)?.content}</div>
    </div>
  );
}
