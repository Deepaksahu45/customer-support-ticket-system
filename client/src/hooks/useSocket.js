// Aegis — Socket.io hook with JWT authentication
import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

const useSocket = () => {
  const { token } = useAuth();
  const socketRef = useRef(null);

  useEffect(() => {
    if (!token) return;

    socketRef.current = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    socketRef.current.on('connect', () => {
      console.log('⚡ Aegis Socket connected');
    });

    socketRef.current.on('auth_error', (data) => {
      console.error('🔒 Aegis Socket auth error:', data.message);
    });

    socketRef.current.on('connect_error', (err) => {
      console.error('❌ Aegis Socket connection error:', err.message);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [token]);

  return socketRef.current;
};

export default useSocket;
