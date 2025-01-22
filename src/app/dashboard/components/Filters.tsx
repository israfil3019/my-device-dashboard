"use client";

import React from "react";

interface FiltersProps {
  interval: string;
  setInterval: (value: string) => void;
}

export default function Filters({ interval, setInterval }: FiltersProps) {
  const intervals = ["daily", "weekly", "monthly"]; // Define intervals

  return (
    <div className="mb-4">
      <div className="flex justify-center gap-4">
        {intervals.map((value) => (
          <button
            key={value}
            onClick={() => setInterval(value)}
            className={`px-4 py-2 rounded ${
              interval === value
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}
