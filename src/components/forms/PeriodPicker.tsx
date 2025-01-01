import React from 'react';
import { useScheduleStore } from '../../store/scheduleStore';

interface PeriodPickerProps {
  value: number;
  onChange: (period: number) => void;
  error?: string;
}

export function PeriodPicker({ value, onChange, error }: PeriodPickerProps) {
  const periodsPerDay = useScheduleStore((state) => state.periodsPerDay);
  const periods = Array.from({ length: periodsPerDay }, (_, i) => i + 1);

  return (
    <div>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      >
        {periods.map((period) => (
          <option key={period} value={period}>
            Period {period}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}