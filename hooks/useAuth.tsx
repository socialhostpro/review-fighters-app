
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types';
import { authService } from '../services/authService'; // Assuming authService handles actual auth logic

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLoggedInUser = async () => {
      setIsLoading(true);
      try {
        // This would typically be a call to verify a session token
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.info('No active session or error fetching user:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkLoggedInUser();
  }, []);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const loggedInUser = await authService.login(email, pass);
      setUser(loggedInUser);
    } catch (error) {
      console.error('Login failed:', error);
      setUser(null); 
      throw error; // Re-throw to be caught by UI
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
      // Decide if user should be cleared even if backend logout fails
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
    