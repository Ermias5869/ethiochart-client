'use client';
import { useState } from 'react';
import Link from 'next/link';
export default function DoctorPatientDetailPage() {
  const [tab, setTab] = useState('medical-history');
  return (
    <>
      <div className="bg-surface-container-lowest p-6 shadow-sm mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary-container flex items-center justify-center text-white text-lg font-bold">A</div>
          <div><h3 className="font-headline font-bold text-primary text-lg">Abebe Tadesse</h3><p className="font-mono text-xs text-primary-container">EC-M5K2XRPA-A1B2C3</p><p className="text-xs text-on-surface-variant mt-1">Email: abebe@email.com • Phone: +251 911 112 233</p></div>
        </div>
        <Link href="/doctor/ai-assistant" className="flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/30 text-on-tertiary-container text-xs font-bold hover:bg-gold/20 transition-colors"><span className="material-symbols-outlined text-sm">smart_toy</span>Ask AI</Link>
      </div>
      <div className="border-b border-outline-variant/30 mb-6 flex gap-0">
        {['Medical History', 'Appointments', 'Prescriptions', 'Lab Results'].map(t => (
          <button key={t} onClick={() => setTab(t.toLowerCase().replace(' ','-'))} className={`px-6 py-3 font-headline font-medium text-sm ${tab === t.toLowerCase().replace(' ','-') ? 'text-primary border-b-2 border-gold' : 'text-outline hover:text-primary'}`}>{t}</button>
        ))}
      </div>
      <div className="bg-surface-container-lowest p-6 shadow-sm">
        {tab === 'medical-history' && (
          <div className="space-y-4">
            {[{name:'Hypertension',severity:'Moderate',color:'bg-gold/10 text-on-tertiary-container'},{name:'Type 2 Diabetes',severity:'Mild',color:'bg-primary-container/10 text-primary-container'},{name:'Chronic Back Pain',severity:'Severe',color:'bg-error-container text-error'}].map(c => (
              <div key={c.name} className="p-4 border border-outline-variant/20 flex justify-between items-center">
                <div><p className="font-semibold">{c.name}</p><p className="text-xs text-on-surface-variant">Diagnosed: 2022</p></div>
                <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${c.color}`}>{c.severity}</span>
              </div>
            ))}
          </div>
        )}
        {tab !== 'medical-history' && <p className="text-center text-on-surface-variant font-mono text-xs uppercase tracking-wider py-8">{tab.replace('-',' ')} will load from API</p>}
      </div>
    </>
  );
}
