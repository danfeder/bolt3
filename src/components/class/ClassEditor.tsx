import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { ScheduleGrid } from '../forms/ScheduleGrid';
import { GradeLevelSelect } from './GradeLevelSelect';
import type { Class } from '../../types/schedule';

interface ClassEditorProps {
  initialClass: Class;
  onSave: (updatedClass: Class) => void;
}

export function ClassEditor({ initialClass, onSave }: ClassEditorProps) {
  const [editedClass, setEditedClass] = useState(initialClass);

  const handleSave = () => {
    onSave(editedClass);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Class Name</label>
          <input
            type="text"
            value={editedClass.name}
            onChange={(e) => setEditedClass({ ...editedClass, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Grade Level</label>
          <GradeLevelSelect
            value={editedClass.gradeLevel}
            onChange={(gradeLevel) => setEditedClass({ ...editedClass, gradeLevel })}
          />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Schedule Constraints</h3>
        <ScheduleGrid
          value={editedClass.constraints}
          onChange={(constraints) => setEditedClass({ ...editedClass, constraints })}
        />
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </button>
      </div>
    </div>
  );
}