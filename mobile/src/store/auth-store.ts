import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { DEMO_USER } from '../data/catalog';
import type { User } from '../types';

type AuthUser = Pick<User, 'id' | 'name' | 'email' | 'phone' | 'role'>;

interface AuthState {
  user: AuthUser | null;
  hasOnboarded: boolean;
  isHydrated: boolean;
  login: (email: string, password: string) => boolean;
  signup: (
    name: string,
    email: string,
    password: string,
    phone: string
  ) => boolean;
  logout: () => void;
  completeOnboarding: () => void;
  setHydrated: () => void;
  updateProfile: (partial: Partial<AuthUser>) => void;
}

function isValidCredentials(email: string, password: string): boolean {
  return email.trim().length >= 4 && password.length >= 4;
}

function buildDemoUser(email: string, overrides?: Partial<AuthUser>): AuthUser {
  const isShopper = email.toLowerCase().includes('shopper');
  return {
    id: overrides?.id ?? `user_${Date.now().toString(36)}`,
    name:
      overrides?.name ??
      (isShopper ? 'Jordan Shopper' : DEMO_USER.name),
    email: email.trim().toLowerCase(),
    phone: overrides?.phone ?? DEMO_USER.phone ?? '',
    role: overrides?.role ?? (isShopper ? 'SHOPPER' : 'CUSTOMER'),
  };
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      hasOnboarded: false,
      isHydrated: false,

      login: (email, password) => {
        if (!isValidCredentials(email, password)) return false;
        set({ user: buildDemoUser(email) });
        return true;
      },

      signup: (name, email, password, phone) => {
        if (!name.trim() || !isValidCredentials(email, password)) return false;
        set({
          user: buildDemoUser(email, {
            name: name.trim(),
            phone: phone.trim(),
            role: email.toLowerCase().includes('shopper')
              ? 'SHOPPER'
              : 'CUSTOMER',
          }),
        });
        return true;
      },

      logout: () => set({ user: null }),

      completeOnboarding: () => set({ hasOnboarded: true }),

      setHydrated: () => set({ isHydrated: true }),

      updateProfile: (partial) => {
        const current = get().user;
        if (!current) return;
        set({ user: { ...current, ...partial } });
      },
    }),
    {
      name: 'teedeux-auth',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        hasOnboarded: state.hasOnboarded,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.warn('[auth-store] rehydration failed', error);
        }
        state?.setHydrated();
      },
    }
  )
);
