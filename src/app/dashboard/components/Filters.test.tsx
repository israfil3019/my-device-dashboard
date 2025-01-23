import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Filters from "./Filters";

describe("Filters Component", () => {
  const mockSetInterval = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all interval buttons correctly", () => {
    render(<Filters interval="daily" setInterval={mockSetInterval} />);

    expect(screen.getByText("Daily")).toBeInTheDocument();
    expect(screen.getByText("Weekly")).toBeInTheDocument();
    expect(screen.getByText("Monthly")).toBeInTheDocument();
  });

  it("applies the correct styles to the active interval", () => {
    render(<Filters interval="weekly" setInterval={mockSetInterval} />);

    const dailyButton = screen.getByText("Daily");
    const weeklyButton = screen.getByText("Weekly");
    const monthlyButton = screen.getByText("Monthly");

    expect(dailyButton).toHaveClass("bg-gray-200 text-gray-800");
    expect(weeklyButton).toHaveClass("bg-blue-500 text-white");
    expect(monthlyButton).toHaveClass("bg-gray-200 text-gray-800");
  });

  it("calls setInterval with the correct value when an interval button is clicked", () => {
    render(<Filters interval="daily" setInterval={mockSetInterval} />);

    const weeklyButton = screen.getByText("Weekly");
    fireEvent.click(weeklyButton);

    expect(mockSetInterval).toHaveBeenCalledWith("weekly");

    const monthlyButton = screen.getByText("Monthly");
    fireEvent.click(monthlyButton);

    expect(mockSetInterval).toHaveBeenCalledWith("monthly");
  });

  it("updates styles when the active interval changes", () => {
    const { rerender } = render(
      <Filters interval="daily" setInterval={mockSetInterval} />
    );

    const dailyButton = screen.getByText("Daily");
    const weeklyButton = screen.getByText("Weekly");

    expect(dailyButton).toHaveClass("bg-blue-500 text-white");
    expect(weeklyButton).toHaveClass("bg-gray-200 text-gray-800");

    rerender(<Filters interval="weekly" setInterval={mockSetInterval} />);

    expect(dailyButton).toHaveClass("bg-gray-200 text-gray-800");
    expect(weeklyButton).toHaveClass("bg-blue-500 text-white");
  });
});
