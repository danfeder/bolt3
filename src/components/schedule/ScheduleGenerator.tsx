import React, { useState } from 'react';
import { CalendarRange } from 'lucide-react';
import { useScheduleStore } from '../../store/scheduleStore';
import { generateSchedule } from '../../utils/scheduling';
import { SchedulePreview } from './SchedulePreview';

export function ScheduleGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { 
    classes, 
    teacherSchedule, 
    periodsPerDay,
    scheduleConstraints,
    setCurrentSchedule 
  } = useScheduleStore();

  const handleGenerateSchedule = async () => {
    try {
      setIsGenerating(true);
      setError(null);
      const schedule = await generateSchedule(
        classes,
        teacherSchedule.constraints,
        periodsPerDay,
        scheduleConstraints
      );
      setCurrentSchedule(schedule);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to generate schedule');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <CalendarRange className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">Generate Schedule</h2>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Maximum Classes Per Day
              <input
                type="number"
                min={1}
                max={8}
                value={scheduleConstraints.maxPeriodsPerDay}
                onChange={(e) => useScheduleStore.setState((state) => ({
                  scheduleConstraints: {
                    ...state.scheduleConstraints,
                    maxPeriodsPerDay: parseInt(e.target.value)
                  }
                }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Maximum Classes Per Week
              <input
                type="number"
                min={1}
                max={40}
                value={scheduleConstraints.maxPeriodsPerWeek}
                onChange={(e) => useScheduleStore.setState((state) => ({
                  scheduleConstraints: {
                    ...state.scheduleConstraints,
                    maxPeriodsPerWeek: parseInt(e.target.value)
                  }
                }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Start Date
              <input
                type="date"
                value={scheduleConstraints.startDate}
                onChange={(e) => useScheduleStore.setState((state) => ({
                  scheduleConstraints: {
                    ...state.scheduleConstraints,
                    startDate: e.target.value
                  }
                }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </label>
          </div>

          <div className="flex items-end">
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                checked={scheduleConstraints.allowConsecutivePeriods}
                onChange={(e) => useScheduleStore.setState((state) => ({
                  scheduleConstraints: {
                    ...state.scheduleConstraints,
                    allowConsecutivePeriods: e.target.checked
                  }
                }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Allow Back-to-Back Classes</span>
            </label>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleGenerateSchedule}
            disabled={isGenerating || classes.length === 0}
            className={`
              inline-flex items-center px-4 py-2 border border-transparent 
              rounded-md shadow-sm text-sm font-medium text-white
              ${isGenerating || classes.length === 0 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              }
            `}
          >
            {isGenerating ? 'Generating...' : 'Generate Schedule'}
          </button>
        </div>

        <SchedulePreview />
      </div>
    </div>
  );
}