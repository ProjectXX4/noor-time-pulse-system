
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Settings, Clock, Clock12 } from 'lucide-react';

type WorkingHoursFormData = {
  startHour: string;
  endHour: string;
};

type NotificationSettings = {
  checkInReminder: boolean;
  dailyReportReminder: boolean;
  overdueReports: boolean;
  systemUpdates: boolean;
};

const SettingsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<NotificationSettings>({
    checkInReminder: true,
    dailyReportReminder: true,
    overdueReports: true,
    systemUpdates: false,
  });
  
  // Handle unauthorized access
  if (user?.role !== 'admin') {
    return (
      <DashboardLayout title="Access Denied">
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <div className="text-company-red text-6xl mb-6">⚠️</div>
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-gray-600">You do not have permission to view this page.</p>
          <Button className="mt-6" asChild>
            <a href="/dashboard">Return to Dashboard</a>
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const { register, handleSubmit, formState: { errors } } = useForm<WorkingHoursFormData>({
    defaultValues: {
      startHour: '09:00',
      endHour: '17:00',
    }
  });

  const saveWorkingHours = (data: WorkingHoursFormData) => {
    toast({
      title: "Settings Saved",
      description: `Working hours updated to ${data.startHour} - ${data.endHour}.`,
    });
  };
  
  const toggleNotification = (key: keyof NotificationSettings) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
    
    toast({
      title: "Notification Setting Updated",
      description: `${key} notifications ${notifications[key] ? 'disabled' : 'enabled'}.`,
    });
  };

  return (
    <DashboardLayout title="System Settings">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-3 md:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-company-green" />
                Working Hours Configuration
              </CardTitle>
              <CardDescription>
                Set the standard working hours for overtime calculation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(saveWorkingHours)}>
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <Label htmlFor="startHour">Start Time</Label>
                    <Input 
                      type="time"
                      id="startHour" 
                      {...register('startHour', { required: true })}
                    />
                    {errors.startHour && <p className="text-red-500 text-sm">Start time is required</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="endHour">End Time</Label>
                    <Input 
                      type="time"
                      id="endHour" 
                      {...register('endHour', { required: true })}
                    />
                    {errors.endHour && <p className="text-red-500 text-sm">End time is required</p>}
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md mb-4">
                  <div className="text-sm text-gray-600">
                    <p className="mb-2">
                      <strong>Note:</strong> Hours worked after the end time will be automatically 
                      calculated as overtime.
                    </p>
                    <p>
                      Employees must check in and check out to track their hours 
                      accurately. Late check-ins and early check-outs will be flagged in reports.
                    </p>
                  </div>
                </div>
                
                <Button type="submit" className="bg-company-green hover:bg-company-darkGreen">
                  Save Working Hours
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>
                Configure the automatic email notifications sent to employees
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Check-in Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Remind employees to check in if not done by 9:15 AM
                    </p>
                  </div>
                  <Switch
                    checked={notifications.checkInReminder}
                    onCheckedChange={() => toggleNotification('checkInReminder')}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Daily Report Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Send reminder at 4:30 PM if daily report is not submitted
                    </p>
                  </div>
                  <Switch 
                    checked={notifications.dailyReportReminder}
                    onCheckedChange={() => toggleNotification('dailyReportReminder')}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Overdue Reports Alert</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify managers about overdue employee reports
                    </p>
                  </div>
                  <Switch 
                    checked={notifications.overdueReports}
                    onCheckedChange={() => toggleNotification('overdueReports')}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">System Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify all users about system maintenance and updates
                    </p>
                  </div>
                  <Switch 
                    checked={notifications.systemUpdates}
                    onCheckedChange={() => toggleNotification('systemUpdates')}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-sm text-gray-500 mb-1">System Name</h3>
                  <p>NoorCare</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-sm text-gray-500 mb-1">Company</h3>
                  <p>Nooralqmar</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-sm text-gray-500 mb-1">Version</h3>
                  <p>1.0.0</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-sm text-gray-500 mb-1">Last Updated</h3>
                  <p>{new Date().toLocaleDateString()}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-sm text-gray-500 mb-1">Domain</h3>
                  <p>https://noorreport.nooralqmar.com/</p>
                </div>
                
                <Separator />
                
                <div className="pt-2">
                  <Button variant="outline" className="w-full mb-2">
                    <Clock12 className="mr-2 h-4 w-4 text-company-green" />
                    View System Logs
                  </Button>
                  <Button variant="outline" className="w-full mb-2">
                    <Settings className="mr-2 h-4 w-4 text-company-green" />
                    Advanced Settings
                  </Button>
                  <Button variant="outline" className="w-full text-company-red border-red-200 hover:bg-red-50 hover:text-company-darkRed">
                    Clear System Cache
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
