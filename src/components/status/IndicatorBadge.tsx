import type { StatusIndicator } from '../../types/status.types';

const styles: Record<StatusIndicator, string> = {
  none: 'bg-green-100  text-green-800  dark:bg-green-900/30  dark:text-green-400',
  minor:
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  major:
    'bg-red-100    text-red-800    dark:bg-red-900/30    dark:text-red-400',
  critical:
    'bg-red-100    text-red-800    dark:bg-red-900/30    dark:text-red-400',
  maintenance:
    'bg-blue-100   text-blue-800   dark:bg-blue-900/30   dark:text-blue-400',
};

const labels: Record<StatusIndicator, string> = {
  none: 'Operational',
  minor: 'Minor Issues',
  major: 'Major Outage',
  critical: 'Critical',
  maintenance: 'Maintenance',
};

interface Props {
  indicator: StatusIndicator;
}

export default function IndicatorBadge({ indicator }: Props) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[indicator]}`}
    >
      {labels[indicator]}
    </span>
  );
}
