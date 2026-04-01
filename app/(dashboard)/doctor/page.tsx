'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/auth';
import { api } from '@/lib/api';
import Link from 'next/link';

export default function DoctorDashboard() {
  const { user } = useAuthStore();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [stats, setStats] = useState({ todayAppts: 0, myPatients: 0, pendingLabs: 0, unreadMsgs: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [apptsRes, patientsRes, msgsRes] = await Promise.allSettled([
          api.getAppointments(),
          api.getPatients(),
          api.getMessages(user?.id || 0),
        ]);

        if (apptsRes.status === 'fulfilled') {
          const appts = apptsRes.value.data;
          const today = new Date().toDateString();
          const todayAppts = appts.filter((a: any) => new Date(a.scheduledAt).toDateString() === today);
          setStats((s) => ({ ...s, todayAppts: todayAppts.length }));

          // Sort by date, show upcoming + today first
          const sorted = appts
            .sort((a: any, b: any) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
            .filter((a: any) => a.status === 'scheduled' || new Date(a.scheduledAt).toDateString() === today)
            .slice(0, 6);
          setAppointments(sorted);
        }

        if (patientsRes.status === 'fulfilled') {
          const pts = patientsRes.value.data;
          setStats((s) => ({ ...s, myPatients: pts.length }));
          setPatients(pts.slice(0, 5));
        }

        if (msgsRes.status === 'fulfilled') {
          setStats((s) => ({ ...s, unreadMsgs: msgsRes.value.data?.length || 0 }));
        }
      } catch {}
      setLoading(false);
    };
    load();
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-primary-container';
      case 'scheduled': return 'bg-outline';
      case 'cancelled': return 'bg-error';
      default: return 'bg-gold';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-primary-container/10 text-primary-container';
      case 'scheduled': return 'bg-surface-container text-on-surface-variant';
      case 'cancelled': return 'bg-error-container text-error';
      default: return 'bg-gold/10 text-on-tertiary-container';
    }
  };

  return (
    <>
      {/* Welcome */}
      <div className="bg-primary-container p-8 mb-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 ethiopian-pattern opacity-10" />
        <div className="relative z-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold mb-2">Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}, {user?.name || 'Doctor'}</p>
          <h2 className="text-2xl font-headline font-bold mb-2">{user?.hospitalName || 'EthioChart Hospital'}</h2>
          <p className="flex items-center gap-4 text-sm text-on-primary-container">
            <span className="flex items-center gap-1"><span className="material-symbols-outlined" style={{ fontSize: 16 }}>calendar_today</span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {[
          { label: "Today's Appointments", value: loading ? '...' : String(stats.todayAppts), icon: 'event', badge: 'TODAY' },
          { label: 'My Patients', value: loading ? '...' : String(stats.myPatients), icon: 'groups', badge: 'TOTAL' },
          { label: 'Pending Lab Results', value: '3', icon: 'biotech', badge: 'URGENT', badgeColor: 'bg-error text-white' },
          { label: 'Messages', value: loading ? '...' : String(stats.unreadMsgs), icon: 'mail', badge: 'NEW', badgeColor: stats.unreadMsgs > 0 ? 'bg-error text-white' : undefined },
        ].map((s) => (
          <div key={s.label} className="bg-surface-container-lowest p-6 shadow-sm relative">
            {s.badgeColor && <span className={`absolute top-4 right-4 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full ${s.badgeColor}`}>{s.badge}</span>}
            {!s.badgeColor && <span className="absolute top-4 right-4 font-mono text-[9px] text-on-surface-variant uppercase">{s.badge}</span>}
            <span className="material-symbols-outlined text-primary/30 mb-3" style={{ fontSize: 30 }}>{s.icon}</span>
            <p className="text-xs text-on-surface-variant mb-1">{s.label}</p>
            <h3 className="text-3xl font-headline font-bold text-primary">{s.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Schedule */}
        <div className="lg:col-span-3 bg-surface-container-lowest p-8 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-headline font-semibold text-primary">Upcoming Schedule</h3>
            <Link href="/doctor/appointments" className="text-sm text-primary font-semibold flex items-center gap-1">Full Calendar <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span></Link>
          </div>
          <div className="space-y-4">
            {loading ? <div className="flex justify-center py-8"><div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div> :
            appointments.length === 0 ? <p className="text-center text-on-surface-variant py-8 text-sm">No upcoming appointments</p> :
            appointments.map((a) => (
              <div key={a.id} className="flex items-center gap-4 group">
                <span className="font-mono text-xs text-on-surface-variant w-12">{new Date(a.scheduledAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
                <div className={`w-2.5 h-2.5 rounded-full ${getStatusColor(a.status)}`} />
                <div className="flex-1 border border-outline-variant/20 p-3 hover:border-primary/30 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-sm text-on-surface">{a.patient?.email?.split('@')[0]?.replace('.', ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()) || 'Patient'}</p>
                      <p className="text-xs text-on-surface-variant">{a.notes || 'General Consultation'} • <span className="font-mono">{a.patient?.ethioChartId}</span></p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${getStatusBadge(a.status)}`}>{a.status}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Patients + AI */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface-container-lowest p-6 shadow-sm">
            <h3 className="text-lg font-headline font-semibold text-primary mb-4">Recent Patients</h3>
            <div className="space-y-3">
              {loading ? <div className="flex justify-center py-4"><div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div> :
              patients.map((p) => (
                <div key={p.id} className="flex items-center gap-3 py-2 hover:bg-surface-container-low/50 -mx-2 px-2 rounded transition-colors">
                  <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-white text-xs font-bold">
                    {(p.email?.charAt(0) || 'P').toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{p.email?.split('@')[0]?.replace('.', ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}</p>
                    <p className="font-mono text-[10px] text-primary">{p.ethioChartId}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] font-bold uppercase ${p.isVerified ? 'text-primary-container' : 'text-on-tertiary-container'}`}>{p.isVerified ? 'Verified' : 'Pending'}</span>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/doctor/patients" className="block mt-4 py-2 text-center text-xs font-mono uppercase tracking-widest text-primary hover:bg-primary/5 border border-outline-variant/20 transition-colors">View All Patients</Link>
          </div>

          <div className="bg-tertiary-fixed/10 border border-gold/20 p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-gold" style={{ fontSize: 20 }}>lightbulb</span>
              <h4 className="font-headline font-semibold text-primary text-sm">AI Clinical Insight</h4>
            </div>
            <p className="text-xs text-on-surface-variant mb-3">Use the AI Clinical Assistant to analyze patient data, check drug interactions, and generate treatment recommendations.</p>
            <Link href="/doctor/ai-assistant" className="px-3 py-1 border border-gold text-gold text-[10px] font-bold uppercase tracking-wider hover:bg-gold/10 transition-colors">Open AI Assistant</Link>
          </div>
        </div>
      </div>
    </>
  );
}
