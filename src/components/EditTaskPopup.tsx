import React, { useState, useEffect } from "react";
import { Task } from "../types";

interface EditTaskPopupProps {
  task: Task; // Current task being edited
  onSave: (id: string, title: string, description: string) => void; // Callback for saving changes
  onClose: () => void; // Callback for closing the popup
}

const EditTaskPopup: React.FC<EditTaskPopupProps> = ({
  task,
  onSave,
  onClose,
}) => {
  // State for managing the edited title and description
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description);
  const [error, setError] = useState<string | null>(null); // State for error messages

  // Effect to handle closing the popup when the Escape key is pressed
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  // Function to handle saving the task
  const handleSave = () => {
    if (editTitle.trim() === "") {
      setError("Title cannot be empty"); // Set error if title is empty
      return;
    }
    if (editDescription.trim() === "") {
      setError("Description cannot be empty"); // Set error if description is empty
      return;
    }
    setError(null); // Clear any previous errors
    onSave(task.id, editTitle.trim(), editDescription.trim()); // Save the task with updated values
    onClose(); // Close the popup
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      {/* Popup container */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          Edit Task
        </h2>
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        {/* Input field for task title */}
        <input
          type="text"
          value={editTitle}
          onChange={(e) => {
            setEditTitle(e.target.value); // Update title state on change
            if (error) setError(null); // Clear error if title is edited
          }}
          className="w-full px-3 py-2 mb-4 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-indigo-900 dark:focus:border-indigo-500"
          placeholder="Task title"
        />
        {/* Textarea for task description */}
        <textarea
          value={editDescription}
          onChange={(e) => {
            setEditDescription(e.target.value); // Update description state on change
            if (error) setError(null); // Clear error if description is edited
          }}
          className="w-full px-3 py-2 mb-4 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-indigo-900 dark:focus:border-indigo-500"
          rows={3}
          placeholder="Task description"
        />
        <div className="flex justify-end space-x-2">
          {/* Cancel button */}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          {/* Save button */}
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTaskPopup;
