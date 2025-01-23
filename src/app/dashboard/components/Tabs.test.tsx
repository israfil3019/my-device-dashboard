import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Tabs from "./Tabs";

describe("Tabs Component", () => {
  const tabs = [
    {
      label: "Tab 1",
      content: <div data-testid="tab1-content">Content 1</div>,
    },
    {
      label: "Tab 2",
      content: <div data-testid="tab2-content">Content 2</div>,
    },
    {
      label: "Tab 3",
      content: <div data-testid="tab3-content">Content 3</div>,
    },
  ];

  it("renders all tabs correctly", () => {
    render(<Tabs tabs={tabs} />);

    tabs.forEach((tab) => {
      expect(screen.getByText(tab.label)).toBeInTheDocument();
    });
  });

  it("displays the content of the first tab by default", () => {
    render(<Tabs tabs={tabs} />);

    expect(screen.getByTestId("tab1-content")).toBeInTheDocument();
  });

  it("switches to the correct tab when clicked", () => {
    render(<Tabs tabs={tabs} />);

    const tab2Button = screen.getByText("Tab 2");
    fireEvent.click(tab2Button);

    expect(screen.queryByTestId("tab1-content")).not.toBeInTheDocument();
    expect(screen.getByTestId("tab2-content")).toBeInTheDocument();

    const tab3Button = screen.getByText("Tab 3");
    fireEvent.click(tab3Button);

    expect(screen.queryByTestId("tab2-content")).not.toBeInTheDocument();
    expect(screen.getByTestId("tab3-content")).toBeInTheDocument();
  });

  it("applies the correct styles to the active tab", () => {
    render(<Tabs tabs={tabs} />);

    const tab1Button = screen.getByText("Tab 1");
    expect(tab1Button).toHaveClass("bg-blue-500 text-white");

    const tab2Button = screen.getByText("Tab 2");
    fireEvent.click(tab2Button);

    expect(tab1Button).toHaveClass("bg-gray-200");
    expect(tab2Button).toHaveClass("bg-blue-500 text-white");
  });

  it("handles empty tabs array gracefully", () => {
    render(<Tabs tabs={[]} />);

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.queryByTestId("tab1-content")).not.toBeInTheDocument();
  });
});
