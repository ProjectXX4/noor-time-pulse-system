
import { createContext, useState, ReactNode, useContext, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";

// Define types for our context
type User = {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'employee';
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const mockUsers = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@nooralqmar.com',
    password: 'admin123',
    role: 'admin' as const,
  },
  {
    id: 2,
    name: 'John Employee',
    email: 'john@nooralqmar.com',
    password: 'john123',
    role: 'employee' as const,
  },
  {
    id: 3,
    name: 'Sarah Employee',
    email: 'sarah@nooralqmar.com',
    password: 'sarah123',
    role: 'employee' as const,
  },
];

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API call
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        const foundUser = mockUsers.find(
          (u) => u.email === email && u.password === password
        );

        if (foundUser) {
          const { password, ...userWithoutPassword } = foundUser;
          setUser(userWithoutPassword);
          localStorage.setItem('user', JSON.stringify(userWithoutPassword));
          toast({
            title: "Login successful",
            description: `Welcome back, ${userWithoutPassword.name}!`,
          });
          resolve(true);
        } else {
          toast({
            title: "Login failed",
            description: "Invalid email or password.",
            variant: "destructive",
          });
          resolve(false);
        }
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
