'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function HospitalsPage() {
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', address: '' });

  useEffect(() => { const load = async () => { try { const res = await api.getHospitals(); setHospitals(res.data); } catch {} setLoading(false); }; load(); }, []);

  const create = async () => {
    try { const res = await api.createHospital(form); setHospitals([...hospitals, res.data]); setShowForm(false); setForm({ name: '', address: '' }); } catch {}
  };

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-headline font-bold text-primary">Hospitals Directory</h2>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-primary-container text-white px-6 py-3 font-headline font-semibold text-sm hover:bg-primary transition-colors shadow-lg"><span className="material-symbols-outlined text-lg">add</span>Add Hospital</button>
      </div>
      {showForm && (
        <div className="bg-surface-container-lowest p-6 shadow-sm mb-8 max-w-lg">
          <h3 className="font-headline font-semibold text-primary mb-4">New Hospital</h3>
          <div className="space-y-4">
            <input type="text" placeholder="Hospital Name" className="w-full px-4 py-3 border border-outline-variant/30 focus:border-primary focus:ring-0" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            <input type="text" placeholder="Address" className="w-full px-4 py-3 border border-outline-variant/30 focus:border-primary focus:ring-0" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
            <div className="flex gap-4"><button onClick={() => setShowForm(false)} className="flex-1 py-2 border border-outline-variant/30 font-semibold text-sm">Cancel</button><button onClick={create} className="flex-1 py-2 bg-primary-container text-white font-semibold text-sm">Create</button></div>
          </div>
        </div>
      )}
      {loading ? <div className="flex justify-center py-20"><div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" /></div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {hospitals.map(h => (
            <div key={h.id} className="bg-surface-container-lowest p-6 shadow-sm border-t-4 border-primary-container hover:shadow-md transition-shadow">
              <h3 className="font-headline font-bold text-lg text-primary mb-2">{h.name}</h3>
              <p className="flex items-center gap-2 text-sm text-on-surface-variant mb-4"><span className="material-symbols-outlined text-sm">location_on</span>{h.address}</p>
              <div className="flex gap-4 text-xs">
                <span className="px-3 py-1 bg-surface-container font-semibold">Doctors: {h._count?.doctors || 0}</span>
                <span className="px-3 py-1 bg-surface-container font-semibold">Patients: {h._count?.patients || 0}</span>
                <span className="px-3 py-1 bg-surface-container font-semibold">Staff: {h._count?.users || 0}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
