/**
 * WebSocket Event Types for Boilerplate
 */

export interface SocketUser {
    id: string;
    email: string;
    name: string;
    username?: string | null;
    role: 'ADMIN' | 'MANAGER' | 'USER' | 'VIEWER';
}

// ============================================
// CLIENT TO SERVER EVENTS
// ============================================

export interface ClientToServerEvents {
    // Basic Events
    'ping': () => void;
}

// ============================================
// SERVER TO CLIENT EVENTS
// ============================================

export interface ServerToClientEvents {
    // General Events
    'error': (error: {
        message: string;
        code?: string;
        details?: any;
    }) => void;

    'success': (data: {
        message: string;
        data?: any;
    }) => void;

    // Notification Event
    'notification': (data: {
        type: string;
        title: string;
        message: string;
        data?: any;
        timestamp?: string;
    }) => void;
}

// ============================================
// INTER SERVER EVENTS
// ============================================

export interface InterServerEvents {
    ping: () => void;
}

// ============================================
// SOCKET DATA & AUTHENTICATED SOCKET
// ============================================

export interface SocketData {
    userId: string;
    user: SocketUser;
}

export interface AuthenticatedSocket {
    id: string;
    userId: string;
    data: SocketData;
    user: SocketUser;
    join: (room: string) => void;
    leave: (room: string) => void;
    emit: <K extends keyof ServerToClientEvents>(
        event: K,
        ...args: Parameters<ServerToClientEvents[K]>
    ) => boolean;
    to: (room: string) => {
        emit: <K extends keyof ServerToClientEvents>(
            event: K,
            ...args: Parameters<ServerToClientEvents[K]>
        ) => boolean;
    };
    on: <K extends keyof ClientToServerEvents>(
        event: K,
        listener: ClientToServerEvents[K]
    ) => void;
}
