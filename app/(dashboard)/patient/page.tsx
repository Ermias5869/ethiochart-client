'use client';

import { useAuthStore } from '@/lib/auth';
import Link from 'next/link';

export default function PatientDashboard() {
  const { user } = useAuthStore();
  const prescriptions = [
    { name: 'Amoxicillin', dosage: '500mg • 3 times daily', badge: '7 DAYS LEFT', color: 'bg-primary-container/10 text-primary-container', icon: '💊' },
    { name: 'Metformin', dosage: '850mg • Once daily', badge: 'CHRONIC', color: 'bg-gold/10 text-on-tertiary-container', icon: '💊' },
    { name: 'Lisinopril', dosage: '10mg • Every morning', badge: 'ACTIVE', color: 'bg-primary-container/10 text-primary-container', icon: '💊' },
  ];

  return (
    <>
      {/* EthioChart Card */}
      <div className="bg-primary-container p-8 mb-8 relative overflow-hidden text-white">
        <div className="absolute inset-0 ethiopian-pattern opacity-10" />
        <div className="relative z-10 flex justify-between items-start">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold mb-2">My EthioChart Card</p>
            <h2 className="text-3xl font-headline font-bold mb-3">{user?.name || 'Abebe Tadesse'}</h2>
            <p className="text-sm text-on-primary-container mb-1">Hospital: <span className="text-white font-medium">{user?.hospitalName || 'Addis Ababa General'}</span></p>
            <p className="text-sm text-on-primary-container mb-4">Registered: <span className="text-white font-medium">12 Oct 2023</span></p>
            <p className="font-mono text-2xl font-bold text-gold tracking-wider">EC-M5K2XRPA-A1B2C3</p>
            <button className="mt-4 flex items-center gap-2 px-5 py-2 bg-white/10 border border-white/20 text-white text-sm font-medium hover:bg-white/20 transition-colors">
              <span className="material-symbols-outlined text-sm">download</span>Download Card
            </button>
          </div>
          <div className="w-28 h-28 bg-white/10 rounded-lg flex items-center justify-center border-2 border-white/20">
            <span className="material-symbols-outlined text-5xl text-white/50">qr_code_2</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Upcoming Appointments', value: '2', icon: 'event' },
          { label: 'Active Prescriptions', value: '3', icon: 'medication' },
          { label: 'Pending Bills', value: '1,500', suffix: 'ETB', icon: 'payments', bar: true },
          { label: 'Unread Messages', value: '2', icon: 'mail', dot: true },
        ].map((s) => (
          <div key={s.label} className="bg-surface-container-lowest p-6 shadow-sm relative">
            {s.dot && <span className="absolute top-4 right-4 w-2.5 h-2.5 bg-error rounded-full" />}
            <p className="text-xs font-mono text-on-surface-variant uppercase tracking-widest mb-3">{s.label}</p>
            <div className="flex items-baseline gap-1">
              <h3 className="text-3xl font-headline font-bold text-primary">{s.value}</h3>
              {s.suffix && <span className="text-xs font-mono text-primary/60">{s.suffix}</span>}
            </div>
            {s.bar && <div className="w-full h-1.5 bg-gold/30 rounded-full mt-3"><div className="h-full bg-gold rounded-full" style={{width:'60%'}} /></div>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Next Appointment */}
        <div className="bg-surface-container-lowest p-8 shadow-sm">
          <h3 className="text-lg font-headline font-semibold text-primary mb-6">Next Appointment</h3>
          <div className="flex items-center gap-6 mb-6">
            <div className="w-20 h-20 rounded-full bg-surface-container-low flex items-center justify-center overflow-hidden flex-shrink-0">
              <span className="material-symbols-outlined text-4xl text-primary/30">person</span>
            </div>
            <div>
              <h4 className="font-headline font-bold text-primary text-lg">Dr. Abebe Kebede</h4>
              <p className="text-sm text-on-surface-variant">Senior Cardiologist</p>
              <div className="flex gap-4 mt-3 text-xs text-on-surface-variant">
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">calendar_today</span>Oct 24, 2023</span>
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">schedule</span>10:30 AM</span>
              </div>
              <p className="flex items-center gap-1 mt-1 text-xs text-on-surface-variant"><span className="material-symbols-outlined text-sm">location_on</span>Main Building, Block C-4</p>
            </div>
          </div>
          <Link href="/patient/video-sessions" className="w-full py-3 bg-primary-container text-white font-headline font-semibold flex items-center justify-center gap-2 hover:bg-primary transition-colors">
            <span className="material-symbols-outlined text-lg">videocam</span>Join Video Session
          </Link>
        </div>

        {/* Recent Prescriptions */}
        <div className="bg-surface-container-lowest p-8 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-headline font-semibold text-primary">Recent Prescriptions</h3>
            <Link href="/patient/prescriptions" className="text-sm text-primary font-semibold underline underline-offset-4">View All</Link>
          </div>
          <div className="space-y-4">
            {prescriptions.map((p) => (
              <div key={p.name} className="flex items-center gap-4 p-3 border border-outline-variant/20 hover:border-primary/20 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-primary-container/10 flex items-center justify-center"><span className="material-symbols-outlined text-primary-container">medication</span></div>
                <div className="flex-1"><p className="font-semibold text-sm">{p.name}</p><p className="text-xs text-on-surface-variant">{p.dosage}</p></div>
                <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest ${p.color}`}>{p.badge}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 p-3 border-l-4 border-gold bg-gold/5">
            <p className="text-xs text-on-surface-variant">
              <strong>Note:</strong> Your prescription for Amoxicillin will expire in 7 days. Please contact Dr. Kebede if you require a refill.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-outline-variant/20 flex justify-between items-center">
        <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">
          Secure Institutional Portal • EthioChart v4.2.0
        </p>
        <div className="flex gap-6 text-xs text-on-surface-variant">
          <a href="#" className="hover:text-primary">Privacy Policy</a>
          <a href="#" className="hover:text-primary">Support Center</a>
        </div>
      </div>
    </>
  );
}
