import { describe, it, expect } from 'vitest';
import { loginSchema, registerSchema } from '../auth.schemas';

describe('loginSchema', () => {
  it('passes with a valid email and password', () => {
    const result = loginSchema.safeParse({
      email: 'user@example.com',
      password: 'secret123',
    });
    expect(result.success).toBe(true);
  });

  it('fails with an invalid email format', () => {
    const result = loginSchema.safeParse({
      email: 'not-an-email',
      password: 'secret123',
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toContain('valid email');
  });

  it('fails when password is under 6 characters', () => {
    const result = loginSchema.safeParse({
      email: 'user@example.com',
      password: '123',
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toContain('6 characters');
  });

  it('fails with an empty email', () => {
    const result = loginSchema.safeParse({ email: '', password: 'secret123' });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toContain('email');
  });

  it('fails with an empty password', () => {
    const result = loginSchema.safeParse({
      email: 'user@example.com',
      password: '',
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toContain('password');
  });
});

describe('registerSchema', () => {
  const valid = {
    name: 'Jane Doe',
    email: 'jane@example.com',
    password: 'secret123',
    confirmPassword: 'secret123',
  };

  it('passes with valid data', () => {
    const result = registerSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it('fails when name is under 2 characters', () => {
    const result = registerSchema.safeParse({ ...valid, name: 'J' });
    expect(result.success).toBe(false);
    const issue = result.error?.issues.find((i) => i.path.includes('name'));
    expect(issue).toBeDefined();
    expect(issue?.message).toContain('2 characters');
  });

  it('fails when passwords do not match', () => {
    const result = registerSchema.safeParse({
      ...valid,
      confirmPassword: 'different',
    });
    expect(result.success).toBe(false);
    const issue = result.error?.issues.find((i) =>
      i.path.includes('confirmPassword')
    );
    expect(issue).toBeDefined();
    expect(issue?.message).toBe('Passwords do not match');
  });

  it('fails with an invalid email', () => {
    const result = registerSchema.safeParse({ ...valid, email: 'bad-email' });
    expect(result.success).toBe(false);
    const issue = result.error?.issues.find((i) => i.path.includes('email'));
    expect(issue).toBeDefined();
    expect(issue?.message).toContain('valid email');
  });
});
