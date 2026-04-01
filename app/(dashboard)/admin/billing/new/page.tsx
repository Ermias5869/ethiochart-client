'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function CreateBillPage() {
  const router = useRouter();
  const [form, setForm] = useState({ patientId: '', amount: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.createBill({ patientId: Number(form.patientId), amount: parseFloat(form.amount), description: form.description });
      router.push('/admin/billing');
    } catch (err: any) { setError(err.message); }
    setLoading(false);
  };

  return (
    <>
      <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-tighter mb-4">Billing &gt; <span className="font-bold text-primary">Create Bill</span></p>
      <div className="max-w-lg mx-auto bg-surface-container-lowest p-8 shadow-sm">
        <h2 className="text-xl font-headline font-bold text-primary mb-6">Create Bill</h2>
        {error && <div className="mb-4 p-3 bg-error-container text-error text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div><label className="block font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Patient ID</label><input type="number" className="w-full px-4 py-3 border border-outline-variant/30 focus:border-primary focus:ring-0" required value={form.patientId} onChange={e => setForm({...form, patientId: e.target.value})} /></div>
          <div><label className="block font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Amount (ETB)</label><input type="number" step="0.01" className="w-full px-4 py-3 border border-outline-variant/30 focus:border-primary focus:ring-0 text-2xl font-headline font-bold" required value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} /></div>
          <div><label className="block font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Description</label><textarea className="w-full px-4 py-3 border border-outline-variant/30 focus:border-primary focus:ring-0 h-24" required value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
          <div className="flex gap-4 pt-4">
            <button type="button" onClick={() => router.back()} className="flex-1 py-3 border border-outline-variant/30 font-headline font-semibold text-on-surface-variant">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 py-3 bg-primary-container text-white font-headline font-semibold hover:bg-primary disabled:opacity-50">{loading ? 'Creating...' : 'Create Bill'}</button>
          </div>
        </form>
      </div>
    </>
  );
}
