export interface IUser {
    id: string;
    clerkId: string;
    email: string;
    name?: string | null;
    role: 'ADMIN' | 'MANAGER' | 'USER';
}
