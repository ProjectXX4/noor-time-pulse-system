
import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Clock, CheckCircle, FileText, AlertTriangle } from 'lucide-react';

const formatTime = (date: Date) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const { 
    getTodayCheckIn, 
    getTodayCheckOut, 
    getUserReports, 
    getOvertime, 
    getUserCheckIns,
    addCheckIn
  } = useData();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const userId = user?.id || 0;
  const checkInRecord = getTodayCheckIn(userId);
  const checkOutRecord = getTodayCheckOut(userId);
  const reports = getUserReports(userId);
  const lastReport = reports[reports.length - 1];
  const overtime = getOvertime(userId, 'week');
  const checkInHistory = getUserCheckIns(userId).slice(-7).reverse();
  
  const handleCheckIn = () => {
    if (user) {
      addCheckIn(user.id, 'in');
    }
  };
  
  const handleCheckOut = () => {
    if (user) {
      addCheckIn(user.id, 'out');
    }
  };

  return (
    <DashboardLayout title="Employee Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <Card className="dashboard-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Current Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="w-5 h-5 text-company-blue mr-2" />
              <div className="font-semibold text-2xl">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {currentTime.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Today's Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Check In:</span>
                <span className="font-medium">
                  {checkInRecord ? formatTime(new Date(checkInRecord.timestamp)) : 'Not checked in'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Check Out:</span>
                <span className="font-medium">
                  {checkOutRecord ? formatTime(new Date(checkOutRecord.timestamp)) : 'Not checked out'}
                </span>
              </div>
              <div className="pt-2">
                {!checkInRecord && (
                  <Button 
                    variant="default" 
                    className="w-full bg-company-blue hover:bg-company-darkBlue" 
                    onClick={handleCheckIn}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Check In
                  </Button>
                )}
                {checkInRecord && !checkOutRecord && (
                  <Button 
                    variant="outline" 
                    className="w-full border-company-blue text-company-blue hover:bg-company-blue hover:text-white" 
                    onClick={handleCheckOut}
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Check Out
                  </Button>
                )}
                {checkInRecord && checkOutRecord && (
                  <div className="text-sm text-center font-medium text-green-600">
                    Day complete ✓
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Weekly Overtime</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xl font-semibold">{overtime.hours} hrs {overtime.minutes % 60} min</span>
              </div>
              <Progress value={Math.min(100, (overtime.hours / 10) * 100)} className="h-2" />
              <div className="text-xs text-gray-500">Weekly target: 10 hours</div>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Daily Report</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lastReport && new Date(lastReport.date).toDateString() === new Date().toDateString() ? (
                <>
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">Submitted today</span>
                  </div>
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <a href="/reports">
                      <FileText className="w-4 h-4 mr-2" />
                      View Report
                    </a>
                  </Button>
                </>
              ) : (
                <>
                  <div className="flex items-center text-amber-600">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">Not submitted yet</span>
                  </div>
                  <Button className="w-full bg-company-blue hover:bg-company-darkBlue" size="sm" asChild>
                    <a href="/reports">
                      <FileText className="w-4 h-4 mr-2" />
                      Submit Report
                    </a>
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {checkInHistory.length > 0 ? (
                checkInHistory.map((record, index) => (
                  <div key={record.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                    <div className="flex items-center">
                      {record.type === 'in' ? (
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                          <Clock className="w-4 h-4 text-blue-600" />
                        </div>
                      )}
                      <div>
                        <div className="font-medium">
                          {record.type === 'in' ? 'Checked In' : 'Checked Out'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(record.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm font-medium">
                      {formatTime(new Date(record.timestamp))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-6">No recent activity</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Upcoming Deadlines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center border-b pb-3">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-3">
                  <FileText className="w-4 h-4 text-red-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">Daily Report</div>
                    <div className="text-sm text-red-600">Due Today</div>
                  </div>
                  <div className="text-sm text-gray-500">Submit your work summary before 6 PM</div>
                </div>
              </div>
              <div className="flex items-center border-b pb-3">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                  <FileText className="w-4 h-4 text-amber-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">Weekly Progress Report</div>
                    <div className="text-sm text-amber-600">Due in 3 days</div>
                  </div>
                  <div className="text-sm text-gray-500">Project milestone update and status</div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">Monthly Performance Review</div>
                    <div className="text-sm text-blue-600">Due in 12 days</div>
                  </div>
                  <div className="text-sm text-gray-500">Prepare self-assessment and achievements</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default EmployeeDashboard;
