import { z } from 'zod';

// ============================================
// ORGANIZATION SCHEMAS
// ============================================

export const createOrganizationSchema = z.object({
  name: z.string().min(2, 'Organization name must be at least 2 characters').max(100),
  slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  logo: z.string().url().optional(),
  description: z.string().max(500).optional(),
  settings: z.record(z.any()).optional(),
});

export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;

// ============================================
// CARRIER SCHEMAS
// ============================================

export const createCarrierSchema = z.object({
  name: z.string().min(2).max(100),
  code: z.string().min(2).max(20).toUpperCase(),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().min(10).max(20).optional(),
  rating: z.number().min(0).max(5).optional(),
  isActive: z.boolean().default(true),
});

export const updateCarrierSchema = createCarrierSchema.partial();

export type CreateCarrierInput = z.infer<typeof createCarrierSchema>;
export type UpdateCarrierInput = z.infer<typeof updateCarrierSchema>;

// ============================================
// WAREHOUSE SCHEMAS
// ============================================

export const createWarehouseSchema = z.object({
  name: z.string().min(2).max(100),
  code: z.string().min(2).max(20).toUpperCase(),
  address: z.string().min(5).max(200),
  city: z.string().min(2).max(100),
  state: z.string().min(2).max(100).optional(),
  country: z.string().min(2).max(100),
  postalCode: z.string().max(20).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  capacity: z.number().int().positive().optional(),
  currentLoad: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

export const updateWarehouseSchema = createWarehouseSchema.partial();

export type CreateWarehouseInput = z.infer<typeof createWarehouseSchema>;
export type UpdateWarehouseInput = z.infer<typeof updateWarehouseSchema>;

// ============================================
// ROUTE SCHEMAS
// ============================================

export const createRouteSchema = z.object({
  name: z.string().min(2).max(100),
  originWarehouseId: z.string().cuid(),
  destinationWarehouseId: z.string().cuid(),
  distance: z.number().positive(),
  estimatedTime: z.number().int().positive(),
  isActive: z.boolean().default(true),
});

export const updateRouteSchema = createRouteSchema.partial();

export type CreateRouteInput = z.infer<typeof createRouteSchema>;
export type UpdateRouteInput = z.infer<typeof updateRouteSchema>;

// ============================================
// SHIPMENT QUERY/FILTER SCHEMAS
// ============================================

export const shipmentFilterSchema = z.object({
  status: z.enum(['PENDING', 'IN_TRANSIT', 'DELAYED', 'DELIVERED', 'CANCELLED', 'RETURNED']).optional(),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']).optional(),
  carrierId: z.string().cuid().optional(),
  originWarehouseId: z.string().cuid().optional(),
  destinationWarehouseId: z.string().cuid().optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  search: z.string().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
  sortBy: z.enum(['createdAt', 'estimatedDeliveryTime', 'actualDeliveryTime', 'trackingNumber']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type ShipmentFilterInput = z.infer<typeof shipmentFilterSchema>;

// ============================================
// ALERT SCHEMAS
// ============================================

export const updateAlertSchema = z.object({
  isRead: z.boolean(),
});

export type UpdateAlertInput = z.infer<typeof updateAlertSchema>;

// ============================================
// DASHBOARD SCHEMAS
// ============================================

export const dashboardFilterSchema = z.object({
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
});

export type DashboardFilterInput = z.infer<typeof dashboardFilterSchema>;
