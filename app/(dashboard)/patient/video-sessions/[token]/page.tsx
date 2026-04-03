'use client';

import { useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth';
import { useVideoCall } from '@/hooks/useVideoCall';

export default function PatientVideoCallRoomPage() {
  const { token } = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const call = useVideoCall({
    userId: user?.patientProfileId || user?.id || 0,
    userType: 'patient',
    userName: user?.name || 'Patient',
    sessionToken: token as string,
  });

  useEffect(() => {
    if (localVideoRef.current && call.localStream) {
      localVideoRef.current.srcObject = call.localStream;
    }
  }, [call.localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && call.remoteStream) {
      remoteVideoRef.current.srcObject = call.remoteStream;
    }
  }, [call.remoteStream]);

  const handleEndCall = () => {
    call.endCall();
    setTimeout(() => router.push('/patient/video-sessions'), 1000);
  };

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 bg-black/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-white/70">videocam</span>
          <div>
            <p className="text-white text-sm font-semibold">Video Consultation</p>
            <p className="text-white/50 text-[10px] font-mono">Session: {token}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${
              call.connectionQuality === 'good' ? 'bg-green-500' :
              call.connectionQuality === 'poor' ? 'bg-yellow-500' : 'bg-red-500'
            }`} />
            <span className="text-white/70 text-xs capitalize">{call.connectionQuality}</span>
          </div>
          {call.callState === 'connected' && (
            <span className="text-white font-mono text-sm bg-red-600 px-3 py-1 rounded-full animate-pulse">
              🔴 {call.formattedDuration}
            </span>
          )}
        </div>
      </div>

      {/* Video Area */}
      <div className="flex-1 relative">
        <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />

        {call.callState !== 'connected' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80">
            <div className="text-center">
              {call.callState === 'idle' && (
                <>
                  <span className="material-symbols-outlined text-7xl text-white/30 mb-4">videocam</span>
                  <p className="text-white text-lg mb-6">Waiting for doctor to start the call...</p>
                  <button
                    onClick={() => call.acceptCall()}
                    className="px-8 py-3 bg-green-600 text-white font-semibold rounded-full hover:bg-green-500 transition-colors flex items-center gap-2 mx-auto"
                  >
                    <span className="material-symbols-outlined">call</span>
                    Join Call
                  </button>
                </>
              )}
              {call.callState === 'ringing' && (
                <>
                  <div className="w-20 h-20 border-4 border-white/20 border-t-green-500 rounded-full animate-spin mx-auto mb-6" />
                  <p className="text-white text-lg">Incoming call...</p>
                  <div className="flex gap-4 mt-6 justify-center">
                    <button onClick={() => call.acceptCall()} className="px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-500 flex items-center gap-2">
                      <span className="material-symbols-outlined">call</span>Accept
                    </button>
                    <button onClick={handleEndCall} className="px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-500 flex items-center gap-2">
                      <span className="material-symbols-outlined">call_end</span>Decline
                    </button>
                  </div>
                </>
              )}
              {call.callState === 'ended' && (
                <>
                  <span className="material-symbols-outlined text-7xl text-red-400 mb-4">call_end</span>
                  <p className="text-white text-lg mb-2">Call Ended</p>
                  <p className="text-white/50 text-sm">Duration: {call.formattedDuration}</p>
                </>
              )}
            </div>
          </div>
        )}

        {/* Local Video PIP */}
        <div className="absolute bottom-6 right-6 w-48 h-36 bg-black rounded-lg overflow-hidden shadow-2xl border-2 border-white/20">
          <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
          {!call.cameraOn && (
            <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
              <span className="material-symbols-outlined text-white/50 text-3xl">videocam_off</span>
            </div>
          )}
          <p className="absolute bottom-1 left-2 text-[10px] text-white/70 font-mono">You</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 py-6 bg-black/50 backdrop-blur-sm">
        <button onClick={call.toggleMic} className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${call.micOn ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-red-600 text-white'}`}>
          <span className="material-symbols-outlined">{call.micOn ? 'mic' : 'mic_off'}</span>
        </button>
        <button onClick={call.toggleCamera} className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${call.cameraOn ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-red-600 text-white'}`}>
          <span className="material-symbols-outlined">{call.cameraOn ? 'videocam' : 'videocam_off'}</span>
        </button>
        <button onClick={handleEndCall} className="w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-500 transition-colors shadow-lg shadow-red-600/30">
          <span className="material-symbols-outlined text-2xl">call_end</span>
        </button>
        <button className="w-14 h-14 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors">
          <span className="material-symbols-outlined">chat</span>
        </button>
      </div>
    </div>
  );
}
