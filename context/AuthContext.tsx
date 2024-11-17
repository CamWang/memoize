// context/AuthContext.tsx
import React, { createContext, useContext, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  login: (data: { access_token: string; user: User }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // Load stored authentication data when the component mounts
  React.useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync('userToken');
        const storedUser = await SecureStore.getItemAsync('userData');
        
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error loading auth data:', error);
      }
    };

    loadStoredAuth();
  }, []);

  const login = async (data: { access_token: string; user: User }) => {
    try {
      // Store in SecureStore
      await SecureStore.setItemAsync('userToken', data.access_token);
      await SecureStore.setItemAsync('userData', JSON.stringify(data.user));
      
      // Update state
      setToken(data.access_token);
      setUser(data.user);
    } catch (error) {
      console.error('Error storing auth data:', error);
    }
  };

  const logout = async () => {
    try {
      // Remove from SecureStore
      await SecureStore.deleteItemAsync('userToken');
      await SecureStore.deleteItemAsync('userData');
      
      // Update state
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Error removing auth data:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}