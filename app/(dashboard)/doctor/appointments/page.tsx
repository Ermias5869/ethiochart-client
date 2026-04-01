'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';

export default function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try { const res = await api.getAppointments(); setAppointments(res.data.sort((a: any, b: any) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())); } catch {}
      setLoading(false);
    };
    load();
  }, []);

  const sc = (s: string) => s === 'completed' ? 'bg-primary-container/10 text-primary-container' : s === 'scheduled' ? 'bg-gold/10 text-on-tertiary-container' : 'bg-error-container text-error';

  return (
    <>
      <h2 className="text-2xl font-headline font-bold text-primary mb-8">My Appointments</h2>
      <div className="bg-surface-container-lowest shadow-sm">
        {loading ? <div className="flex justify-center py-12"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div> :
        appointments.length === 0 ? <p className="text-center py-12 text-on-surface-variant">No appointments found</p> :
        appointments.map((a) => (
          <div key={a.id} className="flex items-center gap-4 p-6 border-b border-outline-variant/10 hover:bg-surface-container-low/50 transition-colors">
            <span className="font-mono text-sm text-on-surface-variant w-14">{new Date(a.scheduledAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
            <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center text-white font-bold">{(a.patient?.email?.charAt(0) || 'P').toUpperCase()}</div>
            <div className="flex-1">
              <p className="font-semibold">{a.patient?.email?.split('@')[0]?.replace('.', ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()) || 'Patient'}</p>
              <p className="text-xs text-on-surface-variant">{a.notes || 'Consultation'} • {new Date(a.scheduledAt).toLocaleDateString()}</p>
            </div>
            <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm ${sc(a.status)}`}>{a.status}</span>
            <div className="flex gap-2">
              <Link href={`/doctor/appointments/${a.id}`} className="px-3 py-1 bg-primary-container text-white text-xs font-semibold">View</Link>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
