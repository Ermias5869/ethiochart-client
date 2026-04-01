'use client';
export default function DoctorVideoSessionsPage() {
  const sessions = [
    { patient: 'Abebe Tadesse', date: 'Oct 24, 2023', time: '10:30 AM', status: 'scheduled' },
    { patient: 'Martha Kassaye', date: 'Oct 25, 2023', time: '02:00 PM', status: 'scheduled' },
    { patient: 'Tamrat Ayele', date: 'Oct 22, 2023', time: '11:00 AM', status: 'completed' },
  ];
  return (
    <>
      <h2 className="text-2xl font-headline font-bold text-primary mb-8">Video Sessions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sessions.map((s,i) => (
          <div key={i} className="bg-surface-container-lowest p-6 shadow-sm border-t-4 border-primary-container hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4"><div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center text-white font-bold">{s.patient.charAt(0)}</div><div><p className="font-semibold">{s.patient}</p><p className="text-xs text-on-surface-variant">{s.date} at {s.time}</p></div></div>
            <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm ${s.status==='scheduled'?'bg-primary-container/10 text-primary-container':'bg-secondary-container/50 text-secondary'}`}>{s.status}</span>
            {s.status === 'scheduled' && <button className="w-full mt-4 py-2 bg-primary-container text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-primary transition-colors"><span className="material-symbols-outlined text-sm">videocam</span>Join Session</button>}
          </div>
        ))}
      </div>
    </>
  );
}
