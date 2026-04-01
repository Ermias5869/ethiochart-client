'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function PatientAppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try { const res = await api.getAppointments(); setAppointments(res.data.sort((a: any, b: any) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime())); } catch {}
      setLoading(false);
    };
    load();
  }, []);

  const sc = (s: string) => s === 'scheduled' ? 'bg-primary-container/10 text-primary-container' : s === 'completed' ? 'bg-secondary-container/50 text-secondary' : 'bg-error-container text-error';

  return (
    <>
      <h2 className="text-2xl font-headline font-bold text-primary mb-8">My Appointments</h2>
      <div className="space-y-4">
        {loading ? <div className="flex justify-center py-12"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div> :
        appointments.length === 0 ? <p className="text-center py-12 text-on-surface-variant text-sm">No appointments found</p> :
        appointments.map((a) => (
          <div key={a.id} className="bg-surface-container-lowest p-6 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center text-white font-bold">{(a.doctor?.name?.charAt(4) || 'D')}</div>
              <div><p className="font-semibold">{a.doctor?.name || 'Doctor'}</p><p className="text-xs text-on-surface-variant">{a.notes || 'Consultation'}</p></div>
            </div>
            <div className="text-center"><p className="text-sm font-medium">{new Date(a.scheduledAt).toLocaleDateString()}</p><p className="text-xs text-on-surface-variant">{new Date(a.scheduledAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p></div>
            <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm ${sc(a.status)}`}>{a.status}</span>
          </div>
        ))}
      </div>
    </>
  );
}
