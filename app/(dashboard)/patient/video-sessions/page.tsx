'use client';
export default function PatientVideoSessionsPage() {
  return (
    <>
      <h2 className="text-2xl font-headline font-bold text-primary mb-8">Video Sessions</h2>
      <div className="space-y-4">
        {[{doctor:'Dr. Abebe Kebede',date:'Oct 24, 2023',time:'10:30 AM',status:'scheduled'},{doctor:'Dr. Meron Desta',date:'Oct 22, 2023',time:'11:00 AM',status:'completed'}].map((s,i) => (
          <div key={i} className="bg-surface-container-lowest p-6 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4"><div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center text-white font-bold">{s.doctor.charAt(4)}</div><div><p className="font-semibold">{s.doctor}</p><p className="text-xs text-on-surface-variant">{s.date} at {s.time}</p></div></div>
            <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm ${s.status==='scheduled'?'bg-primary-container/10 text-primary-container':'bg-secondary-container/50 text-secondary'}`}>{s.status}</span>
            {s.status === 'scheduled' && <button className="px-4 py-2 bg-primary-container text-white text-sm font-semibold flex items-center gap-2 hover:bg-primary"><span className="material-symbols-outlined text-sm">videocam</span>Join</button>}
          </div>
        ))}
      </div>
    </>
  );
}
