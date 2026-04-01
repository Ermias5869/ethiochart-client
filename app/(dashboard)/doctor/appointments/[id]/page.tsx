'use client';
import { useState } from 'react';
export default function AppointmentDetailPage() {
  const [tab, setTab] = useState('prescriptions');
  const [med, setMed] = useState({ medication: '', dosage: '', duration: '' });
  return (
    <>
      <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-tighter mb-4">Appointments &gt; <span className="font-bold text-primary">Appointment Detail</span></p>
      <div className="bg-surface-container-lowest p-6 shadow-sm mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary-container flex items-center justify-center text-white text-lg font-bold">A</div>
          <div><h3 className="font-headline font-bold text-primary text-lg">Abebe Tadesse</h3><p className="font-mono text-xs text-primary-container">EC-M5K2XRPA</p><p className="text-xs text-on-surface-variant mt-1">Oct 24, 2023 • 09:00 AM</p></div>
        </div>
        <div className="flex gap-2"><button className="px-4 py-2 bg-primary-container text-white text-xs font-semibold">Mark Complete</button><button className="px-4 py-2 border border-error text-error text-xs font-semibold">Cancel</button></div>
      </div>
      <div className="border-b border-outline-variant/30 mb-6 flex gap-0">
        {['Prescriptions', 'Lab Results', 'Notes'].map(t => (
          <button key={t} onClick={() => setTab(t.toLowerCase().replace(' ','-'))} className={`px-6 py-3 font-headline font-medium text-sm ${tab === t.toLowerCase().replace(' ','-') ? 'text-primary border-b-2 border-gold' : 'text-outline hover:text-primary'}`}>{t}</button>
        ))}
      </div>
      {tab === 'prescriptions' && (
        <div className="bg-surface-container-lowest p-6 shadow-sm">
          <h4 className="font-headline font-semibold text-primary mb-4">Add Prescription</h4>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <input placeholder="Medication" className="px-4 py-3 border border-outline-variant/30 focus:border-primary focus:ring-0 text-sm" value={med.medication} onChange={e => setMed({...med, medication: e.target.value})} />
            <input placeholder="Dosage (e.g., 500mg)" className="px-4 py-3 border border-outline-variant/30 focus:border-primary focus:ring-0 text-sm" value={med.dosage} onChange={e => setMed({...med, dosage: e.target.value})} />
            <input placeholder="Duration (e.g., 7 days)" className="px-4 py-3 border border-outline-variant/30 focus:border-primary focus:ring-0 text-sm" value={med.duration} onChange={e => setMed({...med, duration: e.target.value})} />
          </div>
          <button className="px-6 py-2 bg-primary-container text-white text-sm font-semibold hover:bg-primary transition-colors">Add Prescription</button>
        </div>
      )}
      {tab === 'lab-results' && <div className="bg-surface-container-lowest p-6 shadow-sm"><p className="text-center text-on-surface-variant font-mono text-xs">Lab results for this appointment</p></div>}
      {tab === 'notes' && <div className="bg-surface-container-lowest p-6 shadow-sm"><textarea className="w-full h-40 px-4 py-3 border border-outline-variant/30 focus:border-primary focus:ring-0 text-sm" placeholder="Enter clinical notes..." /></div>}
    </>
  );
}
