import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ChartPage from "./ChartPage";
import { useTabsContext } from "@/context/TabsContext";
import { useChartData } from "@/lib/hooks/useChartData";
import { ChartData } from "@/lib/types/chart.types";

jest.mock("echarts-for-react", () => ({
  __esModule: true,
  default: () => <div data-testid="echarts-mock" />,
}));

jest.mock("@/context/TabsContext", () => ({
  useTabsContext: jest.fn(),
}));

jest.mock("@/lib/hooks/useChartData", () => ({
  useChartData: jest.fn(),
}));

describe("ChartPage Component", () => {
  const mockSetActiveTab = jest.fn();
  const mockSetInterval = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useTabsContext as jest.Mock).mockReturnValue({
      activeTab: "all",
      setActiveTab: mockSetActiveTab,
      interval: "daily",
      setInterval: mockSetInterval,
    });
  });

  const renderChartPage = (
    chartData: ChartData[] = [],
    isLoading = false,
    isError = false
  ) => {
    (useChartData as jest.Mock).mockReturnValue({
      data: chartData,
      isLoading,
      isError,
    });
    render(<ChartPage />);
  };

  it("renders filters and device tabs correctly", () => {
    renderChartPage();

    expect(screen.getByText("Daily")).toBeInTheDocument();
    expect(screen.getByText("All Devices")).toBeInTheDocument();
  });

  it("renders a loading spinner when data is loading", () => {
    renderChartPage([], true);

    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });

  it("renders an error message when data fails to load", () => {
    renderChartPage([], false, true);

    expect(screen.getByText("Error")).toBeInTheDocument();
    expect(
      screen.getByText("Failed to load chart data. Please try again later.")
    ).toBeInTheDocument();
  });

  it("renders charts in compare mode", () => {
    const mockChartData = [
      { TMS: 1, DID: "25_225", tem1: 20, hum1: 50 },
      { TMS: 2, DID: "25_225", tem1: 22, hum1: 55 },
      { TMS: 1, DID: "25_226", tem1: 18, hum1: 60 },
      { TMS: 2, DID: "25_226", tem1: 19, hum1: 62 },
    ];
    renderChartPage(mockChartData);

    fireEvent.click(screen.getByText("Compare Mode"));

    expect(screen.getAllByTestId("echarts-mock")).toHaveLength(1);
  });

  it("renders individual charts for each device in non-compare mode", () => {
    const mockChartData = [
      { TMS: 1, DID: "25_225", tem1: 20, hum1: 50 },
      { TMS: 2, DID: "25_225", tem1: 22, hum1: 55 },
      { TMS: 1, DID: "25_226", tem1: 18, hum1: 60 },
      { TMS: 2, DID: "25_226", tem1: 19, hum1: 62 },
    ];
    renderChartPage(mockChartData);

    expect(screen.getAllByTestId("echarts-mock")).toHaveLength(2);
  });

  it("calls setActiveTab and toggles compare mode on button click", () => {
    (useTabsContext as jest.Mock).mockReturnValue({
      activeTab: "25_225",
      setActiveTab: mockSetActiveTab,
      interval: "daily",
      setInterval: mockSetInterval,
    });

    render(<ChartPage />);

    fireEvent.click(screen.getByText("Compare Mode"));

    expect(mockSetActiveTab).toHaveBeenCalledWith("all");
    expect(screen.getByText("Compare Mode")).toHaveClass("bg-green-500");
  });

  it("renders a single chart for an active device tab", () => {
    (useTabsContext as jest.Mock).mockReturnValue({
      activeTab: "25_225",
      setActiveTab: mockSetActiveTab,
      interval: "daily",
      setInterval: mockSetInterval,
    });

    const mockChartData = [
      { TMS: 1, DID: "25_225", tem1: 20, hum1: 50 },
      { TMS: 2, DID: "25_225", tem1: 22, hum1: 55 },
    ];

    renderChartPage(mockChartData);

    expect(screen.getAllByTestId("echarts-mock")).toHaveLength(1);
  });
});
