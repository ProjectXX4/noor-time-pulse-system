
import { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import AdminDashboard from '@/pages/AdminDashboard';
import CheckInPage from '@/pages/CheckInPage';
import ReportsPage from '@/pages/ReportsPage';
import EmployeesPage from '@/pages/EmployeesPage';
import SettingsPage from '@/pages/SettingsPage';
import NotFound from '@/pages/NotFound';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login', { replace: true, state: { from: location } });
    }
  }, [isAuthenticated, isLoading, navigate, location]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return isAuthenticated ? children : null;
};

const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, isLoading, navigate, location]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return user?.role === 'admin' ? children : null;
};

const DashboardRedirect = () => {
  const { user } = useAuth();
  
  if (user?.role === 'admin') {
    return <Navigate to="/admin" replace />;
  } else {
    return <Navigate to="/dashboard" replace />;
  }
};

const Router = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} 
      />
      
      {/* Private routes */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <DashboardRedirect />
          </PrivateRoute>
        }
      />
      
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />
      
      <Route
        path="/check-in"
        element={
          <PrivateRoute>
            <CheckInPage />
          </PrivateRoute>
        }
      />
      
      <Route
        path="/reports"
        element={
          <PrivateRoute>
            <ReportsPage />
          </PrivateRoute>
        }
      />
      
      <Route
        path="/employees"
        element={
          <AdminRoute>
            <EmployeesPage />
          </AdminRoute>
        }
      />
      
      <Route
        path="/settings"
        element={
          <AdminRoute>
            <SettingsPage />
          </AdminRoute>
        }
      />
      
      {/* Catch all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Router;
