'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function AdminHospitalsPage() {
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try { const res = await api.getHospitals(); setHospitals(res.data); } catch {}
      setLoading(false);
    };
    load();
  }, []);

  return (
    <>
      <h2 className="text-2xl font-headline font-bold text-primary mb-8">Hospitals</h2>
      {loading ? <div className="flex justify-center py-12"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {hospitals.map((h) => (
            <div key={h.id} className="bg-surface-container-lowest p-8 shadow-sm border-t-4 border-primary-container hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-lg bg-primary-container/10 flex items-center justify-center"><span className="material-symbols-outlined text-primary-container" style={{ fontSize: 28 }}>domain</span></div>
                <div><h3 className="font-headline font-bold text-primary text-lg">{h.name}</h3><p className="text-sm text-on-surface-variant">{h.address}</p></div>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center p-3 bg-surface-container-low"><p className="font-headline font-bold text-primary">{h._count?.doctors ?? h.doctors?.length ?? '—'}</p><p className="text-[10px] text-on-surface-variant">Doctors</p></div>
                <div className="text-center p-3 bg-surface-container-low"><p className="font-headline font-bold text-primary">{h._count?.patients ?? h.patients?.length ?? '—'}</p><p className="text-[10px] text-on-surface-variant">Patients</p></div>
                <div className="text-center p-3 bg-surface-container-low"><p className="font-headline font-bold text-primary">{h._count?.users ?? h.users?.length ?? '—'}</p><p className="text-[10px] text-on-surface-variant">Staff</p></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
