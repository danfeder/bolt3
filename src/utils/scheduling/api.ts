import type { Class, TimeSlot, RotationSchedule } from '../../types/schedule';
import type { ScheduleConstraints } from '../../types/constraints';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function generateSchedule(
  classes: Class[],
  teacherConstraints: TimeSlot[],
  periodsPerDay: number,
  constraints: ScheduleConstraints
): Promise<RotationSchedule> {
  if (!classes.length) {
    throw new Error('No classes available to schedule');
  }

  try {
    console.log('Sending request to:', API_URL);
    const response = await fetch(`${API_URL}/api/schedule`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        classes: classes.map(cls => ({
          id: cls.id,
          name: cls.name,
          gradeLevel: cls.gradeLevel,
          constraints: cls.constraints
        })),
        teacherConstraints,
        periodsPerDay,
        maxPeriodsPerDay: constraints.maxPeriodsPerDay,
        maxPeriodsPerWeek: constraints.maxPeriodsPerWeek,
        allowConsecutivePeriods: constraints.allowConsecutivePeriods,
        startDate: constraints.startDate,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Server error:', errorData);
      throw new Error(errorData.detail || 'Failed to generate schedule');
    }

    const data = await response.json();
    return {
      ...data,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
    };
  } catch (error) {
    console.error('Schedule generation error:', error);
    if (error instanceof Error) {
      throw new Error(`Schedule generation failed: ${error.message}`);
    }
    throw new Error('Failed to connect to scheduling service');
  }
}