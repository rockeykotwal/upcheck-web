import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import type { AxiosError } from 'axios';
import { registerUser } from '../../../api/auth.api';
import { useAuthStore } from '../../../store/auth.store';

export function useRegister() {
  const { setToken, setUser } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
    }) =>
      registerUser(data.firstName, data.lastName, data.email, data.password),
    onSuccess: ({ accessToken, user }) => {
      setToken(accessToken);
      setUser(user);
      navigate('/');
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const message =
        error.response?.data?.message ??
        'Registration failed. Please try again.';
      toast.error(message);
    },
  });
}
