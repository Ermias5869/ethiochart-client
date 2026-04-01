'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, getRolePath } from '@/lib/auth';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import FlagStripe from '@/components/layout/FlagStripe';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, loadFromCookies } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    loadFromCookies();
  }, [loadFromCookies]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-container border-t-gold rounded-full animate-spin" />
          <p className="font-mono text-xs text-on-surface-variant uppercase tracking-widest">
            Loading EthioChart...
          </p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-surface-container-low">
      <FlagStripe />
      <Sidebar />
      <Header />
      <main className="ml-[240px] pt-[calc(3px+4rem)] min-h-screen p-8">
        {children}
      </main>
    </div>
  );
}
