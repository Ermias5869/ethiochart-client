'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/auth';

export default function CreateAppointmentPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [form, setForm] = useState({ patientId: '', doctorId: '', dateTime: '', notes: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.createAppointment({ ...form, patientId: Number(form.patientId), doctorId: Number(form.doctorId), hospitalId: user?.hospitalId });
      router.push('/admin/appointments');
    } catch (err: any) { setError(err.message); }
    setLoading(false);
  };

  return (
    <>
      <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-tighter mb-4">Appointments &gt; <span className="font-bold text-primary">New Appointment</span></p>
      <div className="max-w-lg mx-auto bg-surface-container-lowest p-8 shadow-sm">
        <h2 className="text-xl font-headline font-bold text-primary mb-6">Create Appointment</h2>
        {error && <div className="mb-4 p-3 bg-error-container text-error text-sm rounded">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div><label className="block font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Patient ID</label><input type="number" className="w-full px-4 py-3 border border-outline-variant/30 focus:border-primary focus:ring-0" required value={form.patientId} onChange={(e) => setForm({...form, patientId: e.target.value})} /></div>
          <div><label className="block font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Doctor ID</label><input type="number" className="w-full px-4 py-3 border border-outline-variant/30 focus:border-primary focus:ring-0" required value={form.doctorId} onChange={(e) => setForm({...form, doctorId: e.target.value})} /></div>
          <div><label className="block font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Date & Time</label><input type="datetime-local" className="w-full px-4 py-3 border border-outline-variant/30 focus:border-primary focus:ring-0" required value={form.dateTime} onChange={(e) => setForm({...form, dateTime: e.target.value})} /></div>
          <div><label className="block font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Notes</label><textarea className="w-full px-4 py-3 border border-outline-variant/30 focus:border-primary focus:ring-0 h-24" value={form.notes} onChange={(e) => setForm({...form, notes: e.target.value})} /></div>
          <div className="flex gap-4 pt-4">
            <button type="button" onClick={() => router.back()} className="flex-1 py-3 border border-outline-variant/30 font-headline font-semibold text-on-surface-variant hover:bg-surface-container transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 py-3 bg-primary-container text-white font-headline font-semibold hover:bg-primary transition-colors disabled:opacity-50">{loading ? 'Creating...' : 'Schedule Appointment'}</button>
          </div>
        </form>
      </div>
    </>
  );
}
