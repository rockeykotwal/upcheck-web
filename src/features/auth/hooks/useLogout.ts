import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../../api/auth.api';
import { useAuthStore } from '../../../store/auth.store';

export function useLogout() {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutUser,
    onSettled: () => {
      logout();
      queryClient.clear();
      navigate('/login');
    },
  });
}
