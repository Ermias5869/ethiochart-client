'use client';

export default function AdminMessagesPage() {
  return (
    <>
      <h2 className="text-2xl font-headline font-bold text-primary mb-8">Messages</h2>
      <div className="flex h-[calc(100vh-14rem)] bg-surface-container-lowest shadow-sm">
        {/* Conversations List */}
        <div className="w-80 border-r border-outline-variant/20 flex flex-col">
          <div className="p-4 border-b border-outline-variant/20">
            <div className="relative"><span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">search</span><input type="text" placeholder="Search messages..." className="w-full pl-9 pr-3 py-2 border border-outline-variant/30 text-sm focus:border-primary focus:ring-0" /></div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {['Abebe Tadesse', 'Selamawit Girma', 'Dawit Yilma'].map((name, i) => (
              <div key={name} className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${i === 0 ? 'bg-primary/5 border-l-4 border-gold' : 'hover:bg-surface-container-low border-l-4 border-transparent'}`}>
                <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-white text-sm font-bold">{name.charAt(0)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-on-surface truncate">{name}</p>
                  <p className="text-xs text-on-surface-variant truncate">Last message preview...</p>
                </div>
                <span className="text-[10px] font-mono text-on-surface-variant">09:12</span>
              </div>
            ))}
          </div>
        </div>
        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          <div className="px-6 py-4 border-b border-outline-variant/20 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-white text-xs font-bold">A</div>
            <div><p className="text-sm font-semibold">Abebe Tadesse</p><p className="text-[10px] text-on-surface-variant">● Active Now</p></div>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="flex gap-3"><div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-xs">A</div><div className="bg-surface-container-low px-4 py-3 rounded-lg max-w-md"><p className="text-sm">Good morning doctor, I finished my Amoxicillin course yesterday.</p><p className="text-[10px] text-on-surface-variant mt-1">08:45 AM</p></div></div>
            <div className="flex gap-3 justify-end"><div className="bg-primary-container text-white px-4 py-3 rounded-lg max-w-md"><p className="text-sm">Good morning. How are you feeling today?</p><p className="text-[10px] text-white/70 mt-1">08:52 AM</p></div></div>
          </div>
          <div className="px-6 py-4 border-t border-outline-variant/20 flex items-center gap-3">
            <button className="text-outline hover:text-primary"><span className="material-symbols-outlined">attach_file</span></button>
            <input type="text" placeholder="Type your message..." className="flex-1 px-4 py-3 border border-outline-variant/30 text-sm focus:border-primary focus:ring-0" />
            <button className="w-10 h-10 bg-primary-container text-white rounded flex items-center justify-center hover:bg-primary transition-colors"><span className="material-symbols-outlined text-lg">send</span></button>
          </div>
        </div>
      </div>
    </>
  );
}
