import type { Class, TimeSlot, RotationSchedule } from '../../types/schedule';

function isValidAssignment(
  classId: string,
  day: string,
  period: number,
  classes: Class[],
  teacherConstraints: TimeSlot[],
  assignments: Record<string, TimeSlot[]>
): boolean {
  // Check class constraints
  const cls = classes.find(c => c.id === classId);
  if (!cls) return false;

  if (cls.constraints.some(c => c.day === day && c.period === period)) {
    return false;
  }

  // Check teacher constraints
  if (teacherConstraints.some(c => c.day === day && c.period === period)) {
    return false;
  }

  // Check if period is already assigned
  for (const [assignedClassId, slots] of Object.entries(assignments)) {
    if (assignedClassId !== classId && 
        slots.some(s => s.day === day && s.period === period)) {
      return false;
    }
  }

  return true;
}

export async function solveSchedule(
  classes: Class[],
  teacherConstraints: TimeSlot[],
  periodsPerDay: number
): Promise<RotationSchedule> {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const assignments: Record<string, TimeSlot[]> = {};
  
  // Initialize assignments
  classes.forEach(cls => {
    assignments[cls.id] = [];
  });

  // Simple greedy assignment
  for (const cls of classes) {
    let assigned = false;
    
    // Try each day and period until we find a valid slot
    for (const day of days) {
      for (let period = 1; period <= periodsPerDay; period++) {
        if (isValidAssignment(cls.id, day, period, classes, teacherConstraints, assignments)) {
          assignments[cls.id].push({ day, period });
          assigned = true;
          break;
        }
      }
      if (assigned) break;
    }
    
    if (!assigned) {
      throw new Error(`Could not find valid slot for class: ${cls.name}`);
    }
  }

  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 14); // 2-week schedule

  return {
    id: crypto.randomUUID(),
    startDate,
    endDate,
    classes,
    assignments
  };
}