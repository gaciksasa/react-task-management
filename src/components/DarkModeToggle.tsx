import { FaSun, FaMoon } from "react-icons/fa";
import { useDarkMode } from "../hooks/useDarkMode";

function DarkModeToggle() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDarkMode ? (
        <FaSun className="w-4 h-4 text-yellow-400" />
      ) : (
        <FaMoon className="w-4 h-4 text-gray-800" />
      )}
    </button>
  );
}

export default DarkModeToggle;
