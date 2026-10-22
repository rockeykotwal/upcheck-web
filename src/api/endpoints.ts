export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    SIGNUP: '/api/auth/signup',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
  },
  STATUS: {
    LIST: '/api/status',
    SEARCH: '/api/status/search',
    DETAIL: (slug: string) => `/api/status/${slug}`,
  },
  AI: {
    SUMMARY: (slug: string) => `/api/ai/summary/${slug}`,
  },
  WATCHLIST: {
    LIST: '/api/watchlist',
    WATCH: (slug: string) => `/api/watchlist/${slug}`,
    UNWATCH: (slug: string) => `/api/watchlist/${slug}`,
  },
} as const;
