"use client";

import React from "react";

interface SpinnerProps {
  overlay?: boolean;
}

const Spinner: React.FC<SpinnerProps> = ({ overlay = false }) => {
  if (overlay) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div
          className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"
          data-testid="spinner-overlay"
        ></div>
      </div>
    );
  }

  return (
    <div
      className="flex justify-center items-center h-full"
      data-testid="spinner"
    >
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
};

export default Spinner;
