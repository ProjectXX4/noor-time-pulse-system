
import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, User, FileText, CheckCircle } from 'lucide-react';

const AdminDashboard = () => {
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month'>('day');
  const { checkIns, workReports, employees } = useData();
  
  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  
  // Filter check-ins for today
  const todayCheckIns = checkIns.filter(checkIn => checkIn.timestamp.startsWith(today));
  const checkedInCount = new Set(todayCheckIns.filter(c => c.type === 'in').map(c => c.userId)).size;
  const checkedOutCount = new Set(todayCheckIns.filter(c => c.type === 'out').map(c => c.userId)).size;
  
  // Filter reports for today
  const todayReports = workReports.filter(report => report.date === today);
  
  // Calculate missing reports
  const missingReports = checkedInCount - todayReports.length;

  // Format time from ISO string
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Get employee name by ID
  const getEmployeeName = (id: number) => {
    const employee = employees.find(emp => emp.id === id);
    return employee ? employee.name : 'Unknown';
  };

  return (
    <DashboardLayout title="Admin Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <Card className="statistics-card flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Employees</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex items-center">
            <User className="w-10 h-10 text-company-blue mr-3" />
            <div>
              <div className="text-3xl font-bold">{employees.length}</div>
              <div className="text-sm text-gray-500">Active employees</div>
            </div>
          </CardContent>
        </Card>

        <Card className="statistics-card flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Today's Check-ins</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex items-center">
            <CheckCircle className="w-10 h-10 text-green-600 mr-3" />
            <div>
              <div className="text-3xl font-bold">{checkedInCount}</div>
              <div className="text-sm text-gray-500">{checkedOutCount} checked out</div>
            </div>
          </CardContent>
        </Card>

        <Card className="statistics-card flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Missing Reports</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex items-center">
            <FileText className="w-10 h-10 text-amber-500 mr-3" />
            <div>
              <div className="text-3xl font-bold">{missingReports}</div>
              <div className="text-sm text-gray-500">{todayReports.length} submitted</div>
            </div>
          </CardContent>
        </Card>

        <Card className="statistics-card flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Overtime Hours</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex items-center">
            <Clock className="w-10 h-10 text-company-blue mr-3" />
            <div>
              <div className="text-3xl font-bold">24.5</div>
              <div className="text-sm text-gray-500">This week</div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="activity" className="space-y-4">
        <TabsList>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="reports">Daily Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="activity" className="space-y-4">
          <Card className="overflow-hidden">
            <CardHeader className="bg-gray-50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Check-in/out Activity</CardTitle>
                <div className="flex space-x-2">
                  <Button 
                    variant={timeframe === 'day' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setTimeframe('day')}
                    className={timeframe === 'day' ? 'bg-company-blue hover:bg-company-darkBlue' : ''}
                  >
                    Today
                  </Button>
                  <Button 
                    variant={timeframe === 'week' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setTimeframe('week')}
                    className={timeframe === 'week' ? 'bg-company-blue hover:bg-company-darkBlue' : ''}
                  >
                    Week
                  </Button>
                  <Button 
                    variant={timeframe === 'month' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setTimeframe('month')}
                    className={timeframe === 'month' ? 'bg-company-blue hover:bg-company-darkBlue' : ''}
                  >
                    Month
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Type</th>
                    <th>Time</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {checkIns
                    .filter(record => {
                      if (timeframe === 'day') {
                        return record.timestamp.startsWith(today);
                      }
                      const recordDate = new Date(record.timestamp);
                      const startDate = new Date();
                      if (timeframe === 'week') {
                        startDate.setDate(startDate.getDate() - 7);
                      } else {
                        startDate.setMonth(startDate.getMonth() - 1);
                      }
                      return recordDate >= startDate;
                    })
                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                    .slice(0, 10)
                    .map((record) => (
                    <tr key={record.id}>
                      <td className="font-medium">{getEmployeeName(record.userId)}</td>
                      <td>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          record.type === 'in' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {record.type === 'in' ? 'Check In' : 'Check Out'}
                        </span>
                      </td>
                      <td>{formatTime(record.timestamp)}</td>
                      <td>{new Date(record.timestamp).toLocaleDateString()}</td>
                      <td>
                        {record.type === 'in' && new Date(record.timestamp).getHours() > 9 ? (
                          <span className="text-amber-500 font-medium">Late</span>
                        ) : record.type === 'out' && new Date(record.timestamp).getHours() >= 17 ? (
                          <span className="text-company-blue font-medium">Overtime</span>
                        ) : (
                          <span className="text-green-600 font-medium">On time</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {checkIns.filter(record => timeframe === 'day' ? record.timestamp.startsWith(today) : true).length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-4 text-gray-500">No check-in records found for the selected period</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <Card className="overflow-hidden">
            <CardHeader className="bg-gray-50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Daily Reports</CardTitle>
                <div className="flex space-x-2">
                  <Button 
                    variant={timeframe === 'day' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setTimeframe('day')}
                    className={timeframe === 'day' ? 'bg-company-blue hover:bg-company-darkBlue' : ''}
                  >
                    Today
                  </Button>
                  <Button 
                    variant={timeframe === 'week' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setTimeframe('week')}
                    className={timeframe === 'week' ? 'bg-company-blue hover:bg-company-darkBlue' : ''}
                  >
                    Week
                  </Button>
                  <Button 
                    variant={timeframe === 'month' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setTimeframe('month')}
                    className={timeframe === 'month' ? 'bg-company-blue hover:bg-company-darkBlue' : ''}
                  >
                    Month
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Date</th>
                    <th>Submission Time</th>
                    <th>Tasks</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {workReports
                    .filter(report => {
                      if (timeframe === 'day') {
                        return report.date === today;
                      }
                      const reportDate = new Date(report.date);
                      const startDate = new Date();
                      if (timeframe === 'week') {
                        startDate.setDate(startDate.getDate() - 7);
                      } else {
                        startDate.setMonth(startDate.getMonth() - 1);
                      }
                      return reportDate >= startDate;
                    })
                    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
                    .map((report) => (
                    <tr key={report.id}>
                      <td className="font-medium">{getEmployeeName(report.userId)}</td>
                      <td>{new Date(report.date).toLocaleDateString()}</td>
                      <td>{formatTime(report.submittedAt)}</td>
                      <td className="max-w-[300px] truncate">{report.tasks}</td>
                      <td>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {workReports.filter(report => timeframe === 'day' ? report.date === today : true).length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-4 text-gray-500">No reports found for the selected period</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default AdminDashboard;
