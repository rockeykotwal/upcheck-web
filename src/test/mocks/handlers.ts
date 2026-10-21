import { http, HttpResponse } from 'msw';
import { env } from '@/config/env';

const base = env.apiUrl;

export const handlers = [
  http.get(`${base}/api/status`, () => HttpResponse.json({ statuses: [] })),

  http.get(`${base}/api/status/search`, () =>
    HttpResponse.json({ statuses: [] })
  ),

  http.all('*', ({ request }) => {
    console.warn(`[MSW] No handler for ${request.method} ${request.url}`);
  }),
];
