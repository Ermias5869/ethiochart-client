'use client';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/auth';
import { api } from '@/lib/api';

export default function PatientBillsPage() {
  const { user } = useAuthStore();
  const [bills, setBills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try { const res = await api.getBills(user?.id || 0); setBills(res.data); } catch {}
      setLoading(false);
    };
    load();
  }, [user]);

  const totalPending = bills.filter((b) => b.status === 'pending').reduce((s, b) => s + b.amount, 0);
  const totalPaid = bills.filter((b) => b.status === 'paid').reduce((s, b) => s + b.amount, 0);

  return (
    <>
      <h2 className="text-2xl font-headline font-bold text-primary mb-2">My Bills</h2>
      <p className="text-sm text-on-surface-variant mb-8">View and manage your medical bills</p>
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-surface-container-lowest p-6 shadow-sm border-b-2 border-gold"><p className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">Pending Amount</p><h3 className="text-3xl font-headline font-bold text-on-tertiary-container">{loading ? '...' : Math.round(totalPending).toLocaleString()} <span className="text-sm font-normal">ETB</span></h3></div>
        <div className="bg-surface-container-lowest p-6 shadow-sm border-b-2 border-primary-container"><p className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">Total Paid</p><h3 className="text-3xl font-headline font-bold text-primary-container">{loading ? '...' : Math.round(totalPaid).toLocaleString()} <span className="text-sm font-normal">ETB</span></h3></div>
      </div>
      <div className="bg-surface-container-lowest shadow-sm">
        {loading ? <div className="flex justify-center py-12"><div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div> :
        bills.length === 0 ? <p className="text-center py-12 text-on-surface-variant text-sm">No bills found</p> :
        bills.map((b, i) => (
          <div key={b.id} className="flex items-center justify-between p-6 border-b border-outline-variant/10 hover:bg-surface-container-low/50 transition-colors">
            <div><p className="font-semibold text-sm">{b.description || 'Medical Service'}</p><p className="text-xs text-on-surface-variant">{new Date(b.createdAt).toLocaleDateString()}</p></div>
            <div className="flex items-center gap-4">
              <p className="font-headline font-bold text-primary">{Math.round(b.amount).toLocaleString()} ETB</p>
              <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm ${b.status === 'paid' ? 'bg-primary-container/10 text-primary-container' : 'bg-gold/10 text-on-tertiary-container'}`}>{b.status}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
