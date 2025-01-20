import React, { useState } from 'react';

interface Tab {
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultActiveTab?: number; // Optional, to set the default active tab
}

export default function Tabs({ tabs, defaultActiveTab = 0 }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultActiveTab);

  return (
    <div>
      {/* Tab Headers */}
      <div className="flex gap-4 mb-6">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`px-4 py-2 rounded ${
              activeTab === index ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
            onClick={() => setActiveTab(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Active Tab Content */}
      <div>{tabs[activeTab]?.content}</div>
    </div>
  );
}
