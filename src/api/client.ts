import axios, { type AxiosRequestConfig, type AxiosError } from 'axios';
import { env } from '../config/env';
import { ENDPOINTS } from './endpoints';

interface RetryableConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

const client = axios.create({
  baseURL: env.apiUrl,
  withCredentials: true,
});

// ── Request: attach access token ──────────────────────────────────────────────
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response: silent refresh on 401 ──────────────────────────────────────────
type QueueItem = {
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
};

let isRefreshing = false;
let queue: QueueItem[] = [];

function drainQueue(token: string) {
  queue.forEach(({ resolve }) => resolve(token));
  queue = [];
}

function rejectQueue(error: unknown) {
  queue.forEach(({ reject }) => reject(error));
  queue = [];
}

client.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const config = error.config as RetryableConfig | undefined;

    const is401 = error.response?.status === 401;
    const isRetry = config?._retry;
    const isRefreshCall = config?.url === ENDPOINTS.AUTH.REFRESH;
    const isLoginCall = config?.url === ENDPOINTS.AUTH.LOGIN;

    if (!is401 || isRetry || isRefreshCall || isLoginCall || !config) {
      return Promise.reject(error);
    }

    // Queue concurrent 401s while a refresh is already in flight
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        queue.push({ resolve, reject });
      }).then((token) => {
        if (config.headers) config.headers.Authorization = `Bearer ${token}`;
        return client(config);
      });
    }

    isRefreshing = true;
    config._retry = true;

    try {
      const res = await client.get<{
        success: boolean;
        data: { accessToken: string };
      }>(ENDPOINTS.AUTH.REFRESH);
      const newToken = res.data.data.accessToken;

      localStorage.setItem('accessToken', newToken);
      drainQueue(newToken);

      if (config.headers) config.headers.Authorization = `Bearer ${newToken}`;
      return client(config);
    } catch (refreshError) {
      rejectQueue(refreshError);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('authUser');
      window.location.href = '/login';
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default client;
