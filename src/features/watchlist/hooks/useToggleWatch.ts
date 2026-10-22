import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { watchCompany, unwatchCompany } from '../../../api/watchlist.api';
import { WATCHLIST_QUERY_KEY } from './useWatchlist';

export function useToggleWatch(slug: string, isWatching: boolean) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => (isWatching ? unwatchCompany(slug) : watchCompany(slug)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WATCHLIST_QUERY_KEY });
      toast.success(
        isWatching ? 'Removed from watchlist' : 'Added to watchlist'
      );
    },
    onError: () => {
      toast.error('Something went wrong. Please try again.');
    },
  });
}
