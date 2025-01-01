import React from 'react';
import { format } from 'date-fns';
import type { TimeSlot, Class } from '../../types/schedule';
import { useScheduleStore } from '../../store/scheduleStore';

interface WeekGridProps {
  startDate: Date;
  constraints: (TimeSlot & { classId?: string })[];
  onChange: (constraints: TimeSlot[]) => void;
  showClassNames?: boolean;
  classes?: Class[];
}

export function WeekGrid({ 
  startDate, 
  constraints, 
  onChange, 
  showClassNames = false,
  classes = []
}: WeekGridProps) {
  const periodsPerDay = useScheduleStore((state) => state.periodsPerDay);
  const periods = Array.from({ length: periodsPerDay }, (_, i) => i + 1);

  const isConstraint = (date: Date, period: number) => {
    const day = format(date, 'EEEE');
    return constraints.some(
      (constraint) => constraint.day === day && constraint.period === period
    );
  };

  const getClassForSlot = (date: Date, period: number) => {
    const day = format(date, 'EEEE');
    const slot = constraints.find(
      (constraint) => constraint.day === day && 
                     constraint.period === period && 
                     constraint.classId
    );
    if (slot?.classId) {
      return classes.find(c => c.id === slot.classId);
    }
    return null;
  };

  const toggleConstraint = (date: Date, period: number) => {
    const day = format(date, 'EEEE');
    if (isConstraint(date, period)) {
      onChange(
        constraints.filter(
          (constraint) => !(constraint.day === day && constraint.period === period)
        )
      );
    } else {
      onChange([...constraints, { day, period }]);
    }
  };

  // Generate week dates
  const weekDates = Array.from({ length: 5 }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    return date;
  });

  return (
    <div className="border rounded-lg bg-white shadow-sm">
      <div className="grid grid-cols-6 gap-px bg-gray-200">
        {/* Header - Empty cell + Days */}
        <div className="bg-white p-2" />
        {weekDates.map((date) => (
          <div
            key={date.toISOString()}
            className="bg-white p-2 text-center"
          >
            <div className="text-sm font-medium text-gray-900">
              {format(date, 'EEE')}
            </div>
            <div className="text-xs text-gray-500">
              {format(date, 'MMM d')}
            </div>
          </div>
        ))}

        {/* Grid rows */}
        {periods.map((period) => (
          <React.Fragment key={period}>
            {/* Period label */}
            <div className="bg-white p-2 text-sm font-medium text-gray-700">
              P{period}
            </div>
            {/* Time slots */}
            {weekDates.map((date) => {
              const classInSlot = showClassNames ? getClassForSlot(date, period) : null;
              return (
                <button
                  key={`${date.toISOString()}-${period}`}
                  type="button"
                  onClick={() => toggleConstraint(date, period)}
                  disabled={showClassNames}
                  className={`bg-white transition-colors p-2 ${
                    classInSlot
                      ? 'bg-blue-50 hover:bg-blue-100'
                      : isConstraint(date, period)
                      ? 'bg-red-50 hover:bg-red-100'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {classInSlot && (
                    <div className="text-xs text-blue-800 font-medium truncate">
                      {classInSlot.name}
                    </div>
                  )}
                </button>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}