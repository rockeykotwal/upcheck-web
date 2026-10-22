import { create } from 'zustand';
import type { AuthState, SafeUser } from '../types/auth.types';

const TOKEN_KEY = 'accessToken';
const USER_KEY = 'authUser';

export const useAuthStore = create<AuthState>((set) => ({
  user: JSON.parse(localStorage.getItem(USER_KEY) ?? 'null') as SafeUser | null,
  accessToken: localStorage.getItem(TOKEN_KEY),
  isAuthenticated: !!localStorage.getItem(TOKEN_KEY),

  setToken: (token) => {
    localStorage.setItem(TOKEN_KEY, token);
    set({ accessToken: token, isAuthenticated: true });
  },

  setUser: (user) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    set({ user });
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    set({ user: null, accessToken: null, isAuthenticated: false });
  },
}));
