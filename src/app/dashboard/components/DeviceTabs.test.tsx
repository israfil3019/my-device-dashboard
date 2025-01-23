import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import DeviceTabs from "./DeviceTabs";
import { TabsProvider } from "@/context/TabsContext";

describe("DeviceTabs Component", () => {
  const mockSetCompareMode = jest.fn();

  const renderWithProvider = (devices: string[]) => {
    render(
      <TabsProvider>
        <DeviceTabs devices={devices} setCompareMode={mockSetCompareMode} />
      </TabsProvider>
    );
  };

  const devices = ["Device 1", "Device 2", "all"];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all device buttons", () => {
    renderWithProvider(devices);

    expect(screen.getByText("Device 1")).toBeInTheDocument();
    expect(screen.getByText("Device 2")).toBeInTheDocument();
    expect(screen.getByText("All Devices")).toBeInTheDocument();
  });

  it("applies the correct styles to the active tab", () => {
    renderWithProvider(devices);

    const allDevicesButton = screen.getByText("All Devices");
    const device1Button = screen.getByText("Device 1");

    expect(allDevicesButton).toHaveClass("bg-blue-500 text-white"); // Default active tab
    expect(device1Button).toHaveClass("bg-gray-200 text-gray-800"); // Inactive tab
  });

  it("changes the active tab and calls setCompareMode when a device button is clicked", async () => {
    renderWithProvider(devices);

    const device2Button = screen.getByText("Device 2");
    userEvent.click(device2Button);

    const device1Button = screen.getByText("Device 1");
    const allDevicesButton = screen.getByText("All Devices");

    await waitFor(() =>
      expect(device2Button).toHaveClass("bg-blue-500 text-white")
    );
    expect(device1Button).toHaveClass("bg-gray-200 text-gray-800");
    expect(allDevicesButton).toHaveClass("bg-gray-200 text-gray-800");

    expect(mockSetCompareMode).toHaveBeenCalledWith(false);
  });

  it("renders 'All Devices' for the 'all' tab", () => {
    renderWithProvider(devices);

    const allDevicesButton = screen.getByText("All Devices");
    expect(allDevicesButton).toBeInTheDocument();
    expect(allDevicesButton).toHaveClass("bg-blue-500 text-white");
  });

  it("handles an empty devices array gracefully", () => {
    renderWithProvider([]);

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
