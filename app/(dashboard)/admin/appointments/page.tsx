'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try { const res = await api.getAppointments(); setAppointments(res.data.sort((a: any, b: any) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime())); } catch {}
      setLoading(false);
    };
    load();
  }, []);

  const sc = (s: string) => s === 'completed' ? 'bg-primary-container/10 text-primary-container' : s === 'scheduled' ? 'bg-gold/10 text-on-tertiary-container' : 'bg-error-container text-error';

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-headline font-bold text-primary">Appointments</h2>
        <Link href="/admin/appointments/new" className="px-6 py-3 bg-primary text-white font-headline font-semibold text-sm flex items-center gap-2 hover:bg-primary-container"><span className="material-symbols-outlined" style={{ fontSize: 16 }}>add_box</span>New Appointment</Link>
      </div>
      <div className="bg-surface-container-lowest shadow-sm">
        <table className="w-full">
          <thead><tr className="border-b border-outline-variant/20">
            <th className="text-left px-6 py-4 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">Patient</th>
            <th className="text-left px-6 py-4 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">Doctor</th>
            <th className="text-left px-6 py-4 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">Date & Time</th>
            <th className="text-left px-6 py-4 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">Status</th>
            <th className="text-left px-6 py-4 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">Notes</th>
          </tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={5} className="px-6 py-12 text-center"><div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" /></td></tr> :
            appointments.map((a, i) => (
              <tr key={a.id} className={`border-b border-outline-variant/10 ${i % 2 ? 'bg-surface-container-low/30' : ''}`}>
                <td className="px-6 py-4 text-sm font-semibold">{a.patient?.email?.split('@')[0]?.replace('.', ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()) || 'Patient'}</td>
                <td className="px-6 py-4 text-sm">{a.doctor?.name || 'Doctor'}</td>
                <td className="px-6 py-4 text-sm text-on-surface-variant">{new Date(a.scheduledAt).toLocaleDateString()} {new Date(a.scheduledAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</td>
                <td className="px-6 py-4"><span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm ${sc(a.status)}`}>{a.status}</span></td>
                <td className="px-6 py-4 text-xs text-on-surface-variant truncate max-w-[200px]">{a.notes || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-6 py-4 border-t border-outline-variant/20"><p className="font-mono text-xs text-on-surface-variant">{appointments.length} appointments</p></div>
      </div>
    </>
  );
}
