'use client';
import { useAuthStore } from '@/lib/auth';
export default function DoctorProfilePage() {
  const { user } = useAuthStore();
  return (
    <>
      <h2 className="text-2xl font-headline font-bold text-primary mb-8">Doctor Profile</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-surface-container-lowest p-8 shadow-sm text-center">
          <div className="w-24 h-24 rounded-full bg-primary-container flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">{user?.name?.charAt(0)}</div>
          <h3 className="font-headline font-bold text-primary text-lg">{user?.name}</h3>
          <p className="text-sm text-on-surface-variant">Senior Clinician</p>
          <p className="font-mono text-[10px] text-gold mt-1 uppercase tracking-wider">Doctor</p>
          <div className="mt-6 space-y-2 text-left">
            <p className="flex items-center gap-2 text-sm text-on-surface-variant"><span className="material-symbols-outlined text-sm">mail</span>{user?.email}</p>
            <p className="flex items-center gap-2 text-sm text-on-surface-variant"><span className="material-symbols-outlined text-sm">domain</span>Addis Ababa General</p>
          </div>
          <button className="mt-6 w-full py-2 border border-primary-container text-primary-container text-sm font-semibold hover:bg-primary-container/5 transition-colors">Edit Profile</button>
        </div>
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface-container-lowest p-6 shadow-sm">
            <h4 className="font-headline font-semibold text-primary mb-4">Statistics</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-surface-container-low text-center"><p className="text-2xl font-headline font-bold text-primary">247</p><p className="text-xs text-on-surface-variant">Total Patients</p></div>
              <div className="p-4 bg-surface-container-low text-center"><p className="text-2xl font-headline font-bold text-primary">1,024</p><p className="text-xs text-on-surface-variant">Appointments</p></div>
              <div className="p-4 bg-surface-container-low text-center"><p className="text-2xl font-headline font-bold text-primary">89%</p><p className="text-xs text-on-surface-variant">Satisfaction</p></div>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-6 shadow-sm">
            <h4 className="font-headline font-semibold text-primary mb-4">Change Password</h4>
            <div className="space-y-4 max-w-md"><input type="password" placeholder="Current Password" className="w-full px-4 py-3 border border-outline-variant/30 focus:border-primary focus:ring-0" /><input type="password" placeholder="New Password" className="w-full px-4 py-3 border border-outline-variant/30 focus:border-primary focus:ring-0" /><button className="px-6 py-2 bg-primary-container text-white font-semibold text-sm">Update</button></div>
          </div>
        </div>
      </div>
    </>
  );
}
