export interface ScheduleConstraints {
  startDate: string;
  allowConsecutivePeriods: boolean;
  maxPeriodsPerDay: number;
  maxPeriodsPerWeek: number;
}