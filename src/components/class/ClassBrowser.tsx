import React, { useState } from 'react';
import { useScheduleStore } from '../../store/scheduleStore';
import { ClassSelector } from './ClassSelector';
import { ClassEditor } from './ClassEditor';
import type { Class } from '../../types/schedule';

export function ClassBrowser() {
  const { classes, updateClass } = useScheduleStore();
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);

  const selectedClass = classes.find(c => c.id === selectedClassId);

  const handleSave = (updatedClass: Class) => {
    updateClass(updatedClass.id, updatedClass);
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold text-gray-900">Browse Classes</h2>
      <ClassSelector
        classes={classes}
        selectedClassId={selectedClassId}
        onSelect={setSelectedClassId}
      />
      {selectedClass && (
        <ClassEditor
          initialClass={selectedClass}
          onSave={handleSave}
        />
      )}
    </div>
  );
}