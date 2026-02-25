export const channels = {
    /**
     * User-specific channel for personal notifications
     * @param userId - User ID
     * @returns Channel name: `user:{userId}`
     */
    user: (userId: string) => `user:${userId}`,

    /**
     * Broadcast to all servers/clients (system-wide announcements)
     * @returns Channel name: `broadcast`
     */
    broadcast: () => 'broadcast',
};