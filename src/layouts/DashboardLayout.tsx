import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { env } from '../config/env';
import ThemeToggle from '../components/common/ThemeToggle';

export default function DashboardLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="text-lg font-bold hover:opacity-80 transition-opacity"
        >
          {env.appName}
        </Link>
        <ThemeToggle />
      </header>
      <main className="flex-1 px-4 sm:px-6 py-6 overflow-y-auto max-w-3xl w-full mx-auto">
        <Outlet />
      </main>
    </div>
  );
}
