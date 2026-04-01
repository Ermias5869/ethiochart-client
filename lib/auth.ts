'use client';

import { create } from 'zustand';
import Cookies from 'js-cookie';
import type { AuthUser, UserRole } from './types';

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  setAuth: (user: AuthUser, token: string) => void;
  logout: () => void;
  loadFromCookies: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: true,

  setAuth: (user, token) => {
    Cookies.set('ethiochart_token', token, { expires: 1 });
    Cookies.set('ethiochart_user', JSON.stringify(user), { expires: 1 });
    set({ user, token, isLoading: false });
  },

  logout: () => {
    Cookies.remove('ethiochart_token');
    Cookies.remove('ethiochart_user');
    set({ user: null, token: null, isLoading: false });
  },

  loadFromCookies: () => {
    const token = Cookies.get('ethiochart_token');
    const userStr = Cookies.get('ethiochart_user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as AuthUser;
        set({ user, token, isLoading: false });
      } catch {
        set({ user: null, token: null, isLoading: false });
      }
    } else {
      set({ isLoading: false });
    }
  },
}));

export function getRolePath(role: UserRole): string {
  switch (role) {
    case 'hospital_admin': return '/admin';
    case 'doctor': return '/doctor';
    case 'patient': return '/patient';
  }
}

export function getRoleLabel(role: UserRole): string {
  switch (role) {
    case 'hospital_admin': return 'Admin';
    case 'doctor': return 'Doctor';
    case 'patient': return 'Patient';
  }
}
