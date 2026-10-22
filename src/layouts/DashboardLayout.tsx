import { Outlet, Link } from 'react-router-dom';
import { env } from '../config/env';
import ThemeToggle from '../components/common/ThemeToggle';
import { useAuthStore } from '../store/auth.store';
import { useLogout } from '../features/auth/hooks/useLogout';

export default function DashboardLayout() {
  const { isAuthenticated, user } = useAuthStore();
  const { mutate: logout, isPending } = useLogout();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="text-lg font-bold hover:opacity-80 transition-opacity"
        >
          {env.appName}
        </Link>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          {isAuthenticated ? (
            <>
              <Link
                to="/watchlist"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Watchlist
              </Link>
              <span className="text-sm text-muted-foreground hidden sm:block">
                {user?.firstName} {user?.lastName}
              </span>
              <button
                onClick={() => logout()}
                disabled={isPending}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Sign in
            </Link>
          )}
        </div>
      </header>

      <main className="flex-1 px-4 sm:px-6 py-6 overflow-y-auto max-w-3xl w-full mx-auto">
        <Outlet />
      </main>
    </div>
  );
}
