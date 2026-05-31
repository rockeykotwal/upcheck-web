import { render, type RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import type { ReactElement } from 'react';
import ThemeProvider from '@/providers/ThemeProvider';
import { useAuthStore } from '@/store/auth.store';
import type { User } from '@/types/auth.types';

const mockUser: User = {
  id: 'user-1',
  name: 'Test User',
  email: 'test@example.com',
  role: 'user',
  createdAt: '2024-01-01T00:00:00.000Z',
};

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
}

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialEntries?: string[];
}

function customRender(
  ui: ReactElement,
  { initialEntries = ['/'], ...options }: CustomRenderOptions = {}
) {
  const queryClient = createTestQueryClient();

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={initialEntries}>
          <ThemeProvider>{children}</ThemeProvider>
        </MemoryRouter>
      </QueryClientProvider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...options });
}

interface RenderWithAuthOptions extends CustomRenderOptions {
  isAuthenticated?: boolean;
  user?: User;
  token?: string;
}

export function renderWithAuth(
  ui: ReactElement,
  {
    isAuthenticated = true,
    user = mockUser,
    token = 'mock-token-123',
    ...options
  }: RenderWithAuthOptions = {}
) {
  useAuthStore.setState({
    user: isAuthenticated ? user : null,
    accessToken: isAuthenticated ? token : null,
    isAuthenticated,
    isLoading: false,
  });

  return customRender(ui, options);
}

// eslint-disable-next-line react-refresh/only-export-components
export * from '@testing-library/react';
export { customRender as render };
