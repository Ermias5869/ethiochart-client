'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try { const res = await api.getDoctors(); setDoctors(res.data); } catch {}
      setLoading(false);
    };
    load();
  }, []);

  return (
    <>
      <h2 className="text-2xl font-headline font-bold text-primary mb-8">Doctors Directory</h2>
      {loading ? <div className="flex justify-center py-12"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((d) => (
            <div key={d.id} className="bg-surface-container-lowest p-6 shadow-sm border-t-4 border-primary-container hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-primary-container flex items-center justify-center text-white text-lg font-bold">{d.name?.charAt(4) || 'D'}</div>
                <div><h3 className="font-headline font-semibold text-primary">{d.name}</h3><p className="text-xs text-on-surface-variant">{d.email}</p></div>
              </div>
              <div className="space-y-2 text-sm text-on-surface-variant">
                <p className="flex items-center gap-2"><span className="material-symbols-outlined" style={{ fontSize: 16 }}>call</span>{d.phone}</p>
                <p className="flex items-center gap-2"><span className="material-symbols-outlined" style={{ fontSize: 16 }}>domain</span>{d.hospital?.name || 'Hospital'}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
