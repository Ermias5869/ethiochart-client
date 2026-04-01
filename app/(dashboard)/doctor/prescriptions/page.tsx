'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function DoctorPrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.getAppointments();
        const allRx: any[] = [];
        res.data.forEach((a: any) => {
          if (a.prescriptions) {
            a.prescriptions.forEach((rx: any) => allRx.push({
              ...rx,
              patientName: a.patient?.email?.split('@')[0]?.replace('.', ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()) || 'Patient',
              date: new Date(a.scheduledAt).toLocaleDateString(),
            }));
          }
        });
        setPrescriptions(allRx);
      } catch {}
      setLoading(false);
    };
    load();
  }, []);

  return (
    <>
      <h2 className="text-2xl font-headline font-bold text-primary mb-8">Prescriptions</h2>
      <div className="bg-surface-container-lowest shadow-sm">
        {loading ? <div className="flex justify-center py-12"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div> :
        prescriptions.length === 0 ? <p className="text-center py-12 text-on-surface-variant text-sm">No prescriptions found</p> :
        prescriptions.map((p, i) => (
          <div key={i} className="flex items-center gap-4 p-6 border-b border-outline-variant/10 hover:bg-surface-container-low/50 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-primary-container/10 flex items-center justify-center"><span className="material-symbols-outlined text-primary-container" style={{ fontSize: 20 }}>medication</span></div>
            <div className="flex-1"><p className="font-semibold text-sm">{p.medication} — <span className="text-on-surface-variant font-normal">{p.dosage} • {p.duration}</span></p><p className="text-xs text-on-surface-variant">For: {p.patientName} • {p.date}</p></div>
            <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm bg-primary-container/10 text-primary-container">Active</span>
          </div>
        ))}
      </div>
    </>
  );
}
