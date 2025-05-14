
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

const AttendancePanel = () => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="bg-gray-50 border-b p-4 flex justify-between items-center">
        <h2 className="font-semibold">Attendance Report</h2>
        <Button variant="outline" size="sm">
          Export to Excel
        </Button>
      </div>
      <div className="p-8 text-center text-gray-500">
        <Settings className="mx-auto h-12 w-12 text-gray-400 mb-3" />
        <h3 className="text-lg font-medium mb-2">Coming Soon</h3>
        <p>The detailed attendance report feature is under development.</p>
      </div>
    </div>
  );
};

export default AttendancePanel;
