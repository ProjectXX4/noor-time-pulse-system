
import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useData, WorkReport } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { FileText, FilePlus, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

type ReportFormData = {
  tasks: string;
  issues: string;
  plans: string;
};

const ReportsPage = () => {
  const { user } = useAuth();
  const { getUserReports, addWorkReport, getTodayCheckIn } = useData();
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewReport, setViewReport] = useState<WorkReport | null>(null);

  const userId = user?.id || 0;
  const reports = getUserReports(userId);
  const todayCheckIn = getTodayCheckIn(userId);
  
  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  
  // Check if user has already submitted a report today
  const todayReport = reports.find(report => report.date === today);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ReportFormData>({
    defaultValues: {
      tasks: '',
      issues: '',
      plans: '',
    }
  });

  const onSubmit = (data: ReportFormData) => {
    if (!user) return;
    
    if (!todayCheckIn) {
      toast({
        title: "Cannot Submit Report",
        description: "You must check in first before submitting a daily report.",
        variant: "destructive",
      });
      return;
    }
    
    if (todayReport) {
      toast({
        title: "Report Already Submitted",
        description: "You have already submitted a report for today.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Process file if provided
    let files: string[] | undefined = undefined;
    if (selectedFile) {
      files = [selectedFile.name];
    }
    
    try {
      addWorkReport({
        userId: user.id,
        date: today,
        tasks: data.tasks,
        issues: data.issues,
        plans: data.plans,
        files: files,
      });
      
      toast({
        title: "Report Submitted",
        description: "Your daily work report has been successfully submitted.",
      });
      
      reset();
      setSelectedFile(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <DashboardLayout title="Daily Reports">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {viewReport ? (
            <Card className="mb-6">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Report for {formatDate(viewReport.date)}</CardTitle>
                    <CardDescription>
                      Submitted at {formatTime(viewReport.submittedAt)}
                    </CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setViewReport(null)}
                  >
                    Back to Form
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-gray-700 mb-2">Tasks Completed</h3>
                    <p className="text-gray-600 whitespace-pre-line">{viewReport.tasks}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700 mb-2">Issues Encountered</h3>
                    <p className="text-gray-600 whitespace-pre-line">{viewReport.issues || "None reported"}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700 mb-2">Plans for Tomorrow</h3>
                    <p className="text-gray-600 whitespace-pre-line">{viewReport.plans}</p>
                  </div>
                  
                  {viewReport.files && viewReport.files.length > 0 && (
                    <div>
                      <h3 className="font-medium text-gray-700 mb-2">Attached Files</h3>
                      <ul className="list-disc pl-4">
                        {viewReport.files.map((file, index) => (
                          <li key={index} className="text-company-blue hover:underline">
                            <a href="#">{file}</a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="mb-6">
              <CardHeader className="bg-gray-50 border-b">
                <CardTitle>Daily Work Report</CardTitle>
                <CardDescription>
                  {todayReport ? (
                    <span className="flex items-center text-green-600">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      You've already submitted today's report
                    </span>
                  ) : !todayCheckIn ? (
                    <span className="flex items-center text-amber-600">
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      You need to check in before submitting a report
                    </span>
                  ) : (
                    <span>{formatDate(today)}</span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="tasks">Tasks Completed Today <span className="text-red-500">*</span></Label>
                    <Textarea
                      id="tasks"
                      placeholder="List the tasks you've completed today..."
                      rows={4}
                      disabled={!!todayReport || !todayCheckIn}
                      {...register('tasks', { required: 'This field is required' })}
                    />
                    {errors.tasks && <p className="text-red-500 text-sm">{errors.tasks.message}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="issues">Issues or Challenges Faced</Label>
                    <Textarea
                      id="issues"
                      placeholder="Describe any issues you encountered..."
                      rows={3}
                      disabled={!!todayReport || !todayCheckIn}
                      {...register('issues')}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="plans">Plans for Tomorrow <span className="text-red-500">*</span></Label>
                    <Textarea
                      id="plans"
                      placeholder="What do you plan to work on tomorrow?"
                      rows={3}
                      disabled={!!todayReport || !todayCheckIn}
                      {...register('plans', { required: 'This field is required' })}
                    />
                    {errors.plans && <p className="text-red-500 text-sm">{errors.plans.message}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="file">Attach Files (Optional)</Label>
                    <Input 
                      id="file" 
                      type="file" 
                      disabled={!!todayReport || !todayCheckIn}
                      onChange={handleFileChange}
                      className="cursor-pointer"
                    />
                    {selectedFile && (
                      <p className="text-sm text-gray-600">
                        Selected: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                      </p>
                    )}
                  </div>
                  
                  <div className="pt-2">
                    <Button 
                      type="submit" 
                      className="w-full bg-company-blue hover:bg-company-darkBlue"
                      disabled={isSubmitting || !!todayReport || !todayCheckIn}
                    >
                      {isSubmitting ? 'Submitting...' : todayReport ? 'Report Submitted' : 'Submit Daily Report'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
          
          {!todayCheckIn && (
            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-amber-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-amber-700">
                    You need to check in first before you can submit a daily report.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div>
          <Card>
            <CardHeader className="border-b">
              <CardTitle>Report History</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {reports.length > 0 ? (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                  {reports.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((report) => (
                    <div 
                      key={report.id} 
                      className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50 cursor-pointer"
                      onClick={() => setViewReport(report)}
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                          <FileText className="w-5 h-5 text-company-blue" />
                        </div>
                        <div>
                          <div className="font-medium">{formatDate(report.date).split(',')[0]}</div>
                          <div className="text-xs text-gray-500">
                            Submitted at {formatTime(report.submittedAt)}
                          </div>
                        </div>
                      </div>
                      <span className="text-company-blue">View</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                    <FilePlus className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-gray-500 font-medium">No reports yet</h3>
                  <p className="text-gray-400 text-sm mt-1">
                    Your submitted reports will appear here
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ReportsPage;
