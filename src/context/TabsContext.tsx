"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface TabsContextProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  interval: string;
  setInterval: (interval: string) => void;
}

const TabsContext = createContext<TabsContextProps | undefined>(undefined);

export const TabsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [interval, setInterval] = useState<string>("daily");

  return (
    <TabsContext.Provider
      value={{
        activeTab,
        setActiveTab,
        interval,
        setInterval,
      }}
    >
      {children}
    </TabsContext.Provider>
  );
};

export const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("useTabsContext must be used within a TabsProvider");
  }
  return context;
};
