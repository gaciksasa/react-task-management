import { useEffect, useState } from "react";
import { Task, TaskListProps } from "../types";
import { FaEdit, FaTrash, FaGripVertical } from "react-icons/fa";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DroppableProps,
} from "@hello-pangea/dnd";
import EditTaskPopup from "./EditTaskPopup";

interface ExtendedTaskListProps extends TaskListProps {
  onReorderTasks: (tasks: Task[]) => void;
  isEditMode: boolean;
}

// Wrapper component to suppress the warning for non-SSR environments
const StrictModeDroppable = ({ children, ...props }: DroppableProps) => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));
    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);

  if (!enabled) {
    return null;
  }

  return <Droppable {...props}>{children}</Droppable>;
};

function TaskList({
  tasks,
  onToggleTask,
  onDeleteTask,
  onEditTask,
  onReorderTasks,
  isEditMode,
}: ExtendedTaskListProps) {
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Handle the drag-and-drop end event
  const onDragEnd = (result: DropResult) => {
    if (!result.destination || isEditMode) {
      return; // Exit if no valid drop location or edit mode is active
    }

    // Reorder tasks based on drag-and-drop result
    const newTasks = Array.from(tasks);
    const [reorderedItem] = newTasks.splice(result.source.index, 1);
    newTasks.splice(result.destination.index, 0, reorderedItem);

    onReorderTasks(newTasks); // Update the task order in the state
  };

  if (tasks.length === 0) {
    // Show a message if no tasks are available
    return (
      <p className="text-center text-gray-500 dark:text-gray-400">
        No tasks yet. Add a task to get started!
      </p>
    );
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <StrictModeDroppable droppableId="taskList">
        {(provided) => (
          <ul
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-4"
          >
            {tasks.map((task: Task, index: number) => (
              <Draggable
                key={task.id}
                draggableId={task.id.toString()}
                index={index}
                isDragDisabled={isEditMode} // Disable dragging in edit mode
              >
                {(provided, snapshot) => (
                  <li
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={`bg-white dark:bg-gray-700 shadow-md rounded-lg p-4 transition-colors duration-200 flex items-center ${
                      snapshot.isDragging ? "opacity-70" : ""
                    }`}
                  >
                    {/* Drag handle icon, hidden in edit mode */}
                    {!isEditMode && (
                      <div
                        {...provided.dragHandleProps}
                        className="mr-3 text-gray-500 dark:text-gray-400"
                      >
                        <FaGripVertical />
                      </div>
                    )}
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => onToggleTask(task.id)} // Toggle task completion
                      className="form-checkbox h-5 w-5 text-blue-600 dark:text-blue-400 rounded border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 transition duration-150 ease-in-out mr-3"
                    />
                    <div className="flex-grow">
                      {/* Task title and description with conditional styles */}
                      <h3
                        className={`text-lg font-semibold ${
                          task.completed
                            ? "line-through text-gray-500 dark:text-gray-400"
                            : "text-gray-900 dark:text-white"
                        }`}
                      >
                        {task.title}
                      </h3>
                      <p
                        className={`mt-1 text-sm ${
                          task.completed
                            ? "line-through text-gray-400 dark:text-gray-500"
                            : "text-gray-600 dark:text-gray-300"
                        }`}
                      >
                        {task.description}
                      </p>
                    </div>
                    {/* Edit and Delete buttons */}
                    <div className="flex space-x-2 ml-3">
                      <button
                        onClick={() => setEditingTask(task)} // Open edit popup
                        className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 dark:bg-blue-600 dark:hover:bg-blue-700"
                        aria-label="Edit task"
                      >
                        <FaEdit className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => onDeleteTask(task.id)} // Delete the task
                        className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 dark:bg-red-600 dark:hover:bg-red-700"
                        aria-label="Delete task"
                      >
                        <FaTrash className="h-3 w-3" />
                      </button>
                    </div>
                  </li>
                )}
              </Draggable>
            ))}
            {provided.placeholder} {/* Placeholder for droppable spacing */}
          </ul>
        )}
      </StrictModeDroppable>
      {/* Edit task popup, shown when a task is being edited */}
      {editingTask && (
        <EditTaskPopup
          task={editingTask}
          onSave={onEditTask}
          onClose={() => setEditingTask(null)} // Close popup after saving
        />
      )}
    </DragDropContext>
  );
}

export default TaskList;
