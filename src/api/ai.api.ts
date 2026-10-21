import client from './client';
import { ENDPOINTS } from './endpoints';

export async function fetchAiSummary(slug: string): Promise<string> {
  const res = await client.get<{ slug: string; summary: string }>(
    ENDPOINTS.AI.SUMMARY(slug)
  );
  return res.data.summary;
}
