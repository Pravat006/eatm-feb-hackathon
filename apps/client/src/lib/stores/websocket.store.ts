import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';
import { ClientToServerEvents, ServerToClientEvents } from '@repo/shared';

// Assuming server is on 3001
const WS_URL = process.env.NEXT_PUBLIC_WS_URI || 'http://localhost:8082';

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
        set({ isConnecting: true, error: null });
        console.log('🔗 [Mocking WebSocket Connection]');
        set({ isConnected: true, isConnecting: false, error: null });
    },

    disconnect: () => {
        const { socket } = get();
        if (socket) {
            socket.disconnect();
            set({ socket: null, isConnected: false, isConnecting: false });
        }
    },
}));
