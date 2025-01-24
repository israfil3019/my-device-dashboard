import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import RootLayout, { metadata } from "./layout";

describe("RootLayout Component", () => {
  it("renders children correctly", () => {
    render(
      <RootLayout>
        <div data-testid="child">Child Content</div>
      </RootLayout>
    );

    expect(screen.getByTestId("child")).toBeInTheDocument();
    expect(screen.getByText("Child Content")).toBeInTheDocument();
  });

  it("applies metadata correctly", () => {
    expect(metadata.title).toBe("Mould Detection Challenge");
    expect(metadata.description).toBe("All rights reserved");
  });

  it("renders favicon link", () => {
    render(
      <RootLayout>
        <div />
      </RootLayout>
    );

    const link = document.querySelector("link[rel='icon']");
    expect(link).toHaveAttribute("href", "./leaf.svg");
    expect(link).toHaveAttribute("type", "image/svg+xml");
  });

  it("applies font variables to the body", () => {
    const { container } = render(
      <RootLayout>
        <div />
      </RootLayout>
    );

    const body = container.querySelector("body");
    expect(body).toHaveClass("bg-gray-50");
    expect(body).toHaveClass("text-gray-800");
    expect(body).toHaveClass("antialiased");
    expect(body).toHaveClass("min-h-screen");
  });
});
