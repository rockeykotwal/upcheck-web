import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useForgotPassword } from '../features/auth/hooks/useForgotPassword';

const schema = z.object({ email: z.string().email('Enter a valid email') });
type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const { mutate, isPending, isSuccess } = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  if (isSuccess) {
    return (
      <div className="text-center space-y-3">
        <p className="text-2xl">📬</p>
        <p className="font-medium text-foreground">Check your inbox</p>
        <p className="text-sm text-muted-foreground">
          If that email is registered, we've sent a reset link. It expires in 15
          minutes.
        </p>
        <Link
          to="/login"
          className="block mt-4 text-sm text-primary underline underline-offset-2"
        >
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-lg font-semibold mb-1">Forgot password</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Enter your email and we'll send you a reset link.
      </p>

      <form
        onSubmit={handleSubmit((data) => mutate(data.email))}
        className="space-y-4"
      >
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email
          </Label>
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

        <Button type="submit" disabled={isPending} className="w-full mt-2">
          {isPending ? 'Sending…' : 'Send reset link'}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-muted-foreground">
        <Link to="/login" className="text-primary underline underline-offset-2">
          Back to sign in
        </Link>
      </p>
    </>
  );
}
