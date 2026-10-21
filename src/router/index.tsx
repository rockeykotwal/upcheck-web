/* eslint-disable react-refresh/only-export-components */
import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';

const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const StatusDetailPage = lazy(() => import('../pages/StatusDetailPage'));

const fallback = (
  <div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">
    Loading…
  </div>
);

export const router = createBrowserRouter([
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
]);
