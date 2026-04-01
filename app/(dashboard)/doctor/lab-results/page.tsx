'use client';
const results = [
  { patient: 'Abebe Tadesse', test: 'Complete Blood Count', date: 'Oct 24, 2023', status: 'ready' },
  { patient: 'Mulugeta Seraw', test: 'Metabolic Panel', date: 'Oct 23, 2023', status: 'pending' },
  { patient: 'Tsedey Wolde', test: 'Hemoglobin A1c', date: 'Oct 22, 2023', status: 'ready' },
  { patient: 'Martha Kassaye', test: 'Lipid Panel', date: 'Oct 20, 2023', status: 'reviewed' },
];
export default function DoctorLabResultsPage() {
  const sc = (s:string) => s==='ready'?'bg-gold/10 text-on-tertiary-container':s==='pending'?'bg-error-container text-error':'bg-primary-container/10 text-primary-container';
  return (
    <>
      <h2 className="text-2xl font-headline font-bold text-primary mb-8">Lab Results</h2>
      <div className="bg-surface-container-lowest shadow-sm">
        <table className="w-full">
          <thead><tr className="border-b border-outline-variant/20">
            <th className="text-left px-6 py-4 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">Patient</th>
            <th className="text-left px-6 py-4 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">Test</th>
            <th className="text-left px-6 py-4 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">Date</th>
            <th className="text-left px-6 py-4 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">Status</th>
            <th className="text-left px-6 py-4 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">Actions</th>
          </tr></thead>
          <tbody>{results.map((r,i) => (
            <tr key={i} className={`border-b border-outline-variant/10 ${i%2?'bg-surface-container-low/30':''}`}>
              <td className="px-6 py-4 text-sm font-semibold">{r.patient}</td>
              <td className="px-6 py-4 text-sm">{r.test}</td>
              <td className="px-6 py-4 text-sm text-on-surface-variant">{r.date}</td>
              <td className="px-6 py-4"><span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm ${sc(r.status)}`}>{r.status}</span></td>
              <td className="px-6 py-4"><button className="px-3 py-1 bg-primary-container text-white text-xs font-semibold">Review</button></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </>
  );
}
