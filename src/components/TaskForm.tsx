import React, { useState } from "react";
import { TaskFormProps } from "../types";

function TaskForm({ onAddTask }: TaskFormProps) {
  // State to manage the input values for title and description
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission behavior
    if (title.trim()) {
      onAddTask(title, description); // Call the parent function to add the task
      setTitle(""); // Clear the title input
      setDescription(""); // Clear the description input
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="mb-4">
        {/* Input field for task title */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)} // Update title state on change
          placeholder="Task title"
          className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-indigo-900 dark:focus:border-indigo-500"
          required
        />
      </div>
      <div className="mb-4">
        {/* Textarea field for task description */}
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)} // Update description state on change
          placeholder="Task description"
          className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-indigo-900 dark:focus:border-indigo-500"
          rows={3}
        />
      </div>
      {/* Submit button to add the task */}
      <button
        type="submit"
        className="w-full px-3 py-3 text-white bg-indigo-500 rounded-md focus:bg-indigo-600 focus:outline-none hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700"
      >
        Add Task
      </button>
    </form>
  );
}

export default TaskForm;
