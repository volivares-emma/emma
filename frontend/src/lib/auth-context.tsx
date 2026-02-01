'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  first_name?: string | null;
  last_name?: string | null;
}

interface AuthContextType {
  user: User | null;
  status: 'loading' | 'authenticated' | 'unauthenticated';
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');
  const router = useRouter();
  const pathname = usePathname();

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
        cache: 'no-store', // Evitar cache
      });
      
      console.log('AuthContext: Verificando sesión...', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('AuthContext: Usuario autenticado', data.user);
        setUser(data.user);
        setStatus('authenticated');
      } else {
        console.log('AuthContext: No autenticado');
        setUser(null);
        setStatus('unauthenticated');
      }
    } catch (error) {
      console.error('AuthContext: Error al verificar sesión', error);
      setUser(null);
      setStatus('unauthenticated');
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (status === 'unauthenticated' && pathname?.startsWith('/admin')) {
      router.push('/');
    }
  }, [status, pathname, router]);

  const signOut = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      setStatus('unauthenticated');
      router.push('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const refreshUser = async () => {
    await fetchUser();
  };

  return (
    <AuthContext.Provider value={{ user, status, signOut, refreshUser }}>
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

// Hook compatible con useSession de next-auth para facilitar migración
export function useSession() {
  const { user, status } = useAuth();
  return {
    data: user ? { user } : null,
    status,
  };
}
