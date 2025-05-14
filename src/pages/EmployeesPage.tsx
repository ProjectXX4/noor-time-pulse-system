
import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { User, Search } from 'lucide-react';
import EmployeeTable from '@/components/employees/EmployeeTable';
import OvertimeTable from '@/components/employees/OvertimeTable';
import AttendancePanel from '@/components/employees/AttendancePanel';
import AddEmployeeForm, { EmployeeFormData } from '@/components/employees/AddEmployeeForm';
import AccessDenied from '@/components/AccessDenied';
import { Employee } from '@/contexts/DataContext';

const EmployeesPage = () => {
  const { user } = useAuth();
  const { employees, addEmployee, getOvertime, departments, positions } = useData();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  // Handle unauthorized access
  if (user?.role !== 'admin') {
    return <AccessDenied />;
  }
  
  const handleSubmit = (data: EmployeeFormData) => {
    if (editingEmployee) {
      // In a real app, this would update the employee
      // For now, we'll just show a toast since the DataContext doesn't have an update method
      toast({
        title: "Employee Updated",
        description: `${data.name}'s information has been updated.`,
      });
    } else {
      addEmployee(data);
      toast({
        title: "Employee Added",
        description: `${data.name} has been added to the system.`,
      });
    }
    
    setIsDialogOpen(false);
    setEditingEmployee(null);
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsDialogOpen(true);
  };

  const handleDelete = (employeeId: number) => {
    // In a real app, this would delete the employee from the database
    // For now we'll just show a toast since DataContext doesn't have a delete method
    const employeeToDelete = employees.find(emp => emp.id === employeeId);
    if (employeeToDelete) {
      toast({
        title: "Employee Deleted",
        description: `${employeeToDelete.name} has been removed from the system.`,
      });
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingEmployee(null);
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            placeholder="Search employees..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="w-full sm:w-auto bg-company-green hover:bg-company-darkGreen">
          <User className="mr-2 h-4 w-4" />
          Add New Employee
        </Button>
      </div>
      
      <Tabs defaultValue="list" className="space-y-4">
        <TabsList className="w-full sm:w-auto overflow-x-auto">
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
              <EmployeeTable 
                employees={filteredEmployees} 
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="overtime">
          <Card className="overflow-hidden">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle>Overtime Report</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <OvertimeTable employees={employees} getOvertime={getOvertime} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="attendance">
          <AttendancePanel />
        </TabsContent>
      </Tabs>
      
      <AddEmployeeForm
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        onSubmit={handleSubmit}
        departments={departments}
        positions={positions}
        employee={editingEmployee}
      />
    </DashboardLayout>
  );
};

export default EmployeesPage;
