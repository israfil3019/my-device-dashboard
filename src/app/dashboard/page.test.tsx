import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import DashboardPage from "./page";
import { useRouter } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("echarts-for-react", () => ({
  __esModule: true,
  default: () => <div data-testid="echarts-mock" />,
}));

jest.mock("@/lib/hooks/useChartData", () => ({
  useChartData: jest.fn(() => ({
    data: [],
    isLoading: false,
    isError: false,
  })),
}));

describe("DashboardPage Component", () => {
  const mockRouterPush = jest.fn();
  const queryClient = new QueryClient();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockRouterPush,
    });
    localStorage.setItem("token", "mock-token");
  });

  afterEach(() => {
    localStorage.clear();
  });

  const renderWithQueryClient = (ui: React.ReactElement) => {
    render(
      <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
    );
  };

  it("redirects to login when no token is present", () => {
    localStorage.removeItem("token");

    renderWithQueryClient(<DashboardPage />);

    expect(mockRouterPush).toHaveBeenCalledWith("/login");
  });

  it("renders Navbar, Tabs, and Tabs Content correctly", () => {
    renderWithQueryClient(<DashboardPage />);

    expect(screen.getByText(/Birre Soft/i)).toBeInTheDocument(); // Navbar
    expect(screen.getByText("Charts")).toBeInTheDocument(); // Tab 1
    expect(screen.getByText("AG Grid")).toBeInTheDocument(); // Tab 2
    expect(screen.getByText(/Charts/i)).toBeInTheDocument(); // Default tab content
  });

  it("renders two charts by default in the Charts tab", () => {
    renderWithQueryClient(<DashboardPage />);

    const charts = screen.getAllByTestId("echarts-mock");
    expect(charts).toHaveLength(2);
    expect(screen.queryByTestId("spinner")).not.toBeInTheDocument(); // Ensure spinner is not present
  });
});
