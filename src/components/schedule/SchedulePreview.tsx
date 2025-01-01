import React, { useState } from 'react';
import { format, addWeeks, startOfWeek } from 'date-fns';
import { useScheduleStore } from '../../store/scheduleStore';
import { WeekSelector } from './WeekSelector';
import { WeekGrid } from '../calendar/WeekGrid';

export function SchedulePreview() {
  const { currentSchedule } = useScheduleStore();
  const [currentWeek, setCurrentWeek] = useState(1);

  if (!currentSchedule) {
    return (
      <div className="text-center py-8 text-gray-500">
        No schedule has been generated yet. Use the generator above to create a new schedule.
      </div>
    );
  }

  const startDate = new Date(currentSchedule.startDate);
  const endDate = new Date(currentSchedule.endDate);
  const totalWeeks = Math.ceil((endDate.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
  
  const weekStartDate = startOfWeek(addWeeks(startDate, currentWeek - 1), { weekStartsOn: 1 });

  // Transform assignments into constraints format for WeekGrid
  const weekConstraints = Object.entries(currentSchedule.assignments).flatMap(([classId, slots]) => 
    slots.map(slot => ({
      ...slot,
      classId
    }))
  );

  return (
    <div className="space-y-4">
      <WeekSelector
        currentWeek={currentWeek}
        totalWeeks={totalWeeks}
        onWeekChange={setCurrentWeek}
      />
      
      <div className="text-sm text-gray-500 mb-4">
        {format(weekStartDate, 'MMMM d, yyyy')} - {format(addWeeks(weekStartDate, 1), 'MMMM d, yyyy')}
      </div>

      <WeekGrid
        startDate={weekStartDate}
        constraints={weekConstraints}
        onChange={() => {}} // Schedule is read-only
        showClassNames
        classes={currentSchedule.classes}
      />
    </div>
  );
}