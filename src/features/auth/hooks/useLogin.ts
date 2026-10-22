import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import type { AxiosError } from 'axios';
import { loginUser } from '../../../api/auth.api';
import { useAuthStore } from '../../../store/auth.store';

export function useLogin() {
  const { setToken, setUser } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      loginUser(email, password),
    onSuccess: ({ accessToken, user }) => {
      setToken(accessToken);
      setUser(user);
      navigate('/');
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const message =
        error.response?.data?.message ?? 'Invalid email or password';
      toast.error(message);
    },
  });
}
