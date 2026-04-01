'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/auth';
import { api } from '@/lib/api';

const weekData = [
  { day: 'MON', height: 60 },
  { day: 'TUE', height: 45 },
  { day: 'WED', height: 85 },
  { day: 'THU', height: 70 },
  { day: 'FRI', height: 95 },
  { day: 'SAT', height: 30 },
  { day: 'SUN', height: 20 },
];

const recentPatients = [
  { name: 'Abebe Bikila', id: 'ETH-0045-BK', date: 'MAY 15, 08:30', status: 'Active' },
  { name: 'Selamawit Tadesse', id: 'ETH-0046-ST', date: 'MAY 15, 09:12', status: 'Active' },
  { name: 'Desta Kassahun', id: 'ETH-0047-DK', date: 'MAY 15, 10:45', status: 'Pending' },
  { name: 'Mulugeta Haile', id: 'ETH-0048-MH', date: 'MAY 14, 16:20', status: 'Active' },
  { name: 'Genet Tekle', id: 'ETH-0049-GT', date: 'MAY 14, 15:10', status: 'Active' },
];

const quickActions = [
  { label: 'Register Patient', icon: 'person_add', href: '/admin/patients/register' },
  { label: 'Create Appt.', icon: 'add_box', href: '/admin/appointments/new' },
  { label: 'Add User', icon: 'manage_accounts', href: '/admin/users/new' },
  { label: 'Create Bill', icon: 'receipt_long', href: '/admin/billing/new' },
];

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    totalPatients: 1247,
    totalDoctors: 48,
    todaysAppts: 23,
    pendingAppts: 5,
    revenue: 45200,
    revenueGrowth: 8,
    patientGrowth: 12,
  });
  const [patients, setPatients] = useState(recentPatients);

  useEffect(() => {
    // Fetch real data
    const loadData = async () => {
      try {
        const [patientsRes, doctorsRes] = await Promise.allSettled([
          api.getPatients(),
          api.getDoctors(),
        ]);
        if (patientsRes.status === 'fulfilled') {
          const data = patientsRes.value.data;
          setStats((s) => ({ ...s, totalPatients: data.length }));
          if (data.length > 0) {
            setPatients(
              data.slice(0, 5).map((p: any) => ({
                name: p.name || p.email?.split('@')[0] || 'Patient',
                id: p.ethioChartId || 'N/A',
                date: new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                status: p.isVerified ? 'Active' : 'Pending',
              }))
            );
          }
        }
        if (doctorsRes.status === 'fulfilled') {
          setStats((s) => ({ ...s, totalDoctors: doctorsRes.value.data.length }));
        }
      } catch {}
    };
    loadData();
  }, []);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <>
      {/* Header */}
      <header className="mb-10">
        <h2 className="text-3xl font-headline font-semibold text-primary tracking-tight">
          Welcome back, {user?.name || 'Admin'}
        </h2>
        <p className="font-mono text-xs text-on-surface-variant uppercase mt-1 tracking-widest">
          {today}
        </p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {/* Total Patients */}
        <div className="bg-surface-container-lowest p-6 shadow-sm border-b-2 border-primary/5">
          <div className="flex justify-between items-start mb-4">
            <p className="text-xs font-mono text-on-surface-variant uppercase tracking-widest">Total Patients</p>
            <span className="material-symbols-outlined text-primary/30">person</span>
          </div>
          <div className="flex items-end justify-between">
            <h3 className="text-4xl font-headline font-bold text-primary">{stats.totalPatients.toLocaleString()}</h3>
            <div className="flex items-center text-primary-fixed-dim text-sm font-semibold">
              <span className="material-symbols-outlined text-sm">arrow_upward</span>
              <span>{stats.patientGrowth}%</span>
            </div>
          </div>
        </div>

        {/* Total Doctors */}
        <div className="bg-surface-container-lowest p-6 shadow-sm border-b-2 border-primary/5">
          <div className="flex justify-between items-start mb-4">
            <p className="text-xs font-mono text-on-surface-variant uppercase tracking-widest">Total Doctors</p>
            <span className="material-symbols-outlined text-primary/30">medical_services</span>
          </div>
          <div className="flex items-end justify-between">
            <h3 className="text-4xl font-headline font-bold text-primary">{stats.totalDoctors}</h3>
            <span className="text-[10px] text-on-surface-variant font-mono uppercase">Full Roster</span>
          </div>
        </div>

        {/* Today's Appointments */}
        <div className="bg-surface-container-lowest p-6 shadow-sm border-b-2 border-primary/5">
          <div className="flex justify-between items-start mb-4">
            <p className="text-xs font-mono text-on-surface-variant uppercase tracking-widest">Today&apos;s Appt.</p>
            <span className="material-symbols-outlined text-primary/30">event</span>
          </div>
          <div className="flex items-end justify-between">
            <h3 className="text-4xl font-headline font-bold text-primary">{stats.todaysAppts}</h3>
            <div className="px-2 py-1 bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold uppercase tracking-tighter">
              {stats.pendingAppts} Pending
            </div>
          </div>
        </div>

        {/* Revenue */}
        <div className="bg-surface-container-lowest p-6 shadow-sm border-b-2 border-primary/5">
          <div className="flex justify-between items-start mb-4">
            <p className="text-xs font-mono text-on-surface-variant uppercase tracking-widest">Net Revenue</p>
            <span className="material-symbols-outlined text-primary/30">payments</span>
          </div>
          <div className="flex items-end justify-between">
            <div className="flex items-baseline space-x-1">
              <h3 className="text-4xl font-headline font-bold text-primary">{stats.revenue.toLocaleString()}</h3>
              <span className="text-xs font-mono text-primary/60">ETB</span>
            </div>
            <div className="flex items-center text-primary-fixed-dim text-sm font-semibold">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              <span>{stats.revenueGrowth}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Middle: Chart + Registrations */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 mb-10">
        {/* Bar Chart */}
        <div className="lg:col-span-6 bg-surface-container-lowest p-8 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h4 className="text-lg font-headline font-semibold text-primary">Appointments This Week</h4>
            <select className="bg-transparent border-0 font-mono text-[10px] uppercase tracking-widest focus:ring-0 text-on-surface-variant">
              <option>Current Week</option>
              <option>Past Week</option>
            </select>
          </div>
          <div className="flex items-end justify-between h-64 px-4 space-x-4">
            {weekData.map((d) => (
              <div key={d.day} className="flex flex-col items-center flex-1 space-y-4">
                <div className="w-full bg-primary-container/20 relative h-40">
                  <div
                    className="absolute bottom-0 w-full bg-primary transition-all duration-700 ease-out"
                    style={{ height: `${d.height}%` }}
                  />
                </div>
                <span className="font-mono text-[10px] text-on-surface-variant">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Registrations */}
        <div className="lg:col-span-4 bg-surface-container-lowest p-8 shadow-sm">
          <h4 className="text-lg font-headline font-semibold text-primary mb-8">Recent Registrations</h4>
          <div className="space-y-6">
            {patients.map((p, i) => (
              <div key={i} className="flex items-center justify-between group hover:bg-surface-container-low/50 -mx-2 px-2 py-1 rounded transition-colors">
                <div>
                  <p className="text-sm font-semibold text-on-surface">{p.name}</p>
                  <p className="font-mono text-[10px] text-on-surface-variant tracking-tighter">{p.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-mono text-on-surface-variant">{p.date}</p>
                  <span className={`text-[9px] font-bold uppercase tracking-widest ${
                    p.status === 'Active' ? 'text-primary-container' : 'text-on-tertiary-container'
                  }`}>
                    {p.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <Link
            href="/admin/patients"
            className="block w-full mt-8 py-3 border-b-2 border-outline-variant/30 text-xs font-mono uppercase tracking-[0.2em] text-primary hover:bg-primary/5 transition-all text-center"
          >
            View All Patients
          </Link>
        </div>
      </div>

      {/* Bottom: Billing + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Billing Overview */}
        <div className="bg-surface-container-lowest p-8 shadow-sm">
          <h4 className="text-lg font-headline font-semibold text-primary mb-8">Billing Overview</h4>
          <div className="flex items-center space-x-12">
            {/* Donut */}
            <div className="relative w-40 h-40 flex items-center justify-center flex-shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                <circle cx="80" cy="80" fill="transparent" r="70" stroke="#D4A843" strokeDasharray="440" strokeDashoffset="123" strokeWidth="15" />
                <circle cx="80" cy="80" fill="transparent" r="70" stroke="#1B4332" strokeDasharray="440" strokeDashoffset="0" strokeWidth="15" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white rounded-full m-6">
                <span className="text-xl font-bold text-primary">72%</span>
                <span className="text-[9px] text-on-surface-variant font-mono uppercase">Settled</span>
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-primary-container mr-3" />
                  <span className="text-xs font-semibold text-on-surface uppercase tracking-tight">Paid Claims</span>
                </div>
                <span className="font-mono text-xs text-primary">72%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-gold mr-3" />
                  <span className="text-xs font-semibold text-on-surface uppercase tracking-tight">Outstanding</span>
                </div>
                <span className="font-mono text-xs text-primary">28%</span>
              </div>
              <div className="pt-4 border-t border-outline-variant/20">
                <p className="text-[10px] text-on-surface-variant leading-relaxed">
                  Summary of institutional billing ledger. Net pending balance represents{' '}
                  <span className="font-mono text-primary">12,656 ETB</span> across all active departments.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-surface-container-lowest p-8 shadow-sm">
          <h4 className="text-lg font-headline font-semibold text-primary mb-8">System Operations</h4>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="flex flex-col items-center justify-center p-6 border border-outline-variant/30 hover:bg-primary hover:text-white transition-all group duration-300"
              >
                <span className="material-symbols-outlined text-3xl mb-3 text-primary group-hover:text-white">
                  {action.icon}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest group-hover:text-white">
                  {action.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
