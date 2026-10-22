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
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-sm px-4 sm:px-6 py-3.5 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 font-bold text-lg hover:opacity-80 transition-opacity"
        >
          <span className="relative flex size-2.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60" />
            <span className="relative inline-flex rounded-full size-2.5 bg-green-500" />
          </span>
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

      {isAuthenticated && user && !user.emailVerifiedAt && (
        <div className="border-b border-yellow-500/20 bg-yellow-50/50 dark:bg-yellow-900/10 px-4 sm:px-6 py-2.5 flex items-center gap-2 text-xs text-yellow-700 dark:text-yellow-400">
          <span className="size-1.5 rounded-full bg-yellow-500 shrink-0" />
          <span>
            Please verify your email address. Check your inbox for a
            verification link.
          </span>
        </div>
      )}

      <main className="flex-1 px-4 sm:px-6 py-6 overflow-y-auto max-w-3xl w-full mx-auto">
        <Outlet />
      </main>
    </div>
  );
}
