import type { CompanyStatus, StatusIndicator } from '../../types/status.types';
import IndicatorBadge from './IndicatorBadge';

const leftBorder: Record<StatusIndicator, string> = {
  none: 'border-l-green-500',
  minor: 'border-l-yellow-500',
  major: 'border-l-red-500',
  critical: 'border-l-red-600',
  maintenance: 'border-l-blue-500',
};

function formatCategory(cat: string) {
  return cat.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

interface Props {
  status: CompanyStatus;
  onClick: (slug: string) => void;
}

export default function StatusCard({ status, onClick }: Props) {
  const { company, current } = status;
  const borderColor = current
    ? leftBorder[current.indicator]
    : 'border-l-border';

  return (
    <button
      onClick={() => onClick(company.slug)}
      className={`w-full text-left rounded-lg border border-border border-l-4 bg-card px-4 py-3.5 hover:bg-muted/50 transition-colors ${borderColor}`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-medium text-card-foreground">{company.name}</p>
            {company.category && (
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                {formatCategory(company.category)}
              </span>
            )}
          </div>
          {current && (
            <p className="mt-0.5 text-xs text-muted-foreground truncate">
              {current.description}
            </p>
          )}
        </div>
        <div className="shrink-0">
          {current ? (
            <IndicatorBadge indicator={current.indicator} />
          ) : (
            <span className="text-xs text-muted-foreground">No data</span>
          )}
        </div>
      </div>
    </button>
  );
}
