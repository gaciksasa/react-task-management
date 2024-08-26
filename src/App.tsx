import React, { useState } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import FilterButtons from "./components/FilterButtons";
import DarkModeToggle from "./components/DarkModeToggle";
import { useTasks } from "./hooks/useTasks";

function App() {
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
  const [isEditMode, setIsEditMode] = useState(false);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const newTasks = Array.from(tasks);
    const [reorderedItem] = newTasks.splice(result.source.index, 1);
    newTasks.splice(result.destination.index, 0, reorderedItem);

    reorderTasks(newTasks);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-6 flex flex-col justify-center sm:py-12 transition-colors duration-200">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 dark:from-cyan-600 dark:to-light-blue-700 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl transition-colors duration-200"></div>
        <div className="relative px-4 py-10 bg-white dark:bg-gray-800 shadow-lg sm:rounded-3xl sm:p-20 transition-colors duration-200">
          <div className="max-w-md mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Task Management
              </h1>
              <DarkModeToggle />
            </div>
            {!isEditMode && (
              <>
                <TaskForm onAddTask={addTask} />
                <FilterButtons filter={filter} onFilterChange={setFilter} />
              </>
            )}
            <DragDropContext onDragEnd={onDragEnd}>
              <TaskList
                tasks={tasks}
                onToggleTask={toggleTask}
                onDeleteTask={deleteTask}
                onEditTask={(id, title, description) => {
                  editTask(id, title, description);
                  setIsEditMode(false);
                }}
                onReorderTasks={reorderTasks}
                isEditMode={isEditMode}
              />
            </DragDropContext>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
