import { describe, it, expect } from 'vitest';
import { Routes, Route } from 'react-router-dom';
import { screen } from '@/test/utils';
import { renderWithAuth } from '@/test/utils';
import type { User } from '@/types/auth.types';
import RoleGuard from '../RoleGuard';

function makeUser(role: string): User {
  return {
    id: 'user-1',
    name: 'Test User',
    email: 'test@example.com',
    role,
    createdAt: '2024-01-01T00:00:00.000Z',
  };
}

// Renders RoleGuard as a layout route in front of a sentinel child.
// The redirect target /unauthorized is also registered so Navigate renders it.
function setup(allowedRoles: string[], user: User | null) {
  return renderWithAuth(
    <Routes>
      <Route element={<RoleGuard allowedRoles={allowedRoles} />}>
        <Route path="/dashboard" element={<div>Dashboard Content</div>} />
      </Route>
      <Route path="/unauthorized" element={<div>Unauthorized Page</div>} />
    </Routes>,
    {
      isAuthenticated: user !== null,
      user: user ?? undefined,
      initialEntries: ['/dashboard'],
    }
  );
}

describe('RoleGuard', () => {
  it('redirects to /unauthorized when user is null', () => {
    setup(['admin'], null);

    expect(screen.getByText('Unauthorized Page')).toBeInTheDocument();
  });

  it('redirects to /unauthorized when user role is not in allowedRoles', () => {
    setup(['admin'], makeUser('viewer'));

    expect(screen.getByText('Unauthorized Page')).toBeInTheDocument();
  });

  it('renders the outlet child when user role is in allowedRoles', () => {
    setup(['admin'], makeUser('admin'));

    expect(screen.getByText('Dashboard Content')).toBeInTheDocument();
  });

  it('allows through a user whose role matches the second entry in allowedRoles', () => {
    setup(['admin', 'editor'], makeUser('editor'));

    expect(screen.getByText('Dashboard Content')).toBeInTheDocument();
  });
});
