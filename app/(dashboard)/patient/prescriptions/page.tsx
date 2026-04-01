'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function PatientPrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.getAppointments();
        const allRx: any[] = [];
        res.data.forEach((a: any) => {
          if (a.prescriptions) {
            a.prescriptions.forEach((rx: any) => allRx.push({ ...rx, doctorName: a.doctor?.name, date: new Date(a.scheduledAt).toLocaleDateString() }));
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
      <h2 className="text-2xl font-headline font-bold text-primary mb-8">My Prescriptions</h2>
      <div className="space-y-4">
        {loading ? <div className="flex justify-center py-12"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div> :
        prescriptions.length === 0 ? <p className="text-center py-12 text-on-surface-variant text-sm">No prescriptions found</p> :
        prescriptions.map((r, i) => (
          <div key={i} className="bg-surface-container-lowest p-6 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-primary-container/10 flex items-center justify-center"><span className="material-symbols-outlined text-primary-container" style={{ fontSize: 24 }}>medication</span></div>
            <div className="flex-1">
              <h4 className="font-semibold text-on-surface">{r.medication}</h4>
              <p className="text-xs text-on-surface-variant">{r.dosage} • {r.duration}</p>
              <p className="text-xs text-on-surface-variant mt-1">Prescribed by: {r.doctorName} • {r.date}</p>
            </div>
            <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm bg-primary-container/10 text-primary-container">Active</span>
          </div>
        ))}
      </div>
    </>
  );
}
