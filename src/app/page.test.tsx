import React from "react";
import { render } from "@testing-library/react";
import { useRouter } from "next/navigation";
import HomePage from "./page";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("HomePage Component", () => {
  const mockRouterPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockRouterPush,
    });
  });

  it("redirects to /login on render", () => {
    render(<HomePage />);
    expect(mockRouterPush).toHaveBeenCalledWith("/login");
  });
});
