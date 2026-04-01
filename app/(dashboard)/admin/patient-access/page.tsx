'use client';

import { useState } from 'react';
import { api } from '@/lib/api';

export default function PatientAccessPage() {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ patientId: '', doctorId: '' });
  const [records] = useState([
    { id: 1, patientName: 'Abebe Tadesse', patientId: 'EC-M5K2XRPA', doctorName: 'Dr. Abebe Kebede', hospital: 'Addis Ababa General', grantedAt: '2023-10-24', status: 'active' },
    { id: 2, patientName: 'Selamawit Bekele', patientId: 'EC-L2S8ZTYV', doctorName: 'Dr. Meron Desta', hospital: 'St. Paul\'s Hospital', grantedAt: '2023-11-02', status: 'active' },
    { id: 3, patientName: 'Dawit Mengistu', patientId: 'EC-K7X3PRWD', doctorName: 'Dr. Abebe Kebede', hospital: 'Tikur Anbessa', grantedAt: '2023-09-15', status: 'revoked' },
  ]);

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-headline font-bold text-primary">Patient Access Control</h2>
          <p className="text-sm text-on-surface-variant mt-1">Manage which doctors can access patient records across hospitals</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-primary-container text-white px-6 py-3 font-headline font-semibold text-sm hover:bg-primary transition-colors shadow-lg"><span className="material-symbols-outlined text-lg">security</span>Grant Access</button>
      </div>
      <div className="bg-surface-container-lowest shadow-sm">
        <table className="w-full">
          <thead><tr className="border-b border-outline-variant/20">
            <th className="text-left px-6 py-4 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">Patient</th>
            <th className="text-left px-6 py-4 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">Doctor</th>
            <th className="text-left px-6 py-4 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">Granted</th>
            <th className="text-left px-6 py-4 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">Status</th>
            <th className="text-left px-6 py-4 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">Actions</th>
          </tr></thead>
          <tbody>
            {records.map((r, i) => (
              <tr key={r.id} className={`border-b border-outline-variant/10 ${i%2?'bg-surface-container-low/30':''}`}>
                <td className="px-6 py-4"><p className="text-sm font-semibold">{r.patientName}</p><p className="font-mono text-[10px] text-primary">{r.patientId}</p></td>
                <td className="px-6 py-4"><p className="text-sm">{r.doctorName}</p><p className="text-xs text-on-surface-variant">{r.hospital}</p></td>
                <td className="px-6 py-4 text-sm text-on-surface-variant">{r.grantedAt}</td>
                <td className="px-6 py-4"><span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm ${r.status === 'active' ? 'bg-primary-container/10 text-primary-container' : 'bg-error-container text-error'}`}>{r.status === 'active' ? '● Active' : '● Revoked'}</span></td>
                <td className="px-6 py-4">{r.status === 'active' && <button className="px-3 py-1 border border-error/30 text-error text-xs font-semibold hover:bg-error-container/50 transition-colors">Revoke</button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="bg-white p-8 shadow-2xl w-96" onClick={e => e.stopPropagation()}>
            <h3 className="font-headline font-bold text-primary mb-6">Grant Access</h3>
            <div className="space-y-4">
              <div><label className="block font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Patient ID</label><input type="number" className="w-full px-4 py-3 border border-outline-variant/30 focus:border-primary focus:ring-0" value={form.patientId} onChange={e => setForm({...form, patientId: e.target.value})} /></div>
              <div><label className="block font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Doctor ID</label><input type="number" className="w-full px-4 py-3 border border-outline-variant/30 focus:border-primary focus:ring-0" value={form.doctorId} onChange={e => setForm({...form, doctorId: e.target.value})} /></div>
              <div className="flex gap-4 pt-2"><button onClick={() => setShowModal(false)} className="flex-1 py-2 border border-outline-variant/30 font-semibold text-sm">Cancel</button><button className="flex-1 py-2 bg-primary-container text-white font-semibold text-sm">Grant</button></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
