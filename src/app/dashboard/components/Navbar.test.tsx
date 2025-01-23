import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Navbar from "./Navbar";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

const queryClient = new QueryClient();

describe("Navbar", () => {
  beforeEach(() => {
    localStorage.clear();
    queryClient.clear();
  });

  it("renders the company name from the user data", () => {
    localStorage.setItem(
      "user",
      JSON.stringify({
        id: 1,
        name: "Challenge 2025",
        email: "guest@example.com",
        company: { name: "Birre Soft" },
      })
    );

    render(
      <QueryClientProvider client={queryClient}>
        <Navbar />
      </QueryClientProvider>
    );

    expect(screen.getByText("Birre Soft")).toBeInTheDocument();
  });

  it("renders the default company name when no user is found", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Navbar />
      </QueryClientProvider>
    );

    expect(screen.getByText("Birre Soft")).toBeInTheDocument();
  });

  it("logs out the user and redirects to login page", () => {
    const push = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push });

    localStorage.setItem("token", "test-token");
    localStorage.setItem(
      "user",
      JSON.stringify({
        id: 1,
        name: "Challenge 2025",
        email: "guest@example.com",
        company: { name: "Birre Soft" },
      })
    );

    render(
      <QueryClientProvider client={queryClient}>
        <Navbar />
      </QueryClientProvider>
    );

    fireEvent.click(screen.getByText("Logout"));

    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("user")).toBeNull();
    expect(push).toHaveBeenCalledWith("/login");
  });

  it("displays the logged-in user's name", () => {
    localStorage.setItem(
      "user",
      JSON.stringify({
        id: 1,
        name: "Challenge 2025",
        email: "guest@example.com",
        company: { name: "Birre Soft" },
      })
    );

    render(
      <QueryClientProvider client={queryClient}>
        <Navbar />
      </QueryClientProvider>
    );

    expect(screen.getByText("Challenge 2025")).toBeInTheDocument();
  });

  it("handles no user name gracefully", () => {
    localStorage.setItem(
      "user",
      JSON.stringify({
        id: 1,
        email: "guest@example.com",
        company: { name: "Birre Soft" },
      })
    );

    render(
      <QueryClientProvider client={queryClient}>
        <Navbar />
      </QueryClientProvider>
    );

    expect(screen.getByText("Challenge 2025")).toBeInTheDocument();
  });
});
