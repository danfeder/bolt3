import React from 'react';
import { X } from 'lucide-react';
import type { TimeSlot } from '../../types/schedule';
import { DayPicker } from './DayPicker';
import { PeriodPicker } from './PeriodPicker';

interface ConstraintListProps {
  constraints: TimeSlot[];
  onChange: (constraints: TimeSlot[]) => void;
}

export function ConstraintList({ constraints, onChange }: ConstraintListProps) {
  const addConstraint = () => {
    onChange([...constraints, { day: 'Monday', period: 1 }]);
  };

  const removeConstraint = (index: number) => {
    onChange(constraints.filter((_, i) => i !== index));
  };

  const updateConstraint = (index: number, updates: Partial<TimeSlot>) => {
    onChange(
      constraints.map((constraint, i) =>
        i === index ? { ...constraint, ...updates } : constraint
      )
    );
  };

  return (
    <div className="space-y-3">
      {constraints.map((constraint, index) => (
        <div key={index} className="flex items-center gap-3">
          <DayPicker
            value={constraint.day}
            onChange={(day) => updateConstraint(index, { day })}
          />
          <PeriodPicker
            value={constraint.period}
            onChange={(period) => updateConstraint(index, { period })}
          />
          <button
            type="button"
            onClick={() => removeConstraint(index)}
            className="p-2 text-gray-400 hover:text-red-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addConstraint}
        className="text-sm text-blue-600 hover:text-blue-700"
      >
        + Add Constraint
      </button>
    </div>
  );
}