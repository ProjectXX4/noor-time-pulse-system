
import { Employee } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Building, Briefcase } from 'lucide-react';

interface EmployeeTableProps {
  employees: Employee[];
}

const EmployeeTable = ({ employees }: EmployeeTableProps) => {
  return (
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
              No employees found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default EmployeeTable;
