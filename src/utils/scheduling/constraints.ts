import type { Class, TimeSlot } from '../../types/schedule';
import type { SchedulingConstraint, SchedulingVariable } from './types';

export function generateConstraints(
  classes: Class[],
  teacherConstraints: TimeSlot[]
): SchedulingConstraint[] {
  const constraints: SchedulingConstraint[] = [];

  // Class constraints - classes can't be scheduled during their constraint periods
  classes.forEach(cls => {
    cls.constraints.forEach(constraint => {
      const dayIndex = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].indexOf(constraint.day);
      constraints.push({
        type: 'class',
        variables: [{
          classId: cls.id,
          day: dayIndex,
          period: constraint.period
        }],
        forbidden: true
      });
    });
  });

  // Teacher constraints
  teacherConstraints.forEach(constraint => {
    const dayIndex = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].indexOf(constraint.day);
    constraints.push({
      type: 'teacher',
      variables: classes.map(cls => ({
        classId: cls.id,
        day: dayIndex,
        period: constraint.period
      })),
      forbidden: true
    });
  });

  // Only one class per period
  for (let day = 0; day < 5; day++) {
    for (let period = 1; period <= 8; period++) {
      constraints.push({
        type: 'single_class_per_period',
        variables: classes.map(cls => ({
          classId: cls.id,
          day,
          period
        }))
      });
    }
  }

  return constraints;
}