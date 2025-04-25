'use client';

import AppHeader from '@/components/AppHeader';
import { useAuth } from '@/components/AuthProvider';
import Loading from '@/components/Loading';
import { ROUTES } from '@/config/routes';
import { Container } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, loading, logout, accessToken } = useAuth();
  const router = useRouter();

  // ログイン状態をチェック
  useEffect(() => {
    if (!loading && !user) {
      // ログインしていない場合はログインページにリダイレクト
      router.push(ROUTES.AUTH.LOGIN);
    }
  }, [user, loading, router]);

  // ローディング中はローディングインジケータを表示
  if (loading) {
    return <Loading />;
  }

  // ユーザーがログインしていない場合は何も表示しない（リダイレクト中）
  if (!user) {
    return null;
  }

  // ログイン済みの場合はレイアウトを表示
  return (
    <>
      <AppHeader user={user} onLogout={logout} />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {children}
      </Container>
    </>
  );
}
