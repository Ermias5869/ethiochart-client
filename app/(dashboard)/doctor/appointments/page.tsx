'use client';
export default function DoctorAppointmentsPage() {
  const schedule = [
    { time: '09:00', name: 'Abebe Tadesse', type: 'Routine Checkup', status: 'arrived' },
    { time: '10:30', name: 'Mulugeta Seraw', type: 'Follow-up', status: 'in_progress' },
    { time: '11:45', name: 'Tsedey Wolde', type: 'Lab Review', status: 'scheduled' },
    { time: '13:30', name: 'Binyam Haile', type: 'Post-Op', status: 'scheduled' },
  ];
  const sc = (s:string) => s==='arrived'?'bg-primary-container/10 text-primary-container':s==='in_progress'?'bg-gold/10 text-on-tertiary-container':'bg-surface-container text-on-surface-variant';
  return (
    <>
      <h2 className="text-2xl font-headline font-bold text-primary mb-8">My Appointments</h2>
      <div className="bg-surface-container-lowest shadow-sm">
        {schedule.map((a,i) => (
          <div key={i} className="flex items-center gap-4 p-6 border-b border-outline-variant/10 hover:bg-surface-container-low/50 transition-colors">
            <span className="font-mono text-sm text-on-surface-variant w-14">{a.time}</span>
            <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center text-white font-bold">{a.name.charAt(0)}</div>
            <div className="flex-1"><p className="font-semibold">{a.name}</p><p className="text-xs text-on-surface-variant">{a.type}</p></div>
            <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm ${sc(a.status)}`}>{a.status.replace('_',' ')}</span>
            <div className="flex gap-2"><button className="px-3 py-1 bg-primary-container text-white text-xs font-semibold">View</button><button className="px-3 py-1 border border-primary-container text-primary-container text-xs font-semibold">Complete</button></div>
          </div>
        ))}
      </div>
    </>
  );
}
