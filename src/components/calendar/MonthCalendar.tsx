import React from 'react';
import { startOfMonth, eachWeekOfInterval, endOfMonth } from 'date-fns';
import { WeekGrid } from './WeekGrid';
import type { TimeSlot } from '../../types/schedule';

interface MonthCalendarProps {
  month: Date;
  constraints: TimeSlot[];
  onChange: (constraints: TimeSlot[]) => void;
}

export function MonthCalendar({ month, constraints, onChange }: MonthCalendarProps) {
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const weeks = eachWeekOfInterval(
    { start: monthStart, end: monthEnd },
    { weekStartsOn: 1 }
  );

  return (
    <div className="space-y-4">
      {weeks.map((week) => (
        <WeekGrid
          key={week.toISOString()}
          startDate={week}
          constraints={constraints}
          onChange={onChange}
        />
      ))}
    </div>
  );
}