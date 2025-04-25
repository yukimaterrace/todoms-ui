'use client';

import { useAuth } from '@/components/AuthProvider';
import { Alert, Box, Button, Card, CardContent, Container, Link, Stack, TextField, Typography } from '@mui/material';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AppLabels } from '@/config/label';
import { ROUTES } from '@/config/routes';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { login, user } = useAuth();
  const router = useRouter();

  // ユーザーが既にログインしている場合はダッシュボードにリダイレクト
  useEffect(() => {
    if (user) {
      router.push(ROUTES.TODOS);
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        router.push(ROUTES.TODOS);
      } else {
        setError(AppLabels.auth.login.error.failed);
      }
    } catch (err) {
      setError(AppLabels.auth.login.error.general);
    } finally {
      setIsLoading(false);
    }
  };

  // デモ用: テスト認証情報を設定
  const setDemoCredentials = () => {
    setEmail('user@example.com');
    setPassword('password');
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box 
          sx={{ 
            mb: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <TaskAltIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
          <Typography component="h1" variant="h4" fontWeight="bold">
            {AppLabels.auth.appName}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {AppLabels.auth.appDescription}
          </Typography>
        </Box>

        <Card elevation={2} sx={{ width: '100%', borderRadius: 2 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography component="h2" variant="h6" fontWeight="medium" sx={{ mb: 2 }}>
              {AppLabels.auth.login.title}
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Stack spacing={2}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label={AppLabels.auth.login.email}
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label={AppLabels.auth.login.password}
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isLoading}
                  sx={{ mt: 1 }}
                >
                  {isLoading ? AppLabels.auth.login.buttonLoading : AppLabels.auth.login.button}
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={setDemoCredentials}
                  disabled={isLoading}
                >
                  {AppLabels.auth.login.demoButton}
                </Button>
              </Stack>
            </Box>
          </CardContent>
        </Card>

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2">
            {AppLabels.auth.login.noAccount}{' '}
            <Link component={NextLink} href={ROUTES.AUTH.SIGNUP} variant="body2">
              {AppLabels.auth.login.signupLink}
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
