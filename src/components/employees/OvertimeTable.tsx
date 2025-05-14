
import { Employee } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';

interface OvertimeTableProps {
  employees: Employee[];
  getOvertime: (userId: number, period: 'day' | 'week' | 'month') => { minutes: number, hours: number };
}

const OvertimeTable = ({ employees, getOvertime }: OvertimeTableProps) => {
  return (
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
  );
};

export default OvertimeTable;
