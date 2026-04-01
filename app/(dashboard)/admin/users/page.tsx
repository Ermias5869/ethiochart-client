'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try { const res = await api.getUsers(); setUsers(res.data); } catch {}
      setLoading(false);
    };
    load();
  }, []);

  const filtered = filter === 'all' ? users : users.filter((u) => u.role === filter);

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-headline font-bold text-primary">User Management</h2>
        <Link href="/admin/users/new" className="px-6 py-3 bg-primary text-white font-headline font-semibold text-sm hover:bg-primary-container">Add User</Link>
      </div>

      <div className="flex gap-2 mb-6">
        {[{ label: 'All', value: 'all' }, { label: 'Admins', value: 'hospital_admin' }, { label: 'Doctors', value: 'doctor' }].map((f) => (
          <button key={f.value} onClick={() => setFilter(f.value)} className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${filter === f.value ? 'bg-primary text-white' : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low shadow-sm'}`}>{f.label}</button>
        ))}
      </div>

      <div className="bg-surface-container-lowest shadow-sm">
        <table className="w-full">
          <thead><tr className="border-b border-outline-variant/20">
            <th className="text-left px-6 py-4 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">Name</th>
            <th className="text-left px-6 py-4 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">Email</th>
            <th className="text-left px-6 py-4 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">Phone</th>
            <th className="text-left px-6 py-4 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">Role</th>
            <th className="text-left px-6 py-4 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">Hospital</th>
          </tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={5} className="px-6 py-12 text-center"><div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" /></td></tr> :
            filtered.map((u, i) => (
              <tr key={u.id} className={`border-b border-outline-variant/10 ${i % 2 ? 'bg-surface-container-low/30' : ''}`}>
                <td className="px-6 py-4 text-sm font-semibold">{u.name}</td>
                <td className="px-6 py-4 text-sm text-on-surface-variant">{u.email}</td>
                <td className="px-6 py-4 text-sm text-on-surface-variant">{u.phone}</td>
                <td className="px-6 py-4"><span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm ${u.role === 'hospital_admin' ? 'bg-gold/10 text-on-tertiary-container' : 'bg-primary-container/10 text-primary-container'}`}>{u.role === 'hospital_admin' ? 'Admin' : 'Doctor'}</span></td>
                <td className="px-6 py-4 text-sm text-on-surface-variant">{u.hospital?.name || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-6 py-4 border-t border-outline-variant/20"><p className="font-mono text-xs text-on-surface-variant">{filtered.length} users</p></div>
      </div>
    </>
  );
}
