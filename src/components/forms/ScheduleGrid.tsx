import React from 'react';
import type { TimeSlot } from '../../types/schedule';
import { useScheduleStore } from '../../store/scheduleStore';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const;

interface ScheduleGridProps {
  value: TimeSlot[];
  onChange: (constraints: TimeSlot[]) => void;
}

export function ScheduleGrid({ value, onChange }: ScheduleGridProps) {
  const periodsPerDay = useScheduleStore((state) => state.periodsPerDay);
  const periods = Array.from({ length: periodsPerDay }, (_, i) => i + 1);

  const isConstraint = (day: string, period: number) => {
    return value.some((constraint) => 
      constraint.day === day && constraint.period === period
    );
  };

  const toggleConstraint = (day: string, period: number) => {
    if (isConstraint(day, period)) {
      onChange(value.filter((constraint) => 
        !(constraint.day === day && constraint.period === period)
      ));
    } else {
      onChange([...value, { day, period }]);
    }
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-6 gap-1">
        {/* Header - Empty cell + Days */}
        <div className="h-8" />
        {DAYS.map((day) => (
          <div key={day} className="h-8 flex items-center justify-center text-sm font-medium text-gray-700">
            {day.slice(0, 3)}
          </div>
        ))}

        {/* Grid rows */}
        {periods.map((period) => (
          <React.Fragment key={period}>
            {/* Period label */}
            <div className="h-8 flex items-center text-sm font-medium text-gray-700">
              P{period}
            </div>
            {/* Time slots */}
            {DAYS.map((day) => (
              <button
                key={`${day}-${period}`}
                type="button"
                onClick={() => toggleConstraint(day, period)}
                className={`h-8 rounded transition-colors ${
                  isConstraint(day, period)
                    ? 'bg-red-100 hover:bg-red-200 border-2 border-red-300'
                    : 'bg-green-50 hover:bg-green-100 border border-green-200'
                }`}
                title={isConstraint(day, period) ? 'Cannot attend' : 'Can attend'}
              />
            ))}
          </React.Fragment>
        ))}
      </div>
      <p className="mt-2 text-sm text-gray-500">
        Click periods to mark when the class cannot attend
      </p>
    </div>
  );
}