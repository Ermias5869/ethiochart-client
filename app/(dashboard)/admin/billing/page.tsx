'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function BillingPage() {
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

  const filtered = filter === 'all' ? bills : bills.filter(b => filter === 'paid' ? b.isPaid : !b.isPaid);
  const totalPending = bills.filter(b => !b.isPaid).reduce((sum, b) => sum + b.amount, 0);
  const totalPaid = bills.filter(b => b.isPaid).reduce((sum, b) => sum + b.amount, 0);

  const markPaid = async (id: number) => {
    try { await api.markBillPaid(id); setBills(bills.map(b => b.id === id ? {...b, isPaid: true, paidAt: new Date().toISOString()} : b)); } catch {}
  };

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-headline font-bold text-primary">Billing & Payments</h2>
        <Link href="/admin/billing/new" className="flex items-center gap-2 bg-primary-container text-white px-6 py-3 font-headline font-semibold text-sm hover:bg-primary transition-colors shadow-lg">
          <span className="material-symbols-outlined text-lg">receipt_long</span>Create Bill
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-surface-container-lowest p-6 shadow-sm"><p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest mb-2">Total Bills</p><h3 className="text-2xl font-headline font-bold text-primary">{bills.length}</h3></div>
        <div className="bg-surface-container-lowest p-6 shadow-sm border-b-2 border-gold"><p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest mb-2">Pending Amount</p><h3 className="text-2xl font-headline font-bold text-on-tertiary-container">{totalPending.toLocaleString()} ETB</h3></div>
        <div className="bg-surface-container-lowest p-6 shadow-sm border-b-2 border-primary-container"><p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest mb-2">Collected</p><h3 className="text-2xl font-headline font-bold text-primary-container">{totalPaid.toLocaleString()} ETB</h3></div>
      </div>

      <div className="flex gap-0 mb-6 border-b border-outline-variant/30">
        {['all', 'pending', 'paid'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-6 py-3 font-headline font-medium text-sm capitalize transition-colors ${filter === f ? 'text-primary border-b-2 border-gold' : 'text-outline hover:text-primary'}`}>{f}</button>
        ))}
      </div>

      <div className="bg-surface-container-lowest shadow-sm">
        <table className="w-full">
          <thead><tr className="border-b border-outline-variant/20">
            <th className="text-left px-6 py-4 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">Patient</th>
            <th className="text-right px-6 py-4 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">Amount</th>
            <th className="text-left px-6 py-4 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">Description</th>
            <th className="text-left px-6 py-4 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">Status</th>
            <th className="text-left px-6 py-4 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">Created</th>
            <th className="text-left px-6 py-4 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">Actions</th>
          </tr></thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-6 py-12 text-center"><div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" /></td></tr>
            ) : filtered.map((b, i) => (
              <tr key={b.id} className={`border-b border-outline-variant/10 hover:bg-surface-container-low/50 ${i%2?'bg-surface-container-low/30':''}`}>
                <td className="px-6 py-4 text-sm font-semibold">{b.patient?.name || b.patient?.email?.split('@')[0] || 'N/A'}</td>
                <td className="px-6 py-4 text-sm font-headline font-bold text-right">{b.amount?.toLocaleString()} ETB</td>
                <td className="px-6 py-4 text-sm text-on-surface-variant">{b.description}</td>
                <td className="px-6 py-4"><span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm ${b.isPaid ? 'bg-primary-container/10 text-primary-container' : 'bg-tertiary-fixed/30 text-on-tertiary-container'}`}>{b.isPaid ? 'Paid' : 'Pending'}</span></td>
                <td className="px-6 py-4 text-sm text-on-surface-variant">{new Date(b.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4">{!b.isPaid && <button onClick={() => markPaid(b.id)} className="px-3 py-1 bg-primary-container text-white text-xs font-semibold hover:bg-primary transition-colors">Mark Paid</button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
