'use client';
const appointments = [
  { doctor: 'Dr. Abebe Kebede', specialty: 'Cardiologist', date: 'Oct 24, 2023', time: '10:30 AM', location: 'Block C-4', status: 'scheduled' },
  { doctor: 'Dr. Meron Desta', specialty: 'Internal Medicine', date: 'Nov 5, 2023', time: '2:00 PM', location: 'Block A-2', status: 'scheduled' },
  { doctor: 'Dr. Abebe Kebede', specialty: 'Cardiologist', date: 'Oct 10, 2023', time: '11:00 AM', location: 'Block C-4', status: 'completed' },
];
export default function PatientAppointmentsPage() {
  const sc = (s:string) => s==='scheduled'?'bg-primary-container/10 text-primary-container':'bg-secondary-container/50 text-secondary';
  return (
    <>
      <h2 className="text-2xl font-headline font-bold text-primary mb-8">My Appointments</h2>
      <div className="space-y-4">
        {appointments.map((a,i) => (
          <div key={i} className="bg-surface-container-lowest p-6 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center text-white font-bold">{a.doctor.charAt(4)}</div>
              <div><p className="font-semibold">{a.doctor}</p><p className="text-xs text-on-surface-variant">{a.specialty}</p></div>
            </div>
            <div className="text-center"><p className="text-sm font-medium">{a.date}</p><p className="text-xs text-on-surface-variant">{a.time}</p></div>
            <p className="text-xs text-on-surface-variant flex items-center gap-1"><span className="material-symbols-outlined text-sm">location_on</span>{a.location}</p>
            <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm ${sc(a.status)}`}>{a.status}</span>
            {a.status === 'scheduled' && <button className="px-4 py-2 bg-primary-container text-white text-xs font-semibold flex items-center gap-1"><span className="material-symbols-outlined text-sm">videocam</span>Join</button>}
          </div>
        ))}
      </div>
    </>
  );
}
