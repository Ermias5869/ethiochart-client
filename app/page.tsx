'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, getRolePath } from '@/lib/auth';

export default function HomePage() {
  const { user, isLoading, loadFromCookies } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    loadFromCookies();
  }, [loadFromCookies]);

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.push(getRolePath(user.role));
      } else {
        router.push('/login');
      }
    }
  }, [user, isLoading, router]);

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary-container border-t-gold rounded-full animate-spin" />
        <p className="font-mono text-xs text-on-surface-variant uppercase tracking-widest">
          Initializing EthioChart...
        </p>
      </div>
    </div>
  );
}
