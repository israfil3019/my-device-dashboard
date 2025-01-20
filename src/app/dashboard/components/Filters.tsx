'use client';

import React from 'react';

interface FiltersProps {
  startDate: string;
  setStartDate: (value: string) => void;
  interval: string;
  setInterval: (value: string) => void;
}

export default function Filters({
  startDate,
  setStartDate,
  interval,
  setInterval,
}: FiltersProps) {
  return (
    <div className="flex items-center gap-4 mb-4">
      <div>
        <label className="block text-sm font-medium">Start Date</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="p-2 border rounded"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Interval</label>
        <select
          value={interval}
          onChange={(e) => setInterval(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>
    </div>
  );
}
