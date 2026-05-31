import { describe, it, expect } from 'vitest';
import { http, HttpResponse, delay } from 'msw';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '@/test/utils';
import LoginForm from '../LoginForm';
import { server } from '@/test/mocks/server';
import { env } from '@/config/env';
import { useAuthStore } from '@/store/auth.store';

const loginUrl = `${env.apiUrl}/auth/login`;

describe('LoginForm', () => {
  it('renders email input, password input, and submit button', () => {
    render(<LoginForm />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /sign in/i })
    ).toBeInTheDocument();
  });

  it('shows email validation error when submitted with empty email', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/valid email/i)).toBeInTheDocument();
    });
  });

  it('shows password validation error when password is shorter than 6 characters', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByLabelText(/email/i), 'user@example.com');
    await user.type(screen.getByLabelText(/password/i), 'abc');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/6 characters/i)).toBeInTheDocument();
    });
  });

  it('shows no validation errors when form has valid values before submitting', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByLabelText(/email/i), 'user@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');

    expect(screen.queryByText(/valid email/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/6 characters/i)).not.toBeInTheDocument();
  });

  it('calls the login mutation and stores the access token on valid submission', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByLabelText(/email/i), 'user@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(useAuthStore.getState().accessToken).toBe('mock-token-123');
    });
  });

  it('shows "Signing in…" and disables the button while the request is pending', async () => {
    // Never resolve the request so the component stays in the pending state
    server.use(
      http.post(loginUrl, async () => {
        await delay('infinite');
      })
    );

    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByLabelText(/email/i), 'user@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      const button = screen.getByRole('button', { name: /signing in/i });
      expect(button).toBeDisabled();
    });
  });

  it('shows a generic error message when the login API returns 401', async () => {
    // Override login to return 401 for both the initial request and the
    // interceptor retry (which fires after the silent-refresh succeeds).
    server.use(
      http.post(loginUrl, () =>
        HttpResponse.json({ message: 'Unauthorized' }, { status: 401 })
      )
    );

    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByLabelText(/email/i), 'user@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    // The Axios interceptor catches the first 401, calls POST /auth/refresh
    // (handled by the default handler → success), then retries the login.
    // The retry hits the override again and rejects because _retry = true.
    await waitFor(
      () => {
        expect(
          screen.getByText('Login failed. Please check your credentials.')
        ).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });
});
