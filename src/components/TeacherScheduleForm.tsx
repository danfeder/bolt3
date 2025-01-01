import React, { useState } from 'react';
import { format, addWeeks, subWeeks, startOfWeek } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { WeekCalendar } from './calendar/WeekCalendar';
import { useScheduleStore } from '../store/scheduleStore';

export function TeacherScheduleForm() {
  const [currentWeek, setCurrentWeek] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  const { teacherSchedule, setTeacherSchedule } = useScheduleStore();

  const nextWeek = () => setCurrentWeek(addWeeks(currentWeek, 1));
  const prevWeek = () => setCurrentWeek(subWeeks(currentWeek, 1));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">Teacher Schedule</h2>
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={prevWeek}
            className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="Previous week"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="text-lg font-medium">
            {format(currentWeek, 'MMMM yyyy')}
          </span>
          <button
            type="button"
            onClick={nextWeek}
            className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="Next week"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <WeekCalendar
        startDate={currentWeek}
        constraints={teacherSchedule.constraints}
        onChange={(constraints) =>
          setTeacherSchedule({ ...teacherSchedule, constraints })
        }
      />
    </div>
  );
}