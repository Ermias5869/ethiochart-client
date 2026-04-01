'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';

export default function AdminBillingPage() {
  const [bills, setBills] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try { const res = await api.getBills(0); setBills(res.data); } catch {}
      setLoading(false);
    };
    load();
  }, []);

  const filtered = filter === 'all' ? bills : bills.filter((b) => b.status === filter);
  const totalPaid = bills.filter((b) => b.status === 'paid').reduce((s, b) => s + b.amount, 0);
  const totalPending = bills.filter((b) => b.status === 'pending').reduce((s, b) => s + b.amount, 0);

  const markPaid = async (id: number) => {
    try {
      await api.patch(`/billing/${id}`, { status: 'paid', paidAt: new Date().toISOString() });
      setBills((prev) => prev.map((b) => b.id === id ? { ...b, status: 'paid', paidAt: new Date() } : b));
    } catch {}
  };

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-headline font-bold text-primary">Billing & Payments</h2>
        <Link href="/admin/billing/new" className="px-6 py-3 bg-primary text-white font-headline font-semibold text-sm hover:bg-primary-container">Create Bill</Link>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-surface-container-lowest p-6 shadow-sm border-b-2 border-primary-container"><p className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">Total Revenue</p><h3 className="text-3xl font-headline font-bold text-primary">{(totalPaid + totalPending).toLocaleString()} <span className="text-sm font-normal">ETB</span></h3></div>
        <div className="bg-surface-container-lowest p-6 shadow-sm border-b-2 border-primary-fixed-dim"><p className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">Collected</p><h3 className="text-3xl font-headline font-bold text-primary-container">{totalPaid.toLocaleString()} <span className="text-sm font-normal">ETB</span></h3></div>
        <div className="bg-surface-container-lowest p-6 shadow-sm border-b-2 border-gold"><p className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">Outstanding</p><h3 className="text-3xl font-headline font-bold text-on-tertiary-container">{totalPending.toLocaleString()} <span className="text-sm font-normal">ETB</span></h3></div>
      </div>

      <div className="flex gap-2 mb-6">
        {['all', 'paid', 'pending'].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${filter === f ? 'bg-primary text-white' : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low shadow-sm'}`}>{f}</button>
        ))}
      </div>

      <div className="bg-surface-container-lowest shadow-sm">
        {loading ? <div className="flex justify-center py-12"><div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div> :
        filtered.map((b, i) => (
          <div key={b.id} className={`flex items-center justify-between p-6 border-b border-outline-variant/10 ${i % 2 ? 'bg-surface-container-low/30' : ''}`}>
            <div><p className="font-semibold text-sm">{b.description || 'Medical Service'}</p><p className="text-xs text-on-surface-variant">{new Date(b.createdAt).toLocaleDateString()}</p></div>
            <div className="flex items-center gap-4">
              <p className="font-headline font-bold text-primary">{b.amount.toLocaleString()} ETB</p>
              <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm ${b.status === 'paid' ? 'bg-primary-container/10 text-primary-container' : 'bg-gold/10 text-on-tertiary-container'}`}>{b.status}</span>
              {b.status === 'pending' && <button onClick={() => markPaid(b.id)} className="px-3 py-1 bg-primary-container text-white text-xs font-semibold hover:bg-primary">Mark Paid</button>}
            </div>
          </div>
        ))}
        <div className="px-6 py-4 border-t border-outline-variant/20"><p className="font-mono text-xs text-on-surface-variant">{filtered.length} of {bills.length} records</p></div>
      </div>
    </>
  );
}
