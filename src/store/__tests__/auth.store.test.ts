import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuthStore } from '@/store/auth.store';
import type { User } from '@/types/auth.types';

const mockUser: User = {
  id: 'user-1',
  name: 'Test User',
  email: 'test@example.com',
  role: 'user',
  createdAt: '2024-01-01T00:00:00.000Z',
};

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
    });
    vi.clearAllMocks();
  });

  // ─── Initial hydration ──────────────────────────────────────────────────────
  // The store reads localStorage at module-evaluation time (inside `create`),
  // so each hydration test must reset the module registry and re-import to get
  // a fresh store instance that re-reads from localStorage.

  describe('initial state hydration', () => {
    it('sets isAuthenticated to false when localStorage is empty', async () => {
      vi.resetModules();
      const { useAuthStore: fresh } = await import('@/store/auth.store');

      expect(fresh.getState().isAuthenticated).toBe(false);
      expect(fresh.getState().accessToken).toBeNull();
    });

    it('sets isAuthenticated to true when localStorage has a token', async () => {
      localStorage.setItem('accessToken', 'stored-token');

      vi.resetModules();
      const { useAuthStore: fresh } = await import('@/store/auth.store');

      expect(fresh.getState().isAuthenticated).toBe(true);
      expect(fresh.getState().accessToken).toBe('stored-token');
    });
  });

  // ─── setToken ───────────────────────────────────────────────────────────────

  describe('setToken', () => {
    it('updates accessToken in the store', () => {
      useAuthStore.getState().setToken('new-token');

      expect(useAuthStore.getState().accessToken).toBe('new-token');
    });

    it('sets isAuthenticated to true', () => {
      useAuthStore.getState().setToken('new-token');

      expect(useAuthStore.getState().isAuthenticated).toBe(true);
    });

    it('calls localStorage.setItem with the accessToken key', () => {
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');

      useAuthStore.getState().setToken('new-token');

      expect(setItemSpy).toHaveBeenCalledWith('accessToken', 'new-token');
    });
  });

  // ─── setUser ────────────────────────────────────────────────────────────────

  describe('setUser', () => {
    it('updates the user object in the store', () => {
      useAuthStore.getState().setUser(mockUser);

      expect(useAuthStore.getState().user).toEqual(mockUser);
    });

    it('sets isAuthenticated to true', () => {
      useAuthStore.getState().setUser(mockUser);

      expect(useAuthStore.getState().isAuthenticated).toBe(true);
    });
  });

  // ─── logout ─────────────────────────────────────────────────────────────────

  describe('logout', () => {
    beforeEach(() => {
      useAuthStore.setState({
        user: mockUser,
        accessToken: 'some-token',
        isAuthenticated: true,
        isLoading: false,
      });
    });

    it('sets user to null', () => {
      useAuthStore.getState().logout();

      expect(useAuthStore.getState().user).toBeNull();
    });

    it('sets accessToken to null', () => {
      useAuthStore.getState().logout();

      expect(useAuthStore.getState().accessToken).toBeNull();
    });

    it('sets isAuthenticated to false', () => {
      useAuthStore.getState().logout();

      expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });

    it('calls localStorage.removeItem with the accessToken key', () => {
      const removeItemSpy = vi.spyOn(Storage.prototype, 'removeItem');

      useAuthStore.getState().logout();

      expect(removeItemSpy).toHaveBeenCalledWith('accessToken');
    });

    it('getState() confirms fully clean state after logout', () => {
      useAuthStore.getState().logout();

      expect(useAuthStore.getState()).toMatchObject({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isLoading: false,
      });
    });
  });
});
