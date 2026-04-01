'use client';
const results = [
  { test: 'Complete Blood Count', date: 'Oct 20, 2023', doctor: 'Dr. Kebede', result: 'Normal', status: 'reviewed' },
  { test: 'Hemoglobin A1c', date: 'Oct 15, 2023', doctor: 'Dr. Kebede', result: '6.2%', status: 'reviewed' },
  { test: 'Metabolic Panel', date: 'Oct 10, 2023', doctor: 'Dr. Desta', result: 'See Details', status: 'pending_review' },
];
export default function PatientLabResultsPage() {
  return (
    <>
      <h2 className="text-2xl font-headline font-bold text-primary mb-8">My Lab Results</h2>
      <div className="bg-surface-container-lowest shadow-sm">
        <table className="w-full">
          <thead><tr className="border-b border-outline-variant/20">
            <th className="text-left px-6 py-4 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">Test</th>
            <th className="text-left px-6 py-4 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">Date</th>
            <th className="text-left px-6 py-4 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">Doctor</th>
            <th className="text-left px-6 py-4 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">Result</th>
            <th className="text-left px-6 py-4 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">Status</th>
          </tr></thead>
          <tbody>{results.map((r,i) => (
            <tr key={i} className={`border-b border-outline-variant/10 ${i%2?'bg-surface-container-low/30':''}`}>
              <td className="px-6 py-4 text-sm font-semibold">{r.test}</td>
              <td className="px-6 py-4 text-sm text-on-surface-variant">{r.date}</td>
              <td className="px-6 py-4 text-sm text-on-surface-variant">{r.doctor}</td>
              <td className="px-6 py-4 text-sm font-mono">{r.result}</td>
              <td className="px-6 py-4"><span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm ${r.status==='reviewed'?'bg-primary-container/10 text-primary-container':'bg-gold/10 text-on-tertiary-container'}`}>{r.status.replace('_',' ')}</span></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </>
  );
}
