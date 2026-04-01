'use client';
const prescriptions = [
  { patient: 'Abebe Tadesse', medication: 'Amoxicillin', dosage: '500mg', frequency: '3 times daily', daysLeft: 7, status: 'active' },
  { patient: 'Martha Kassaye', medication: 'Metformin', dosage: '850mg', frequency: 'Once daily', daysLeft: 0, status: 'chronic' },
  { patient: 'Tamrat Ayele', medication: 'Lisinopril', dosage: '10mg', frequency: 'Every morning', daysLeft: 14, status: 'active' },
  { patient: 'Zenebech Alemu', medication: 'Ibuprofen', dosage: '400mg', frequency: 'As needed', daysLeft: 3, status: 'expiring' },
];
export default function DoctorPrescriptionsPage() {
  const bc = (s:string) => s==='active'?'bg-primary-container/10 text-primary-container':s==='chronic'?'bg-gold/10 text-on-tertiary-container':'bg-error-container text-error';
  return (
    <>
      <h2 className="text-2xl font-headline font-bold text-primary mb-8">Prescriptions</h2>
      <div className="bg-surface-container-lowest shadow-sm">
        {prescriptions.map((p,i) => (
          <div key={i} className="flex items-center gap-4 p-6 border-b border-outline-variant/10 hover:bg-surface-container-low/50 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-primary-container/10 flex items-center justify-center"><span className="material-symbols-outlined text-primary-container">medication</span></div>
            <div className="flex-1"><p className="font-semibold text-sm">{p.medication} — <span className="text-on-surface-variant font-normal">{p.dosage} • {p.frequency}</span></p><p className="text-xs text-on-surface-variant">For: {p.patient}</p></div>
            <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm ${bc(p.status)}`}>{p.status === 'active' ? `${p.daysLeft} Days Left` : p.status === 'chronic' ? 'Chronic' : 'Expiring'}</span>
          </div>
        ))}
      </div>
    </>
  );
}
