export interface SchedulingVariable {
  classId: string;
  day: number;  // 0-4 for Monday-Friday
  period: number;
}

export interface SchedulingConstraint {
  type: 'class' | 'teacher' | 'single_class_per_period';
  variables: SchedulingVariable[];
  forbidden?: boolean;
}