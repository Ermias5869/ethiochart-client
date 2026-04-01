'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';

export default function PatientDetailPage() {
  const params = useParams();
  const [patient, setPatient] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('appointments');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.getPatient(Number(params.id));
        setPatient(res.data);
      } catch {}
      setLoading(false);
    };
    load();
  }, [params.id]);

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  if (!patient) return <div className="text-center py-20 text-on-surface-variant">Patient not found</div>;

  const tabs = ['Appointments', 'Billing', 'Medical Conditions', 'Messages', 'Video Sessions', 'Access Log'];

  return (
    <>
      <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-tighter mb-4">
        Patients &gt; <span className="font-bold text-primary">{patient.name || patient.email?.split('@')[0]}</span>
      </p>

      {/* Patient Header */}
      <div className="bg-surface-container-lowest p-8 shadow-sm mb-8">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-primary-container flex items-center justify-center text-white text-2xl font-bold font-headline">
              {(patient.name || patient.email || 'P').charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-headline font-bold text-primary mb-1">{patient.name || patient.email?.split('@')[0]}</h2>
              <p className="font-mono text-sm text-primary-container font-medium mb-2">{patient.ethioChartId}</p>
              <div className="flex gap-6 text-sm text-on-surface-variant">
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">mail</span> {patient.email}</span>
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">phone</span> {patient.phone}</span>
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">domain</span> {patient.hospital?.name || 'N/A'}</span>
              </div>
              <div className="flex gap-4 mt-2 text-xs text-on-surface-variant">
                <span>National ID: <span className="font-mono">{patient.nationalId?.replace(/.(?=.{4})/g, '*')}</span></span>
                <span>Registered: {new Date(patient.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${patient.isVerified ? 'bg-primary-container/10 text-primary-container' : 'bg-tertiary-fixed/30 text-on-tertiary-container'}`}>
              {patient.isVerified ? '✓ Verified' : 'Pending'}
            </span>
            <button className="px-4 py-2 border border-outline-variant/30 text-xs font-semibold text-on-surface-variant hover:bg-surface-container transition-colors">Edit</button>
            <button className="px-4 py-2 border border-error/30 text-xs font-semibold text-error hover:bg-error-container/50 transition-colors">Delete</button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-outline-variant/30 mb-8">
        <div className="flex gap-0">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase().replace(' ', '-'))}
              className={`px-6 py-3 font-headline font-medium text-sm transition-colors ${
                activeTab === tab.toLowerCase().replace(' ', '-')
                  ? 'text-primary border-b-2 border-gold'
                  : 'text-outline hover:text-primary'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content placeholder */}
      <div className="bg-surface-container-lowest p-8 shadow-sm">
        <p className="text-center text-on-surface-variant font-mono text-xs uppercase tracking-wider">
          {activeTab.replace('-', ' ')} data will load here from the API
        </p>
      </div>
    </>
  );
}
