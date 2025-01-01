import type { GradeLevel } from '../types/schedule';

export function inferGradeLevel(className: string): GradeLevel {
  // Handle special combined grade levels
  if (className.includes(',')) {
    return 'Multiple Grades';
  }

  // Extract grade level from class name patterns
  if (className.startsWith('PK')) return 'Pre-K';
  if (className.startsWith('K')) return 'Kindergarten';
  
  const match = className.match(/^(\d+)-/);
  if (match) {
    const grade = match[1];
    switch (grade) {
      case '1': return '1st Grade';
      case '2': return '2nd Grade';
      case '3': return '3rd Grade';
      case '4': return '4th Grade';
      case '5': return '5th Grade';
      default: return 'Multiple Grades';
    }
  }
  
  return 'Multiple Grades';
}