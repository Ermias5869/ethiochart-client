'use client';

import { useAuthStore } from '@/lib/auth';
import Link from 'next/link';

const schedule = [
  { time: '09:00', name: 'Abebe Tadesse', type: 'Routine Checkup', id: 'ETH-4421-M', status: 'ARRIVED', color: 'bg-primary-container' },
  { time: '10:30', name: 'Mulugeta Seraw', type: 'Follow-up: Cardiology', id: 'ETH-9921-X', status: 'IN PROGRESS', color: 'bg-gold' },
  { time: '11:45', name: 'Tsedey Wolde', type: 'Lab Results Review', id: 'ETH-1029-F', status: 'SCHEDULED', color: 'bg-outline' },
  { time: '13:30', name: 'Binyam Haile', type: 'Post-Op Consultation', id: 'ETH-0032-M', status: 'SCHEDULED', color: 'bg-outline' },
  { time: '15:00', name: 'Samrawit Belay', type: 'Initial Consultation', id: 'ETH-8821-F', status: 'SCHEDULED', color: 'bg-outline' },
  { time: '16:30', name: 'Dawit Yohannes', type: 'Diabetes Management', id: 'ETH-5561-M', status: 'SCHEDULED', color: 'bg-outline' },
];

const recentPatients = [
  { initials: 'MK', name: 'Martha Kassaye', id: 'ETH-8827-F', date: 'Oct 22, 2023' },
  { initials: 'TA', name: 'Tamrat Ayele', id: 'ETH-1129-M', date: 'Oct 20, 2023' },
  { initials: 'ZA', name: 'Zenebech Alemu', id: 'ETH-3345-F', date: 'Oct 19, 2023' },
  { initials: 'HG', name: 'Hirut Gebre', id: 'ETH-7721-F', date: 'Oct 18, 2023' },
  { initials: 'SD', name: 'Solomon Desta', id: 'ETH-2211-M', date: 'Oct 15, 2023' },
];

export default function DoctorDashboard() {
  const { user } = useAuthStore();

  return (
    <>
      {/* Welcome */}
      <div className="bg-primary-container p-8 mb-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 ethiopian-pattern opacity-10" />
        <div className="relative z-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold mb-2">Good Morning, Dr. {user?.name?.split(' ').pop()}</p>
          <h2 className="text-2xl font-headline font-bold mb-2">{user?.hospitalName || 'Addis Ababa General Hospital'}</h2>
          <p className="flex items-center gap-4 text-sm text-on-primary-container">
            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">calendar_today</span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
            <span>● Main Campus • Wing B</span>
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {[
          { label: "Today's Appointments", value: '6', icon: 'event', badge: 'TOTAL' },
          { label: 'My Patients', value: '34', icon: 'groups', badge: 'ACTIVE' },
          { label: 'Pending Lab Results', value: '3', icon: 'biotech', badge: 'URGENT', badgeColor: 'bg-error text-white' },
          { label: 'Unread Messages', value: '5', icon: 'mail', badge: '5 NEW', badgeColor: 'bg-error text-white' },
        ].map((s) => (
          <div key={s.label} className="bg-surface-container-lowest p-6 shadow-sm relative">
            {s.badgeColor && <span className={`absolute top-4 right-4 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full ${s.badgeColor}`}>{s.badge}</span>}
            {!s.badgeColor && <span className="absolute top-4 right-4 font-mono text-[9px] text-on-surface-variant uppercase">{s.badge}</span>}
            <span className="material-symbols-outlined text-3xl text-primary/30 mb-3">{s.icon}</span>
            <p className="text-xs text-on-surface-variant mb-1">{s.label}</p>
            <h3 className="text-3xl font-headline font-bold text-primary">{s.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Schedule */}
        <div className="lg:col-span-3 bg-surface-container-lowest p-8 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-headline font-semibold text-primary">Today&apos;s Schedule</h3>
            <Link href="/doctor/appointments" className="text-sm text-primary font-semibold flex items-center gap-1">Full Calendar <span className="material-symbols-outlined text-sm">arrow_forward</span></Link>
          </div>
          <div className="space-y-4">
            {schedule.map((s) => (
              <div key={s.time} className="flex items-center gap-4 group">
                <span className="font-mono text-xs text-on-surface-variant w-12">{s.time}</span>
                <div className={`w-2.5 h-2.5 rounded-full ${s.color}`} />
                <div className="flex-1 border border-outline-variant/20 p-3 hover:border-primary/30 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-sm text-on-surface">{s.name}</p>
                      <p className="text-xs text-on-surface-variant">{s.type} • <span className="font-mono">{s.id}</span></p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                        s.status === 'ARRIVED' ? 'bg-primary-container/10 text-primary-container' :
                        s.status === 'IN PROGRESS' ? 'bg-gold/10 text-on-tertiary-container' :
                        'bg-surface-container text-on-surface-variant'
                      }`}>{s.status}</span>
                      <Link href="/doctor/appointments/1" className="text-xs text-primary font-semibold hover:underline">View</Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Patients + AI Insight */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface-container-lowest p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-headline font-semibold text-primary">Recent Patients</h3>
              <button className="text-outline"><span className="material-symbols-outlined text-sm">tune</span></button>
            </div>
            <div className="space-y-3">
              {recentPatients.map((p) => (
                <div key={p.id} className="flex items-center gap-3 py-2 hover:bg-surface-container-low/50 -mx-2 px-2 rounded transition-colors">
                  <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-white text-xs font-bold">{p.initials}</div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{p.name}</p>
                    <p className="font-mono text-[10px] text-primary">{p.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-mono text-on-surface-variant uppercase">Last Visit</p>
                    <p className="text-xs text-on-surface-variant">{p.date}</p>
                    <Link href="/doctor/patients/1" className="text-[10px] text-primary font-semibold">View File</Link>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/doctor/patients" className="block mt-4 py-2 text-center text-xs font-mono uppercase tracking-widest text-primary hover:bg-primary/5 border border-outline-variant/20 transition-colors">View All Patients</Link>
          </div>

          {/* AI Insight */}
          <div className="bg-tertiary-fixed/10 border border-gold/20 p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-gold">lightbulb</span>
              <h4 className="font-headline font-semibold text-primary text-sm">AI Clinical Insight</h4>
            </div>
            <p className="text-xs text-on-surface-variant mb-3">
              Patient <span className="font-mono font-bold">ETH-9921-X</span> showing elevated glucose trends over the last 3 visits. Recommend metabolic panel.
            </p>
            <Link href="/doctor/ai-assistant" className="px-3 py-1 border border-gold text-gold text-[10px] font-bold uppercase tracking-wider hover:bg-gold/10 transition-colors">
              Generate Referral
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
