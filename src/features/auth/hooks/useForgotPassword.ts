import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { forgotPassword } from '../../../api/auth.api';

export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => forgotPassword(email),
    onSuccess: () => {
      toast.success('If that email is registered, a reset link has been sent.');
    },
    onError: () => {
      toast.error('Something went wrong. Please try again.');
    },
  });
}
