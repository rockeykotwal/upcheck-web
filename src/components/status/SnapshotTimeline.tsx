import type { StatusSnapshot } from '../../types/status.types';
import IndicatorBadge from './IndicatorBadge';

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
    <ol className="space-y-3">
      {history.map((snap, i) => (
        <li key={i} className="flex items-start gap-3">
          <div className="mt-0.5 shrink-0">
            <IndicatorBadge indicator={snap.indicator} />
          </div>
          <div className="min-w-0">
            <p className="text-sm text-foreground">{snap.description}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {formatDate(snap.fetchedAt)}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
