'use client';

import { useEffect, useState, useRef } from 'react';
import { useAuthStore } from '@/lib/auth';
import { useChat } from '@/hooks/useChat';
import { api } from '@/lib/api';

interface Conversation {
  doctor?: { id: number; name: string; email: string };
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  isOnline: boolean;
  senderType: string;
}

export default function PatientMessagesPage() {
  const { user } = useAuthStore();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [inputText, setInputText] = useState('');
  const [loadingConvs, setLoadingConvs] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const patientProfileId = user?.patientProfileId || 0;
  const doctorId = selectedConv?.doctor?.id || 0;

  const chat = useChat({
    userId: patientProfileId,
    userType: 'patient',
    userName: user?.name || 'Patient',
    recipientId: doctorId,
    recipientType: 'doctor',
    patientId: patientProfileId,
    doctorId,
  });

  useEffect(() => {
    if (!patientProfileId) return;
    loadConversations();
  }, [patientProfileId]);

  const loadConversations = async () => {
    try {
      const res = await api.get(`/chat/conversations/patient/${patientProfileId}`);
      setConversations(res.data || []);
      if (res.data?.length > 0) setSelectedConv(res.data[0]);
    } catch {}
    setLoadingConvs(false);
  };

  useEffect(() => {
    if (!selectedConv?.doctor?.id || !patientProfileId) return;
    loadThread();
  }, [selectedConv?.doctor?.id, patientProfileId]);

  const loadThread = async () => {
    try {
      const res = await api.get(`/chat/thread/${patientProfileId}/${selectedConv!.doctor!.id}`);
      chat.setMessages(res.data || []);
    } catch {}
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat.messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    chat.sendMessage(inputText);
    setInputText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    } else {
      chat.emitTyping();
    }
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 86400000) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (diff < 172800000) return 'Yesterday';
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-headline font-bold text-primary">Messages</h2>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${chat.connected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-[10px] font-mono text-on-surface-variant">{chat.connected ? 'Connected' : 'Offline'}</span>
        </div>
      </div>

      <div className="flex h-[calc(100vh-14rem)] bg-surface-container-lowest shadow-sm">
        {/* Conversation List */}
        <div className="w-80 border-r border-outline-variant/20 flex flex-col">
          <div className="p-4 border-b border-outline-variant/20">
            <p className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant mb-2">Your Doctors</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loadingConvs ? (
              <div className="p-8 text-center"><div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" /></div>
            ) : conversations.length === 0 ? (
              <p className="p-6 text-sm text-on-surface-variant text-center">No conversations yet</p>
            ) : (
              conversations.map((c, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedConv(c)}
                  className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
                    selectedConv?.doctor?.id === c.doctor?.id
                      ? 'bg-primary/5 border-l-4 border-gold'
                      : 'hover:bg-surface-container-low border-l-4 border-transparent'
                  }`}
                >
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-white text-sm font-bold">
                      {c.doctor?.name?.charAt(0) || 'D'}
                    </div>
                    {c.isOnline && <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <p className="text-sm font-semibold text-on-surface truncate">{c.doctor?.name}</p>
                      <span className="text-[10px] font-mono text-on-surface-variant">{formatTime(c.lastMessageAt)}</span>
                    </div>
                    <p className="text-xs text-on-surface-variant truncate">{c.lastMessage}</p>
                  </div>
                  {c.unreadCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-error text-white text-[10px] flex items-center justify-center font-bold">{c.unreadCount}</span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConv ? (
            <>
              <div className="px-6 py-4 border-b border-outline-variant/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-white font-bold text-sm">
                      {selectedConv.doctor?.name?.charAt(0) || 'D'}
                    </div>
                    {chat.isRecipientOnline && <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{selectedConv.doctor?.name}</p>
                    <p className={`text-[10px] ${chat.isRecipientOnline ? 'text-green-600' : 'text-on-surface-variant'}`}>
                      {chat.isTyping ? 'Typing...' : chat.isRecipientOnline ? '● Online' : '○ Offline'}
                    </p>
                  </div>
                </div>
                <button className="text-outline hover:text-primary transition-colors"><span className="material-symbols-outlined">videocam</span></button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-surface-container-low/30">
                {chat.messages.length === 0 ? (
                  <p className="text-center text-sm text-on-surface-variant py-12">No messages yet</p>
                ) : (
                  chat.messages.map((m: any, i: number) => (
                    <div key={m.id || i} className={`flex gap-3 ${m.senderType === 'patient' ? 'justify-end' : ''}`}>
                      {m.senderType === 'doctor' && (
                        <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {selectedConv.doctor?.name?.charAt(0) || 'D'}
                        </div>
                      )}
                      <div className={`px-4 py-3 rounded-lg max-w-md ${
                        m.senderType === 'patient' ? 'bg-primary-container text-white' : 'bg-white shadow-sm'
                      }`}>
                        <p className="text-sm">{m.content}</p>
                        <p className={`text-[10px] mt-1 ${m.senderType === 'patient' ? 'text-white/70' : 'text-on-surface-variant'}`}>{formatTime(m.createdAt)}</p>
                      </div>
                    </div>
                  ))
                )}
                {chat.isTyping && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-white text-xs font-bold">D</div>
                    <div className="bg-white shadow-sm px-4 py-3 rounded-lg">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-outline rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-outline rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-outline rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="px-6 py-4 border-t border-outline-variant/20">
                <div className="flex items-center gap-3">
                  <input
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-3 border border-outline-variant/30 text-sm focus:border-primary focus:ring-0"
                  />
                  <button onClick={handleSend} disabled={!inputText.trim()} className="w-10 h-10 bg-primary-container text-white rounded flex items-center justify-center hover:bg-primary transition-colors disabled:opacity-50">
                    <span className="material-symbols-outlined">send</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <span className="material-symbols-outlined text-6xl text-outline/30">forum</span>
                <p className="text-on-surface-variant mt-2">Select a conversation</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
