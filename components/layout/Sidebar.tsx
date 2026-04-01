'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore, getRoleLabel } from '@/lib/auth';
import type { UserRole } from '@/lib/types';

interface NavItem {
  label: string;
  icon: string;
  href: string;
}

const adminNav: NavItem[] = [
  { label: 'Dashboard', icon: 'dashboard', href: '/admin' },
  { label: 'Hospitals', icon: 'domain', href: '/admin/hospitals' },
  { label: 'Users', icon: 'group', href: '/admin/users' },
  { label: 'Doctors', icon: 'medical_services', href: '/admin/doctors' },
  { label: 'Patients', icon: 'person', href: '/admin/patients' },
  { label: 'Appointments', icon: 'event', href: '/admin/appointments' },
  { label: 'Billing', icon: 'payments', href: '/admin/billing' },
  { label: 'Messages', icon: 'chat', href: '/admin/messages' },
  { label: 'Video Sessions', icon: 'videocam', href: '/admin/video-sessions' },
  { label: 'Patient Access', icon: 'security', href: '/admin/patient-access' },
  { label: 'Settings', icon: 'settings', href: '/admin/settings' },
];

const doctorNav: NavItem[] = [
  { label: 'Dashboard', icon: 'dashboard', href: '/doctor' },
  { label: 'My Appointments', icon: 'event', href: '/doctor/appointments' },
  { label: 'My Patients', icon: 'groups', href: '/doctor/patients' },
  { label: 'Prescriptions', icon: 'medication', href: '/doctor/prescriptions' },
  { label: 'Lab Results', icon: 'biotech', href: '/doctor/lab-results' },
  { label: 'Messages', icon: 'chat', href: '/doctor/messages' },
  { label: 'Video Sessions', icon: 'videocam', href: '/doctor/video-sessions' },
  { label: 'AI Assistant', icon: 'smart_toy', href: '/doctor/ai-assistant' },
];

const patientNav: NavItem[] = [
  { label: 'Dashboard', icon: 'dashboard', href: '/patient' },
  { label: 'My Appointments', icon: 'event', href: '/patient/appointments' },
  { label: 'My Prescriptions', icon: 'medication', href: '/patient/prescriptions' },
  { label: 'My Lab Results', icon: 'biotech', href: '/patient/lab-results' },
  { label: 'My Bills', icon: 'payments', href: '/patient/bills' },
  { label: 'Messages', icon: 'chat', href: '/patient/messages' },
  { label: 'Video Sessions', icon: 'videocam', href: '/patient/video-sessions' },
  { label: 'Profile', icon: 'person', href: '/patient/profile' },
];

function getNavItems(role: UserRole): NavItem[] {
  switch (role) {
    case 'hospital_admin': return adminNav;
    case 'doctor': return doctorNav;
    case 'patient': return patientNav;
  }
}

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  if (!user) return null;

  const navItems = getNavItems(user.role);

  const isActive = (href: string) => {
    if (href === '/admin' || href === '/doctor' || href === '/patient') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-[240px] bg-sidebar flex flex-col z-50 border-r border-white/5">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-white/10">
        <h1 className="text-base font-bold text-white tracking-[0.15em] uppercase font-headline">
          ETHIOCHART
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 mx-2 px-3 py-2.5 rounded-md text-[13px] font-medium transition-all duration-200 ${
              isActive(item.href)
                ? 'bg-primary-container text-white'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: '20px', lineHeight: 1 }}
            >
              {item.icon}
            </span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* User Info */}
      <div className="px-4 py-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary-container flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            {user.name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user.name}</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">
              {getRoleLabel(user.role)}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
