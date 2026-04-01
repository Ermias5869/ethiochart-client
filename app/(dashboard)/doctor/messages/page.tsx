'use client';

export default function DoctorMessagesPage() {
  const conversations = [
    { name: 'Abebe Tadesse', time: '09:12 AM', preview: 'No fever, but still feeling a bit weak...', online: true },
    { name: 'Selamawit Girma', time: 'YESTERDAY', preview: 'Thank you for the prescription,...', unread: 2 },
    { name: 'Dawit Yilma', time: 'MONDAY', preview: 'The laboratory results are ready.' },
    { name: 'Tigest Balcha', time: 'OCT 12', preview: 'Appointment scheduled for next we...' },
  ];
  const messages = [
    { from: 'patient', text: 'Good morning doctor, I finished my Amoxicillin course yesterday.', time: '08:45 AM' },
    { from: 'doctor', text: 'Good morning Abebe. How are you feeling today? Any recurring fever?', time: '08:52 AM' },
    { from: 'patient', text: 'No fever, but still feeling a bit weak in the mornings.', time: '09:12 AM' },
    { from: 'doctor', text: 'That is expected. Please continue to monitor your glucose levels and log them in the portal.', time: '09:15 AM' },
  ];
  return (
    <>
      <h2 className="text-2xl font-headline font-bold text-primary mb-8">Messages</h2>
      <div className="flex h-[calc(100vh-14rem)] bg-surface-container-lowest shadow-sm">
        {/* Sidebar */}
        <div className="w-80 border-r border-outline-variant/20 flex flex-col">
          <div className="p-4 border-b border-outline-variant/20">
            <div className="relative"><span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">search</span><input placeholder="Search discussions..." className="w-full pl-9 pr-3 py-2 border border-outline-variant/30 text-sm focus:ring-0 focus:border-primary" /></div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.map((c, i) => (
              <div key={i} className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${i===0?'bg-primary/5 border-l-4 border-gold':'hover:bg-surface-container-low border-l-4 border-transparent'}`}>
                <div className="relative"><div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-white text-sm font-bold">{c.name.charAt(0)}</div>{c.online && <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-primary-fixed-dim rounded-full border-2 border-white" />}</div>
                <div className="flex-1 min-w-0"><div className="flex justify-between"><p className="text-sm font-semibold text-on-surface truncate">{c.name}</p><span className="text-[10px] font-mono text-on-surface-variant">{c.time}</span></div><p className="text-xs text-on-surface-variant truncate">{c.preview}</p></div>
                {c.unread && <span className="w-5 h-5 rounded-full bg-error text-white text-[10px] flex items-center justify-center font-bold">{c.unread}</span>}
              </div>
            ))}
          </div>
          <div className="p-4"><button className="w-full py-2 bg-primary-container text-white text-xs font-bold uppercase tracking-widest">New Consultation</button></div>
        </div>
        {/* Chat */}
        <div className="flex-1 flex flex-col">
          <div className="px-6 py-4 border-b border-outline-variant/20 flex items-center justify-between">
            <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-white font-bold text-sm">A</div><div><p className="font-semibold text-sm">Abebe Tadesse <span className="font-mono text-[10px] bg-primary-container/10 text-primary-container px-2 py-0.5 ml-2">EC-M5K2XRPA</span></p><p className="text-[10px] text-primary-fixed-dim">● Active Now</p></div></div>
            <div className="flex gap-3"><button className="text-outline hover:text-primary"><span className="material-symbols-outlined">videocam</span></button><button className="text-outline hover:text-primary"><span className="material-symbols-outlined">call</span></button><button className="text-outline hover:text-primary"><span className="material-symbols-outlined">more_vert</span></button></div>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-surface-container-low/30">
            <p className="text-center font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">Today, October 24</p>
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-3 ${m.from==='doctor'?'justify-end':''}`}>
                {m.from==='patient' && <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-xs flex-shrink-0">A</div>}
                <div className={`px-4 py-3 rounded-lg max-w-md ${m.from==='doctor'?'bg-primary-container text-white':'bg-white shadow-sm'}`}>
                  <p className="text-sm">{m.text}</p>
                  <p className={`text-[10px] mt-1 ${m.from==='doctor'?'text-white/70':'text-on-surface-variant'}`}>{m.time}</p>
                </div>
                {m.from==='doctor' && <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-white text-xs flex-shrink-0 font-bold">D</div>}
              </div>
            ))}
          </div>
          <div className="px-6 py-4 border-t border-outline-variant/20">
            <div className="flex items-center gap-3 mb-3"><input placeholder="Type your message..." className="flex-1 px-4 py-3 border border-outline-variant/30 text-sm focus:border-primary focus:ring-0" /><button className="w-10 h-10 bg-primary-container text-white rounded flex items-center justify-center hover:bg-primary transition-colors"><span className="material-symbols-outlined">send</span></button></div>
            <div className="flex gap-4 text-[10px] font-mono text-on-surface-variant uppercase tracking-wider"><button className="hover:text-primary flex items-center gap-1"><span className="material-symbols-outlined text-sm">description</span>Send Lab Result</button><button className="hover:text-primary flex items-center gap-1"><span className="material-symbols-outlined text-sm">medication</span>Prescribe Medication</button><button className="hover:text-primary flex items-center gap-1"><span className="material-symbols-outlined text-sm">event</span>Request Follow-Up</button></div>
          </div>
        </div>
      </div>
    </>
  );
}
