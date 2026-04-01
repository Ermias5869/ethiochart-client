'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';

export default function DoctorPatientsPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try { const res = await api.getPatients(); setPatients(res.data); } catch {}
      setLoading(false);
    };
    load();
  }, []);

  return (
    <>
      <h2 className="text-2xl font-headline font-bold text-primary mb-2">My Patients</h2>
      <p className="text-sm text-on-surface-variant mb-8">Patients you have access to view and treat</p>
      {loading ? <div className="flex justify-center py-12"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {patients.map((p) => (
            <div key={p.id} className="bg-surface-container-lowest p-6 shadow-sm border-l-4 border-primary-container hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center text-white font-bold text-sm">{(p.email?.charAt(0) || 'P').toUpperCase()}</div>
                <div><h3 className="font-semibold text-primary">{p.email?.split('@')[0]?.replace('.', ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}</h3><p className="font-mono text-[10px] text-primary-container">{p.ethioChartId}</p></div>
              </div>
              <p className="text-xs text-on-surface-variant mb-1">{p.email}</p>
              <p className="text-xs text-on-surface-variant mb-4">{p.phone}</p>
              <Link href={`/doctor/patients/${p.id}`} className="block text-center py-2 border border-primary-container text-primary-container text-xs font-semibold hover:bg-primary-container/5 transition-colors">View History</Link>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
