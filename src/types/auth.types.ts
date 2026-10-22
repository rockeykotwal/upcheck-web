export interface SafeUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  emailVerifiedAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface AuthState {
  user: SafeUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setToken: (token: string) => void;
  setUser: (user: SafeUser) => void;
  logout: () => void;
}
