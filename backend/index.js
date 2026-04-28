const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Basic Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'Operational', database: 'Connected' });
});

// Device Routes
app.get('/api/devices', async (req, res) => {
  try {
    const devices = await prisma.device.findMany({
      include: { snapshots: { take: 5, orderBy: { timestamp: 'desc' } } }
    });
    res.json(devices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Backup & Snapshot Routes
app.get('/api/backups', async (req, res) => {
  try {
    const snapshots = await prisma.snapshot.findMany({
      include: { device: true },
      orderBy: { timestamp: 'desc' }
    });
    res.json(snapshots);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/backups', async (req, res) => {
  const { deviceId, status, size, health } = req.body;
  try {
    const [snapshot, log] = await prisma.$transaction([
      prisma.snapshot.create({
        data: { deviceId, status: status || 'successful', size, health }
      }),
      prisma.device.update({
        where: { id: deviceId },
        data: { lastSync: new Date() }
      }),
      prisma.auditLog.create({
        data: {
          action: 'BACKUP_CREATED',
          details: `Backup created for device ${deviceId} (Size: ${size})`
        }
      })
    ]);
    res.status(201).json(snapshot);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Audit Log Routes
app.get('/api/logs', async (req, res) => {
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { timestamp: 'desc' }
    });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/logs', async (req, res) => {
  const { action, details, user } = req.body;
  try {
    const log = await prisma.auditLog.create({
      data: { action, details, user }
    });
    res.status(201).json(log);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/devices', async (req, res) => {
  const { name, type, storage, userId } = req.body;
  try {
    const device = await prisma.device.create({
      data: { name, type, storage, userId }
    });
    res.status(201).json(device);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
