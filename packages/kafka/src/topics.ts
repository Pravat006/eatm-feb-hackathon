
export const TOPICS = {
    /**
     * Published when: Shipment is created
     * Consumed by: WebSocket server for real-time updates, Analytics service
     */
    SHIPMENT_CREATED: "shipment.created",

    /**
     * Published when: Shipment information is updated (e.g., notes, priority)
     * Consumed by: WebSocket server, Database sync service
     */
    SHIPMENT_UPDATED: "shipment.updated",

    /**
     * Published when: Shipment status changes (PENDING → IN_TRANSIT → DELIVERED, etc.)
     * Consumed by: WebSocket server, Alert service, Analytics service
     */
    SHIPMENT_STATUS_CHANGED: "shipment.status.changed",

    /**
     * Published when: Shipment location is updated (GPS coordinates, checkpoint scanning)
     * Consumed by: WebSocket server for real-time tracking, Alert service for delays
     */
    SHIPMENT_LOCATION_UPDATED: "shipment.location.updated",

    /**
     * Published when: Shipment is successfully delivered
     * Consumed by: WebSocket server, Notification service, Analytics service
     */
    SHIPMENT_DELIVERED: "shipment.delivered",

    /**
     * Published when: Shipment is delayed beyond ETA
     * Consumed by: Alert service, Notification service, WebSocket server
     */
    SHIPMENT_DELAYED: "shipment.delayed",

    /**
     * Published when: Shipment is cancelled
     * Consumed by: WebSocket server, Notification service, Analytics service
     */
    SHIPMENT_CANCELLED: "shipment.cancelled",

    /**
     * Published when: Alert is created (delay, risk, capacity warning, etc.)
     * Consumed by: WebSocket server for real-time notifications, Email service
     */
    ALERT_CREATED: "alert.created",

    /**
     * Published when: Warehouse status changes (capacity, load, operational status)
     * Consumed by: WebSocket server, Dashboard service, Alert service
     */
    WAREHOUSE_STATUS: "warehouse.status",

    /**
     * Published when: Carrier performance metrics are updated
     * Consumed by: Analytics service, Dashboard service
     */
    CARRIER_PERFORMANCE: "carrier.performance",

    /**
     * Published when: Route is blocked or has issues
     * Consumed by: Alert service, Route optimization service
     */
    ROUTE_ISSUE: "route.issue",

} as const;

export type TopicName = typeof TOPICS[keyof typeof TOPICS];
