'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/auth';
import { api } from '@/lib/api';
import Link from 'next/link';

export default function PatientDashboard() {
  const { user } = useAuthStore();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [bills, setBills] = useState<any[]>([]);
  const [stats, setStats] = useState({ upcomingAppts: 0, activeRx: 0, pendingBills: 0, unreadMsgs: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [apptsRes, billsRes] = await Promise.allSettled([
          api.getAppointments(),
          api.getBills(user?.id || 0),
        ]);

        if (apptsRes.status === 'fulfilled') {
          const appts = apptsRes.value.data;
          const upcoming = appts.filter((a: any) => a.status === 'scheduled' && new Date(a.scheduledAt) > new Date());
          setStats((s) => ({ ...s, upcomingAppts: upcoming.length }));
          setAppointments(upcoming.slice(0, 1)); // Next appointment

          // Extract prescriptions from completed appointments
          const allRx: any[] = [];
          appts.forEach((a: any) => {
            if (a.prescriptions) {
              a.prescriptions.forEach((rx: any) => allRx.push({ ...rx, doctorName: a.doctor?.name }));
            }
          });
          setPrescriptions(allRx.slice(0, 3));
          setStats((s) => ({ ...s, activeRx: allRx.length }));
        }

        if (billsRes.status === 'fulfilled') {
          const b = billsRes.value.data;
          const pending = b.filter((bill: any) => bill.status === 'pending');
          const pendingTotal = pending.reduce((s: number, bill: any) => s + bill.amount, 0);
          setStats((s) => ({ ...s, pendingBills: Math.round(pendingTotal) }));
          setBills(b);
        }
      } catch {}
      setLoading(false);
    };
    load();
  }, [user]);

  const nextAppt = appointments[0];

  return (
    <>
      {/* EthioChart Card */}
      <div className="bg-primary-container p-8 mb-8 relative overflow-hidden text-white">
        <div className="absolute inset-0 ethiopian-pattern opacity-10" />
        <div className="relative z-10 flex justify-between items-start">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold mb-2">My EthioChart Card</p>
            <h2 className="text-3xl font-headline font-bold mb-3">{user?.name || 'Patient'}</h2>
            <p className="text-sm text-on-primary-container mb-1">Hospital: <span className="text-white font-medium">{user?.hospitalName || 'EthioChart Hospital'}</span></p>
            <p className="font-mono text-2xl font-bold text-gold tracking-wider mt-4">{user?.ethioChartId || 'EC-XXXXXXXX'}</p>
          </div>
          <div className="w-28 h-28 bg-white/10 rounded-lg flex items-center justify-center border-2 border-white/20">
            <span className="material-symbols-outlined text-white/50" style={{ fontSize: 50 }}>qr_code_2</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-surface-container-lowest p-6 shadow-sm">
          <p className="text-xs font-mono text-on-surface-variant uppercase tracking-widest mb-3">Upcoming Appointments</p>
          <h3 className="text-3xl font-headline font-bold text-primary">{loading ? '...' : stats.upcomingAppts}</h3>
        </div>
        <div className="bg-surface-container-lowest p-6 shadow-sm">
          <p className="text-xs font-mono text-on-surface-variant uppercase tracking-widest mb-3">Active Prescriptions</p>
          <h3 className="text-3xl font-headline font-bold text-primary">{loading ? '...' : stats.activeRx}</h3>
        </div>
        <div className="bg-surface-container-lowest p-6 shadow-sm relative">
          <p className="text-xs font-mono text-on-surface-variant uppercase tracking-widest mb-3">Pending Bills</p>
          <div className="flex items-baseline gap-1">
            <h3 className="text-3xl font-headline font-bold text-primary">{loading ? '...' : stats.pendingBills.toLocaleString()}</h3>
            <span className="text-xs font-mono text-primary/60">ETB</span>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-6 shadow-sm relative">
          {stats.unreadMsgs > 0 && <span className="absolute top-4 right-4 w-2.5 h-2.5 bg-error rounded-full" />}
          <p className="text-xs font-mono text-on-surface-variant uppercase tracking-widest mb-3">Unread Messages</p>
          <h3 className="text-3xl font-headline font-bold text-primary">{stats.unreadMsgs}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Next Appointment */}
        <div className="bg-surface-container-lowest p-8 shadow-sm">
          <h3 className="text-lg font-headline font-semibold text-primary mb-6">Next Appointment</h3>
          {loading ? <div className="flex justify-center py-8"><div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div> :
          nextAppt ? (
            <div>
              <div className="flex items-center gap-6 mb-6">
                <div className="w-20 h-20 rounded-full bg-surface-container-low flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-primary/30" style={{ fontSize: 40 }}>person</span>
                </div>
                <div>
                  <h4 className="font-headline font-bold text-primary text-lg">{nextAppt.doctor?.name || 'Doctor'}</h4>
                  <div className="flex gap-4 mt-3 text-xs text-on-surface-variant">
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined" style={{ fontSize: 14 }}>calendar_today</span>{new Date(nextAppt.scheduledAt).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined" style={{ fontSize: 14 }}>schedule</span>{new Date(nextAppt.scheduledAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  {nextAppt.notes && <p className="text-xs text-on-surface-variant mt-2">{nextAppt.notes}</p>}
                </div>
              </div>
              <Link href="/patient/appointments" className="w-full py-3 bg-primary-container text-white font-headline font-semibold flex items-center justify-center gap-2 hover:bg-primary transition-colors">
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>event</span>View All Appointments
              </Link>
            </div>
          ) : (
            <div className="text-center py-6">
              <span className="material-symbols-outlined text-outline mb-2" style={{ fontSize: 40 }}>event_busy</span>
              <p className="text-on-surface-variant text-sm">No upcoming appointments</p>
            </div>
          )}
        </div>

        {/* Recent Prescriptions */}
        <div className="bg-surface-container-lowest p-8 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-headline font-semibold text-primary">Recent Prescriptions</h3>
            <Link href="/patient/prescriptions" className="text-sm text-primary font-semibold underline underline-offset-4">View All</Link>
          </div>
          {loading ? <div className="flex justify-center py-8"><div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div> :
          prescriptions.length === 0 ? (
            <p className="text-center text-on-surface-variant py-6 text-sm">No prescriptions yet</p>
          ) : (
            <div className="space-y-4">
              {prescriptions.map((p, i) => (
                <div key={i} className="flex items-center gap-4 p-3 border border-outline-variant/20 hover:border-primary/20 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-primary-container/10 flex items-center justify-center"><span className="material-symbols-outlined text-primary-container" style={{ fontSize: 20 }}>medication</span></div>
                  <div className="flex-1"><p className="font-semibold text-sm">{p.medication}</p><p className="text-xs text-on-surface-variant">{p.dosage} • {p.duration}</p></div>
                  <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest bg-primary-container/10 text-primary-container">Active</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
