'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/auth';
import { api } from '@/lib/api';

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({ totalPatients: 0, totalDoctors: 0, todaysAppts: 0, pendingAppts: 0, revenue: 0, revenueGrowth: 8, patientGrowth: 12 });
  const [patients, setPatients] = useState<any[]>([]);
  const [weekData, setWeekData] = useState<{ day: string; count: number }[]>([]);
  const [billingStats, setBillingStats] = useState({ paid: 0, pending: 0, paidPct: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [patientsRes, doctorsRes, apptsRes, billsRes] = await Promise.allSettled([
          api.getPatients(),
          api.getDoctors(),
          api.getAppointments(),
          api.getBills(0),
        ]);

        // Patients
        if (patientsRes.status === 'fulfilled') {
          const data = patientsRes.value.data;
          setStats((s) => ({ ...s, totalPatients: data.length }));
          setPatients(
            data.slice(0, 5).map((p: any) => ({
              name: p.email?.split('@')[0]?.replace('.', ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()) || 'Patient',
              id: p.ethioChartId || 'N/A',
              date: new Date(p.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).toUpperCase(),
              status: p.isVerified ? 'Active' : 'Pending',
            }))
          );
        }

        // Doctors
        if (doctorsRes.status === 'fulfilled') {
          setStats((s) => ({ ...s, totalDoctors: doctorsRes.value.data.length }));
        }

        // Appointments
        if (apptsRes.status === 'fulfilled') {
          const appts = apptsRes.value.data;
          const today = new Date().toDateString();
          const todaysAppts = appts.filter((a: any) => new Date(a.scheduledAt).toDateString() === today);
          const pendingAppts = appts.filter((a: any) => a.status === 'scheduled');
          setStats((s) => ({ ...s, todaysAppts: todaysAppts.length, pendingAppts: pendingAppts.length }));

          // Weekly chart data
          const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
          const weekCounts = days.map(() => 0);
          appts.forEach((a: any) => {
            const d = new Date(a.scheduledAt).getDay();
            weekCounts[d]++;
          });
          const maxCount = Math.max(...weekCounts, 1);
          setWeekData(days.map((day, i) => ({ day, count: weekCounts[i] })));
        }

        // Billing
        if (billsRes.status === 'fulfilled') {
          const bills = billsRes.value.data;
          const paid = bills.filter((b: any) => b.status === 'paid').reduce((s: number, b: any) => s + b.amount, 0);
          const pending = bills.filter((b: any) => b.status === 'pending').reduce((s: number, b: any) => s + b.amount, 0);
          const total = paid + pending;
          setBillingStats({ paid, pending, paidPct: total > 0 ? Math.round((paid / total) * 100) : 0 });
          setStats((s) => ({ ...s, revenue: Math.round(paid) }));
        }
      } catch {}
      setLoading(false);
    };
    loadData();
  }, []);

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  const maxWeek = Math.max(...weekData.map((d) => d.count), 1);

  const quickActions = [
    { label: 'Register Patient', icon: 'person_add', href: '/admin/patients/register' },
    { label: 'Create Appt.', icon: 'add_box', href: '/admin/appointments/new' },
    { label: 'Add User', icon: 'manage_accounts', href: '/admin/users/new' },
    { label: 'Create Bill', icon: 'receipt_long', href: '/admin/billing/new' },
  ];

  return (
    <>
      <header className="mb-10">
        <h2 className="text-3xl font-headline font-semibold text-primary tracking-tight">Welcome back, {user?.name || 'Admin'}</h2>
        <p className="font-mono text-xs text-on-surface-variant uppercase mt-1 tracking-widest">{today}</p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-surface-container-lowest p-6 shadow-sm border-b-2 border-primary/5">
          <div className="flex justify-between items-start mb-4"><p className="text-xs font-mono text-on-surface-variant uppercase tracking-widest">Total Patients</p><span className="material-symbols-outlined text-primary/30" style={{ fontSize: 20 }}>person</span></div>
          <div className="flex items-end justify-between"><h3 className="text-4xl font-headline font-bold text-primary">{loading ? '...' : stats.totalPatients.toLocaleString()}</h3><div className="flex items-center text-primary-fixed-dim text-sm font-semibold"><span className="material-symbols-outlined text-sm">arrow_upward</span><span>{stats.patientGrowth}%</span></div></div>
        </div>
        <div className="bg-surface-container-lowest p-6 shadow-sm border-b-2 border-primary/5">
          <div className="flex justify-between items-start mb-4"><p className="text-xs font-mono text-on-surface-variant uppercase tracking-widest">Total Doctors</p><span className="material-symbols-outlined text-primary/30" style={{ fontSize: 20 }}>medical_services</span></div>
          <div className="flex items-end justify-between"><h3 className="text-4xl font-headline font-bold text-primary">{loading ? '...' : stats.totalDoctors}</h3><span className="text-[10px] text-on-surface-variant font-mono uppercase">Full Roster</span></div>
        </div>
        <div className="bg-surface-container-lowest p-6 shadow-sm border-b-2 border-primary/5">
          <div className="flex justify-between items-start mb-4"><p className="text-xs font-mono text-on-surface-variant uppercase tracking-widest">Today&apos;s Appt.</p><span className="material-symbols-outlined text-primary/30" style={{ fontSize: 20 }}>event</span></div>
          <div className="flex items-end justify-between"><h3 className="text-4xl font-headline font-bold text-primary">{loading ? '...' : stats.todaysAppts}</h3><div className="px-2 py-1 bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold uppercase tracking-tighter">{stats.pendingAppts} Pending</div></div>
        </div>
        <div className="bg-surface-container-lowest p-6 shadow-sm border-b-2 border-primary/5">
          <div className="flex justify-between items-start mb-4"><p className="text-xs font-mono text-on-surface-variant uppercase tracking-widest">Net Revenue</p><span className="material-symbols-outlined text-primary/30" style={{ fontSize: 20 }}>payments</span></div>
          <div className="flex items-end justify-between"><div className="flex items-baseline space-x-1"><h3 className="text-4xl font-headline font-bold text-primary">{loading ? '...' : stats.revenue.toLocaleString()}</h3><span className="text-xs font-mono text-primary/60">ETB</span></div><div className="flex items-center text-primary-fixed-dim text-sm font-semibold"><span className="material-symbols-outlined text-sm">trending_up</span><span>{stats.revenueGrowth}%</span></div></div>
        </div>
      </div>

      {/* Chart + Registrations */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 mb-10">
        <div className="lg:col-span-6 bg-surface-container-lowest p-8 shadow-sm">
          <h4 className="text-lg font-headline font-semibold text-primary mb-8">Appointments by Day</h4>
          <div className="flex items-end justify-between h-64 px-4 space-x-4">
            {weekData.map((d) => (
              <div key={d.day} className="flex flex-col items-center flex-1 space-y-4">
                <div className="w-full bg-primary-container/20 relative h-40">
                  <div className="absolute bottom-0 w-full bg-primary transition-all duration-700 ease-out" style={{ height: `${(d.count / maxWeek) * 100}%` }} />
                </div>
                <div className="text-center">
                  <span className="font-mono text-[10px] text-on-surface-variant">{d.day}</span>
                  <p className="font-mono text-xs font-bold text-primary">{d.count}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="lg:col-span-4 bg-surface-container-lowest p-8 shadow-sm">
          <h4 className="text-lg font-headline font-semibold text-primary mb-8">Recent Registrations</h4>
          <div className="space-y-6">
            {loading ? <div className="flex justify-center py-8"><div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div> : patients.map((p, i) => (
              <div key={i} className="flex items-center justify-between group hover:bg-surface-container-low/50 -mx-2 px-2 py-1 rounded transition-colors">
                <div><p className="text-sm font-semibold text-on-surface">{p.name}</p><p className="font-mono text-[10px] text-on-surface-variant tracking-tighter">{p.id}</p></div>
                <div className="text-right"><p className="text-[10px] font-mono text-on-surface-variant">{p.date}</p><span className={`text-[9px] font-bold uppercase tracking-widest ${p.status === 'Active' ? 'text-primary-container' : 'text-on-tertiary-container'}`}>{p.status}</span></div>
              </div>
            ))}
          </div>
          <Link href="/admin/patients" className="block w-full mt-8 py-3 border-b-2 border-outline-variant/30 text-xs font-mono uppercase tracking-[0.2em] text-primary hover:bg-primary/5 transition-all text-center">View All Patients</Link>
        </div>
      </div>

      {/* Billing + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-surface-container-lowest p-8 shadow-sm">
          <h4 className="text-lg font-headline font-semibold text-primary mb-8">Billing Overview</h4>
          <div className="flex items-center space-x-12">
            <div className="relative w-40 h-40 flex items-center justify-center flex-shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                <circle cx="80" cy="80" fill="transparent" r="70" stroke="#e0e0e0" strokeWidth="15" />
                <circle cx="80" cy="80" fill="transparent" r="70" stroke="#1B4332" strokeDasharray="440" strokeDashoffset={440 - (440 * billingStats.paidPct / 100)} strokeWidth="15" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white rounded-full m-6"><span className="text-xl font-bold text-primary">{billingStats.paidPct}%</span><span className="text-[9px] text-on-surface-variant font-mono uppercase">Settled</span></div>
            </div>
            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between"><div className="flex items-center"><span className="w-3 h-3 bg-primary-container mr-3" /><span className="text-xs font-semibold text-on-surface uppercase tracking-tight">Paid</span></div><span className="font-mono text-xs text-primary">{billingStats.paid.toLocaleString()} ETB</span></div>
              <div className="flex items-center justify-between"><div className="flex items-center"><span className="w-3 h-3 bg-gold mr-3" /><span className="text-xs font-semibold text-on-surface uppercase tracking-tight">Outstanding</span></div><span className="font-mono text-xs text-primary">{billingStats.pending.toLocaleString()} ETB</span></div>
            </div>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-8 shadow-sm">
          <h4 className="text-lg font-headline font-semibold text-primary mb-8">System Operations</h4>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((a) => (
              <Link key={a.label} href={a.href} className="flex flex-col items-center justify-center p-6 border border-outline-variant/30 hover:bg-primary hover:text-white transition-all group duration-300">
                <span className="material-symbols-outlined text-3xl mb-3 text-primary group-hover:text-white" style={{ fontSize: 30 }}>{a.icon}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest group-hover:text-white">{a.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
