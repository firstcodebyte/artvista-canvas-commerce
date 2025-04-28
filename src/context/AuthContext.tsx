
import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Defining the user roles
export type UserRole = 'user' | 'artist' | 'admin';

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

// Auth context interface
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isArtist: boolean;
}

// Creating the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Sample users for demonstration
const sampleUsers = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@artvista.com',
    password: 'admin123',
    role: 'admin' as UserRole,
  },
  {
    id: '2',
    name: 'Artist User',
    email: 'artist@artvista.com',
    password: 'artist123',
    role: 'artist' as UserRole,
  },
  {
    id: '3',
    name: 'Regular User',
    email: 'user@artvista.com',
    password: 'user123',
    role: 'user' as UserRole,
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  
  // Check for existing user session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('artVistaUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Login function
  const login = async (email: string, password: string, role: UserRole): Promise<void> => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const foundUser = sampleUsers.find(
          (u) => u.email === email && u.password === password && u.role === role
        );
        
        if (foundUser) {
          const { password: _, ...userWithoutPassword } = foundUser;
          setUser(userWithoutPassword);
          localStorage.setItem('artVistaUser', JSON.stringify(userWithoutPassword));
          
          // Store user login event in Supabase
          supabase.from('user_activity').insert({
            user_id: userWithoutPassword.id,
            email: userWithoutPassword.email,
            action: 'login',
            role: userWithoutPassword.role
          }).then(({ error }) => {
            if (error) console.error('Error logging activity:', error);
          });
          
          resolve();
        } else {
          reject(new Error('Invalid credentials or role'));
        }
      }, 1000);
    });
  };

  // Signup function
  const signup = async (name: string, email: string, password: string, role: UserRole): Promise<void> => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const existingUser = sampleUsers.find((u) => u.email === email);
        
        if (existingUser) {
          reject(new Error('User already exists'));
          return;
        }
        
        const newUser = {
          id: Math.random().toString(36).substr(2, 9),
          name,
          email,
          role,
        };
        
        setUser(newUser);
        localStorage.setItem('artVistaUser', JSON.stringify(newUser));
        
        // Store new user in Supabase
        supabase.from('users').insert({
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        }).then(({ error }) => {
          if (error) console.error('Error storing user:', error);
        });
        
        // Store user signup event in Supabase
        supabase.from('user_activity').insert({
          user_id: newUser.id,
          email: newUser.email,
          action: 'signup',
          role: newUser.role
        }).then(({ error }) => {
          if (error) console.error('Error logging activity:', error);
        });
        
        resolve();
      }, 1000);
    });
  };

  // Logout function
  const logout = () => {
    if (user) {
      // Store user logout event in Supabase
      supabase.from('user_activity').insert({
        user_id: user.id,
        email: user.email,
        action: 'logout',
        role: user.role
      }).then(({ error }) => {
        if (error) console.error('Error logging activity:', error);
      });
    }
    
    setUser(null);
    localStorage.removeItem('artVistaUser');
  };

  // Computed properties for convenience
  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';
  const isArtist = user?.role === 'artist';

  const value = {
    user,
    login,
    signup,
    logout,
    isAuthenticated,
    isAdmin,
    isArtist,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
