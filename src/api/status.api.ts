import client from './client';
import { ENDPOINTS } from './endpoints';
import type {
  CompanyStatus,
  CompanyDetail,
  Postmortem,
} from '../types/status.types';

export async function fetchStatusList(): Promise<CompanyStatus[]> {
  const res = await client.get<{ statuses: CompanyStatus[] }>(
    ENDPOINTS.STATUS.LIST
  );
  return res.data.statuses;
}

export async function fetchStatusSearch(
  query: string
): Promise<CompanyStatus[]> {
  const res = await client.get<{ statuses: CompanyStatus[] }>(
    ENDPOINTS.STATUS.SEARCH,
    {
      params: { q: query },
    }
  );
  return res.data.statuses;
}

export async function fetchStatusDetail(slug: string): Promise<CompanyDetail> {
  const res = await client.get<CompanyDetail>(ENDPOINTS.STATUS.DETAIL(slug));
  return res.data;
}

export async function fetchPostmortems(slug: string): Promise<Postmortem[]> {
  const res = await client.get<{ postmortems: Postmortem[] }>(
    ENDPOINTS.STATUS.POSTMORTEMS(slug)
  );
  return res.data.postmortems;
}
