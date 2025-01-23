import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Navbar from "./Navbar";

// Mock dependencies
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));
jest.mock("@/context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

describe("Navbar Component", () => {
  const mockPush = jest.fn();
  const mockLogout = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useAuth as jest.Mock).mockReturnValue({
      user: { name: "John Doe", companyName: "Acme Corp" },
      logout: mockLogout,
    });
    localStorage.clear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the navbar with user details", () => {
    render(<Navbar />);

    // Check for the company name
    expect(screen.getByText("Acme Corp")).toBeInTheDocument();

    // Check for the user's name
    expect(screen.getByText(/Logged in as: John Doe/i)).toBeInTheDocument();

    // Check for the logout button
    expect(screen.getByRole("button", { name: /logout/i })).toBeInTheDocument();
  });

  it("calls handleLogout when logout button is clicked", () => {
    render(<Navbar />);

    const logoutButton = screen.getByRole("button", { name: /logout/i });

    // Simulate click on logout button
    fireEvent.click(logoutButton);

    // Check if localStorage was cleared
    expect(localStorage.getItem("token")).toBeNull();

    // Check if logout function was called
    expect(mockLogout).toHaveBeenCalled();

    // Check if router.push was called with '/login'
    expect(mockPush).toHaveBeenCalledWith("/login");
  });

  it("does not break if user is not logged in", () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      logout: mockLogout,
    });

    render(<Navbar />);

    // Ensure the navbar does not display user-specific details
    expect(screen.queryByText(/Logged in as:/i)).not.toBeInTheDocument();

    // Check that the logout button still exists
    const logoutButton = screen.getByRole("button", { name: /logout/i });
    expect(logoutButton).toBeInTheDocument();

    // Simulate click on logout button
    fireEvent.click(logoutButton);

    // Ensure no crash occurs and logout and push are still called
    expect(mockLogout).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith("/login");
  });
});
