'use client';

import { TodomsApiClient } from "@/lib/api-client";
import { UserResponse } from "@/lib/model";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  user: UserResponse | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  accessToken: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const apiClient = new TodomsApiClient();

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // 初回レンダリング時にローカルストレージからトークンを取得
  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    if (storedToken) {
      setAccessToken(storedToken);
      fetchUser(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  // ユーザー情報を取得
  const fetchUser = async (token: string) => {
    try {
      const response = await apiClient.getCurrentUser(token);
      if (response.data) {
        setUser(response.data);
      } else {
        // トークンが無効な場合はログアウト
        handleLogout();
      }
    } catch (error) {
      handleLogout();
    } finally {
      setLoading(false);
    }
  };

  // ログイン処理
  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await apiClient.login({ email, password });
      if (response.data) {
        const token = response.data.access_token;
        localStorage.setItem('accessToken', token);
        localStorage.setItem('refreshToken', response.data.refresh_token);
        setAccessToken(token);
        
        // ユーザー情報を取得
        const userResponse = await apiClient.getCurrentUser(token);
        if (userResponse.data) {
          setUser(userResponse.data);
          return true;
        }
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  // サインアップ処理
  const handleSignup = async (email: string, password: string) => {
    try {
      const response = await apiClient.signup({ email, password });
      if (response.data) {
        // サインアップ後自動ログイン
        return handleLogin(email, password);
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  // ログアウト処理
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setAccessToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login: handleLogin,
        signup: handleSignup,
        logout: handleLogout,
        accessToken
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
