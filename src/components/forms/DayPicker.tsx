import React from 'react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const;
type Day = typeof DAYS[number];

interface DayPickerProps {
  value: Day;
  onChange: (day: Day) => void;
  error?: string;
}

export function DayPicker({ value, onChange, error }: DayPickerProps) {
  return (
    <div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as Day)}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      >
        {DAYS.map((day) => (
          <option key={day} value={day}>
            {day}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}