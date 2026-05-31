import { describe, it, expect } from 'vitest';
import { Routes, Route } from 'react-router-dom';
import { screen } from '@/test/utils';
import { renderWithAuth } from '@/test/utils';
import ProtectedRoute from '../ProtectedRoute';

// Renders a full route tree inside the MemoryRouter that renderWithAuth provides.
// ProtectedRoute is a layout route (no path) that wraps a sentinel child.
function setup(isAuthenticated: boolean) {
  return renderWithAuth(
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path="/protected" element={<div>Protected Content</div>} />
      </Route>
      <Route path="/login" element={<div>Login Page</div>} />
    </Routes>,
    { isAuthenticated, initialEntries: ['/protected'] }
  );
}

describe('ProtectedRoute', () => {
  it('redirects to /login when not authenticated', () => {
    setup(false);

    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('renders the outlet child (sentinel element) when authenticated', () => {
    setup(true);

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('does not render the outlet child when not authenticated', () => {
    setup(false);

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });
});
