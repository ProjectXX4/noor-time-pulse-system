
import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { useForm } from 'react-hook-form';
import { User, Settings, Search } from 'lucide-react';

type EmployeeFormData = {
  name: string;
  email: string;
  department: string;
  position: string;
  joinDate: string;
};

const EmployeesPage = () => {
  const { user } = useAuth();
  const { employees, addEmployee, getOvertime } = useData();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Handle unauthorized access
  if (user?.role !== 'admin') {
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
  }

  const { register, handleSubmit, reset, formState: { errors } } = useForm<EmployeeFormData>();

  const onSubmit = (data: EmployeeFormData) => {
    addEmployee(data);
    
    toast({
      title: "Employee Added",
      description: `${data.name} has been added to the system.`,
    });
    
    setIsDialogOpen(false);
    reset();
  };

  const filteredEmployees = searchTerm 
    ? employees.filter(
        emp => 
          emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.department.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : employees;

  return (
    <DashboardLayout title="Employee Management">
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            placeholder="Search employees..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="bg-company-blue hover:bg-company-darkBlue">
          <User className="mr-2 h-4 w-4" />
          Add New Employee
        </Button>
      </div>
      
      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Employee List</TabsTrigger>
          <TabsTrigger value="overtime">Overtime Report</TabsTrigger>
          <TabsTrigger value="attendance">Attendance Report</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list">
          <Card className="overflow-hidden">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle>Employee Directory</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Department</th>
                    <th>Position</th>
                    <th>Join Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.length > 0 ? (
                    filteredEmployees.map((employee) => (
                      <tr key={employee.id}>
                        <td className="font-medium">{employee.name}</td>
                        <td>{employee.email}</td>
                        <td>{employee.department}</td>
                        <td>{employee.position}</td>
                        <td>{new Date(employee.joinDate).toLocaleDateString()}</td>
                        <td>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700">
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center py-4">
                        {searchTerm ? "No matching employees found" : "No employees in the system"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="overtime">
          <Card className="overflow-hidden">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle>Overtime Report</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Department</th>
                    <th>Daily Overtime</th>
                    <th>Weekly Overtime</th>
                    <th>Monthly Overtime</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee) => {
                    const dailyOvertime = getOvertime(employee.id, 'day');
                    const weeklyOvertime = getOvertime(employee.id, 'week');
                    const monthlyOvertime = getOvertime(employee.id, 'month');
                    
                    return (
                      <tr key={employee.id}>
                        <td className="font-medium">{employee.name}</td>
                        <td>{employee.department}</td>
                        <td>
                          {dailyOvertime.hours > 0 || dailyOvertime.minutes % 60 > 0 ? (
                            <span className="text-company-blue">
                              {dailyOvertime.hours}h {dailyOvertime.minutes % 60}m
                            </span>
                          ) : (
                            <span className="text-gray-500">None</span>
                          )}
                        </td>
                        <td>
                          {weeklyOvertime.hours > 0 || weeklyOvertime.minutes % 60 > 0 ? (
                            <span className="text-company-blue font-medium">
                              {weeklyOvertime.hours}h {weeklyOvertime.minutes % 60}m
                            </span>
                          ) : (
                            <span className="text-gray-500">None</span>
                          )}
                        </td>
                        <td>
                          {monthlyOvertime.hours > 0 || monthlyOvertime.minutes % 60 > 0 ? (
                            <span className="text-company-blue font-medium">
                              {monthlyOvertime.hours}h {monthlyOvertime.minutes % 60}m
                            </span>
                          ) : (
                            <span className="text-gray-500">None</span>
                          )}
                        </td>
                        <td>
                          <Button variant="outline" size="sm">
                            Generate Report
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="attendance">
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
        </TabsContent>
      </Tabs>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Employee</DialogTitle>
            <DialogDescription>
              Enter the details of the new employee.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name"
                  {...register('name', { required: 'Name is required' })}
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email"
                  type="email"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    }
                  })}
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="department">Department</Label>
                  <Input 
                    id="department"
                    {...register('department', { required: 'Department is required' })}
                  />
                  {errors.department && <p className="text-red-500 text-sm">{errors.department.message}</p>}
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="position">Position</Label>
                  <Input 
                    id="position"
                    {...register('position', { required: 'Position is required' })}
                  />
                  {errors.position && <p className="text-red-500 text-sm">{errors.position.message}</p>}
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="joinDate">Join Date</Label>
                <Input 
                  id="joinDate"
                  type="date"
                  {...register('joinDate', { required: 'Join date is required' })}
                />
                {errors.joinDate && <p className="text-red-500 text-sm">{errors.joinDate.message}</p>}
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-company-blue hover:bg-company-darkBlue">
                Add Employee
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default EmployeesPage;
