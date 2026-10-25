import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { env } from '../config/env';
import ThemeToggle from '../components/common/ThemeToggle';
import { useAuthStore } from '../store/auth.store';
import { useLogout } from '../features/auth/hooks/useLogout';

function useBannerDismissed(userId: string | undefined) {
  const key = `emailBanner:dismissed:${userId}`;
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem(key) === '1'
  );
  const dismiss = () => {
    localStorage.setItem(key, '1');
    setDismissed(true);
  };
  return [dismissed, dismiss] as const;
}

export default function DashboardLayout() {
  const { isAuthenticated, user } = useAuthStore();
  const { mutate: logout, isPending } = useLogout();
  const [bannerDismissed, dismissBanner] = useBannerDismissed(user?.id);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Gutter atmosphere — only on large screens where gutters actually exist */}
      <div
        aria-hidden="true"
        className="pointer-events-none hidden lg:block fixed left-0 top-1/4 -translate-x-1/3 w-[500px] h-[580px] rounded-full blur-[120px] opacity-[0.22] z-0"
        style={{
          background: 'radial-gradient(circle, #A31C1B, transparent 70%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none hidden lg:block fixed right-0 top-[38%] translate-x-1/3 w-[460px] h-[540px] rounded-full blur-[120px] opacity-[0.15] z-0"
        style={{
          background: 'radial-gradient(circle, #1e5c30, transparent 70%)',
        }}
      />
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-sm px-4 sm:px-6 py-3.5 flex items-center justify-between relative">
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

      {isAuthenticated && user && !user.emailVerifiedAt && !bannerDismissed && (
        <div className="border-b border-yellow-500/20 bg-yellow-50/50 dark:bg-yellow-900/10 px-4 sm:px-6 py-2.5 flex items-center gap-2 text-xs text-yellow-700 dark:text-yellow-400">
          <span className="size-1.5 rounded-full bg-yellow-500 shrink-0" />
          <span className="flex-1">
            Please verify your email address. Check your inbox for a
            verification link.
          </span>
          <button
            onClick={dismissBanner}
            aria-label="Dismiss"
            className="ml-2 hover:opacity-70 transition-opacity"
          >
            ✕
          </button>
        </div>
      )}

      <main className="flex-1 px-4 sm:px-6 py-6 overflow-y-auto max-w-5xl w-full mx-auto relative z-[1]">
        <Outlet />
      </main>

      <footer className="border-t border-border py-4 flex justify-center gap-4">
        <a
          href="https://www.linkedin.com/in/rockey-kotwal-2b7482142/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground/50 hover:text-muted-foreground transition-colors"
          aria-label="LinkedIn"
        >
          <svg
            role="img"
            viewBox="0 0 24 24"
            className="size-4 fill-current"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
        </a>
        <a
          href="https://github.com/rockeykotwal"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground/50 hover:text-muted-foreground transition-colors"
          aria-label="GitHub"
        >
          <svg
            role="img"
            viewBox="0 0 24 24"
            className="size-4 fill-current"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
          </svg>
        </a>
      </footer>
    </div>
  );
}
