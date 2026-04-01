'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function PatientsListPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.getPatients();
        setPatients(res.data);
      } catch {}
      setLoading(false);
    };
    load();
  }, []);

  const filtered = patients.filter(
    (p) =>
      (p.name || p.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.ethioChartId || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.nationalId || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-tighter mb-1">
            Registry &gt; <span className="font-bold text-primary">Patients</span>
          </p>
          <h2 className="text-2xl font-headline font-bold text-primary">Patient Ledger</h2>
        </div>
        <Link
          href="/admin/patients/register"
          className="flex items-center gap-2 bg-primary-container text-white px-6 py-3 font-headline font-semibold text-sm hover:bg-primary transition-colors shadow-lg"
        >
          <span className="material-symbols-outlined text-lg">person_add</span>
          Register New Patient
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="flex gap-4 mb-8">
        <div className="flex-1 relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
          <input
            type="text"
            placeholder="Search by name, EthioChart ID, or National ID"
            className="w-full pl-10 pr-4 py-3 bg-surface-container-lowest border border-outline-variant/30 focus:border-primary focus:ring-0 text-sm font-body"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select className="px-4 py-3 bg-surface-container-lowest border border-outline-variant/30 font-mono text-xs uppercase tracking-wider text-on-surface-variant focus:ring-0">
          <option>Hospital</option>
        </select>
        <select className="px-4 py-3 bg-surface-container-lowest border border-outline-variant/30 font-mono text-xs uppercase tracking-wider text-on-surface-variant focus:ring-0">
          <option>Status</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-surface-container-lowest shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-primary-container text-white">
              <th className="text-left px-6 py-4 font-mono text-[10px] uppercase tracking-widest">EthioChart ID</th>
              <th className="text-left px-6 py-4 font-mono text-[10px] uppercase tracking-widest">Name</th>
              <th className="text-left px-6 py-4 font-mono text-[10px] uppercase tracking-widest">Email</th>
              <th className="text-left px-6 py-4 font-mono text-[10px] uppercase tracking-widest">Phone</th>
              <th className="text-left px-6 py-4 font-mono text-[10px] uppercase tracking-widest">Hospital</th>
              <th className="text-left px-6 py-4 font-mono text-[10px] uppercase tracking-widest">Registered</th>
              <th className="text-left px-6 py-4 font-mono text-[10px] uppercase tracking-widest">Status</th>
              <th className="text-left px-6 py-4 font-mono text-[10px] uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <span className="font-mono text-xs text-on-surface-variant">Loading records...</span>
                  </div>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-on-surface-variant font-mono text-xs">
                  No patients found
                </td>
              </tr>
            ) : (
              filtered.map((p, i) => (
                <tr key={p.id} className={`border-b border-outline-variant/10 hover:bg-surface-container-low/50 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-surface-container-low/30'}`}>
                  <td className="px-6 py-4 font-mono text-sm text-primary font-medium">{p.ethioChartId || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-on-surface">{p.name || p.email?.split('@')[0]}</td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">{p.email}</td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant font-mono">{p.phone}</td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">{p.hospital?.name || '—'}</td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">
                    {new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm ${
                      p.isVerified
                        ? 'bg-primary-container/10 text-primary-container'
                        : 'bg-tertiary-fixed/30 text-on-tertiary-container'
                    }`}>
                      {p.isVerified ? 'Verified' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/patients/${p.id}`} className="text-outline hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-lg">visibility</span>
                      </Link>
                      <button className="text-outline hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-lg">more_vert</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-between items-center px-6 py-4 border-t border-outline-variant/20">
          <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">
            Showing <span className="font-bold text-primary">1-{filtered.length}</span> of <span className="font-bold text-primary">{patients.length}</span> patients
          </p>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 flex items-center justify-center text-outline hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            <button className="w-8 h-8 flex items-center justify-center bg-primary-container text-white text-xs font-bold">1</button>
            <button className="w-8 h-8 flex items-center justify-center text-on-surface-variant text-xs hover:bg-surface-container transition-colors">2</button>
            <button className="w-8 h-8 flex items-center justify-center text-on-surface-variant text-xs hover:bg-surface-container transition-colors">3</button>
            <button className="w-8 h-8 flex items-center justify-center text-outline hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-8 pt-4 border-t border-outline-variant/20">
        <div className="flex gap-8">
          <div>
            <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">Record Integrity</p>
            <p className="font-headline font-bold text-sm text-primary">100% Secure</p>
          </div>
          <div>
            <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">Active Nodes</p>
            <p className="font-headline font-bold text-sm text-primary">42 Hospitals</p>
          </div>
        </div>
        <p className="text-[10px] text-on-surface-variant italic">
          All patient data is encrypted and managed under the National Sovereign Ledger protocols.
        </p>
      </div>
    </>
  );
}
