export type StatusIndicator =
  | 'none'
  | 'minor'
  | 'major'
  | 'critical'
  | 'maintenance';

export interface Company {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  statusPageUrl: string;
  provider: string;
  category: string | null;
  createdAt: string | null;
}

export interface StatusSnapshot {
  companyId: string;
  slug: string;
  indicator: StatusIndicator;
  description: string;
  fetchedAt: string;
}

export interface CompanyStatus {
  company: Company;
  current: StatusSnapshot | null;
}

export interface CompanyDetail {
  company: Company;
  current: StatusSnapshot | null;
  history: StatusSnapshot[];
}
