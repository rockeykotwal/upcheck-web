import client from './client';
import { ENDPOINTS } from './endpoints';

export async function fetchAiSummary(slug: string): Promise<string> {
  const res = await client.get<{ slug: string; summary: string }>(
    ENDPOINTS.AI.SUMMARY(slug)
  );
  return res.data.summary;
}

export async function sendAiSummary(slug: string): Promise<number> {
  const res = await client.post<{ sent: number }>(
    ENDPOINTS.AI.SUMMARY_SEND(slug)
  );
  return res.data.sent;
}
