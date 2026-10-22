import type { StatusSnapshot, StatusIndicator } from '../../types/status.types';
import IndicatorBadge from './IndicatorBadge';

const trackDot: Record<StatusIndicator, string> = {
  none: 'bg-green-500',
  minor: 'bg-yellow-500',
  major: 'bg-red-500',
  critical: 'bg-red-600',
  maintenance: 'bg-blue-500',
};

interface Props {
  history: StatusSnapshot[];
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function SnapshotTimeline({ history }: Props) {
  if (history.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No history available yet.</p>
    );
  }

  return (
    <ol className="relative border-l border-border ml-2 space-y-0">
      {history.map((snap, i) => (
        <li key={i} className="relative pl-6 pb-5 last:pb-0">
          {/* Track dot */}
          <span
            className={`absolute -left-[5px] top-1 size-2.5 rounded-full border-2 border-background ${trackDot[snap.indicator]}`}
          />
          <div className="flex items-center gap-2 flex-wrap">
            <IndicatorBadge indicator={snap.indicator} />
            <span className="text-xs text-muted-foreground">
              {formatDate(snap.fetchedAt)}
            </span>
          </div>
          <p className="mt-1 text-sm text-foreground">{snap.description}</p>
        </li>
      ))}
    </ol>
  );
}
