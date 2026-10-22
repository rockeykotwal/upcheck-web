import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/ui/password-input';
import { useResetPassword } from '../features/auth/hooks/useResetPassword';

const schema = z
  .object({
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const token = params.get('token');
  const { mutate, isPending } = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  if (!token) {
    return (
      <div className="text-center space-y-3">
        <p className="text-2xl">⚠️</p>
        <p className="font-medium text-foreground">Invalid reset link</p>
        <p className="text-sm text-muted-foreground">
          This link is missing a token. Request a new one below.
        </p>
        <Link
          to="/forgot-password"
          className="block mt-4 text-sm text-primary underline underline-offset-2"
        >
          Request a new link
        </Link>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-lg font-semibold mb-1">Set new password</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Choose a strong password — at least 8 characters.
      </p>

      <form
        onSubmit={handleSubmit((data) =>
          mutate({ token, newPassword: data.newPassword })
        )}
        className="space-y-4"
      >
        <div className="space-y-1.5">
          <Label htmlFor="newPassword">New password</Label>
          <PasswordInput
            id="newPassword"
            autoComplete="new-password"
            aria-invalid={!!errors.newPassword}
            {...register('newPassword')}
          />
          {errors.newPassword && (
            <p className="text-xs text-destructive">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <PasswordInput
            id="confirmPassword"
            autoComplete="new-password"
            aria-invalid={!!errors.confirmPassword}
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && (
            <p className="text-xs text-destructive">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button type="submit" disabled={isPending} className="w-full mt-2">
          {isPending ? 'Updating…' : 'Update password'}
        </Button>
      </form>
    </>
  );
}
