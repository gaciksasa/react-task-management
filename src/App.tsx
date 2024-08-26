import React, { useState } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import FilterButtons from "./components/FilterButtons";
import DarkModeToggle from "./components/DarkModeToggle";
import { useTasks } from "./hooks/useTasks";

function App() {
  // Custom hook to manage tasks and their operations
  const {
    tasks,
    addTask,
    toggleTask,
    deleteTask,
    editTask,
    filter,
    setFilter,
    reorderTasks,
  } = useTasks();

  // State to manage whether the app is in edit mode
  const [isEditMode, setIsEditMode] = useState(false);

  // Handle the drag-and-drop functionality
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return; // Exit if the item is dropped outside any droppable area

    // Reorder the tasks based on the drag-and-drop result
    const newTasks = Array.from(tasks);
    const [reorderedItem] = newTasks.splice(result.source.index, 1);
    newTasks.splice(result.destination.index, 0, reorderedItem);

    reorderTasks(newTasks); // Update the task order in the state
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-6 flex flex-col justify-center sm:py-12 transition-colors duration-200">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        {/* Background gradient and layout for the task management interface */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 dark:from-cyan-600 dark:to-light-blue-700 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl transition-colors duration-200"></div>
        <div className="relative px-4 py-10 bg-white dark:bg-gray-800 shadow-lg sm:rounded-3xl sm:p-20 transition-colors duration-200">
          <div className="max-w-md mx-auto">
            <div className="flex justify-between items-center mb-6">
              {/* Header with title and dark mode toggle */}
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Task Management
              </h1>
              <DarkModeToggle />
            </div>
            {!isEditMode && (
              <>
                {/* Form to add new tasks and filter buttons */}
                <TaskForm onAddTask={addTask} />
                <FilterButtons filter={filter} onFilterChange={setFilter} />
              </>
            )}
            <DragDropContext onDragEnd={onDragEnd}>
              {/* List of tasks with drag-and-drop and editing capabilities */}
              <TaskList
                tasks={tasks}
                onToggleTask={toggleTask}
                onDeleteTask={deleteTask}
                onEditTask={(id, title, description) => {
                  editTask(id, title, description); // Handle task editing
                  setIsEditMode(false); // Exit edit mode after saving
                }}
                onReorderTasks={reorderTasks}
                isEditMode={isEditMode} // Disable drag-and-drop during edit mode
              />
            </DragDropContext>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
