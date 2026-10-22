import { Outlet, Link } from 'react-router-dom';
import { env } from '../config/env';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <Link
          to="/"
          className="block text-center text-xl font-bold mb-8 hover:opacity-80 transition-opacity"
        >
          {env.appName}
        </Link>
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
