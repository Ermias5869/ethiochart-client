'use client';

import { useAuthStore } from '@/lib/auth';

export default function AdminSettingsPage() {
  const { user } = useAuthStore();
  return (
    <>
      <h2 className="text-2xl font-headline font-bold text-primary mb-8">Settings</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-surface-container-lowest p-8 shadow-sm">
          <h3 className="font-headline font-semibold text-primary mb-6">Profile Settings</h3>
          <div className="flex items-center gap-4 mb-6"><div className="w-16 h-16 rounded-full bg-primary-container flex items-center justify-center text-white text-xl font-bold">{user?.name?.charAt(0)}</div><button className="text-xs text-primary underline">Change photo</button></div>
          <div className="space-y-4">
            <div><label className="block font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Name</label><input type="text" className="w-full px-4 py-3 border border-outline-variant/30 focus:border-primary focus:ring-0" defaultValue={user?.name} /></div>
            <div><label className="block font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Email</label><input type="email" className="w-full px-4 py-3 border border-outline-variant/30 bg-surface-container-low text-on-surface-variant" defaultValue={user?.email} readOnly /><span className="material-symbols-outlined text-sm text-outline absolute right-3 top-1/2">lock</span></div>
            <button className="px-6 py-2 bg-primary-container text-white font-semibold text-sm hover:bg-primary transition-colors">Update Profile</button>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-8 shadow-sm">
          <h3 className="font-headline font-semibold text-primary mb-6">Security</h3>
          <div className="space-y-4">
            <div><label className="block font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Current Password</label><input type="password" className="w-full px-4 py-3 border border-outline-variant/30 focus:border-primary focus:ring-0" /></div>
            <div><label className="block font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">New Password</label><input type="password" className="w-full px-4 py-3 border border-outline-variant/30 focus:border-primary focus:ring-0" /></div>
            <div><label className="block font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Confirm New Password</label><input type="password" className="w-full px-4 py-3 border border-outline-variant/30 focus:border-primary focus:ring-0" /></div>
            <button className="px-6 py-2 bg-primary-container text-white font-semibold text-sm hover:bg-primary transition-colors">Change Password</button>
          </div>
        </div>
      </div>
      <div className="bg-surface-container-lowest p-8 shadow-sm">
        <h3 className="font-headline font-semibold text-primary mb-6">Notification Preferences</h3>
        <div className="space-y-4">
          {['Email notifications', 'SMS notifications', 'Appointment reminders', 'Billing alerts'].map(label => (
            <div key={label} className="flex items-center justify-between py-2 border-b border-outline-variant/10">
              <span className="text-sm font-medium">{label}</span>
              <button className="w-10 h-5 bg-primary-container rounded-full relative"><div className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-white shadow" /></button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
