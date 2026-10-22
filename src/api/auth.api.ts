import client from './client';
import { ENDPOINTS } from './endpoints';
import type { SafeUser } from '../types/auth.types';

interface AuthData {
  accessToken: string;
  user: SafeUser;
}

export async function loginUser(
  email: string,
  password: string
): Promise<AuthData> {
  const res = await client.post<{ success: boolean; data: AuthData }>(
    ENDPOINTS.AUTH.LOGIN,
    {
      email,
      password,
    }
  );
  return res.data.data;
}

export async function registerUser(
  firstName: string,
  lastName: string,
  email: string,
  password: string
): Promise<AuthData> {
  const res = await client.post<{ success: boolean; data: AuthData }>(
    ENDPOINTS.AUTH.SIGNUP,
    {
      firstName,
      lastName,
      email,
      password,
    }
  );
  return res.data.data;
}

export async function silentRefresh(): Promise<{ accessToken: string }> {
  const res = await client.get<{
    success: boolean;
    data: { accessToken: string };
  }>(ENDPOINTS.AUTH.REFRESH);
  return res.data.data;
}

export async function logoutUser(): Promise<void> {
  await client.post(ENDPOINTS.AUTH.LOGOUT);
}
