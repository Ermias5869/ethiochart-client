'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function UsersListPage() {
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

  const filtered = filter === 'all' ? users : users.filter((u) => filter === 'admins' ? u.role === 'hospital_admin' : u.role === 'doctor');

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-headline font-bold text-primary">User Management</h2>
        <Link href="/admin/users/new" className="flex items-center gap-2 bg-primary-container text-white px-6 py-3 font-headline font-semibold text-sm hover:bg-primary transition-colors shadow-lg">
          <span className="material-symbols-outlined text-lg">person_add</span>
          Add New User
        </Link>
      </div>

      <div className="flex gap-0 mb-8 border-b border-outline-variant/30">
        {[['all', `All (${users.length})`], ['admins', `Admins (${users.filter(u => u.role === 'hospital_admin').length})`], ['doctors', `Doctors (${users.filter(u => u.role === 'doctor').length})`]].map(([key, label]) => (
          <button key={key} onClick={() => setFilter(key)} className={`px-6 py-3 font-headline font-medium text-sm transition-colors ${filter === key ? 'text-primary border-b-2 border-gold' : 'text-outline hover:text-primary'}`}>
            {label}
          </button>
        ))}
      </div>

      <div className="bg-surface-container-lowest shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-outline-variant/20">
              <th className="text-left px-6 py-4 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">Name</th>
              <th className="text-left px-6 py-4 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">Email</th>
              <th className="text-left px-6 py-4 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">Phone</th>
              <th className="text-left px-6 py-4 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">Role</th>
              <th className="text-left px-6 py-4 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="px-6 py-12 text-center"><div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" /></td></tr>
            ) : filtered.map((u, i) => (
              <tr key={u.id} className={`border-b border-outline-variant/10 hover:bg-surface-container-low/50 ${i % 2 === 0 ? '' : 'bg-surface-container-low/30'}`}>
                <td className="px-6 py-4 text-sm font-semibold text-on-surface">{u.name}</td>
                <td className="px-6 py-4 text-sm text-on-surface-variant">{u.email}</td>
                <td className="px-6 py-4 text-sm text-on-surface-variant font-mono">{u.phone}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm ${u.role === 'hospital_admin' ? 'bg-primary-container/10 text-primary-container' : 'bg-secondary-container/50 text-secondary'}`}>
                    {u.role === 'hospital_admin' ? 'Admin' : 'Doctor'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button className="text-outline hover:text-primary"><span className="material-symbols-outlined text-lg">edit</span></button>
                    <button className="text-outline hover:text-error"><span className="material-symbols-outlined text-lg">delete</span></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
