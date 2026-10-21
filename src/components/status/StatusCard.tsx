import type { CompanyStatus } from '../../types/status.types';
import IndicatorBadge from './IndicatorBadge';

interface Props {
  status: CompanyStatus;
  onClick: (slug: string) => void;
}

export default function StatusCard({ status, onClick }: Props) {
  const { company, current } = status;

  return (
    <button
      onClick={() => onClick(company.slug)}
      className="w-full text-left rounded-lg border border-border bg-card p-4 hover:bg-muted/50 transition-colors"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="font-medium text-card-foreground truncate">
            {company.name}
          </p>
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
