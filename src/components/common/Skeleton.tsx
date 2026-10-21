import { cn } from '../../lib/utils';

interface Props {
  className?: string;
}

export default function Skeleton({ className }: Props) {
  return <div className={cn('rounded bg-muted animate-pulse', className)} />;
}
