import React from 'react';
import { Calendar } from 'lucide-react';
import { ClassForm } from './components/ClassForm';
import { CSVImport } from './components/CSVImport';
import { ClassBrowser } from './components/class/ClassBrowser';
import { TeacherScheduleForm } from './components/TeacherScheduleForm';
import { ScheduleGenerator } from './components/schedule/ScheduleGenerator';
import { useScheduleStore } from './store/scheduleStore';

export default function App() {
  const { addClass } = useScheduleStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">
              Teacher Schedule Assistant
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column - Class Management */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Add New Class</h2>
                <div className="space-y-6">
                  <CSVImport />
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Or add manually</span>
                    </div>
                  </div>
                  <ClassForm onSubmit={addClass} />
                </div>
              </div>
              <ClassBrowser />
            </div>

            {/* Right Column - Schedule Management */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white shadow rounded-lg p-6">
                <TeacherScheduleForm />
              </div>
              <ScheduleGenerator />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}