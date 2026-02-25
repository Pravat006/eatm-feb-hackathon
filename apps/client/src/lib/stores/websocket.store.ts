import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';
import { ClientToServerEvents, ServerToClientEvents } from '@repo/shared';

// Assuming server is on 3001
const WS_URL = process.env.NEXT_PUBLIC_WS_URI || 'http://localhost:3001';

interface WebSocketState {
    socket: Socket<ServerToClientEvents, ClientToServerEvents> | null;
    isConnected: boolean;
    isConnecting: boolean;
    error: string | null;

    connect: () => void;
    disconnect: () => void;
}

export const useWebSocketStore = create<WebSocketState>((set, get) => ({
    socket: null,
    isConnected: false,
    isConnecting: false,
    error: null,

    connect: () => {
        // Prevent multiple connections
        if (get().socket?.connected || get().isConnecting) return;

        set({ isConnecting: true, error: null });

        // Retrieve auth context (assuming we are using auth cookies or passing token logic isn't complex, 
        // socket.io uses standard cross-origin credentials)
        const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(WS_URL, {
            withCredentials: true,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        socket.on('connect', () => {
            console.log('🔗 WebSocket Connected!', socket.id);
            set({ isConnected: true, isConnecting: false, error: null });
        });

        socket.on('disconnect', (reason) => {
            console.log('❌ WebSocket Disconnected:', reason);
            set({ isConnected: false, isConnecting: false });
        });

        socket.on('connect_error', (err) => {
            console.error('🔥 WebSocket Connection Error:', err.message);
            set({ isConnected: false, isConnecting: false, error: err.message });
        });

        // Global Event listeners
        socket.on('error', (err) => {
            console.error('WebSocket Error Event:', err);
        });



        set({ socket });
    },

    disconnect: () => {
        const { socket } = get();
        if (socket) {
            socket.disconnect();
            set({ socket: null, isConnected: false, isConnecting: false });
        }
    },
}));
