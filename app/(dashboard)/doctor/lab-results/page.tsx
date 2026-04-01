'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function DoctorLabResultsPage() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.getAppointments();
        const allLabs: any[] = [];
        res.data.forEach((a: any) => {
          if (a.labResults) {
            a.labResults.forEach((lab: any) => allLabs.push({
              ...lab,
              patientName: a.patient?.email?.split('@')[0]?.replace('.', ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()) || 'Patient',
              date: new Date(lab.recordedAt).toLocaleDateString(),
            }));
          }
        });
        setResults(allLabs);
      } catch {}
      setLoading(false);
    };
    load();
  }, []);

  return (
    <>
      <h2 className="text-2xl font-headline font-bold text-primary mb-8">Lab Results</h2>
      <div className="bg-surface-container-lowest shadow-sm">
        <table className="w-full">
          <thead><tr className="border-b border-outline-variant/20">
            <th className="text-left px-6 py-4 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">Patient</th>
            <th className="text-left px-6 py-4 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">Test</th>
            <th className="text-left px-6 py-4 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">Result</th>
            <th className="text-left px-6 py-4 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">Date</th>
          </tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={4} className="px-6 py-12 text-center"><div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" /></td></tr> :
            results.length === 0 ? <tr><td colSpan={4} className="px-6 py-12 text-center text-on-surface-variant text-sm">No lab results found</td></tr> :
            results.map((r, i) => (
              <tr key={i} className={`border-b border-outline-variant/10 ${i % 2 ? 'bg-surface-container-low/30' : ''}`}>
                <td className="px-6 py-4 text-sm font-semibold">{r.patientName}</td>
                <td className="px-6 py-4 text-sm">{r.type}</td>
                <td className="px-6 py-4 text-sm font-mono text-xs">{r.result}</td>
                <td className="px-6 py-4 text-sm text-on-surface-variant">{r.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
