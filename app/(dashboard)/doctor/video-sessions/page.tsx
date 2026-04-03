'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth';
import { api } from '@/lib/api';

interface Session {
  id: number;
  patientId: number;
  doctorId: number;
  scheduledAt: string;
  sessionToken: string;
  status: string;
  patient?: { id: number; ethioChartId: string; email: string; fullName?: string };
  doctor?: { id: number; name: string; email: string };
}

export default function DoctorVideoSessionsPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const res = await api.getVideoSessions();
      setSessions(res.data || []);
    } catch {}
    setLoading(false);
  };

  const statusColor = (s: string) => {
    switch (s) {
      case 'scheduled': return 'bg-primary-container/10 text-primary-container';
      case 'active': return 'bg-green-100 text-green-800';
      case 'ended': case 'completed': return 'bg-secondary-container/50 text-secondary';
      case 'cancelled': return 'bg-error-container text-error';
      default: return 'bg-surface-container text-on-surface-variant';
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-headline font-bold text-primary">Video Sessions</h2>
          <p className="text-sm text-on-surface-variant mt-1">Manage your video consultations with patients</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>
      ) : sessions.length === 0 ? (
        <div className="bg-surface-container-lowest p-12 text-center shadow-sm">
          <span className="material-symbols-outlined text-5xl text-outline/30">videocam_off</span>
          <p className="text-on-surface-variant mt-3">No video sessions scheduled</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map((s) => (
            <div key={s.id} className="bg-surface-container-lowest p-6 shadow-sm border-t-4 border-primary-container hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center text-white font-bold">
                  {(s.patient?.fullName || s.patient?.email || 'P').charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold">{s.patient?.fullName || s.patient?.email || 'Patient'}</p>
                  <p className="text-xs text-on-surface-variant">
                    {new Date(s.scheduledAt).toLocaleDateString()} at {new Date(s.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${statusColor(s.status)}`}>{s.status}</span>
                <span className="font-mono text-[10px] text-on-surface-variant">{s.patient?.ethioChartId}</span>
              </div>
              {(s.status === 'scheduled' || s.status === 'active') && (
                <button
                  onClick={() => router.push(`/doctor/video-sessions/${s.sessionToken}`)}
                  className="w-full py-2 bg-primary-container text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">videocam</span>
                  {s.status === 'active' ? 'Rejoin Session' : 'Join Session'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
