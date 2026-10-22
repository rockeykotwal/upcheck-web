import client from './client';
import { ENDPOINTS } from './endpoints';
import type { WatchlistItem } from '../types/watchlist.types';

export async function fetchWatchlist(): Promise<WatchlistItem[]> {
  const res = await client.get<{ success: boolean; data: WatchlistItem[] }>(
    ENDPOINTS.WATCHLIST.LIST
  );
  return res.data.data;
}

export async function watchCompany(slug: string): Promise<void> {
  await client.post(ENDPOINTS.WATCHLIST.WATCH(slug));
}

export async function unwatchCompany(slug: string): Promise<void> {
  await client.delete(ENDPOINTS.WATCHLIST.UNWATCH(slug));
}
