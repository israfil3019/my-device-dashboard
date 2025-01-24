import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ProtectedRoute from "./ProtectedRoute";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("ProtectedRoute Component", () => {
  const mockRouterPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockRouterPush,
    });
  });

  it("redirects to /login when no token is found", () => {
    localStorage.removeItem("token");

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(mockRouterPush).toHaveBeenCalledWith("/login");
  });

  it("renders children when a token is found", () => {
    localStorage.setItem("token", "mock-token");

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
    expect(mockRouterPush).not.toHaveBeenCalled();
  });
});
