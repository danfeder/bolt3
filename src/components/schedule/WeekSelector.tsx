import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface WeekSelectorProps {
  currentWeek: number;
  totalWeeks: number;
  onWeekChange: (week: number) => void;
}

export function WeekSelector({ currentWeek, totalWeeks, onWeekChange }: WeekSelectorProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <button
        onClick={() => onWeekChange(currentWeek - 1)}
        disabled={currentWeek === 1}
        className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      
      <div className="text-lg font-medium text-gray-900">
        Week {currentWeek} of {totalWeeks}
      </div>
      
      <button
        onClick={() => onWeekChange(currentWeek + 1)}
        disabled={currentWeek === totalWeeks}
        className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}