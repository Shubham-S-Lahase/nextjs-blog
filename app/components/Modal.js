import { useTheme } from "@/lib/ThemeContext";
import { FaTimes } from "react-icons/fa";

const Modal = ({ isOpen, onClose, children }) => {
  const { theme } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`p-6 rounded-lg shadow-lg max-w-lg w-full ${
          theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
      >
        <div className="flex justify-end items-center mb-4">
          <button
            onClick={onClose}
            className={`text-gray-500 hover:text-gray-800 ${
              theme === "dark" ? "text-gray-400 hover:text-gray-200" : ""
            }`}
            aria-label="Close Modal"
          >
            <FaTimes size={24} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;