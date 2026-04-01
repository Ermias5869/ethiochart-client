'use client';
import { useAuthStore } from '@/lib/auth';
export default function PatientProfilePage() {
  const { user } = useAuthStore();
  return (
    <>
      <h2 className="text-2xl font-headline font-bold text-primary mb-8">My Profile</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-surface-container-lowest p-8 shadow-sm text-center">
          <div className="w-24 h-24 rounded-full bg-primary-container flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">{user?.name?.charAt(0) || 'P'}</div>
          <h3 className="font-headline font-bold text-primary text-lg">{user?.name || 'Patient'}</h3>
          <p className="font-mono text-xs text-gold mt-1 uppercase tracking-wider">Patient</p>
          <div className="mt-6 p-4 bg-primary-container/5 border border-primary-container/20 text-left">
            <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider mb-1">EthioChart ID</p>
            <p className="font-mono text-lg font-bold text-primary-container">EC-M5K2XRPA</p>
          </div>
          <div className="mt-4 space-y-2 text-left">
            <p className="flex items-center gap-2 text-sm text-on-surface-variant"><span className="material-symbols-outlined text-sm">mail</span>{user?.email}</p>
            <p className="flex items-center gap-2 text-sm text-on-surface-variant"><span className="material-symbols-outlined text-sm">domain</span>Addis Ababa General</p>
            <p className="flex items-center gap-2 text-sm text-on-surface-variant"><span className="material-symbols-outlined text-sm">calendar_today</span>Registered: Oct 12, 2023</p>
          </div>
          <button className="mt-6 w-full py-2 border border-primary-container text-primary-container text-sm font-semibold hover:bg-primary-container/5 transition-colors">Edit Profile</button>
        </div>
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface-container-lowest p-6 shadow-sm">
            <h4 className="font-headline font-semibold text-primary mb-4">Personal Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Full Name</label><input className="w-full px-4 py-3 border border-outline-variant/30 bg-surface-container-low" defaultValue={user?.name || ''} readOnly /></div>
              <div><label className="block font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Email</label><input className="w-full px-4 py-3 border border-outline-variant/30 bg-surface-container-low" defaultValue={user?.email || ''} readOnly /></div>
              <div><label className="block font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Phone</label><input className="w-full px-4 py-3 border border-outline-variant/30 focus:border-primary focus:ring-0" defaultValue="+251 911 112 233" /></div>
              <div><label className="block font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Date of Birth</label><input className="w-full px-4 py-3 border border-outline-variant/30 bg-surface-container-low" defaultValue="January 15, 1990" readOnly /></div>
            </div>
            <button className="mt-4 px-6 py-2 bg-primary-container text-white font-semibold text-sm hover:bg-primary transition-colors">Save Changes</button>
          </div>
          <div className="bg-surface-container-lowest p-6 shadow-sm">
            <h4 className="font-headline font-semibold text-primary mb-4">Change Password</h4>
            <div className="space-y-4 max-w-md"><input type="password" placeholder="Current Password" className="w-full px-4 py-3 border border-outline-variant/30 focus:border-primary focus:ring-0" /><input type="password" placeholder="New Password" className="w-full px-4 py-3 border border-outline-variant/30 focus:border-primary focus:ring-0" /><input type="password" placeholder="Confirm New Password" className="w-full px-4 py-3 border border-outline-variant/30 focus:border-primary focus:ring-0" /><button className="px-6 py-2 bg-primary-container text-white font-semibold text-sm">Update Password</button></div>
          </div>
        </div>
      </div>
    </>
  );
}
