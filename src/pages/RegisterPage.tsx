import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/ui/password-input';
import { registerSchema } from '../features/auth/schemas/register.schema';
import { useRegister } from '../features/auth/hooks/useRegister';
import type { RegisterFormData } from '../features/auth/types';

export default function RegisterPage() {
  const { mutate, isPending } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  return (
    <>
      <h1 className="text-lg font-semibold mb-6">Create an account</h1>

      <form
        onSubmit={handleSubmit((data) => mutate(data))}
        className="space-y-4"
      >
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="firstName">First name</Label>
            <Input
              id="firstName"
              type="text"
              autoComplete="given-name"
              aria-invalid={!!errors.firstName}
              {...register('firstName')}
            />
            {errors.firstName && (
              <p className="text-xs text-destructive">
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="lastName">Last name</Label>
            <Input
              id="lastName"
              type="text"
              autoComplete="family-name"
              aria-invalid={!!errors.lastName}
              {...register('lastName')}
            />
            {errors.lastName && (
              <p className="text-xs text-destructive">
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            {...register('email')}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <PasswordInput
            id="password"
            autoComplete="new-password"
            aria-invalid={!!errors.password}
            {...register('password')}
          />
          {errors.password && (
            <p className="text-xs text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button type="submit" disabled={isPending} className="w-full mt-2">
          {isPending ? 'Creating account…' : 'Create account'}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link to="/login" className="text-primary underline underline-offset-2">
          Sign in
        </Link>
      </p>
    </>
  );
}
