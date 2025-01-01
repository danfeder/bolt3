import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus } from 'lucide-react';
import type { Class } from '../types/schedule';
import { ScheduleGrid } from './forms/ScheduleGrid';

const classSchema = z.object({
  name: z.string().min(1, 'Class name is required'),
  constraints: z.array(z.object({
    day: z.string(),
    period: z.number().min(1),
  })),
});

type ClassFormProps = {
  onSubmit: (data: Class) => void;
  initialData?: Class;
};

export function ClassForm({ onSubmit, initialData }: ClassFormProps) {
  const { register, handleSubmit, control, formState: { errors } } = useForm({
    resolver: zodResolver(classSchema),
    defaultValues: initialData || {
      name: '',
      constraints: [],
    },
  });

  return (
    <form onSubmit={handleSubmit((data) => onSubmit({ ...data, id: initialData?.id || crypto.randomUUID() }))} 
          className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Class Name
          <input
            type="text"
            {...register('name')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="e.g., Math 101"
          />
        </label>
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-700">Schedule Constraints</h3>
        <Controller
          name="constraints"
          control={control}
          render={({ field }) => (
            <ScheduleGrid
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </div>

      <button
        type="submit"
        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <Plus className="h-4 w-4 mr-2" />
        {initialData ? 'Update Class' : 'Add Class'}
      </button>
    </form>
  );
}