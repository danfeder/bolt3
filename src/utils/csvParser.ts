import type { TimeSlot, GradeLevel } from '../types/schedule';
import { inferGradeLevel } from './classUtils';

export function parsePeriodsString(periodsStr: string): number[] {
  return periodsStr
    .split(',')
    .map(p => p.trim())
    .filter(p => p !== '')
    .map(p => parseInt(p, 10))
    .filter(p => !isNaN(p));
}

export function parseCsvRow(row: string[]): {
  name: string;
  gradeLevel: GradeLevel;
  constraints: TimeSlot[];
} | null {
  if (row.length !== 6) return null;
  
  const [name, monday, tuesday, wednesday, thursday, friday] = row;
  if (!name) return null;

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const constraints: TimeSlot[] = [];

  [monday, tuesday, wednesday, thursday, friday].forEach((periodsStr, index) => {
    const cleanPeriodsStr = periodsStr.replace(/^"|"$/g, '');
    const periods = parsePeriodsString(cleanPeriodsStr);
    
    periods.forEach(period => {
      constraints.push({
        day: days[index],
        period
      });
    });
  });

  return {
    name,
    gradeLevel: inferGradeLevel(name),
    constraints
  };
}