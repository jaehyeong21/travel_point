'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { setCookie, getCookie, hasCookie } from '@/libs/cookie';
import { useUserStore } from '@/store/userStore';
import { fetchFromAuthApi } from '@/services/fetch-api';
import { useQuery } from '@tanstack/react-query';
import { jwtDecode } from '@/libs/utils';

interface AuthContextType {
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  tokenExpiry: number | null;
  setTokenExpiry: React.Dispatch<React.SetStateAction<number | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const fetchUserData = async () => {
  const refreshToken = hasCookie('refreshToken');
  console.log(refreshToken);
  const accessToken = hasCookie('accessToken');
  if (refreshToken && !accessToken) {
    const response = await fetchFromAuthApi('/refresh', { refreshToken }, 'POST');
    if (response.response) {
      const newAccessToken = response.result.accessToken;
      const expiresIn = 2 * 60 * 60 * 1000; // 2 hours
      setCookie({ name: 'accessToken', value: newAccessToken, hours: 2, secure: true });
      const user = jwtDecode(newAccessToken);
      return {
        token: newAccessToken,
        tokenExpiry: Date.now() + expiresIn,
        user: user,
      };
    } else {
      throw new Error('Failed to refresh token');
    }
  } else {
    throw new Error('No refresh token found');
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [tokenExpiry, setTokenExpiry] = useState<number | null>(null);
  const setUser = useUserStore((state) => state.setUser);
  const clearUser = useUserStore((state) => state.clearUser);
  const router = useRouter();

  useEffect(() => {
    // 클라이언트 측에서만 실행
    const storedToken = getCookie('accessToken');
    if (storedToken) {
      setToken(storedToken);
      const user = jwtDecode(storedToken);
      if (user) {
        setCookie({ name: 'accessToken', value: storedToken, hours: 2, secure: true });
        setUser(user);
      }
    } else {
      const refreshToken = getCookie('refreshToken');
      if (refreshToken) {
        refetch();
      } else {
        clearUser();
        router.push('/auth');
      }
    }
  }, [setUser, clearUser, router]);

  const { refetch } = useQuery({
    queryKey: ['refreshToken'],
    queryFn: fetchUserData,
    enabled: false,
  });

  useEffect(() => {
    const refreshUserData = async () => {
      try {
        const data = await refetch();
        if (data.data) {
          setToken(data.data.token);
          setTokenExpiry(data.data.tokenExpiry);
          if (data.data.user) {
            setUser(data.data.user);
          } else {
            clearUser();
            router.push('/auth');
          }
        } else {
          clearUser();
          router.push('/auth');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        clearUser();
        router.push('/auth');
      }
    };

    refreshUserData();
  }, [refetch, setUser, clearUser, router]);

  // Schedule a query to refresh the token 1 minute before it expires
  useEffect(() => {
    if (tokenExpiry) {
      const timeout = setTimeout(() => {
        refetch();
      }, tokenExpiry - Date.now() - 60 * 1000);

      return () => clearTimeout(timeout);
    }
  }, [tokenExpiry, refetch]);

  return (
    <AuthContext.Provider value={{ token, setToken, tokenExpiry, setTokenExpiry }}>
      {children}
    </AuthContext.Provider>
  );
};
