import z from "zod";

// ============================================
// SUPPLY CHAIN ENUMS
// ============================================

// User Roles
export const UserRoleEnum = z.enum(["ADMIN", "MANAGER", "USER", "VIEWER"]);
export type UserRole = z.infer<typeof UserRoleEnum>;

// Shipment Status
export const ShipmentStatusEnum = z.enum([
    "PENDING",
    "IN_TRANSIT",
    "DELAYED",
    "DELIVERED",
    "CANCELLED",
    "RETURNED",
]);
export type ShipmentStatus = z.infer<typeof ShipmentStatusEnum>;

// Shipment Priority
export const ShipmentPriorityEnum = z.enum(["LOW", "NORMAL", "HIGH", "URGENT"]);
export type ShipmentPriority = z.infer<typeof ShipmentPriorityEnum>;

// Alert Type
export const AlertTypeEnum = z.enum([
    "SHIPMENT_CREATED",
    "SHIPMENT_IN_TRANSIT",
    "SHIPMENT_DELAYED",
    "SHIPMENT_DELIVERED",
    "SHIPMENT_CANCELLED",
    "ROUTE_BLOCKED",
    "WAREHOUSE_CAPACITY",
    "CARRIER_ISSUE",
    "SYSTEM",
]);
export type AlertType = z.infer<typeof AlertTypeEnum>;

// Alert Severity
export const AlertSeverityEnum = z.enum(["INFO", "WARNING", "ERROR", "CRITICAL"]);
export type AlertSeverity = z.infer<typeof AlertSeverityEnum>;

// Activity Type
export const ActivityTypeEnum = z.enum([
    "SHIPMENT_CREATED",
    "SHIPMENT_UPDATED",
    "STATUS_CHANGED",
    "LOCATION_UPDATED",
    "ALERT_CREATED",
    "USER_LOGIN",
    "USER_LOGOUT",
]);
export type ActivityType = z.infer<typeof ActivityTypeEnum>;

// ============================================
// STATUS COLORS (for UI)
// ============================================

export const SHIPMENT_STATUS_COLORS = {
    PENDING: "gray",
    IN_TRANSIT: "blue",
    DELAYED: "orange",
    DELIVERED: "green",
    CANCELLED: "red",
    RETURNED: "purple",
} as const;

export const ALERT_SEVERITY_COLORS = {
    INFO: "blue",
    WARNING: "yellow",
    ERROR: "orange",
    CRITICAL: "red",
} as const;

export const PRIORITY_COLORS = {
    LOW: "gray",
    NORMAL: "blue",
    HIGH: "orange",
    URGENT: "red",
} as const;