import React from 'react';
import { ChevronDown } from 'lucide-react';
import type { Class } from '../../types/schedule';

interface ClassSelectorProps {
  classes: Class[];
  selectedClassId: string | null;
  onSelect: (classId: string) => void;
}

export function ClassSelector({ classes, selectedClassId, onSelect }: ClassSelectorProps) {
  return (
    <div className="relative">
      <select
        value={selectedClassId || ''}
        onChange={(e) => onSelect(e.target.value)}
        className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 pr-8 text-gray-900 focus:border-blue-500 focus:ring-blue-500 appearance-none"
      >
        <option value="">Select a class...</option>
        {classes.map((cls) => (
          <option key={cls.id} value={cls.id}>
            {cls.name}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
    </div>
  );
}