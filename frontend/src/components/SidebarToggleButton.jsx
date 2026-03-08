import React from "react";

const SidebarToggleButton = ({ isSidebarOpen, onToggle }) => {
  if (isSidebarOpen) {
    return null;
  }

  return (
    <button
      onClick={onToggle}
      aria-label="Open sidebar"
      className="relative z-50 w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100"
      type="button"
    >
      <i className="fas fa-bars" />
    </button>
  );
};

export default SidebarToggleButton;