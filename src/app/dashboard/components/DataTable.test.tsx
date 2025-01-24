import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import DataTable from "./DataTable";
import { useTabsContext } from "@/context/TabsContext";
import { useChartData } from "@/lib/hooks/useChartData";
import { ChartData } from "@/lib/types/chart.types";

// Mock `useTabsContext`
jest.mock("@/context/TabsContext", () => ({
  useTabsContext: jest.fn(),
}));

// Mock `useChartData`
jest.mock("@/lib/hooks/useChartData", () => ({
  useChartData: jest.fn(),
}));

describe("DataTable Component", () => {
  const mockSetInterval = jest.fn();

  const defaultMockChartData = [
    { TMS: 1, DID: "25_225", tem1: 20, hum1: 50, solr: 120, wins: 90, wind: 5 },
    {
      TMS: 2,
      DID: "25_225",
      tem1: 22,
      hum1: 55,
      solr: 130,
      wins: 100,
      wind: 6,
    },
    { TMS: 1, DID: "25_226", tem1: 18, hum1: 60, solr: 110, wins: 80, wind: 4 },
    {
      TMS: 2,
      DID: "25_226",
      tem1: 19,
      hum1: 62,
      solr: 115,
      wins: 85,
      wind: 4.5,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (useTabsContext as jest.Mock).mockReturnValue({
      activeTab: "all",
      setActiveTab: jest.fn(),
      interval: "daily",
      setInterval: mockSetInterval,
    });
  });

  const renderDataTable = (
    chartData: ChartData[] = [],
    isLoading = false,
    isError = false
  ) => {
    (useChartData as jest.Mock).mockReturnValue({
      data: chartData,
      isLoading,
      isError,
    });
    render(<DataTable />);
  };

  it("renders filters and device tabs correctly", () => {
    renderDataTable();

    expect(screen.getByText("Daily")).toBeInTheDocument();
    expect(screen.getByText("All Devices")).toBeInTheDocument();
    expect(screen.getByText("25_225")).toBeInTheDocument();
    expect(screen.getByText("25_226")).toBeInTheDocument();
  });

  it("renders a loading spinner when data is loading", () => {
    renderDataTable([], true);

    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });

  it("renders an error message when data fails to load", () => {
    renderDataTable([], false, true);

    expect(screen.getByText("Error")).toBeInTheDocument();
    expect(
      screen.getByText("Failed to load table data. Please try again later.")
    ).toBeInTheDocument();
  });

  it("renders table rows for all data", () => {
    renderDataTable(defaultMockChartData);

    const rows = screen.getAllByRole("row");
    expect(rows.length).toBeGreaterThan(1); // Header + data rows
  });

  it("filters table rows based on the active tab", () => {
    (useTabsContext as jest.Mock).mockReturnValue({
      activeTab: "25_225",
      setActiveTab: jest.fn(),
      interval: "daily",
      setInterval: jest.fn(),
    });

    renderDataTable(defaultMockChartData);

    const rows = screen.getAllByRole("row");

    rows.forEach((row) => {
      if (row.textContent?.includes("25_225")) {
        expect(row).toBeInTheDocument();
      }
      if (row.textContent?.includes("25_226")) {
        expect(row).not.toBeInTheDocument();
      }
    });
  });
});
