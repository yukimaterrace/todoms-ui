'use client';

import { useAuth } from '@/components/AuthProvider';
import { Alert, Box, Button, Card, CardContent, Container, Link, Stack, TextField, Typography } from '@mui/material';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AppLabels } from '@/config/label';
import { ROUTES } from '@/config/routes';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { signup, user } = useAuth();
  const router = useRouter();

  // ユーザーが既にログインしている場合はダッシュボードにリダイレクト
  useEffect(() => {
    if (user) {
      router.push(ROUTES.TODOS);
    }
  }, [user, router]);

  // フォーム送信
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // バリデーション
    if (password !== passwordConfirm) {
      setError(AppLabels.auth.signup.error.passwordMismatch);
      return;
    }

    if (password.length < 6) {
      setError(AppLabels.auth.signup.error.passwordLength);
      return;
    }

    setIsLoading(true);
    
    try {
      const success = await signup(email, password);
      if (success) {
        router.push(ROUTES.TODOS);
      } else {
        setError(AppLabels.auth.signup.error.failed);
      }
    } catch (err) {
      setError(AppLabels.auth.signup.error.general);
    } finally {
      setIsLoading(false);
    }
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
              {AppLabels.auth.signup.title}
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
                  label={AppLabels.auth.signup.email}
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
                  label={AppLabels.auth.signup.password}
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  helperText={AppLabels.auth.signup.passwordHint}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password-confirm"
                  label={AppLabels.auth.signup.passwordConfirm}
                  type="password"
                  id="password-confirm"
                  autoComplete="new-password"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isLoading}
                  sx={{ mt: 1 }}
                >
                  {isLoading ? AppLabels.auth.signup.buttonLoading : AppLabels.auth.signup.button}
                </Button>
              </Stack>
            </Box>
          </CardContent>
        </Card>

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2">
            {AppLabels.auth.signup.haveAccount}{' '}
            <Link component={NextLink} href={ROUTES.AUTH.LOGIN} variant="body2">
              {AppLabels.auth.signup.loginLink}
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
