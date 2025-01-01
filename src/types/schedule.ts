export interface TimeSlot {
  period: number;
  day: string;
}

export type GradeLevel = 
  | 'Pre-K'
  | 'Kindergarten'
  | '1st Grade'
  | '2nd Grade'
  | '3rd Grade'
  | '4th Grade'
  | '5th Grade'
  | 'Multiple Grades';

export interface Class {
  id: string;
  name: string;
  gradeLevel: GradeLevel;
  constraints: TimeSlot[];
}

// ... rest of the file remains the same