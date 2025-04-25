'use client';

import { useAuth } from '@/components/AuthProvider';
import Loading from '@/components/Loading';
import { ROUTES } from '@/config/routes';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RootPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // ローディング完了後にリダイレクト
    if (!loading) {
      if (user) {
        // 認証済みの場合はメインページへ
        router.push(ROUTES.TODOS);
      } else {
        // 未認証の場合はログインページへ
        router.push(ROUTES.AUTH.LOGIN);
      }
    }
  }, [user, loading, router]);

  // リダイレクト中はローディングインジケータを表示
  return <Loading />;
}
