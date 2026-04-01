'use client';
import Link from 'next/link';
const patients = [
  { initials: 'MK', name: 'Martha Kassaye', id: 'ETH-8827-F', visits: 12 },
  { initials: 'TA', name: 'Tamrat Ayele', id: 'ETH-1129-M', visits: 8 },
  { initials: 'ZA', name: 'Zenebech Alemu', id: 'ETH-3345-F', visits: 5 },
  { initials: 'HG', name: 'Hirut Gebre', id: 'ETH-7721-F', visits: 15 },
  { initials: 'SD', name: 'Solomon Desta', id: 'ETH-2211-M', visits: 3 },
  { initials: 'AT', name: 'Abebe Tadesse', id: 'ETH-4421-M', visits: 20 },
];
export default function DoctorPatientsPage() {
  return (
    <>
      <h2 className="text-2xl font-headline font-bold text-primary mb-2">My Patients</h2>
      <p className="text-sm text-on-surface-variant mb-8">Patients you have access to view and treat</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {patients.map(p => (
          <div key={p.id} className="bg-surface-container-lowest p-6 shadow-sm border-l-4 border-primary-container hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center text-white font-bold text-sm">{p.initials}</div>
              <div><h3 className="font-semibold text-primary">{p.name}</h3><p className="font-mono text-[10px] text-primary-container">{p.id}</p></div>
            </div>
            <p className="text-xs text-on-surface-variant mb-4">{p.visits} appointments</p>
            <Link href={`/doctor/patients/${p.id}`} className="block text-center py-2 border border-primary-container text-primary-container text-xs font-semibold hover:bg-primary-container/5 transition-colors">View History</Link>
          </div>
        ))}
      </div>
    </>
  );
}
