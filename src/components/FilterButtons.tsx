import { FilterButtonsProps } from "../types";

function FilterButtons({ filter, onFilterChange }: FilterButtonsProps) {
  return (
    <div className="flex space-x-2 mb-6">
      <button
        onClick={() => onFilterChange("all")}
        className={`flex-1 py-2 px-4 rounded-md focus:outline-none focus:shadow-outline transition-colors duration-200 ${
          filter === "all"
            ? "bg-indigo-500 text-white dark:bg-indigo-600"
            : "bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        }`}
      >
        All
      </button>
      <button
        onClick={() => onFilterChange("active")}
        className={`flex-1 py-2 px-4 rounded-md focus:outline-none focus:shadow-outline transition-colors duration-200 ${
          filter === "active"
            ? "bg-indigo-500 text-white dark:bg-indigo-600"
            : "bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        }`}
      >
        Active
      </button>
      <button
        onClick={() => onFilterChange("completed")}
        className={`flex-1 py-2 px-4 rounded-md focus:outline-none focus:shadow-outline transition-colors duration-200 ${
          filter === "completed"
            ? "bg-indigo-500 text-white dark:bg-indigo-600"
            : "bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        }`}
      >
        Completed
      </button>
    </div>
  );
}

export default FilterButtons;
