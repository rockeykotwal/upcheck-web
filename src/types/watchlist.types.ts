import type { Company, StatusSnapshot } from './status.types';

export interface WatchlistItem {
  company: Company;
  current: StatusSnapshot | null;
  watching: true;
}
