export type StatusIndicator =
  | 'none'
  | 'minor'
  | 'major'
  | 'critical'
  | 'maintenance';

export type ComponentStatus =
  | 'operational'
  | 'degraded_performance'
  | 'partial_outage'
  | 'major_outage'
  | 'under_maintenance';

export interface StatusComponent {
  id: string;
  name: string;
  status: ComponentStatus;
}

export interface UptimeStats {
  h1: number;
  h12: number;
  h24: number;
}

export interface Company {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  statusPageUrl: string;
  provider: string;
  category: string | null;
  userId: string | null;
  createdAt: string | null;
}

export interface MonitorWithStatus {
  company: Company;
  current: StatusSnapshot | null;
}

export interface StatusSnapshot {
  companyId: string;
  slug: string;
  indicator: StatusIndicator;
  description: string;
  components: StatusComponent[];
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
  uptime: UptimeStats;
}

export interface Postmortem {
  _id: string;
  slug: string;
  companyId: string;
  startedAt: string;
  resolvedAt: string;
  durationMinutes: number;
  peakIndicator: StatusIndicator;
  snapshotCount: number;
  summary: string;
  createdAt: string;
}
