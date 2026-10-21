import { Outlet } from 'react-router-dom';
import { env } from '../config/env';
import ThemeToggle from '../components/common/ThemeToggle';

export default function DashboardLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <span className="text-lg font-bold">{env.appName}</span>
        <ThemeToggle />
      </header>
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
