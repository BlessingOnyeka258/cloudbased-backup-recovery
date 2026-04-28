const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.auditLog.deleteMany({});
  await prisma.snapshot.deleteMany({});
  await prisma.device.deleteMany({});
  await prisma.user.deleteMany({});

  const user = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: 'password123',
      role: 'System Admin',
    },
  });

  const devices = [
    { name: 'Workstation-HQ-01', type: 'Workstation', storage: '124 GB', userId: user.id, health: 98 },
    { name: 'Manager-Laptop', type: 'Laptop', storage: '45 GB', userId: user.id, health: 92 },
    { name: 'Sales-Mobile-04', type: 'Mobile', storage: '12 GB', userId: user.id, health: 85 },
    { name: 'Dev-Ubuntu-Srv', type: 'Server', storage: '850 GB', userId: user.id, health: 100 },
    { name: 'Reception-PC', type: 'Workstation', storage: '200 GB', userId: user.id, health: 65 },
  ];

  console.log('Seeding devices...');
  for (const d of devices) {
    const device = await prisma.device.create({ data: d });
    
    // Create some initial backups for each device
    console.log(`Seeding backups for ${device.name}...`);
    for (let i = 0; i < 3; i++) {
      await prisma.snapshot.create({
        data: {
          deviceId: device.id,
          status: 'successful',
          size: (Math.random() * 5 + 1).toFixed(1) + ' GB',
          health: device.health - Math.floor(Math.random() * 5),
          timestamp: new Date(Date.now() - (i + 1) * 86400000) // 1, 2, 3 days ago
        }
      });
    }
  }

  // Create initial audit logs
  console.log('Seeding audit logs...');
  const initialLogs = [
    { action: 'SYSTEM_INIT', details: 'Endpoint recovery system initialized successfully.', user: 'System Admin' },
    { action: 'USER_LOGIN', details: 'Administrator logged in from IP 192.168.1.1', user: 'admin' },
    { action: 'BACKUP_POLICY_UPDATED', details: 'Daily automated backup policy enabled for all nodes.', user: 'System Admin' },
    { action: 'STORAGE_ALERT', details: 'Primary cloud storage reached 85% capacity.', user: 'System' },
  ];

  for (const log of initialLogs) {
    await prisma.auditLog.create({ data: log });
  }

  console.log('Database seeded successfully with Devices, Backups, and Audit Logs!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
