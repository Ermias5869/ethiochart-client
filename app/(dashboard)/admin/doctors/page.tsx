'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function DoctorsListPage() {
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
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-headline font-bold text-primary">Doctors Directory</h2>
        <div className="flex items-center gap-2">
          <input type="text" placeholder="Search doctors..." className="px-4 py-2 border border-outline-variant/30 focus:border-primary focus:ring-0 text-sm" />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((d) => (
            <div key={d.id} className="bg-surface-container-lowest p-6 shadow-sm border-l-4 border-primary-container hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-primary-container flex items-center justify-center text-white text-lg font-bold">
                  {(d.name || 'D').charAt(0)}
                </div>
                <div>
                  <h3 className="font-headline font-semibold text-primary">{d.name}</h3>
                  <p className="text-xs text-on-surface-variant">{d.specialty || 'General Practitioner'}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm text-on-surface-variant">
                <p className="flex items-center gap-2"><span className="material-symbols-outlined text-sm">mail</span>{d.email}</p>
                <p className="flex items-center gap-2"><span className="material-symbols-outlined text-sm">phone</span>{d.phone}</p>
                <p className="flex items-center gap-2"><span className="material-symbols-outlined text-sm">domain</span>{d.hospital?.name || 'N/A'}</p>
              </div>
              <div className="flex gap-2 mt-4 pt-4 border-t border-outline-variant/20">
                <button className="flex-1 px-3 py-2 text-xs font-semibold text-primary border border-outline-variant/30 hover:bg-primary/5 transition-colors">Edit</button>
                <button className="flex-1 px-3 py-2 text-xs font-semibold text-error border border-error/30 hover:bg-error-container/50 transition-colors">Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
