import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import type { AxiosError } from 'axios';
import { resetPassword } from '../../../api/auth.api';

export function useResetPassword() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({
      token,
      newPassword,
    }: {
      token: string;
      newPassword: string;
    }) => resetPassword(token, newPassword),
    onSuccess: () => {
      toast.success('Password updated. You can now sign in.');
      navigate('/login');
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const message =
        error.response?.data?.message ??
        'Reset link is invalid or has expired.';
      toast.error(message);
    },
  });
}
