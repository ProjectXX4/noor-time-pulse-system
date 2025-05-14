
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/DashboardLayout';

const AccessDenied = () => {
  return (
    <DashboardLayout title="Access Denied">
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <div className="text-red-500 text-6xl mb-6">⚠️</div>
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-gray-600">You do not have permission to view this page.</p>
        <Button className="mt-6" asChild>
          <a href="/dashboard">Return to Dashboard</a>
        </Button>
      </div>
    </DashboardLayout>
  );
};

export default AccessDenied;
