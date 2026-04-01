'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function AddUserPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', role: 'hospital_admin', hospitalId: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.createUser(form);
      router.push('/admin/users');
    } catch (err: any) {
      setError(err.message || 'Failed to create user');
    }
    setLoading(false);
  };

  return (
    <>
      <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-tighter mb-4">Users &gt; <span className="font-bold text-primary">Add New User</span></p>
      <div className="max-w-lg mx-auto bg-surface-container-lowest p-8 shadow-sm">
        <h2 className="text-xl font-headline font-bold text-primary mb-6">Add New User</h2>
        {error && <div className="mb-4 p-3 bg-error-container text-error text-sm rounded flex items-center gap-2"><span className="material-symbols-outlined text-sm">error</span>{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Full Name</label>
            <input type="text" className="w-full px-4 py-3 border border-outline-variant/30 focus:border-primary focus:ring-0" required value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} />
          </div>
          <div>
            <label className="block font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Email</label>
            <input type="email" className="w-full px-4 py-3 border border-outline-variant/30 focus:border-primary focus:ring-0" required value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} />
          </div>
          <div>
            <label className="block font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Phone</label>
            <input type="tel" className="w-full px-4 py-3 border border-outline-variant/30 focus:border-primary focus:ring-0" required value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} />
          </div>
          <div>
            <label className="block font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Password</label>
            <input type="password" className="w-full px-4 py-3 border border-outline-variant/30 focus:border-primary focus:ring-0" required value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} />
          </div>
          <div>
            <label className="block font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Role</label>
            <select className="w-full px-4 py-3 border border-outline-variant/30 focus:border-primary focus:ring-0" value={form.role} onChange={(e) => setForm({...form, role: e.target.value})}>
              <option value="hospital_admin">Hospital Admin</option>
              <option value="doctor">Doctor</option>
            </select>
          </div>
          {form.role === 'doctor' && (
            <div className="p-3 bg-surface-container-low border-l-4 border-gold flex items-start gap-2">
              <span className="material-symbols-outlined text-sm text-gold mt-0.5">info</span>
              <span className="text-xs text-on-surface-variant">Selecting &apos;Doctor&apos; will automatically create a linked Doctor profile in the system</span>
            </div>
          )}
          <div className="flex gap-4 pt-4">
            <button type="button" onClick={() => router.back()} className="flex-1 px-6 py-3 border border-outline-variant/30 text-on-surface-variant font-headline font-semibold hover:bg-surface-container transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 px-6 py-3 bg-primary-container text-white font-headline font-semibold hover:bg-primary transition-colors disabled:opacity-50">
              {loading ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
