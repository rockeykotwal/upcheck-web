import client from './client';
import { ENDPOINTS } from './endpoints';
import type { MonitorWithStatus } from '../types/status.types';

export async function fetchMonitors(): Promise<MonitorWithStatus[]> {
  const res = await client.get<{ monitors: MonitorWithStatus[] }>(
    ENDPOINTS.MONITORS.LIST
  );
  return res.data.monitors;
}

export async function createMonitor(data: {
  name: string;
  url: string;
}): Promise<MonitorWithStatus['company']> {
  const res = await client.post<{ monitor: MonitorWithStatus['company'] }>(
    ENDPOINTS.MONITORS.CREATE,
    data
  );
  return res.data.monitor;
}

export async function deleteMonitor(slug: string): Promise<void> {
  await client.delete(ENDPOINTS.MONITORS.DELETE(slug));
}
