import { http, HttpResponse } from 'msw';
import { env } from '@/config/env';

const base = env.apiUrl;

export const handlers = [
  http.post(`${base}/auth/login`, () =>
    HttpResponse.json({ data: { accessToken: 'mock-token-123' } })
  ),

  http.post(`${base}/auth/register`, () =>
    HttpResponse.json({ data: { message: 'User created' } }, { status: 201 })
  ),

  http.post(
    `${base}/auth/logout`,
    () => new HttpResponse(null, { status: 200 })
  ),

  http.post(`${base}/auth/refresh`, () =>
    HttpResponse.json({ data: { accessToken: 'mock-token-new' } })
  ),

  http.all('*', ({ request }) => {
    console.warn(`[MSW] No handler for ${request.method} ${request.url}`);
  }),
];
