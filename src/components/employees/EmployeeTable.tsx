
import { useState } from 'react';
import { Employee } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Building, Briefcase, Edit, Trash2 } from 'lucide-react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';

interface EmployeeTableProps {
  employees: Employee[];
  onEdit?: (employee: Employee) => void;
  onDelete?: (employeeId: number) => void;
}

const EmployeeTable = ({ employees, onEdit, onDelete }: EmployeeTableProps) => {
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
  const { toast } = useToast();

  const handleEditClick = (employee: Employee) => {
    if (onEdit) {
      onEdit(employee);
    } else {
      toast({
        title: "Edit Employee",
        description: "This functionality is coming soon.",
      });
    }
  };

  const handleDeleteClick = (employee: Employee) => {
    setEmployeeToDelete(employee);
  };

  const confirmDelete = () => {
    if (employeeToDelete && onDelete) {
      onDelete(employeeToDelete.id);
      toast({
        title: "Employee Deleted",
        description: `${employeeToDelete.name} has been removed from the system.`,
      });
    } else {
      toast({
        title: "Delete Employee",
        description: "This functionality is coming soon.",
      });
    }
    setEmployeeToDelete(null);
  };

  const cancelDelete = () => {
    setEmployeeToDelete(null);
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="data-table w-full">
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
            {employees.length > 0 ? (
              employees.map((employee) => (
                <tr key={employee.id}>
                  <td className="font-medium">{employee.name}</td>
                  <td>{employee.email}</td>
                  <td>
                    <div className="flex items-center">
                      <Building className="h-4 w-4 mr-2 text-company-green" />
                      {employee.department}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center">
                      <Briefcase className="h-4 w-4 mr-2 text-company-green" />
                      {employee.position}
                    </div>
                  </td>
                  <td>{new Date(employee.joinDate).toLocaleDateString()}</td>
                  <td>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditClick(employee)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                        onClick={() => handleDeleteClick(employee)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  No employees found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AlertDialog open={!!employeeToDelete} onOpenChange={(isOpen) => !isOpen && cancelDelete()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete {employeeToDelete?.name} from the system.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={confirmDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default EmployeeTable;
