'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { getSocket, Socket } from '@/lib/socket';

interface Message {
  id?: number;
  senderId: number;
  receiverId: number;
  senderType: string;
  content: string;
  createdAt: string;
  isRead?: boolean;
  senderName?: string;
}

interface UseChatOptions {
  userId: number;
  userType: string;
  userName: string;
  recipientId: number;
  recipientType: string;
  patientId: number;
  doctorId: number;
}

export function useChat(options: UseChatOptions) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState('');
  const [onlineUsers, setOnlineUsers] = useState<{ userId: number; userType: string }[]>([]);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!options.userId) return;

    const socket = getSocket({
      userId: options.userId,
      userType: options.userType,
      userName: options.userName,
    });
    socketRef.current = socket;

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));

    // Join chat room
    socket.emit('joinRoom', {
      recipientId: options.recipientId,
      recipientType: options.recipientType,
    });

    // Listen for messages
    socket.on('receiveMessage', (msg: Message) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
    });

    // Typing indicators
    socket.on('userTyping', (data: { userName: string }) => {
      setIsTyping(true);
      setTypingUser(data.userName);
    });

    socket.on('userStopTyping', () => {
      setIsTyping(false);
      setTypingUser('');
    });

    // Online status
    socket.on('userOnline', (data: { userId: number; userType: string }) => {
      setOnlineUsers((prev) => {
        if (prev.some((u) => u.userId === data.userId && u.userType === data.userType)) return prev;
        return [...prev, data];
      });
    });

    socket.on('userOffline', (data: { userId: number; userType: string }) => {
      setOnlineUsers((prev) => prev.filter((u) => !(u.userId === data.userId && u.userType === data.userType)));
    });

    // Get initial online users
    socket.emit('getOnlineUsers', {}, (users: any) => {
      if (Array.isArray(users)) setOnlineUsers(users);
    });

    return () => {
      socket.off('receiveMessage');
      socket.off('userTyping');
      socket.off('userStopTyping');
      socket.off('userOnline');
      socket.off('userOffline');
    };
  }, [options.userId, options.recipientId]);

  const sendMessage = useCallback((content: string) => {
    if (!socketRef.current || !content.trim()) return;

    socketRef.current.emit('sendMessage', {
      recipientId: options.recipientId,
      recipientType: options.recipientType,
      content: content.trim(),
      patientId: options.patientId,
      doctorId: options.doctorId,
    });

    // Stop typing
    socketRef.current.emit('stopTyping', {
      recipientId: options.recipientId,
      recipientType: options.recipientType,
    });
  }, [options]);

  const emitTyping = useCallback(() => {
    if (!socketRef.current) return;

    socketRef.current.emit('typing', {
      recipientId: options.recipientId,
      recipientType: options.recipientType,
    });

    // Auto-stop typing after 2s
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current?.emit('stopTyping', {
        recipientId: options.recipientId,
        recipientType: options.recipientType,
      });
    }, 2000);
  }, [options]);

  const markAsRead = useCallback((messageIds: number[]) => {
    if (!socketRef.current || messageIds.length === 0) return;
    socketRef.current.emit('markRead', { messageIds });
  }, []);

  const isRecipientOnline = onlineUsers.some(
    (u) => u.userId === options.recipientId && u.userType === options.recipientType
  );

  return {
    messages,
    setMessages,
    sendMessage,
    emitTyping,
    markAsRead,
    isTyping,
    typingUser,
    onlineUsers,
    isRecipientOnline,
    connected,
  };
}
