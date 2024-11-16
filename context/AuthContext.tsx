// context/AuthContext.tsx
import React, { createContext, useContext, useState } from 'react';

interface User {
  id: number;
  username: string;
  email: string;
  // Add any other user fields that come from the API
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

  const login = (data: { access_token: string; user: User }) => {
    setToken(data.access_token);
    setUser(data.user);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
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