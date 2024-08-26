import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import TaskList from "../../components/TaskList";
import {
  DragDropContext,
  DroppableProvided,
  DropResult,
} from "react-beautiful-dnd";

// Mock react-beautiful-dnd
jest.mock("react-beautiful-dnd", () => ({
  Droppable: ({
    children,
  }: {
    children: (provided: DroppableProvided, snapshot: any) => React.ReactNode;
  }) =>
    children(
      {
        draggableProps: {
          style: {},
        },
        innerRef: jest.fn(),
        placeholder: null,
      } as unknown as DroppableProvided,
      {}
    ),
  DragDropContext: ({
    children,
    onDragEnd,
  }: {
    children: React.ReactNode;
    onDragEnd: (result: DropResult) => void;
  }) => <div onDragEnd={onDragEnd as any}>{children}</div>,
}));

describe("TaskList", () => {
  const mockTasks = [
    {
      id: "1",
      title: "Task 1",
      description: "Description 1",
      completed: false,
    },
    { id: "2", title: "Task 2", description: "Description 2", completed: true },
  ];
  const mockOnToggleTask = jest.fn();
  const mockOnDeleteTask = jest.fn();
  const mockOnEditTask = jest.fn();
  const mockOnReorderTasks = jest.fn();

  const renderComponent = (isEditMode = false) =>
    render(
      <DragDropContext onDragEnd={jest.fn()}>
        <TaskList
          tasks={mockTasks}
          onToggleTask={mockOnToggleTask}
          onDeleteTask={mockOnDeleteTask}
          onEditTask={mockOnEditTask}
          onReorderTasks={mockOnReorderTasks}
          isEditMode={isEditMode}
        />
      </DragDropContext>
    );

  it("renders all tasks", () => {
    renderComponent();

    mockTasks.forEach((task) => {
      const taskElement = screen.queryByText(task.title);
      if (!taskElement) {
        console.error(`Task with title "${task.title}" not found`);
        console.log("Current DOM:", document.body.innerHTML);
      }
      expect(taskElement).toBeInTheDocument();
    });
  });

  it("calls onToggleTask when checkbox is clicked", () => {
    renderComponent();
    const checkbox = screen.getAllByRole("checkbox")[0];
    fireEvent.click(checkbox);
    expect(mockOnToggleTask).toHaveBeenCalledWith("1");
  });

  it("calls onDeleteTask when delete button is clicked", () => {
    renderComponent();
    const deleteButtons = screen.getAllByLabelText("Delete task");
    fireEvent.click(deleteButtons[0]);
    expect(mockOnDeleteTask).toHaveBeenCalledWith("1");
  });

  it("calls onEditTask when edit button is clicked", () => {
    renderComponent();
    const editButtons = screen.getAllByLabelText("Edit task");
    fireEvent.click(editButtons[0]);
    expect(mockOnEditTask).toHaveBeenCalledWith("1", "Task 1", "Description 1");
  });

  it("disables drag handle when in edit mode", () => {
    renderComponent(true);
    const dragHandles = screen.queryAllByTestId("drag-handle");
    expect(dragHandles.length).toBe(0);
  });

  it("renders tasks as completed when they are marked as such", () => {
    renderComponent();
    const completedTaskTitle = screen.getByText("Task 2");
    expect(completedTaskTitle).toHaveClass("line-through");
  });
});
