import React, { createContext, useEffect, useState } from 'react';
import api from '../lib/api';

type User = { id: number; email: string } | null;

export type AuthContextValue = {
  user: User;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>; // 👈 new
};

// ✅ export the context (named)
export const AuthContext = createContext<AuthContextValue | null>(null);

function parseJwt<T = any>(t: string): T {
  try { return JSON.parse(atob(t.split('.')[1])); } catch { return {} as T; }
}

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [token, setToken] = useState<string | null>(null);

  // load saved auth on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('accessToken');
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
    }
  }, []);

  const login = async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    const accessToken: string = data.accessToken ?? data.token;
    if (!accessToken) throw new Error('No token from server');

    // persist + set header
    localStorage.setItem('accessToken', accessToken);
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    setToken(accessToken);

    // build minimal user from JWT
    const payload = parseJwt<{ userId?: number; sub?: number; email?: string }>(accessToken);
    const u = { id: (payload.userId ?? payload.sub) as number, email: payload.email ?? email };
    setUser(u);
    localStorage.setItem('user', JSON.stringify(u));
  };

  const register = async (name: string, email: string, password: string) => {
    await api.post('/auth/register', { name, email, password });
    // Do NOT auto-login here. We’ll redirect to /login after success.
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!token, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
