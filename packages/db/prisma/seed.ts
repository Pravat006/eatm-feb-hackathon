import { PrismaClient } from '../generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcryptjs';

// Create PostgreSQL connection pool
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/supply_chain_360';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

// Initialize Prisma with PostgreSQL adapter
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding database with Indian supply chain data...');

  // Clear existing data
  console.log('Clearing existing data...');
  await prisma.activity.deleteMany();
  await prisma.alert.deleteMany();
  await prisma.shipmentHistory.deleteMany();
  await prisma.shipment.deleteMany();
  await prisma.route.deleteMany();
  await prisma.warehouse.deleteMany();
  await prisma.carrier.deleteMany();
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();

  // Create Organizations
  console.log('Creating organizations...');
  const flipex = await prisma.organization.create({
    data: {
      name: 'FlipEx Logistics',
      slug: 'flipex-logistics',
      description: 'Leading e-commerce logistics provider across India',
    },
  });

  const bharatSupply = await prisma.organization.create({
    data: {
      name: 'Bharat Supply Chain',
      slug: 'bharat-supply-chain',
      description: 'Pan-India supply chain and warehousing solutions',
    },
  });

  console.log(`✓ Created 2 organizations`);

  // Create Users
  console.log('Creating users...');
  const hashedPassword = await bcrypt.hash('password123', 10);

  const users = await Promise.all([
    prisma.user.create({ data: { email: 'admin@flipex.in', password: hashedPassword, name: 'Rajesh Kumar', username: 'rajesh_admin', role: 'ADMIN', organizationId: flipex.id } }),
    prisma.user.create({ data: { email: 'priya.sharma@flipex.in', password: hashedPassword, name: 'Priya Sharma', username: 'priya_s', role: 'MANAGER', organizationId: flipex.id } }),
    prisma.user.create({ data: { email: 'amit.patel@flipex.in', password: hashedPassword, name: 'Amit Patel', username: 'amit_p', role: 'MANAGER', organizationId: flipex.id } }),
    prisma.user.create({ data: { email: 'user@flipex.in', password: hashedPassword, name: 'Vikram Singh', username: 'vikram_s', role: 'USER', organizationId: flipex.id } }),
    prisma.user.create({ data: { email: 'viewer@flipex.in', password: hashedPassword, name: 'Sneha Reddy', username: 'sneha_r', role: 'VIEWER', organizationId: flipex.id } }),
    prisma.user.create({ data: { email: 'admin@bharatsupply.in', password: hashedPassword, name: 'Arjun Mehta', username: 'arjun_admin', role: 'ADMIN', organizationId: bharatSupply.id } }),
    prisma.user.create({ data: { email: 'manager@bharatsupply.in', password: hashedPassword, name: 'Kavita Desai', username: 'kavita_d', role: 'MANAGER', organizationId: bharatSupply.id } }),
  ]);

  console.log(`✓ Created 7 users`);

  // Create Carriers
  console.log('Creating carriers...');
  const bluedart = await prisma.carrier.create({
    data: { organizationId: flipex.id, name: 'Blue Dart Express', code: 'BLUEDART', contactEmail: 'support@bluedart.com', contactPhone: '+91-1800-233-3333', rating: 4.5 },
  });

  const delhivery = await prisma.carrier.create({
    data: { organizationId: flipex.id, name: 'Delhivery', code: 'DELHIVERY', contactEmail: 'support@delhivery.com', contactPhone: '+91-1800-102-4332', rating: 4.3 },
  });

  const dtdc = await prisma.carrier.create({
    data: { organizationId: bharatSupply.id, name: 'DTDC Express', code: 'DTDC', contactEmail: 'support@dtdc.in', contactPhone: '+91-1860-233-3345', rating: 4.2 },
  });

  console.log(`✓ Created 3 carriers`);

  // Create Warehouses
  console.log('Creating warehouses...');
  const mumbaiWH = await prisma.warehouse.create({
    data: { organizationId: flipex.id, name: 'Mumbai Distribution Center', code: 'MUM-DC-01', address: 'Plot No. 45, MIDC Industrial Area', city: 'Mumbai', state: 'Maharashtra', country: 'India', postalCode: '400001', latitude: 19.0760, longitude: 72.8777, capacity: 10000, currentLoad: 3500 },
  });

  const delhiWH = await prisma.warehouse.create({
    data: { organizationId: flipex.id, name: 'Delhi Logistics Hub', code: 'DEL-HUB-01', address: 'Sector 63, Noida Industrial Area', city: 'New Delhi', state: 'Delhi', country: 'India', postalCode: '110001', latitude: 28.7041, longitude: 77.1025, capacity: 15000, currentLoad: 8200 },
  });

  const bangaloreWH = await prisma.warehouse.create({
    data: { organizationId: flipex.id, name: 'Bangalore Tech Hub', code: 'BLR-TH-01', address: '45, Electronics City Phase 1', city: 'Bangalore', state: 'Karnataka', country: 'India', postalCode: '560001', latitude: 12.9716, longitude: 77.5946, capacity: 12000, currentLoad: 5500 },
  });

  const puneWH = await prisma.warehouse.create({
    data: { organizationId: bharatSupply.id, name: 'Pune Distribution Hub', code: 'PUN-DH-01', address: 'Chakan Industrial Area, MIDC', city: 'Pune', state: 'Maharashtra', country: 'India', postalCode: '411001', latitude: 18.5204, longitude: 73.8567, capacity: 8000, currentLoad: 3200 },
  });

  console.log(`✓ Created 4 warehouses`);

  // Create Routes
  console.log('Creating routes...');
  const route1 = await prisma.route.create({
    data: { name: 'Mumbai to Delhi Express', originWarehouseId: mumbaiWH.id, destinationWarehouseId: delhiWH.id, distance: 1420.5, estimatedTime: 36 },
  });

  const route2 = await prisma.route.create({
    data: { name: 'Delhi to Bangalore Tech Route', originWarehouseId: delhiWH.id, destinationWarehouseId: bangaloreWH.id, distance: 2165.8, estimatedTime: 48 },
  });

  const route3 = await prisma.route.create({
    data: { name: 'Bangalore to Mumbai', originWarehouseId: bangaloreWH.id, destinationWarehouseId: mumbaiWH.id, distance: 984.5, estimatedTime: 24 },
  });

  console.log(`✓ Created 3 routes`);

  // Create Shipments
  console.log('Creating shipments...');
  const now = new Date();
  const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const inThreeDays = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
  const inFiveDays = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);
  const inSevenDays = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const ship1 = await prisma.shipment.create({
    data: {
      trackingNumber: 'FLIPEX-2024-001', organizationId: flipex.id, createdById: users[1].id, carrierId: bluedart.id, routeId: route1.id,
      originWarehouseId: mumbaiWH.id, destinationWarehouseId: delhiWH.id, status: 'IN_TRANSIT', priority: 'HIGH',
      productName: 'Electronics Shipment', productDescription: 'Smartphones and tablets for Delhi retailers', quantity: 500, weight: 2500.5, dimensions: '120x80x80 cm',
      estimatedDepartureTime: twoDaysAgo, actualDepartureTime: twoDaysAgo, estimatedDeliveryTime: inThreeDays, currentLocation: 'Surat, Gujarat', notes: 'Handle with care - fragile electronics',
    },
  });

  const ship2 = await prisma.shipment.create({
    data: {
      trackingNumber: 'FLIPEX-2024-002', organizationId: flipex.id, createdById: users[2].id, carrierId: delhivery.id, routeId: route2.id,
      originWarehouseId: delhiWH.id, destinationWarehouseId: bangaloreWH.id, status: 'DELIVERED', priority: 'NORMAL',
      productName: 'Automotive Parts', quantity: 200, weight: 1800.0, estimatedDepartureTime: threeDaysAgo, actualDepartureTime: threeDaysAgo,
      estimatedDeliveryTime: oneDayAgo, actualDeliveryTime: oneDayAgo, currentLocation: 'Bangalore, Karnataka',
    },
  });

  const ship3 = await prisma.shipment.create({
    data: {
      trackingNumber: 'FLIPEX-2024-003', organizationId: flipex.id, createdById: users[1].id, carrierId: bluedart.id, routeId: route3.id,
      originWarehouseId: bangaloreWH.id, destinationWarehouseId: mumbaiWH.id, status: 'DELAYED', priority: 'URGENT',
      productName: 'Medical Supplies', productDescription: 'Temperature-controlled pharmaceutical shipment', quantity: 100, weight: 800.0, dimensions: '60x40x40 cm',
      estimatedDepartureTime: twoDaysAgo, actualDepartureTime: twoDaysAgo, estimatedDeliveryTime: oneDayAgo, currentLocation: 'Pune, Maharashtra',
      notes: 'URGENT - Pharmaceutical supplies, temperature 2-8°C',
    },
  });

  const ship4 = await prisma.shipment.create({
    data: {
      trackingNumber: 'FLIPEX-2024-004', organizationId: flipex.id, createdById: users[3].id, carrierId: delhivery.id,
      originWarehouseId: mumbaiWH.id, destinationWarehouseId: delhiWH.id, status: 'PENDING', priority: 'NORMAL',
      productName: 'Fashion Apparel', quantity: 50, weight: 1500.0, estimatedDeliveryTime: inSevenDays, notes: 'Festive season collection - awaiting pickup',
    },
  });

  const ship5 = await prisma.shipment.create({
    data: {
      trackingNumber: 'BHARAT-2024-001', organizationId: bharatSupply.id, createdById: users[6].id, carrierId: dtdc.id,
      originWarehouseId: puneWH.id, destinationWarehouseId: puneWH.id, status: 'IN_TRANSIT', priority: 'HIGH',
      productName: 'Industrial Equipment', quantity: 1000, weight: 3000.0, estimatedDepartureTime: oneDayAgo, actualDepartureTime: oneDayAgo,
      estimatedDeliveryTime: inFiveDays, currentLocation: 'Nashik, Maharashtra',
    },
  });

  console.log(`✓ Created 5 shipments`);

  // Create Shipment History
  console.log('Creating shipment history...');
  await prisma.shipmentHistory.createMany({
    data: [
      { shipmentId: ship1.id, status: 'PENDING', location: 'Mumbai, Maharashtra', latitude: 19.0760, longitude: 72.8777, timestamp: twoDaysAgo, notes: 'Shipment created' },
      { shipmentId: ship1.id, status: 'IN_TRANSIT', location: 'Ahmedabad, Gujarat', latitude: 23.0225, longitude: 72.5714, timestamp: oneDayAgo, notes: 'Departed from origin' },
      { shipmentId: ship1.id, status: 'IN_TRANSIT', location: 'Surat, Gujarat', latitude: 21.1702, longitude: 72.8311, timestamp: now, notes: 'In transit through Surat' },
      { shipmentId: ship2.id, status: 'PENDING', location: 'New Delhi', timestamp: threeDaysAgo },
      { shipmentId: ship2.id, status: 'IN_TRANSIT', location: 'Jaipur, Rajasthan', timestamp: twoDaysAgo },
      { shipmentId: ship2.id, status: 'DELIVERED', location: 'Bangalore, Karnataka', latitude: 12.9716, longitude: 77.5946, timestamp: oneDayAgo, notes: 'Delivered successfully' },
      { shipmentId: ship3.id, status: 'PENDING', location: 'Bangalore, Karnataka', timestamp: twoDaysAgo },
      { shipmentId: ship3.id, status: 'IN_TRANSIT', location: 'Belgaum, Karnataka', timestamp: oneDayAgo },
      { shipmentId: ship3.id, status: 'DELAYED', location: 'Pune, Maharashtra', timestamp: now, notes: 'Delay due to heavy monsoon rains on NH-48' },
    ],
  });

  console.log(`✓ Created shipment history`);

  // Create Alerts
  console.log('Creating alerts...');
  await prisma.alert.createMany({
    data: [
      { userId: users[0].id, shipmentId: ship1.id, type: 'SHIPMENT_IN_TRANSIT', severity: 'INFO', title: 'Shipment On The Way', message: 'Shipment FLIPEX-2024-001 is in transit to Delhi', isRead: true, createdAt: oneDayAgo },
      { userId: users[1].id, shipmentId: ship3.id, type: 'SHIPMENT_DELAYED', severity: 'CRITICAL', title: 'Urgent Shipment Delayed', message: 'Pharmaceutical shipment FLIPEX-2024-003 delayed in Pune due to heavy monsoon rains', isRead: false, createdAt: now },
      { userId: users[2].id, shipmentId: ship2.id, type: 'SHIPMENT_DELIVERED', severity: 'INFO', title: 'Shipment Delivered', message: 'Shipment FLIPEX-2024-002 successfully delivered to Bangalore', isRead: true, createdAt: oneDayAgo },
      { userId: users[0].id, type: 'WAREHOUSE_CAPACITY', severity: 'WARNING', title: 'Warehouse Capacity Alert', message: 'Delhi Logistics Hub is at 55% capacity', data: { warehouseId: delhiWH.id, percentFull: 55 }, isRead: false, createdAt: now },
      { userId: users[3].id, shipmentId: ship4.id, type: 'SHIPMENT_CREATED', severity: 'INFO', title: 'Shipment Created', message: 'Your shipment FLIPEX-2024-004 (Fashion Apparel) created and pending pickup', isRead: false, createdAt: now },
    ],
  });

  console.log(`✓ Created 5 alerts`);

  // Create Activities
  console.log('Creating activities...');
  await prisma.activity.createMany({
    data: [
      { userId: users[1].id, shipmentId: ship1.id, type: 'SHIPMENT_CREATED', description: 'Created shipment FLIPEX-2024-001 for electronics', createdAt: twoDaysAgo },
      { userId: users[1].id, shipmentId: ship1.id, type: 'STATUS_CHANGED', description: 'Status changed from PENDING to IN_TRANSIT', createdAt: oneDayAgo },
      { userId: users[2].id, shipmentId: ship2.id, type: 'SHIPMENT_CREATED', description: 'Created shipment FLIPEX-2024-002 for automotive parts', createdAt: threeDaysAgo },
      { userId: users[2].id, shipmentId: ship2.id, type: 'STATUS_CHANGED', description: 'Status changed to DELIVERED', createdAt: oneDayAgo },
      { userId: users[1].id, shipmentId: ship3.id, type: 'SHIPMENT_CREATED', description: 'Created urgent pharmaceutical shipment FLIPEX-2024-003', createdAt: twoDaysAgo },
      { userId: users[1].id, shipmentId: ship3.id, type: 'STATUS_CHANGED', description: 'Status changed to DELAYED due to monsoon', createdAt: now },
      { userId: users[1].id, shipmentId: ship3.id, type: 'ALERT_CREATED', description: 'Critical alert for delayed urgent shipment', createdAt: now },
    ],
  });

  console.log(`✓ Created activity logs`);

  console.log('\n✅ Database seeded successfully with Indian locations!');
  console.log('\n📋 Test Credentials:');
  console.log('=====================================');
  console.log('FlipEx Logistics:');
  console.log('  Admin:    admin@flipex.in / password123');
  console.log('  Manager1: priya.sharma@flipex.in / password123');
  console.log('  Manager2: amit.patel@flipex.in / password123');
  console.log('  User:     user@flipex.in / password123');
  console.log('  Viewer:   viewer@flipex.in / password123');
  console.log('\nBharat Supply Chain:');
  console.log('  Admin:    admin@bharatsupply.in / password123');
  console.log('  Manager:  manager@bharatsupply.in / password123');
  console.log('=====================================\n');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
