import React from 'react';
import { ChevronDown } from 'lucide-react';
import type { GradeLevel } from '../../types/schedule';

const GRADE_LEVELS: GradeLevel[] = [
  'Pre-K',
  'Kindergarten',
  '1st Grade',
  '2nd Grade',
  '3rd Grade',
  '4th Grade',
  '5th Grade',
  'Multiple Grades'
];

interface GradeLevelSelectProps {
  value: GradeLevel;
  onChange: (grade: GradeLevel) => void;
  disabled?: boolean;
}

export function GradeLevelSelect({ value, onChange, disabled }: GradeLevelSelectProps) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as GradeLevel)}
        disabled={disabled}
        className="block w-full rounded-md border-gray-300 bg-white px-3 py-2 pr-8 text-gray-900 focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500 appearance-none"
      >
        {GRADE_LEVELS.map((grade) => (
          <option key={grade} value={grade}>
            {grade}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
    </div>
  );
}