import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import EditTaskPopup from "../../components/EditTaskPopup";

describe("EditTaskPopup", () => {
  const mockTask = {
    id: "1",
    title: "Test Task",
    description: "Test Description",
    completed: false,
  };
  const mockOnSave = jest.fn();
  const mockOnClose = jest.fn();

  const renderComponent = () =>
    render(
      <EditTaskPopup
        task={mockTask}
        onSave={mockOnSave}
        onClose={mockOnClose}
      />
    );

  it("renders with the correct initial values", () => {
    renderComponent();
    expect(screen.getByDisplayValue("Test Task")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Test Description")).toBeInTheDocument();
  });

  it("calls onSave with updated values when Save button is clicked", () => {
    renderComponent();
    const titleInput = screen.getByDisplayValue("Test Task");
    const descriptionInput = screen.getByDisplayValue("Test Description");

    fireEvent.change(titleInput, { target: { value: "Updated Task" } });
    fireEvent.change(descriptionInput, {
      target: { value: "Updated Description" },
    });

    fireEvent.click(screen.getByText("Save"));

    expect(mockOnSave).toHaveBeenCalledWith(
      "1",
      "Updated Task",
      "Updated Description"
    );
  });

  it("calls onClose when Cancel button is clicked", () => {
    renderComponent();
    fireEvent.click(screen.getByText("Cancel"));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("displays an error message when trying to save with empty title", () => {
    renderComponent();
    const titleInput = screen.getByDisplayValue("Test Task");
    fireEvent.change(titleInput, { target: { value: "" } });
    fireEvent.click(screen.getByText("Save"));
    expect(screen.getByText("Title cannot be empty")).toBeInTheDocument();
  });

  it("displays an error message when trying to save with empty description", () => {
    renderComponent();
    const descriptionInput = screen.getByDisplayValue("Test Description");
    fireEvent.change(descriptionInput, { target: { value: "" } });
    fireEvent.click(screen.getByText("Save"));
    expect(screen.getByText("Description cannot be empty")).toBeInTheDocument();
  });

  it("clears error message when user starts typing after an error", () => {
    renderComponent();
    const titleInput = screen.getByDisplayValue("Test Task");
    fireEvent.change(titleInput, { target: { value: "" } });
    fireEvent.click(screen.getByText("Save"));
    expect(screen.getByText("Title cannot be empty")).toBeInTheDocument();

    fireEvent.change(titleInput, { target: { value: "New Title" } });
    expect(screen.queryByText("Title cannot be empty")).not.toBeInTheDocument();
  });
});
