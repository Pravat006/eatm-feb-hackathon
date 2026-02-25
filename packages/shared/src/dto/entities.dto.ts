import { Serialize } from './common';

// --- API Response Base ---
export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    error?: string;
}

// --- Campus DTOs ---
export interface ICampus {
    id: string;
    name: string;
    type: "COLLEGE" | "HOSPITAL" | "CORPORATE" | "RESIDENTIAL" | "SCHOOL";
    contactEmail: string | null;
    status: "PENDING" | "ACTIVE" | "REJECTED";
    createdAt: Date;
    updatedAt: Date;
}

export type CampusDto = Serialize<ICampus>;

// --- Ticket DTOs ---
export interface ITicket {
    id: string;
    title: string;
    description: string;
    category: string | null;
    priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
    location: string;
    imageUrl: string | null;
    creatorId: string;
    campusId: string;
    assignedTo: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export type TicketDto = Serialize<ITicket>;

// --- Asset DTOs ---
export interface IAsset {
    id: string;
    name: string;
    type: string;
    location: string;
    lastMaintenance: Date;
    failureRisk: number; // 0.0 to 1.0
    campusId: string;
    createdAt: Date;
    updatedAt: Date;
}

export type AssetDto = Serialize<IAsset>;

// --- User DTOs ---
export interface IUser {
    id: string;
    clerkId: string;
    email: string;
    name: string;
    role: "USER" | "MANAGER" | "ADMIN" | "SUPER_ADMIN";
    campusId: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export type UserDto = Serialize<IUser>;

// --- WebSocket Event DTOs ---
export interface WsNotificationDto {
    type: "TICKET_CREATED" | "TICKET_UPDATED" | "ASSET_RISK_UPDATED" | "SYSTEM_ALERT";
    ticketId?: string;
    assetId?: string;
    name?: string;
    title?: string;
    status?: string;
    failureRisk?: number;
    priority?: string;
    userId?: string; // "ADMIN" or a specific user ID
}
