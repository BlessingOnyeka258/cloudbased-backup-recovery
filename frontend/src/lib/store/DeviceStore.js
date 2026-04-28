import { writable } from 'svelte/store';

const initialDevices = [
  { id: 1, name: 'Workstation-HQ-01', status: 'online', lastSync: '1 min ago', storage: '124 GB', health: 98, type: 'Workstation', syncing: false },
  { id: 2, name: 'Manager-Laptop', status: 'online', lastSync: '15 mins ago', storage: '45 GB', health: 92, type: 'Laptop', syncing: false },
  { id: 3, name: 'Sales-Mobile-04', status: 'offline', lastSync: '2 hours ago', storage: '12 GB', health: 85, type: 'Mobile', syncing: false },
  { id: 4, name: 'Dev-Ubuntu-Srv', status: 'online', lastSync: 'Just now', storage: '850 GB', health: 100, type: 'Server', syncing: true },
  { id: 5, name: 'Reception-PC', status: 'warning', lastSync: '1 day ago', storage: '200 GB', health: 65, type: 'Workstation', syncing: false },
  { id: 6, name: 'Design-MacBook', status: 'online', lastSync: '5 mins ago', storage: '340 GB', health: 95, type: 'Laptop', syncing: false },
];

export const devices = writable([]);
export const backups = writable([]);
export const logs = writable([]);

export const fetchDevices = async () => {
  try {
    const res = await fetch('/api/devices');
    const data = await res.json();
    devices.set(data);
  } catch (error) {
    console.error('Failed to fetch devices:', error);
  }
};

export const fetchBackups = async () => {
  try {
    const res = await fetch('/api/backups');
    const data = await res.json();
    backups.set(data);
  } catch (error) {
    console.error('Failed to fetch backups:', error);
  }
};

export const fetchLogs = async () => {
  try {
    const res = await fetch('/api/logs');
    const data = await res.json();
    logs.set(data);
  } catch (error) {
    console.error('Failed to fetch logs:', error);
  }
};

export const syncDevice = async (id) => {
  devices.update(items => items.map(d => d.id === id ? { ...d, syncing: true } : d));
  
  try {
    // Find device to get current health and random size
    let device;
    devices.subscribe(items => device = items.find(d => d.id === id))();
    
    const res = await fetch('/api/backups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        deviceId: id,
        status: 'successful',
        size: (Math.random() * 5 + 1).toFixed(1) + ' GB',
        health: device ? device.health : 100
      })
    });
    
    if (res.ok) {
      await fetchBackups();
      await fetchLogs();
      await fetchDevices();
    }
  } catch (error) {
    console.error('Sync failed:', error);
  } finally {
    devices.update(items => items.map(d => d.id === id ? { ...d, syncing: false } : d));
  }
};

export const triggerRecovery = async (id) => {
  try {
    await fetch('/api/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'RECOVERY_TRIGGERED',
        details: `Recovery initiated for device ${id}`
      })
    });
    // For now, simulate recovery effect on UI
    devices.update(items => items.map(d => d.id === id ? { ...d, status: 'online', health: 100 } : d));
    await fetchLogs();
  } catch (error) {
    console.error('Recovery trigger failed:', error);
  }
};

export const addDeviceToDB = async (deviceData) => {
  try {
    const res = await fetch('/api/devices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...deviceData, userId: 'demo-user-id' })
    });
    const newDevice = await res.json();
    devices.update(items => [...items, newDevice]);
    
    await fetch('/api/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'DEVICE_ADDED',
        details: `New device registered: ${deviceData.name}`
      })
    });
    await fetchLogs();
  } catch (error) {
    console.error('Failed to add device:', error);
  }
};

// Simulation Loop: Randomly trigger syncs for online devices
if (typeof window !== 'undefined') {
  setInterval(() => {
    devices.update(items => {
      const eligible = items.filter(d => d.status === 'online' && !d.syncing);
      if (eligible.length > 0 && Math.random() > 0.9) { // Reduced frequency for demo
        const target = eligible[Math.floor(Math.random() * eligible.length)];
        setTimeout(() => syncDevice(target.id), 0);
      }
      return items;
    });
  }, 30000); // Check every 30 seconds
}
