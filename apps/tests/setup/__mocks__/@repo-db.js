/**
 * Mock for @repo/db package
 * This allows tests to run without actual database connections
 */

// In-memory storage for test data
const storage = {
  users: new Map(),
  organizations: new Map(),
  shipments: new Map(),
  alerts: new Map(),
  carriers: new Map(),
  warehouses: new Map(),
  routes: new Map(),
  activities: [],
  shipmentHistory: [],
};

// Helper to generate IDs
const generateId = () => `c${Date.now()}${Math.random().toString(36).substring(2, 9)}`;

const mockDb = {
  user: {
    findUnique: jest.fn(async ({ where, select }) => {
      const user = Array.from(storage.users.values()).find(u =>
        u.id === where.id || u.email === where.email || u.username === where.username
      );
      if (!user) return null;
      if (select) {
        const result = {};
        Object.keys(select).forEach(key => {
          if (select[key]) result[key] = user[key];
        });
        return result;
      }
      return user;
    }),
    findFirst: jest.fn(async ({ where, select }) => {
      let user = null;
      if (where.OR) {
        user = Array.from(storage.users.values()).find(u =>
          where.OR.some(condition => {
            if (!condition) return false;
            return Object.keys(condition).every(key => u[key] === condition[key]);
          })
        );
      } else {
        user = Array.from(storage.users.values()).find(u =>
          Object.keys(where).every(key => u[key] === where[key])
        );
      }
      if (!user) return null;
      if (select) {
        const result = {};
        Object.keys(select).forEach(key => {
          if (select[key]) result[key] = user[key];
        });
        return result;
      }
      return user;
    }),
    findMany: jest.fn(async ({ where, select }) => {
      let users = Array.from(storage.users.values());
      if (where) {
        users = users.filter(u =>
          Object.keys(where).every(key => u[key] === where[key])
        );
      }
      if (select) {
        return users.map(u => {
          const result = {};
          Object.keys(select).forEach(key => {
            if (select[key]) result[key] = u[key];
          });
          return result;
        });
      }
      return users;
    }),
    create: jest.fn(async ({ data, select }) => {
      const id = generateId();
      const user = { ...data, id, createdAt: new Date(), updatedAt: new Date() };
      storage.users.set(id, user);
      if (select) {
        const result = {};
        Object.keys(select).forEach(key => {
          if (select[key]) result[key] = user[key];
        });
        return result;
      }
      return user;
    }),
    update: jest.fn(async ({ where, data, select }) => {
      const user = storage.users.get(where.id);
      if (!user) return null;
      Object.assign(user, data, { updatedAt: new Date() });
      if (select) {
        const result = {};
        Object.keys(select).forEach(key => {
          if (select[key]) result[key] = user[key];
        });
        return result;
      }
      return user;
    }),
    delete: jest.fn(async ({ where }) => {
      const user = storage.users.get(where.id);
      if (user) storage.users.delete(where.id);
      return user;
    }),
    count: jest.fn(async ({ where } = {}) => {
      if (!where) return storage.users.size;
      let count = 0;
      for (const user of storage.users.values()) {
        if (Object.keys(where).every(key => user[key] === where[key])) {
          count++;
        }
      }
      return count;
    }),
  },
  organization: {
    findUnique: jest.fn(async ({ where }) => {
      return storage.organizations.get(where.id) || null;
    }),
    findMany: jest.fn(async () => Array.from(storage.organizations.values())),
    create: jest.fn(async ({ data }) => {
      const id = generateId();
      const org = { ...data, id, createdAt: new Date(), updatedAt: new Date() };
      storage.organizations.set(id, org);
      return org;
    }),
    update: jest.fn(async ({ where, data }) => {
      const org = storage.organizations.get(where.id);
      if (!org) return null;
      Object.assign(org, data, { updatedAt: new Date() });
      return org;
    }),
    delete: jest.fn(async ({ where }) => {
      const org = storage.organizations.get(where.id);
      if (org) storage.organizations.delete(where.id);
      return org;
    }),
  },
  shipment: {
    findUnique: jest.fn(async ({ where, include }) => {
      const shipment = storage.shipments.get(where.id);
      if (!shipment) return null;
      if (include) {
        const result = { ...shipment };
        if (include.carrier && shipment.carrierId) result.carrier = storage.carriers.get(shipment.carrierId) || null;
        if (include.originWarehouse && shipment.originWarehouseId) result.originWarehouse = storage.warehouses.get(shipment.originWarehouseId) || null;
        if (include.destinationWarehouse && shipment.destinationWarehouseId) result.destinationWarehouse = storage.warehouses.get(shipment.destinationWarehouseId) || null;
        if (include.route && shipment.routeId) result.route = storage.routes.get(shipment.routeId) || null;
        if (include.organization && shipment.organizationId) result.organization = storage.organizations.get(shipment.organizationId) || null;
        if (include.createdBy && shipment.createdById) result.createdBy = storage.users.get(shipment.createdById) || null;
        if (include.history) result.history = storage.shipmentHistory.filter(h => h.shipmentId === shipment.id);
        if (include.alerts) result.alerts = Array.from(storage.alerts.values()).filter(a => a.shipmentId === shipment.id);
        return result;
      }
      return shipment;
    }),
    findFirst: jest.fn(async ({ where, include }) => {
      const shipment = Array.from(storage.shipments.values()).find(s =>
        Object.keys(where).every(key => s[key] === where[key])
      );
      if (!shipment) return null;
      if (include) {
        const result = { ...shipment };
        if (include.carrier && shipment.carrierId) result.carrier = storage.carriers.get(shipment.carrierId) || null;
        if (include.originWarehouse && shipment.originWarehouseId) result.originWarehouse = storage.warehouses.get(shipment.originWarehouseId) || null;
        if (include.destinationWarehouse && shipment.destinationWarehouseId) result.destinationWarehouse = storage.warehouses.get(shipment.destinationWarehouseId) || null;
        if (include.route && shipment.routeId) result.route = storage.routes.get(shipment.routeId) || null;
        if (include.organization && shipment.organizationId) result.organization = storage.organizations.get(shipment.organizationId) || null;
        if (include.createdBy && shipment.createdById) result.createdBy = storage.users.get(shipment.createdById) || null;
        if (include.history) result.history = storage.shipmentHistory.filter(h => h.shipmentId === shipment.id);
        if (include.alerts) result.alerts = Array.from(storage.alerts.values()).filter(a => a.shipmentId === shipment.id);
        return result;
      }
      return shipment;
    }),
    findMany: jest.fn(async ({ where, include, orderBy, take, skip }) => {
      let shipments = Array.from(storage.shipments.values());
      if (where) {
        shipments = shipments.filter(s => {
          return Object.keys(where).every(key => {
            if (typeof where[key] === 'object' && where[key].contains) {
              return s[key]?.toLowerCase().includes(where[key].contains.toLowerCase());
            }
            return s[key] === where[key];
          });
        });
      }
      if (skip) shipments = shipments.slice(skip);
      if (take) shipments = shipments.slice(0, take);
      if (include) {
        return shipments.map(s => {
          const result = { ...s };
          if (include.carrier && s.carrierId) result.carrier = storage.carriers.get(s.carrierId) || null;
          if (include.originWarehouse && s.originWarehouseId) result.originWarehouse = storage.warehouses.get(s.originWarehouseId) || null;
          if (include.destinationWarehouse && s.destinationWarehouseId) result.destinationWarehouse = storage.warehouses.get(s.destinationWarehouseId) || null;
          return result;
        });
      }
      return shipments;
    }),
    create: jest.fn(async ({ data, include }) => {
      const id = generateId();
      const shipment = { ...data, id, status: data.status || 'PENDING', createdAt: new Date(), updatedAt: new Date() };
      storage.shipments.set(id, shipment);
      if (include) {
        const result = { ...shipment };
        if (include.carrier && shipment.carrierId) result.carrier = storage.carriers.get(shipment.carrierId) || null;
        if (include.originWarehouse && shipment.originWarehouseId) result.originWarehouse = storage.warehouses.get(shipment.originWarehouseId) || null;
        if (include.destinationWarehouse && shipment.destinationWarehouseId) result.destinationWarehouse = storage.warehouses.get(shipment.destinationWarehouseId) || null;
        if (include.route && shipment.routeId) result.route = storage.routes.get(shipment.routeId) || null;
        if (include.organization && shipment.organizationId) result.organization = storage.organizations.get(shipment.organizationId) || null;
        if (include.createdBy && shipment.createdById) result.createdBy = storage.users.get(shipment.createdById) || null;
        return result;
      }
      return shipment;
    }),
    update: jest.fn(async ({ where, data, include }) => {
      const shipment = storage.shipments.get(where.id);
      if (!shipment) return null;
      Object.assign(shipment, data, { updatedAt: new Date() });
      if (include) {
        const result = { ...shipment };
        if (include.carrier && shipment.carrierId) result.carrier = storage.carriers.get(shipment.carrierId) || null;
        if (include.originWarehouse && shipment.originWarehouseId) result.originWarehouse = storage.warehouses.get(shipment.originWarehouseId) || null;
        if (include.destinationWarehouse && shipment.destinationWarehouseId) result.destinationWarehouse = storage.warehouses.get(shipment.destinationWarehouseId) || null;
        if (include.route && shipment.routeId) result.route = storage.routes.get(shipment.routeId) || null;
        return result;
      }
      return shipment;
    }),
    delete: jest.fn(async ({ where }) => {
      const shipment = storage.shipments.get(where.id);
      if (shipment) storage.shipments.delete(where.id);
      return shipment;
    }),
    count: jest.fn(async ({ where } = {}) => {
      if (!where) return storage.shipments.size;
      let count = 0;
      for (const shipment of storage.shipments.values()) {
        let matches = true;
        for (const key of Object.keys(where)) {
          if (key === 'createdAt' && where[key].gte) {
            if (new Date(shipment.createdAt) < new Date(where[key].gte)) {
              matches = false;
              break;
            }
          } else if (key === 'status' && where[key].in) {
            if (!where[key].in.includes(shipment[key])) {
              matches = false;
              break;
            }
          } else if (shipment[key] !== where[key]) {
            matches = false;
            break;
          }
        }
        if (matches) count++;
      }
      return count;
    }),
  },
  shipmentHistory: {
    create: jest.fn(async ({ data }) => {
      const id = generateId();
      const history = { ...data, id, timestamp: new Date() };
      storage.shipmentHistory.push(history);
      return history;
    }),
  },
  alert: {
    findUnique: jest.fn(async ({ where, include }) => {
      const alert = storage.alerts.get(where.id) || null;
      if (!alert) return null;
      if (include && include.shipment && alert.shipmentId) {
        const shipment = storage.shipments.get(alert.shipmentId);
        return { ...alert, shipment: shipment || null };
      }
      return alert;
    }),
    findFirst: jest.fn(async ({ where, include }) => {
      let alert = Array.from(storage.alerts.values()).find(a =>
        Object.keys(where).every(key => a[key] === where[key])
      );
      if (!alert) return null;
      if (include && include.shipment && alert.shipmentId) {
        const shipment = storage.shipments.get(alert.shipmentId);
        alert = {
          ...alert, shipment: shipment ? {
            id: shipment.id,
            trackingNumber: shipment.trackingNumber,
            status: shipment.status
          } : null
        };
      }
      return alert;
    }),
    findMany: jest.fn(async ({ where, include, orderBy, take, skip }) => {
      let alerts = Array.from(storage.alerts.values());
      if (where) {
        alerts = alerts.filter(a =>
          Object.keys(where).every(key => a[key] === where[key])
        );
      }
      if (skip) alerts = alerts.slice(skip);
      if (take) alerts = alerts.slice(0, take);

      if (include && include.shipment) {
        return alerts.map(a => {
          if (a.shipmentId) {
            const shipment = storage.shipments.get(a.shipmentId);
            return {
              ...a, shipment: shipment ? {
                id: shipment.id,
                trackingNumber: shipment.trackingNumber,
                status: shipment.status,
                priority: shipment.priority
              } : null
            };
          }
          return { ...a, shipment: null };
        });
      }

      return alerts;
    }),
    create: jest.fn(async ({ data, include }) => {
      const id = generateId();
      const alert = { ...data, id, isRead: false, createdAt: new Date() };
      storage.alerts.set(id, alert);

      if (include) {
        const result = { ...alert };
        if (include.user && data.userId) {
          const user = storage.users.get(data.userId);
          if (user) {
            result.user = {
              id: user.id,
              name: user.name,
              email: user.email
            };
          }
        }
        if (include.shipment && data.shipmentId) {
          const shipment = storage.shipments.get(data.shipmentId);
          if (shipment) {
            result.shipment = {
              id: shipment.id,
              trackingNumber: shipment.trackingNumber,
              status: shipment.status
            };
          } else {
            result.shipment = null;
          }
        }
        return result;
      }

      return alert;
    }),
    update: jest.fn(async ({ where, data, include }) => {
      const alert = storage.alerts.get(where.id);
      if (!alert) return null;
      Object.assign(alert, data);

      if (include && include.shipment && alert.shipmentId) {
        const shipment = storage.shipments.get(alert.shipmentId);
        return {
          ...alert, shipment: shipment ? {
            id: shipment.id,
            trackingNumber: shipment.trackingNumber,
            status: shipment.status
          } : null
        };
      }

      return alert;
    }),
    delete: jest.fn(async ({ where }) => {
      const alert = storage.alerts.get(where.id);
      if (alert) storage.alerts.delete(where.id);
      return alert;
    }),
    count: jest.fn(async ({ where } = {}) => {
      if (!where) return storage.alerts.size;
      let count = 0;
      for (const alert of storage.alerts.values()) {
        // Handle nested user.organizationId check
        if (where.user && where.user.organizationId) {
          const user = storage.users.get(alert.userId);
          if (!user || user.organizationId !== where.user.organizationId) {
            continue;
          }
        }
        // Check other where conditions
        const matches = Object.keys(where).every(key => {
          if (key === 'user') return true; // Already handled above
          return alert[key] === where[key];
        });
        if (matches) count++;
      }
      return count;
    }),
  },
  carrier: {
    findUnique: jest.fn(async ({ where }) => {
      return storage.carriers.get(where.id) || null;
    }),
    findFirst: jest.fn(async ({ where }) => {
      return Array.from(storage.carriers.values()).find(c =>
        Object.keys(where).every(key => c[key] === where[key])
      ) || null;
    }),
    findMany: jest.fn(async ({ where, select, include, orderBy, take, skip }) => {
      let carriers = Array.from(storage.carriers.values());
      if (where) {
        carriers = carriers.filter(c =>
          Object.keys(where).every(key => c[key] === where[key])
        );
      }

      // Handle orderBy with shipments count
      if (orderBy && orderBy.shipments && orderBy.shipments._count) {
        const order = orderBy.shipments._count;
        carriers.sort((a, b) => {
          const aCount = Array.from(storage.shipments.values()).filter(s => s.carrierId === a.id).length;
          const bCount = Array.from(storage.shipments.values()).filter(s => s.carrierId === b.id).length;
          return order === 'desc' ? bCount - aCount : aCount - bCount;
        });
      }

      if (skip) carriers = carriers.slice(skip);
      if (take) carriers = carriers.slice(0, take);

      // Handle select
      if (select) {
        return carriers.map(c => {
          const result = {};
          Object.keys(select).forEach(key => {
            if (key === '_count' && select[key]) {
              result._count = {};
              if (select[key].select && select[key].select.shipments) {
                // Count shipments for this carrier
                result._count.shipments = Array.from(storage.shipments.values())
                  .filter(s => s.carrierId === c.id).length;
              }
            } else if (select[key]) {
              result[key] = c[key];
            }
          });
          return result;
        });
      }

      // Handle include
      if (include) {
        return carriers.map(c => {
          const result = { ...c };
          if (include._count && include._count.select && include._count.select.shipments) {
            result._count = {
              shipments: Array.from(storage.shipments.values())
                .filter(s => s.carrierId === c.id).length
            };
          }
          if (include.organization && c.organizationId) {
            result.organization = storage.organizations.get(c.organizationId) || null;
          }
          return result;
        });
      }

      return carriers;
    }),
    create: jest.fn(async ({ data }) => {
      const id = generateId();
      const carrier = { ...data, id, isActive: data.isActive !== undefined ? data.isActive : true, createdAt: new Date(), updatedAt: new Date() };
      storage.carriers.set(id, carrier);
      return carrier;
    }),
    update: jest.fn(async ({ where, data }) => {
      const carrier = storage.carriers.get(where.id);
      if (!carrier) return null;
      Object.assign(carrier, data, { updatedAt: new Date() });
      return carrier;
    }),
    delete: jest.fn(async ({ where }) => {
      const carrier = storage.carriers.get(where.id);
      if (carrier) storage.carriers.delete(where.id);
      return carrier;
    }),
    count: jest.fn(async ({ where } = {}) => {
      if (!where) return storage.carriers.size;
      let count = 0;
      for (const carrier of storage.carriers.values()) {
        if (Object.keys(where).every(key => carrier[key] === where[key])) {
          count++;
        }
      }
      return count;
    }),
  },
  warehouse: {
    findUnique: jest.fn(async ({ where }) => {
      return storage.warehouses.get(where.id) || null;
    }),
    findFirst: jest.fn(async ({ where }) => {
      return Array.from(storage.warehouses.values()).find(w =>
        Object.keys(where).every(key => w[key] === where[key])
      ) || null;
    }),
    findMany: jest.fn(async ({ where, select, include, orderBy, take, skip }) => {
      let warehouses = Array.from(storage.warehouses.values());
      if (where) {
        warehouses = warehouses.filter(w =>
          Object.keys(where).every(key => {
            if (where[key] && typeof where[key] === 'object' && Array.isArray(where[key].in)) {
              return where[key].in.includes(w[key]);
            }
            return w[key] === where[key];
          })
        );
      }
      if (skip) warehouses = warehouses.slice(skip);
      if (take) warehouses = warehouses.slice(0, take);

      // Handle select
      if (select) {
        return warehouses.map(w => {
          const result = {};
          Object.keys(select).forEach(key => {
            if (key === '_count' && select[key]) {
              result._count = {};
              if (select[key].select) {
                if (select[key].select.shipmentsFrom) {
                  result._count.shipmentsFrom = Array.from(storage.shipments.values())
                    .filter(s => s.originWarehouseId === w.id).length;
                }
                if (select[key].select.shipmentsTo) {
                  result._count.shipmentsTo = Array.from(storage.shipments.values())
                    .filter(s => s.destinationWarehouseId === w.id).length;
                }
              }
            } else if (select[key]) {
              result[key] = w[key];
            }
          });
          return result;
        });
      }

      return warehouses;
    }),
    create: jest.fn(async ({ data }) => {
      const id = generateId();
      const warehouse = { ...data, id, currentLoad: data.currentLoad || 0, isActive: data.isActive !== undefined ? data.isActive : true, createdAt: new Date(), updatedAt: new Date() };
      storage.warehouses.set(id, warehouse);
      return warehouse;
    }),
    update: jest.fn(async ({ where, data }) => {
      const warehouse = storage.warehouses.get(where.id);
      if (!warehouse) return null;
      Object.assign(warehouse, data, { updatedAt: new Date() });
      return warehouse;
    }),
    delete: jest.fn(async ({ where }) => {
      const warehouse = storage.warehouses.get(where.id);
      if (warehouse) storage.warehouses.delete(where.id);
      return warehouse;
    }),
    count: jest.fn(async ({ where } = {}) => {
      if (!where) return storage.warehouses.size;
      let count = 0;
      for (const warehouse of storage.warehouses.values()) {
        if (Object.keys(where).every(key => warehouse[key] === where[key])) {
          count++;
        }
      }
      return count;
    }),
  },
  route: {
    findUnique: jest.fn(async ({ where }) => {
      return storage.routes.get(where.id) || null;
    }),
    findFirst: jest.fn(async ({ where }) => {
      return Array.from(storage.routes.values()).find(r =>
        Object.keys(where).every(key => r[key] === where[key])
      ) || null;
    }),
    findMany: jest.fn(async ({ where, orderBy, take, skip }) => {
      let routes = Array.from(storage.routes.values());
      if (where) {
        routes = routes.filter(r =>
          Object.keys(where).every(key => r[key] === where[key])
        );
      }
      if (skip) routes = routes.slice(skip);
      if (take) routes = routes.slice(0, take);
      return routes;
    }),
    create: jest.fn(async ({ data }) => {
      const id = generateId();
      const route = { ...data, id, isActive: data.isActive !== undefined ? data.isActive : true, createdAt: new Date(), updatedAt: new Date() };
      storage.routes.set(id, route);
      return route;
    }),
    update: jest.fn(async ({ where, data }) => {
      const route = storage.routes.get(where.id);
      if (!route) return null;
      Object.assign(route, data, { updatedAt: new Date() });
      return route;
    }),
    delete: jest.fn(async ({ where }) => {
      const route = storage.routes.get(where.id);
      if (route) storage.routes.delete(where.id);
      return route;
    }),
    count: jest.fn(async ({ where } = {}) => {
      if (!where) return storage.routes.size;
      let count = 0;
      for (const route of storage.routes.values()) {
        if (Object.keys(where).every(key => route[key] === where[key])) {
          count++;
        }
      }
      return count;
    }),
  },
  activity: {
    findUnique: jest.fn(async ({ where, include }) => {
      const activity = storage.activities.find(a => a.id === where.id) || null;
      if (!activity) return null;
      if (include && include.user && activity.userId) {
        const user = storage.users.get(activity.userId);
        return { ...activity, user };
      }
      return activity;
    }),
    findMany: jest.fn(async ({ where, include, orderBy, take, skip }) => {
      let activities = [...storage.activities];
      if (where) {
        activities = activities.filter(a => {
          // Handle nested user.organizationId check
          if (where.user && where.user.organizationId) {
            const user = storage.users.get(a.userId);
            if (!user || user.organizationId !== where.user.organizationId) {
              return false;
            }
          }
          // Handle other where conditions
          return Object.keys(where).every(key => {
            if (key === 'user') return true; // Already handled above
            return a[key] === where[key];
          });
        });
      }
      if (skip) activities = activities.slice(skip);
      if (take) activities = activities.slice(0, take);
      if (include && include.user) {
        return activities.map(a => {
          const user = storage.users.get(a.userId);
          return { ...a, user: user ? { id: user.id, name: user.name, email: user.email, username: user.username } : null };
        });
      }
      return activities;
    }),
    create: jest.fn(async ({ data }) => {
      const id = generateId();
      const activity = { ...data, id, createdAt: new Date() };
      storage.activities.push(activity);
      return activity;
    }),
    count: jest.fn(async ({ where }) => {
      if (!where) return storage.activities.length;
      let count = 0;
      for (const activity of storage.activities) {
        // Handle nested user.organizationId check
        if (where.user && where.user.organizationId) {
          const user = storage.users.get(activity.userId);
          if (!user || user.organizationId !== where.user.organizationId) {
            continue;
          }
        }
        // Check other where conditions
        const matches = Object.keys(where).every(key => {
          if (key === 'user') return true; // Already handled above
          if (key === 'createdAt' && where[key].gte) {
            return new Date(activity.createdAt) >= new Date(where[key].gte);
          }
          return activity[key] === where[key];
        });
        if (matches) count++;
      }
      return count;
    }),
    groupBy: jest.fn(async ({ by, where, _count, orderBy, take }) => {
      let activities = [...storage.activities];

      // Apply where filter
      if (where) {
        activities = activities.filter(a => {
          // Handle nested user.organizationId check
          if (where.user && where.user.organizationId) {
            const user = storage.users.get(a.userId);
            if (!user || user.organizationId !== where.user.organizationId) {
              return false;
            }
          }
          // Handle createdAt filter
          if (where.createdAt && where.createdAt.gte) {
            if (new Date(a.createdAt) < new Date(where.createdAt.gte)) {
              return false;
            }
          }
          return true;
        });
      }

      // Group by the specified field(s)
      const groups = {};
      activities.forEach(a => {
        const groupKey = by.map(field => a[field]).join('|');
        if (!groups[groupKey]) {
          groups[groupKey] = {
            ...by.reduce((acc, field) => ({ ...acc, [field]: a[field] }), {}),
            _count: {},
            items: []
          };
        }
        groups[groupKey].items.push(a);
      });

      // Calculate counts
      const result = Object.values(groups).map(group => {
        const countFields = _count ? Object.keys(_count) : [];
        countFields.forEach(field => {
          group._count[field] = group.items.length;
        });
        delete group.items;
        return group;
      });

      // Apply ordering
      if (orderBy && orderBy._count) {
        const countField = Object.keys(orderBy._count)[0];
        const order = orderBy._count[countField];
        result.sort((a, b) => {
          const aCount = a._count[countField];
          const bCount = b._count[countField];
          return order === 'desc' ? bCount - aCount : aCount - bCount;
        });
      }

      // Apply limit
      if (take) {
        return result.slice(0, take);
      }

      return result;
    }),
  },
  $transaction: jest.fn(async (callback) => {
    if (typeof callback === 'function') {
      return callback(mockDb);
    }
    // For array of operations
    return Promise.all(callback);
  }),
  $connect: jest.fn(),
  $disconnect: jest.fn(),
};

// Export storage for tests to access if needed
mockDb._storage = storage;

module.exports = mockDb;
