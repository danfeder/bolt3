import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Class, RotationSchedule, SpecialEvent, TeacherSchedule } from '../types/schedule';

interface ScheduleConstraints {
  startDate: string;
  allowConsecutivePeriods: boolean;
  maxPeriodsPerDay: number;
  maxPeriodsPerWeek: number;
}

interface ScheduleState {
  classes: Class[];
  teacherSchedule: TeacherSchedule;
  rotations: RotationSchedule[];
  periodsPerDay: number;
  currentSchedule: RotationSchedule | null;
  scheduleConstraints: ScheduleConstraints;
  
  // Actions
  addClass: (newClass: Class) => void;
  updateClass: (classId: string, updatedClass: Class) => void;
  removeClass: (classId: string) => void;
  setTeacherSchedule: (schedule: TeacherSchedule) => void;
  addSpecialEvent: (event: SpecialEvent) => void;
  removeSpecialEvent: (eventDate: Date) => void;
  setPeriodsPerDay: (periods: number) => void;
  setScheduleConstraints: (constraints: ScheduleConstraints) => void;
  setCurrentSchedule: (schedule: RotationSchedule | null) => void;
}

const initialState = {
  classes: [],
  teacherSchedule: {
    constraints: [],
    specialEvents: []
  },
  rotations: [],
  periodsPerDay: 8,
  currentSchedule: null,
  scheduleConstraints: {
    startDate: new Date().toISOString().split('T')[0],
    allowConsecutivePeriods: false,
    maxPeriodsPerDay: 4,
    maxPeriodsPerWeek: 15,
  }
};

export const useScheduleStore = create<ScheduleState>()(
  persist(
    (set) => ({
      ...initialState,

      addClass: (newClass) =>
        set((state) => ({ classes: [...state.classes, newClass] })),

      updateClass: (classId, updatedClass) =>
        set((state) => ({
          classes: state.classes.map((c) =>
            c.id === classId ? updatedClass : c
          ),
        })),

      removeClass: (classId) =>
        set((state) => ({
          classes: state.classes.filter((c) => c.id !== classId),
        })),

      setTeacherSchedule: (schedule) =>
        set(() => ({ teacherSchedule: schedule })),

      addSpecialEvent: (event) =>
        set((state) => ({
          teacherSchedule: {
            ...state.teacherSchedule,
            specialEvents: [...state.teacherSchedule.specialEvents, event],
          },
        })),

      removeSpecialEvent: (eventDate) =>
        set((state) => ({
          teacherSchedule: {
            ...state.teacherSchedule,
            specialEvents: state.teacherSchedule.specialEvents.filter(
              (e) => e.date !== eventDate
            ),
          },
        })),

      setPeriodsPerDay: (periods) =>
        set(() => ({ periodsPerDay: periods })),

      setScheduleConstraints: (constraints) =>
        set(() => ({ scheduleConstraints: constraints })),

      setCurrentSchedule: (schedule) =>
        set(() => ({ currentSchedule: schedule })),
    }),
    {
      name: 'schedule-storage',
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          // Migration from version 0 to 1
          return {
            ...initialState,
            ...persistedState,
            teacherSchedule: {
              constraints: persistedState.teacherSchedule?.constraints || [],
              specialEvents: persistedState.teacherSchedule?.specialEvents || []
            }
          };
        }
        return persistedState as ScheduleState;
      },
    }
  )
);