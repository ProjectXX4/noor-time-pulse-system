
import { ReactNode } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { useAuth } from '@/contexts/AuthContext';

type DashboardLayoutProps = {
  children: ReactNode;
  title?: string;
};

const DashboardLayout = ({ children, title }: DashboardLayoutProps) => {
  const { user } = useAuth();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col min-h-screen">
          <header className="bg-white shadow-sm border-b">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <SidebarTrigger />
                <h1 className="ml-4 text-xl font-semibold text-gray-800">
                  {title || 'Dashboard'}
                </h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-sm">
                  <span className="text-gray-500">Welcome,</span>{' '}
                  <span className="font-medium">{user?.name}</span>
                </div>
                <div className="w-9 h-9 rounded-full bg-company-green text-white flex items-center justify-center font-medium">
                  {user?.name.charAt(0)}
                </div>
              </div>
            </div>
          </header>
          
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
          
          <footer className="py-4 px-6 border-t text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} NoorCare Employee Management System. All rights reserved.
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
