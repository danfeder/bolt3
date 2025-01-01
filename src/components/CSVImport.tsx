import React, { useCallback, useState } from 'react';
import { Upload, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useScheduleStore } from '../store/scheduleStore';
import { parseCsvRow } from '../utils/csvParser';
import type { Class } from '../types/schedule';

export function CSVImport() {
  const addClass = useScheduleStore((state) => state.addClass);
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const processCSV = useCallback((content: string) => {
    try {
      const lines = content.split('\n');
      if (lines.length < 2) {
        throw new Error('CSV file must contain at least a header row and one data row');
      }

      // Skip header row and process each line
      let successCount = 0;
      lines.slice(1).forEach((line) => {
        if (!line.trim()) return;
        
        // Split the line into cells, handling quoted values properly
        const row = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
        if (!row) return;
        
        // Clean up quoted values
        const cleanRow = row.map(cell => cell.replace(/^"|"$/g, '').trim());
        const parsed = parseCsvRow(cleanRow);
        
        if (parsed) {
          const newClass: Class = {
            id: crypto.randomUUID(),
            name: parsed.name,
            constraints: parsed.constraints
          };
          addClass(newClass);
          successCount++;
        }
      });

      setStatus({
        type: 'success',
        message: `Successfully imported ${successCount} classes`
      });

      // Clear success message after 3 seconds
      setTimeout(() => {
        setStatus({ type: null, message: '' });
      }, 3000);

    } catch (error) {
      setStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to process CSV file'
      });
    }
  }, [addClass]);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      processCSV(content);
    };
    reader.readAsText(file);
    
    // Reset file input
    event.target.value = '';
  }, [processCSV]);

  return (
    <div className="space-y-4">
      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <Upload className="w-8 h-8 mb-2 text-gray-500" />
          <p className="mb-2 text-sm text-gray-500">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500">
            CSV with columns: Class, Monday, Tuesday, Wednesday, Thursday, Friday
          </p>
        </div>
        <input
          type="file"
          className="hidden"
          accept=".csv"
          onChange={handleFileUpload}
        />
      </label>

      {status.type && (
        <div className={`flex items-center gap-2 p-4 rounded-md ${
          status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {status.type === 'success' ? (
            <CheckCircle2 className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          <p className="text-sm">{status.message}</p>
        </div>
      )}
    </div>
  );
}