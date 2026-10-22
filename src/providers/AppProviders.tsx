import { useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../lib/queryClient';
import ThemeProvider from './ThemeProvider';
import ErrorBoundary from '../components/common/ErrorBoundary';
import { Toaster } from '../components/ui/sonner';
import { silentRefresh } from '../api/auth.api';
import { useAuthStore } from '../store/auth.store';

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { setToken, logout } = useAuthStore();

  useEffect(() => {
    silentRefresh()
      .then(({ accessToken }) => setToken(accessToken))
      .catch(() => logout());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
}

interface AppProvidersProps {
  children: React.ReactNode;
}

export default function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary>
          <AuthInitializer>{children}</AuthInitializer>
          <Toaster position="top-right" />
        </ErrorBoundary>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
