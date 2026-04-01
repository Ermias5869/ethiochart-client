'use client';
const rxs = [
  { name: 'Amoxicillin', dosage: '500mg', freq: '3 times daily', doctor: 'Dr. Kebede', badge: '7 DAYS LEFT', color: 'bg-primary-container/10 text-primary-container' },
  { name: 'Metformin', dosage: '850mg', freq: 'Once daily', doctor: 'Dr. Kebede', badge: 'CHRONIC', color: 'bg-gold/10 text-on-tertiary-container' },
  { name: 'Lisinopril', dosage: '10mg', freq: 'Every morning', doctor: 'Dr. Desta', badge: 'ACTIVE', color: 'bg-primary-container/10 text-primary-container' },
];
export default function PatientPrescriptionsPage() {
  return (
    <>
      <h2 className="text-2xl font-headline font-bold text-primary mb-8">My Prescriptions</h2>
      <div className="space-y-4">
        {rxs.map((r,i) => (
          <div key={i} className="bg-surface-container-lowest p-6 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-primary-container/10 flex items-center justify-center"><span className="material-symbols-outlined text-primary-container text-2xl">medication</span></div>
            <div className="flex-1">
              <h4 className="font-semibold text-on-surface">{r.name}</h4>
              <p className="text-xs text-on-surface-variant">{r.dosage} • {r.freq}</p>
              <p className="text-xs text-on-surface-variant mt-1">Prescribed by: {r.doctor}</p>
            </div>
            <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm ${r.color}`}>{r.badge}</span>
          </div>
        ))}
      </div>
    </>
  );
}
