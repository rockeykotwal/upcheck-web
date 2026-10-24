import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchMonitors,
  createMonitor,
  deleteMonitor,
} from '@/api/monitors.api';

export function useMonitors() {
  return useQuery({
    queryKey: ['monitors'],
    queryFn: fetchMonitors,
  });
}

export function useCreateMonitor(onSuccess?: () => void) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createMonitor,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['monitors'] });
      onSuccess?.();
    },
  });
}

export function useDeleteMonitor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteMonitor,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['monitors'] });
    },
  });
}
