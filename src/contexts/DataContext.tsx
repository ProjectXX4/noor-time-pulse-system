
import { createContext, ReactNode, useContext, useState } from 'react';

// Types for our data
export type CheckInRecord = {
  id: number;
  userId: number;
  timestamp: string;
  type: 'in' | 'out';
};

export type WorkReport = {
  id: number;
  userId: number;
  date: string;
  tasks: string;
  issues: string;
  plans: string;
  files?: string[];
  submittedAt: string;
};

export type Employee = {
  id: number;
  name: string;
  email: string;
  department: string;
  position: string;
  joinDate: string;
};

// Mock data
const generateMockCheckIns = () => {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const dayBefore = new Date(now);
  dayBefore.setDate(dayBefore.getDate() - 2);
  
  return [
    { id: 1, userId: 2, timestamp: `${now.toISOString().split('T')[0]}T09:02:15`, type: 'in' as const },
    { id: 2, userId: 2, timestamp: `${now.toISOString().split('T')[0]}T17:30:10`, type: 'out' as const },
    { id: 3, userId: 3, timestamp: `${now.toISOString().split('T')[0]}T08:55:22`, type: 'in' as const },
    { id: 4, userId: 2, timestamp: `${yesterday.toISOString().split('T')[0]}T09:05:33`, type: 'in' as const },
    { id: 5, userId: 2, timestamp: `${yesterday.toISOString().split('T')[0]}T18:15:07`, type: 'out' as const },
    { id: 6, userId: 3, timestamp: `${yesterday.toISOString().split('T')[0]}T08:59:11`, type: 'in' as const },
    { id: 7, userId: 3, timestamp: `${yesterday.toISOString().split('T')[0]}T17:05:45`, type: 'out' as const },
    { id: 8, userId: 2, timestamp: `${dayBefore.toISOString().split('T')[0]}T09:00:00`, type: 'in' as const },
    { id: 9, userId: 2, timestamp: `${dayBefore.toISOString().split('T')[0]}T17:00:00`, type: 'out' as const },
  ];
};

const mockWorkReports: WorkReport[] = [
  {
    id: 1,
    userId: 2,
    date: new Date().toISOString().split('T')[0],
    tasks: 'Completed frontend design for customer portal. Resolved 3 bug tickets.',
    issues: 'Encountered integration issues with payment API',
    plans: 'Fix API integration issues and start working on admin dashboard',
    submittedAt: new Date().toISOString(),
  },
  {
    id: 2,
    userId: 3,
    date: new Date().toISOString().split('T')[0],
    tasks: 'Finished documentation for API v2. Conducted code reviews.',
    issues: 'Database was slow during peak hours',
    plans: 'Optimize database queries and work on new feature requests',
    files: ['documentation.pdf'],
    submittedAt: new Date().toISOString(),
  },
];

const mockEmployees: Employee[] = [
  {
    id: 2,
    name: 'John Employee',
    email: 'john@nooralqmar.com',
    department: 'Engineering',
    position: 'Frontend Developer',
    joinDate: '2022-05-15',
  },
  {
    id: 3,
    name: 'Sarah Employee',
    email: 'sarah@nooralqmar.com',
    department: 'Engineering',
    position: 'Backend Developer',
    joinDate: '2022-03-10',
  },
];

// Define context type
type DataContextType = {
  checkIns: CheckInRecord[];
  workReports: WorkReport[];
  employees: Employee[];
  addCheckIn: (userId: number, type: 'in' | 'out') => void;
  addWorkReport: (report: Omit<WorkReport, 'id' | 'submittedAt'>) => void;
  addEmployee: (employee: Omit<Employee, 'id'>) => void;
  getEmployeeById: (id: number) => Employee | undefined;
  getTodayCheckIn: (userId: number) => CheckInRecord | undefined;
  getTodayCheckOut: (userId: number) => CheckInRecord | undefined;
  getUserReports: (userId: number) => WorkReport[];
  getUserCheckIns: (userId: number) => CheckInRecord[];
  getOvertime: (userId: number, period: 'day' | 'week' | 'month') => { minutes: number, hours: number };
};

// Create the context
const DataContext = createContext<DataContextType | undefined>(undefined);

// Provider component
export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [checkIns, setCheckIns] = useState<CheckInRecord[]>(generateMockCheckIns());
  const [workReports, setWorkReports] = useState<WorkReport[]>(mockWorkReports);
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);

  // Calculate the start of today
  const getStartOfDay = () => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString().split('T')[0];
  };

  const addCheckIn = (userId: number, type: 'in' | 'out') => {
    const now = new Date();
    const newCheckIn = {
      id: checkIns.length + 1,
      userId,
      timestamp: now.toISOString(),
      type,
    };
    setCheckIns([...checkIns, newCheckIn]);
  };

  const addWorkReport = (report: Omit<WorkReport, 'id' | 'submittedAt'>) => {
    const newReport = {
      ...report,
      id: workReports.length + 1,
      submittedAt: new Date().toISOString(),
    };
    setWorkReports([...workReports, newReport]);
  };

  const addEmployee = (employee: Omit<Employee, 'id'>) => {
    const newEmployee = {
      ...employee,
      id: employees.length + 1,
    };
    setEmployees([...employees, newEmployee]);
  };

  const getEmployeeById = (id: number) => {
    return employees.find((emp) => emp.id === id);
  };

  const getTodayCheckIn = (userId: number) => {
    const today = getStartOfDay();
    return checkIns.find(
      (record) => record.userId === userId && 
                 record.timestamp.startsWith(today) && 
                 record.type === 'in'
    );
  };

  const getTodayCheckOut = (userId: number) => {
    const today = getStartOfDay();
    return checkIns.find(
      (record) => record.userId === userId && 
                 record.timestamp.startsWith(today) && 
                 record.type === 'out'
    );
  };

  const getUserReports = (userId: number) => {
    return workReports.filter((report) => report.userId === userId);
  };

  const getUserCheckIns = (userId: number) => {
    return checkIns.filter((record) => record.userId === userId);
  };

  // Calculate overtime (minutes past 5 PM)
  const getOvertime = (userId: number, period: 'day' | 'week' | 'month') => {
    const now = new Date();
    const startPeriod = new Date();
    
    if (period === 'day') {
      startPeriod.setDate(now.getDate() - 1);
    } else if (period === 'week') {
      startPeriod.setDate(now.getDate() - 7);
    } else {
      startPeriod.setMonth(now.getMonth() - 1);
    }
    
    const relevantCheckIns = checkIns.filter(
      (record) => record.userId === userId && 
                 new Date(record.timestamp) >= startPeriod && 
                 record.type === 'out'
    );
    
    let totalMinutes = 0;
    
    relevantCheckIns.forEach((record) => {
      const checkoutTime = new Date(record.timestamp);
      const hour = checkoutTime.getHours();
      const minutes = checkoutTime.getMinutes();
      
      // If checkout after 5pm (17:00)
      if (hour >= 17) {
        const overtimeMinutes = (hour - 17) * 60 + minutes;
        totalMinutes += overtimeMinutes;
      }
    });
    
    return {
      minutes: totalMinutes,
      hours: Math.floor(totalMinutes / 60)
    };
  };

  return (
    <DataContext.Provider
      value={{
        checkIns,
        workReports,
        employees,
        addCheckIn,
        addWorkReport,
        addEmployee,
        getEmployeeById,
        getTodayCheckIn,
        getTodayCheckOut,
        getUserReports,
        getUserCheckIns,
        getOvertime,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

// Custom hook to use the data context
export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
