import { z } from "zod";
import { ShipmentStatusEnum, ShipmentPriorityEnum } from "../constants";

// Re-export enums for convenience
export { ShipmentStatusEnum, ShipmentPriorityEnum };

/**
 * Schema for creating a shipment
 */
export const createShipmentSchema = z.object({
    carrierId: z.string().cuid("Invalid carrier ID"),
    routeId: z.string().cuid("Invalid route ID").optional(),
    originWarehouseId: z.string().cuid("Invalid origin warehouse ID"),
    destinationWarehouseId: z.string().cuid("Invalid destination warehouse ID"),
    priority: ShipmentPriorityEnum.default("NORMAL"),
    productName: z.string().min(2).max(200).optional(),
    productDescription: z.string().max(1000).optional(),
    quantity: z.number().int().positive().optional(),
    weight: z.number().positive().optional(),
    dimensions: z.string().max(50).optional(),
    estimatedDepartureTime: z.string().datetime().optional(),
    estimatedDeliveryTime: z.string().datetime(),
    currentLocation: z.string().max(200).optional(),
    notes: z.string().max(1000).optional(),
});

/**
 * Schema for updating a shipment
 */
export const updateShipmentSchema = z.object({
    carrierId: z.string().cuid("Invalid carrier ID").optional(),
    routeId: z.string().cuid("Invalid route ID").optional().nullable(),
    originWarehouseId: z.string().cuid("Invalid origin warehouse ID").optional(),
    destinationWarehouseId: z.string().cuid("Invalid destination warehouse ID").optional(),
    priority: ShipmentPriorityEnum.optional(),
    productName: z.string().min(2).max(200).optional(),
    productDescription: z.string().max(1000).optional(),
    quantity: z.number().int().positive().optional().nullable(),
    weight: z.number().positive().optional().nullable(),
    dimensions: z.string().max(50).optional().nullable(),
    estimatedDepartureTime: z.string().datetime().optional().nullable(),
    estimatedDeliveryTime: z.string().datetime().optional(),
    actualDepartureTime: z.string().datetime().optional().nullable(),
    actualDeliveryTime: z.string().datetime().optional().nullable(),
    currentLocation: z.string().max(200).optional().nullable(),
    notes: z.string().max(1000).optional().nullable(),
});

/**
 * Schema for updating shipment status
 */
export const updateShipmentStatusSchema = z.object({
    status: ShipmentStatusEnum,
    location: z.string().max(200).optional(),
    notes: z.string().max(1000).optional(),
});

/**
 * Schema for updating shipment location
 */
export const updateShipmentLocationSchema = z.object({
    location: z.string().min(1).max(200),
    notes: z.string().max(500).optional(),
});

/**
 * Schema for shipment filters
 */
export const shipmentFiltersSchema = z.object({
    status: ShipmentStatusEnum.optional(),
    priority: ShipmentPriorityEnum.optional(),
    carrierId: z.string().cuid().optional(),
    originWarehouseId: z.string().cuid().optional(),
    destinationWarehouseId: z.string().cuid().optional(),
    trackingNumber: z.string().optional(),
    limit: z.coerce.number().int().positive().max(100).default(50),
    offset: z.coerce.number().int().min(0).default(0),
});

export type CreateShipmentInput = z.infer<typeof createShipmentSchema>;
export type UpdateShipmentInput = z.infer<typeof updateShipmentSchema>;
export type UpdateShipmentStatusInput = z.infer<typeof updateShipmentStatusSchema>;
export type UpdateShipmentLocationInput = z.infer<typeof updateShipmentLocationSchema>;
export type ShipmentFilters = z.infer<typeof shipmentFiltersSchema>;
