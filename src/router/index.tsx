/* eslint-disable react-refresh/only-export-components */
import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import AuthLayout from '../layouts/AuthLayout';
import ProtectedRoute from './ProtectedRoute';

const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const StatusDetailPage = lazy(() => import('../pages/StatusDetailPage'));
const WatchlistPage = lazy(() => import('../pages/WatchlistPage'));
const LoginPage = lazy(() => import('../pages/LoginPage'));
const RegisterPage = lazy(() => import('../pages/RegisterPage'));

const fallback = (
  <div className="min-h-screen flex items-center justify-center text-muted-foreground text-sm">
    Loading…
  </div>
);

export const router = createBrowserRouter([
  // Auth pages — centered card layout, no nav
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/login',
        element: (
          <Suspense fallback={fallback}>
            <LoginPage />
          </Suspense>
        ),
      },
      {
        path: '/register',
        element: (
          <Suspense fallback={fallback}>
            <RegisterPage />
          </Suspense>
        ),
      },
    ],
  },

  // Public pages — status dashboard is intentionally public
  {
    element: <DashboardLayout />,
    children: [
      {
        path: '/',
        element: (
          <Suspense fallback={fallback}>
            <DashboardPage />
          </Suspense>
        ),
      },
      {
        path: '/status/:slug',
        element: (
          <Suspense fallback={fallback}>
            <StatusDetailPage />
          </Suspense>
        ),
      },
    ],
  },

  // Protected pages — requires auth
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          {
            path: '/watchlist',
            element: (
              <Suspense fallback={fallback}>
                <WatchlistPage />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
]);
