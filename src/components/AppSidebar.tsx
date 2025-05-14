
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Clock, CheckCircle, FileText, User, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AppSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const employeeMenuItems = [
    {
      title: "Dashboard",
      icon: <Clock className="w-5 h-5" />,
      url: "/dashboard",
    },
    {
      title: "Check In/Out",
      icon: <CheckCircle className="w-5 h-5" />,
      url: "/check-in",
    },
    {
      title: "Daily Reports",
      icon: <FileText className="w-5 h-5" />,
      url: "/reports",
    },
  ];

  const adminMenuItems = [
    ...employeeMenuItems,
    {
      title: "Employees",
      icon: <User className="w-5 h-5" />,
      url: "/employees",
    },
    {
      title: "Settings",
      icon: <Settings className="w-5 h-5" />,
      url: "/settings",
    },
  ];

  const menuItems = user?.role === 'admin' ? adminMenuItems : employeeMenuItems;

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center space-x-2">
          <div className="bg-white rounded-md p-1">
            <div className="font-bold text-lg text-company-blue">Noor</div>
            <div className="text-xs text-company-blue">EMS</div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center space-x-3">
                      {item.icon}
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="flex flex-col space-y-4">
          <div className="text-xs text-white/70">
            Logged in as <span className="font-medium">{user?.name}</span>
          </div>
          <Button 
            onClick={handleLogout} 
            variant="outline" 
            size="sm" 
            className="bg-white/10 hover:bg-white/20 text-white border-white/20"
          >
            Logout
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
