
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle, FileText, User } from 'lucide-react';
import { Card } from '@/components/ui/card';

const Index = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header Section */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="font-bold text-2xl text-company-blue">Noor<span className="text-gray-700">EMS</span></div>
          </div>
          <Button variant="outline" onClick={handleGetStarted}>Login</Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-16 pb-24 flex flex-col lg:flex-row items-center">
        <div className="lg:w-1/2 lg:pr-12 mb-10 lg:mb-0">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Employee Management System for <span className="text-company-blue">Nooralqmar</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            A comprehensive solution to manage employee attendance, work reports, and performance tracking.
          </p>
          <Button 
            onClick={handleGetStarted}
            size="lg" 
            className="bg-company-blue hover:bg-company-darkBlue text-white px-8 py-6 text-lg"
          >
            Get Started
          </Button>
        </div>
        <div className="lg:w-1/2">
          <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-100">
            <img src="https://i.imgur.com/Tn8YS5x.png" alt="Dashboard Preview" className="rounded-lg shadow-lg" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="h-14 w-14 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-company-blue" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Check-In System</h3>
              <p className="text-gray-600">
                Secure employee check-in/out with accurate time tracking and attendance management.
              </p>
            </Card>
            
            <Card className="p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="h-14 w-14 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Clock className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Overtime Tracking</h3>
              <p className="text-gray-600">
                Automatic overtime calculation with customizable working hours and detailed reports.
              </p>
            </Card>
            
            <Card className="p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="h-14 w-14 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Daily Reports</h3>
              <p className="text-gray-600">
                Easy submission of daily work reports with task tracking and file attachments.
              </p>
            </Card>
            
            <Card className="p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="h-14 w-14 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <User className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Admin Dashboard</h3>
              <p className="text-gray-600">
                Comprehensive admin tools to manage employees, view reports, and analyze performance.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="text-2xl font-bold">NoorEMS</div>
              <p className="text-gray-400">Employee Management System</p>
            </div>
            <div className="text-center md:text-right">
              <p>&copy; {new Date().getFullYear()} Nooralqmar. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
