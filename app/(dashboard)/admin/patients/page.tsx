'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';

export default function AdminPatientsPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try { const res = await api.getPatients(); setPatients(res.data); } catch {}
      setLoading(false);
    };
    load();
  }, []);

  const filtered = patients.filter((p) => {
    const name = p.email?.split('@')[0]?.replace('.', ' ') || '';
    const matchSearch = name.toLowerCase().includes(search.toLowerCase()) || p.ethioChartId?.toLowerCase().includes(search.toLowerCase()) || p.email?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || (filter === 'verified' && p.isVerified) || (filter === 'pending' && !p.isVerified);
    return matchSearch && matchFilter;
  });

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-headline font-bold text-primary">Patient Ledger</h2>
        <Link href="/admin/patients/register" className="px-6 py-3 bg-primary text-white font-headline font-semibold text-sm flex items-center gap-2 hover:bg-primary-container transition-colors">
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>person_add</span>Register New Patient
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-surface-container-lowest p-4 mb-6 shadow-sm flex items-center gap-4">
        <div className="relative flex-1"><span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline" style={{ fontSize: 18 }}>search</span><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, ID, or email..." className="w-full pl-10 pr-4 py-2 border border-outline-variant/30 text-sm focus:border-primary focus:ring-0 focus:outline-none" /></div>
        <div className="flex border border-outline-variant/30">
          {['all', 'verified', 'pending'].map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${filter === f ? 'bg-primary text-white' : 'text-on-surface-variant hover:bg-surface-container-low'}`}>{f}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface-container-lowest shadow-sm">
        <table className="w-full">
          <thead><tr className="border-b border-outline-variant/20">
            <th className="text-left px-6 py-4 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">Patient</th>
            <th className="text-left px-6 py-4 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">EthioChart ID</th>
            <th className="text-left px-6 py-4 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">National ID</th>
            <th className="text-left px-6 py-4 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">Phone</th>
            <th className="text-left px-6 py-4 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">Status</th>
            <th className="text-left px-6 py-4 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">Actions</th>
          </tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={6} className="px-6 py-12 text-center"><div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" /></td></tr> :
            filtered.length === 0 ? <tr><td colSpan={6} className="px-6 py-12 text-center text-on-surface-variant text-sm">No patients found</td></tr> :
            filtered.map((p, i) => (
              <tr key={p.id} className={`border-b border-outline-variant/10 hover:bg-surface-container-low/50 ${i % 2 ? 'bg-surface-container-low/30' : ''}`}>
                <td className="px-6 py-4 text-sm font-semibold">{p.email?.split('@')[0]?.replace('.', ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}</td>
                <td className="px-6 py-4 font-mono text-xs text-primary">{p.ethioChartId}</td>
                <td className="px-6 py-4 font-mono text-xs text-on-surface-variant">{p.nationalId}</td>
                <td className="px-6 py-4 text-sm text-on-surface-variant">{p.phone}</td>
                <td className="px-6 py-4"><span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm ${p.isVerified ? 'bg-primary-container/10 text-primary-container' : 'bg-gold/10 text-on-tertiary-container'}`}>{p.isVerified ? 'Verified' : 'Pending'}</span></td>
                <td className="px-6 py-4"><Link href={`/admin/patients/${p.id}`} className="px-3 py-1 bg-primary-container text-white text-xs font-semibold hover:bg-primary transition-colors">View</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-6 py-4 border-t border-outline-variant/20 flex justify-between items-center">
          <p className="font-mono text-xs text-on-surface-variant">Showing {filtered.length} of {patients.length} patients</p>
        </div>
      </div>
    </>
  );
}
