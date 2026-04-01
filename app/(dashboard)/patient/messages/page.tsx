'use client';
export default function PatientMessagesPage() {
  return (
    <>
      <h2 className="text-2xl font-headline font-bold text-primary mb-8">Messages</h2>
      <div className="flex h-[calc(100vh-14rem)] bg-surface-container-lowest shadow-sm">
        <div className="w-80 border-r border-outline-variant/20 flex flex-col">
          <div className="p-4 border-b border-outline-variant/20"><div className="relative"><span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">search</span><input placeholder="Search..." className="w-full pl-9 pr-3 py-2 border border-outline-variant/30 text-sm focus:ring-0 focus:border-primary" /></div></div>
          <div className="flex-1 overflow-y-auto">
            {[{name:'Dr. Abebe Kebede',last:'Continue to monitor glucose...',time:'09:15',active:true},{name:'Dr. Meron Desta',last:'Your next appointment is...',time:'Yesterday'}].map((c,i) => (
              <div key={i} className={`flex items-center gap-3 px-4 py-3 cursor-pointer ${i===0?'bg-primary/5 border-l-4 border-gold':'hover:bg-surface-container-low border-l-4 border-transparent'}`}>
                <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-white text-sm font-bold">{c.name.charAt(4)}</div>
                <div className="flex-1 min-w-0"><p className="text-sm font-semibold truncate">{c.name}</p><p className="text-xs text-on-surface-variant truncate">{c.last}</p></div>
                <span className="text-[10px] font-mono text-on-surface-variant">{c.time}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 flex flex-col">
          <div className="px-6 py-4 border-b border-outline-variant/20 flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-white text-xs font-bold">A</div><div><p className="text-sm font-semibold">Dr. Abebe Kebede</p><p className="text-[10px] text-primary-fixed-dim">● Online</p></div></div>
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-surface-container-low/30">
            <div className="flex gap-3"><div className="bg-white px-4 py-3 rounded-lg shadow-sm max-w-md"><p className="text-sm">Good morning doctor, I finished my Amoxicillin course yesterday.</p><p className="text-[10px] text-on-surface-variant mt-1">08:45 AM</p></div></div>
            <div className="flex gap-3 justify-end"><div className="bg-primary-container text-white px-4 py-3 rounded-lg max-w-md"><p className="text-sm">Good morning. Continue to monitor your glucose levels and log them in the portal.</p><p className="text-[10px] text-white/70 mt-1">09:15 AM</p></div></div>
          </div>
          <div className="px-6 py-4 border-t border-outline-variant/20 flex items-center gap-3"><button className="text-outline"><span className="material-symbols-outlined">attach_file</span></button><input placeholder="Type your message..." className="flex-1 px-4 py-3 border border-outline-variant/30 text-sm focus:border-primary focus:ring-0" /><button className="w-10 h-10 bg-primary-container text-white rounded flex items-center justify-center hover:bg-primary"><span className="material-symbols-outlined">send</span></button></div>
        </div>
      </div>
    </>
  );
}
