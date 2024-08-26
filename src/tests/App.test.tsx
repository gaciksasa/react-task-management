import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "../App";

// Mock child components
jest.mock("../components/TaskForm", () => () => (
  <div data-testid="mock-task-form" />
));
jest.mock("../components/TaskList", () => () => (
  <div data-testid="mock-task-list" />
));
jest.mock("../components/FilterButtons", () => () => (
  <div data-testid="mock-filter-buttons" />
));
jest.mock("../components/DarkModeToggle", () => () => (
  <div data-testid="mock-dark-mode-toggle" />
));

describe("App", () => {
  const renderComponent = () => render(<App />);

  it("renders without crashing", () => {
    renderComponent();
    expect(screen.getByText("Task Management")).toBeInTheDocument();
  });

  it("renders all child components", () => {
    renderComponent();
    expect(screen.getByTestId("mock-task-form")).toBeInTheDocument();
    expect(screen.getByTestId("mock-task-list")).toBeInTheDocument();
    expect(screen.getByTestId("mock-filter-buttons")).toBeInTheDocument();
    expect(screen.getByTestId("mock-dark-mode-toggle")).toBeInTheDocument();
  });
});
