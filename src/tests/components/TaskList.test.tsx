/* eslint-disable testing-library/prefer-find-by */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import TaskList from "../../components/TaskList";
import {
  DroppableProvided,
  DraggableProvided,
  DraggableStateSnapshot,
} from "react-beautiful-dnd";
import { Task } from "../../types"; // Make sure to import the Task type from your types file

// Mock EditTaskPopup component with proper typing
jest.mock("../../components/EditTaskPopup", () => {
  return function MockEditTaskPopup({
    task,
    onSave,
    onClose,
  }: {
    task: Task;
    onSave: (id: string, title: string, description: string) => void;
    onClose: () => void;
  }) {
    return (
      <div data-testid="edit-task-popup">
        <button
          onClick={() => onSave(task.id, "Updated Task", "Updated Description")}
        >
          Save
        </button>
        <button onClick={onClose}>Cancel</button>
      </div>
    );
  };
});

// Mock for react-beautiful-dnd
jest.mock("react-beautiful-dnd", () => ({
  DragDropContext: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="drag-drop-context">{children}</div>
  ),
  Droppable: ({
    children,
  }: {
    children: (provided: DroppableProvided) => React.ReactNode;
  }) =>
    children({
      draggableProps: {
        style: {},
      },
      innerRef: jest.fn(),
      placeholder: null,
    } as unknown as DroppableProvided),
  Draggable: ({
    children,
  }: {
    children: (
      provided: DraggableProvided,
      snapshot: DraggableStateSnapshot
    ) => React.ReactNode;
  }) =>
    children(
      {
        draggableProps: {
          style: {},
        },
        innerRef: jest.fn(),
        dragHandleProps: null,
      } as unknown as DraggableProvided,
      {
        isDragging: false,
        isDropAnimating: false,
        isClone: false,
        dropAnimation: null,
        draggingOver: null,
        combineWith: null,
        combineTargetFor: null,
        mode: null,
      } as DraggableStateSnapshot
    ),
}));

describe("TaskList", () => {
  const mockTasks: Task[] = [
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

  const renderComponent = (isEditMode = false) => {
    return render(
      <TaskList
        tasks={mockTasks}
        onToggleTask={mockOnToggleTask}
        onDeleteTask={mockOnDeleteTask}
        onEditTask={mockOnEditTask}
        onReorderTasks={mockOnReorderTasks}
        isEditMode={isEditMode}
      />
    );
  };

  it("renders all tasks", async () => {
    renderComponent();
    await waitFor(() => expect(screen.getByText("Task 1")).toBeInTheDocument());
    expect(screen.getByText("Description 1")).toBeInTheDocument();
    expect(screen.getByText("Task 2")).toBeInTheDocument();
    expect(screen.getByText("Description 2")).toBeInTheDocument();
  });

  it("opens EditTaskPopup when edit button is clicked and calls onEditTask when saved", async () => {
    renderComponent();
    await waitFor(() =>
      expect(screen.getAllByLabelText("Edit task")).toHaveLength(2)
    );

    const editButtons = screen.getAllByLabelText("Edit task");
    fireEvent.click(editButtons[0]);

    await waitFor(() =>
      expect(screen.getByTestId("edit-task-popup")).toBeInTheDocument()
    );

    const saveButton = screen.getByText("Save");
    fireEvent.click(saveButton);

    expect(mockOnEditTask).toHaveBeenCalledWith(
      "1",
      "Updated Task",
      "Updated Description"
    );
  });

  it("calls onDeleteTask when delete button is clicked", async () => {
    renderComponent();
    await waitFor(() =>
      expect(screen.getAllByLabelText("Delete task")).toHaveLength(2)
    );
    const deleteButtons = screen.getAllByLabelText("Delete task");
    fireEvent.click(deleteButtons[0]);
    expect(mockOnDeleteTask).toHaveBeenCalledWith("1");
  });

  it("calls onToggleTask when checkbox is clicked", async () => {
    renderComponent();
    await waitFor(() =>
      expect(screen.getAllByRole("checkbox")).toHaveLength(2)
    );
    const checkboxes = screen.getAllByRole("checkbox");
    fireEvent.click(checkboxes[0]);
    expect(mockOnToggleTask).toHaveBeenCalledWith("1");
  });

  it("renders tasks as completed when they are marked as such", async () => {
    renderComponent();
    await waitFor(() => expect(screen.getByText("Task 2")).toBeInTheDocument());
    const completedTaskTitle = screen.getByText("Task 2");
    expect(completedTaskTitle).toHaveClass("line-through");
  });

  it("disables drag handle when in edit mode", async () => {
    renderComponent(true);
    await waitFor(() =>
      expect(screen.queryAllByTestId("drag-handle")).toHaveLength(0)
    );
  });
});
