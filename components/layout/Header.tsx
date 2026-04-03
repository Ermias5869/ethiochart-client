'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore, getRoleLabel } from '@/lib/auth';
import { useState } from 'react';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [showMenu, setShowMenu] = useState(false);

  if (!user) return null;

  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs = segments.map((seg, i) => ({
    label: seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, ' '),
    isLast: i === segments.length - 1,
  }));

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="fixed top-[3px] right-0 w-[calc(100%-240px)] h-16 bg-white flex justify-between items-center px-8 z-40 border-b border-outline-variant/20">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 font-mono text-[10px] uppercase tracking-tighter text-gray-400">
        {breadcrumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-2">
            {i > 0 && <span>/</span>}
            <span className={crumb.isLast ? 'text-primary font-bold' : ''}>
              {crumb.label}
            </span>
          </span>
        ))}
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-6">
        {/* Notifications */}
        <div className="relative cursor-pointer group">
          <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">
            notifications
          </span>
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-error rounded-full" />
        </div>

        {/* Settings */}
        <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors">
          settings
        </span>

        {/* User + Dropdown */}
        <div className="relative">
          <div
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center space-x-3 pl-4 border-l border-outline-variant/30 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <span className="px-2 py-0.5 bg-gold/10 text-gold text-[10px] font-bold uppercase tracking-widest rounded-sm">
              {getRoleLabel(user.role)}
            </span>
            <p className="font-headline text-xs font-semibold text-primary uppercase">
              {user.name}
            </p>
            <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-white text-xs font-bold">
              {user.name?.charAt(0) || 'U'}
            </div>
          </div>

          {/* Dropdown Menu */}
          {showMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-12 bg-white border border-outline-variant/20 shadow-lg z-50 w-56 py-2">
                <div className="px-4 py-3 border-b border-outline-variant/10">
                  <p className="text-sm font-semibold text-primary">{user.name}</p>
                  <p className="text-[10px] text-on-surface-variant">{user.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-primary-container/10 text-primary-container text-[9px] font-bold uppercase tracking-wider">
                    {getRoleLabel(user.role)}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-sm text-error hover:bg-error/5 flex items-center gap-3 transition-colors"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>logout</span>
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
