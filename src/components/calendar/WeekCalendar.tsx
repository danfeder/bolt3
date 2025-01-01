import React from 'react';
import { format, addDays } from 'date-fns';
import { WeekGrid } from './WeekGrid';
import type { TimeSlot } from '../../types/schedule';

interface WeekCalendarProps {
  startDate: Date;
  constraints: TimeSlot[];
  onChange: (constraints: TimeSlot[]) => void;
}

export function WeekCalendar({ startDate, constraints, onChange }: WeekCalendarProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Week of {format(startDate, 'MMMM d, yyyy')}
        </div>
        <div className="text-sm text-gray-500">
          to {format(addDays(startDate, 4), 'MMMM d, yyyy')}
        </div>
      </div>
      <WeekGrid
        startDate={startDate}
        constraints={constraints}
        onChange={onChange}
      />
    </div>
  );
}