
import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Clock, CheckCircle } from 'lucide-react';

const CheckInPage = () => {
  const { user } = useAuth();
  const { getTodayCheckIn, getTodayCheckOut, addCheckIn } = useData();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userId = user?.id || 0;
  const checkInRecord = getTodayCheckIn(userId);
  const checkOutRecord = getTodayCheckOut(userId);

  // Format time from ISO string
  const formatTime = (timestamp: string | null) => {
    if (!timestamp) return "Not recorded";
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };
  
  const handleCheckIn = async () => {
    if (checkInRecord) {
      toast({
        title: "Already Checked In",
        description: "You have already checked in today.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      addCheckIn(userId, 'in');
      toast({
        title: "Check In Successful",
        description: `You have been checked in at ${new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCheckOut = async () => {
    if (!checkInRecord) {
      toast({
        title: "Check In Required",
        description: "You must check in before checking out.",
        variant: "destructive",
      });
      return;
    }
    
    if (checkOutRecord) {
      toast({
        title: "Already Checked Out",
        description: "You have already checked out today.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      addCheckIn(userId, 'out');
      
      const now = new Date();
      const isOvertime = now.getHours() >= 17;
      
      toast({
        title: "Check Out Successful",
        description: `You have been checked out at ${now.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}${isOvertime ? ' (Overtime)' : ''}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout title="Check-In / Check-Out">
      <div className="max-w-2xl mx-auto">
        <Card className="mb-8 shadow-md">
          <CardHeader className="text-center border-b bg-gray-50">
            <CardTitle className="text-2xl">Employee Attendance</CardTitle>
            <CardDescription className="text-gray-600">
              {formatDate(new Date())}
            </CardDescription>
          </CardHeader>
          <CardContent className="py-8 px-4 md:px-6 text-center">
            <div className="mb-8">
              <div className="text-5xl md:text-7xl font-light text-center mb-2">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="text-gray-500">Current Time</div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mb-10">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-3">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <div className="text-lg font-semibold">Check In</div>
                <div className="text-2xl font-light my-2">
                  {formatTime(checkInRecord?.timestamp || null)}
                </div>
                <Button 
                  onClick={handleCheckIn} 
                  disabled={isSubmitting || !!checkInRecord} 
                  className={`mt-4 px-6 w-full md:w-auto transition-all ${checkInRecord ? 'bg-gray-300' : 'bg-company-green hover:bg-company-darkGreen'} checkin-button`}
                >
                  {checkInRecord ? 'Checked In' : 'Check In'}
                </Button>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                  <Clock className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-lg font-semibold">Check Out</div>
                <div className="text-2xl font-light my-2">
                  {formatTime(checkOutRecord?.timestamp || null)}
                </div>
                <Button 
                  onClick={handleCheckOut} 
                  disabled={isSubmitting || !checkInRecord || !!checkOutRecord}
                  variant="outline" 
                  className={`mt-4 px-6 w-full md:w-auto ${!checkInRecord || checkOutRecord ? 'bg-gray-100 border-gray-300 text-gray-400' : 'border-company-green text-company-green hover:bg-company-green hover:text-white'} checkin-button`}
                >
                  {checkOutRecord ? 'Checked Out' : 'Check Out'}
                </Button>
              </div>
            </div>
            
            <div className="text-gray-500 text-sm">
              <p>Regular Hours: 9:00 AM - 5:00 PM</p>
              <p>Overtime is automatically calculated for hours after 5:00 PM</p>
            </div>
          </CardContent>
        </Card>
        
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Remember to submit your daily work report before checking out.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CheckInPage;
