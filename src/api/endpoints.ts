export const ENDPOINTS = {
  STATUS: {
    LIST: '/api/status',
    SEARCH: '/api/status/search',
    DETAIL: (slug: string) => `/api/status/${slug}`,
  },
  AI: {
    SUMMARY: (slug: string) => `/api/ai/summary/${slug}`,
  },
} as const;
