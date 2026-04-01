'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function AppointmentsListPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try { const res = await api.getAppointments(); setAppointments(res.data); } catch {}
      setLoading(false);
    };
    load();
  }, []);

  const statusColor = (s: string) => {
    switch(s) { case 'scheduled': return 'bg-primary-container/10 text-primary-container'; case 'completed': return 'bg-secondary-container/50 text-secondary'; case 'cancelled': return 'bg-error-container text-error'; default: return 'bg-tertiary-fixed/30 text-on-tertiary-container'; }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-headline font-bold text-primary">Appointments</h2>
        <Link href="/admin/appointments/new" className="flex items-center gap-2 bg-primary-container text-white px-6 py-3 font-headline font-semibold text-sm hover:bg-primary transition-colors shadow-lg">
          <span className="material-symbols-outlined text-lg">add_box</span>New Appointment
        </Link>
      </div>
      <div className="bg-surface-container-lowest shadow-sm">
        <table className="w-full">
          <thead><tr className="border-b border-outline-variant/20">
            <th className="text-left px-6 py-4 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">Date/Time</th>
            <th className="text-left px-6 py-4 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">Patient</th>
            <th className="text-left px-6 py-4 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">Doctor</th>
            <th className="text-left px-6 py-4 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">Status</th>
            <th className="text-left px-6 py-4 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">Notes</th>
            <th className="text-left px-6 py-4 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">Actions</th>
          </tr></thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-6 py-12 text-center"><div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" /></td></tr>
            ) : appointments.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-12 text-center text-on-surface-variant text-sm">No appointments found</td></tr>
            ) : appointments.map((a, i) => (
              <tr key={a.id} className={`border-b border-outline-variant/10 hover:bg-surface-container-low/50 ${i%2?'bg-surface-container-low/30':''}`}>
                <td className="px-6 py-4 text-sm font-mono">{new Date(a.dateTime).toLocaleString()}</td>
                <td className="px-6 py-4 text-sm font-semibold">{a.patient?.name || a.patient?.email?.split('@')[0] || 'N/A'}</td>
                <td className="px-6 py-4 text-sm">{a.doctor?.name || 'N/A'}</td>
                <td className="px-6 py-4"><span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm ${statusColor(a.status)}`}>{a.status}</span></td>
                <td className="px-6 py-4 text-sm text-on-surface-variant truncate max-w-[200px]">{a.notes || '—'}</td>
                <td className="px-6 py-4"><button className="text-outline hover:text-primary"><span className="material-symbols-outlined text-lg">visibility</span></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
