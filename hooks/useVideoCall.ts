'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { getSocket, Socket } from '@/lib/socket';

const ICE_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
];

interface UseVideoCallOptions {
  userId: number;
  userType: string;
  userName: string;
  sessionToken: string;
}

export function useVideoCall(options: UseVideoCallOptions) {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [callState, setCallState] = useState<'idle' | 'calling' | 'ringing' | 'connected' | 'ended'>('idle');
  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [connectionQuality, setConnectionQuality] = useState<'good' | 'poor' | 'disconnected'>('good');
  const [callDuration, setCallDuration] = useState(0);

  const socketRef = useRef<Socket | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const timerRef = useRef<NodeJS.Timeout>();

  // Initialize media + Socket.IO
  useEffect(() => {
    if (!options.sessionToken) return;

    const socket = getSocket({
      userId: options.userId,
      userType: options.userType,
      userName: options.userName,
    });
    socketRef.current = socket;

    // Join call room
    socket.emit('acceptCall', { sessionToken: options.sessionToken });

    // WebRTC signaling handlers
    socket.on('offer', async (data: { offer: RTCSessionDescriptionInit }) => {
      if (!pcRef.current) await setupPeerConnection();
      await pcRef.current!.setRemoteDescription(new RTCSessionDescription(data.offer));
      const answer = await pcRef.current!.createAnswer();
      await pcRef.current!.setLocalDescription(answer);
      socket.emit('answer', { sessionToken: options.sessionToken, answer });
    });

    socket.on('answer', async (data: { answer: RTCSessionDescriptionInit }) => {
      await pcRef.current?.setRemoteDescription(new RTCSessionDescription(data.answer));
    });

    socket.on('iceCandidate', async (data: { candidate: RTCIceCandidateInit }) => {
      try {
        await pcRef.current?.addIceCandidate(new RTCIceCandidate(data.candidate));
      } catch (e) {
        console.error('ICE candidate error:', e);
      }
    });

    socket.on('callAccepted', () => {
      setCallState('connected');
      startTimer();
    });

    socket.on('callEnded', () => {
      setCallState('ended');
      cleanup();
    });

    return () => {
      socket.off('offer');
      socket.off('answer');
      socket.off('iceCandidate');
      socket.off('callAccepted');
      socket.off('callEnded');
      cleanup();
    };
  }, [options.sessionToken]);

  const setupPeerConnection = async () => {
    const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
    pcRef.current = pc;

    // Get local media
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(stream);
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));
    } catch (err) {
      console.error('Media access error:', err);
      // Fallback: audio only
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setLocalStream(stream);
        stream.getTracks().forEach((track) => pc.addTrack(track, stream));
      } catch {
        console.error('No media access available');
      }
    }

    // Remote stream
    const remote = new MediaStream();
    setRemoteStream(remote);

    pc.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => remote.addTrack(track));
      setRemoteStream(new MediaStream(remote.getTracks()));
    };

    // ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate && socketRef.current) {
        socketRef.current.emit('iceCandidate', {
          sessionToken: options.sessionToken,
          candidate: event.candidate,
        });
      }
    };

    // Connection state monitoring
    pc.onconnectionstatechange = () => {
      switch (pc.connectionState) {
        case 'connected':
          setConnectionQuality('good');
          setCallState('connected');
          startTimer();
          break;
        case 'disconnected':
          setConnectionQuality('poor');
          break;
        case 'failed':
          setConnectionQuality('disconnected');
          break;
      }
    };

    return pc;
  };

  const startCall = useCallback(async (recipientId: number, recipientType: string) => {
    setCallState('calling');
    const pc = await setupPeerConnection();

    socketRef.current?.emit('startCall', {
      recipientId,
      recipientType,
      sessionToken: options.sessionToken,
    });

    // Create and send offer
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socketRef.current?.emit('offer', {
      sessionToken: options.sessionToken,
      offer,
    });
  }, [options.sessionToken]);

  const acceptCall = useCallback(async () => {
    setCallState('connected');
    await setupPeerConnection();
    socketRef.current?.emit('acceptCall', {
      sessionToken: options.sessionToken,
    });
  }, [options.sessionToken]);

  const endCall = useCallback(() => {
    socketRef.current?.emit('endCall', {
      sessionToken: options.sessionToken,
    });
    setCallState('ended');
    cleanup();
  }, [options.sessionToken]);

  const toggleCamera = useCallback(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setCameraOn(videoTrack.enabled);
      }
    }
  }, [localStream]);

  const toggleMic = useCallback(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setMicOn(audioTrack.enabled);
      }
    }
  }, [localStream]);

  const startTimer = () => {
    if (timerRef.current) return;
    timerRef.current = setInterval(() => {
      setCallDuration((d) => d + 1);
    }, 1000);
  };

  const cleanup = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = undefined;
    }
    localStream?.getTracks().forEach((t) => t.stop());
    pcRef.current?.close();
    pcRef.current = null;
  };

  const formatDuration = (seconds: number): string => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return {
    localStream,
    remoteStream,
    callState,
    cameraOn,
    micOn,
    connectionQuality,
    callDuration,
    formattedDuration: formatDuration(callDuration),
    startCall,
    acceptCall,
    endCall,
    toggleCamera,
    toggleMic,
  };
}
