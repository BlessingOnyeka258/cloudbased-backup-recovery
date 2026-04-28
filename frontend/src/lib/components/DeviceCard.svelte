<script>
  import { createEventDispatcher } from 'svelte';
  import { syncDevice, triggerRecovery, devices } from '../store/DeviceStore';

  const dispatch = createEventDispatcher();

  export let device = {
    name: 'Endpoint-X1',
    status: 'online',
    lastSync: '2 mins ago',
    storage: '45 GB',
    health: 98,
    type: 'Workstation',
    syncing: false
  };

  export let selected = false;

  const getStatusColor = (status) => {
    switch(status) {
      case 'online': return 'var(--accent-emerald)';
      case 'offline': return 'var(--text-muted)';
      case 'warning': return 'var(--accent-orange)';
      case 'danger': return '#ff3232';
      default: return 'var(--text-secondary)';
    }
  };
</script>

<div class="device-card glass glass-hover {selected ? 'selected' : ''}">
  <div class="card-header">
    <div class="device-info">
      <input 
        type="checkbox" 
        checked={selected} 
        on:change={() => dispatch('toggleSelect', device.id)} 
        class="select-checkbox"
      />
      <span class="icon">💻</span>
      <div class="names">
        <h4>{device.name}</h4>
        <p>{device.type}</p>
      </div>
    </div>
    <div class="status-indicator {device.syncing ? 'syncing' : ''}" style="background: {getStatusColor(device.status)}; box-shadow: 0 0 10px {getStatusColor(device.status)};"></div>
  </div>

  <div class="card-body">
    <div class="metric">
      <span class="label">Last Backup</span>
      <span class="value">{device.syncing ? 'Syncing...' : device.lastSync}</span>
    </div>
    <div class="metric">
      <span class="label">Storage Used</span>
      <span class="value">{device.storage}</span>
    </div>
  </div>

  <div class="card-footer">
    <div class="health-bar-container">
      <div class="health-label">
        <span>System Health</span>
        <span>{device.health}%</span>
      </div>
      <div class="health-bar">
        <div class="health-fill" style="width: {device.health}%; background: {device.health > 90 ? 'var(--accent-emerald)' : (device.health > 50 ? 'var(--accent-orange)' : '#ff3232')}"></div>
      </div>
    </div>
    
    <div class="actions">
      {#if device.status === 'danger' || device.health < 50}
        <button class="btn btn-primary btn-sm" on:click={() => triggerRecovery(device.id)}>
          Automated Recovery
        </button>
      {:else}
        <button class="btn-icon" title="Trigger Manual Backup" on:click={() => syncDevice(device.id)} disabled={device.syncing}>
          {device.syncing ? '⏳' : '⚡'}
        </button>
        <button class="btn-icon danger" title="Simulate Threat" on:click={() => {
          devices.update(items => items.map(d => d.id === device.id ? {...d, status: 'danger', health: 10} : d))
        }}>
          ☣️
        </button>
      {/if}
    </div>
  </div>
</div>


<style>
  .device-card {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    position: relative;
    transition: var(--transition-base);
  }

  .device-card.selected {
    border-color: var(--accent-cyan);
    background: rgba(14, 165, 233, 0.05);
    box-shadow: 0 0 20px rgba(14, 165, 233, 0.05);
  }

  .select-checkbox {
    width: 18px;
    height: 18px;
    margin-right: 0.5rem;
    accent-color: var(--accent-cyan);
    cursor: pointer;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .device-info {
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  .device-info .icon {
    font-size: 1.5rem;
    background: var(--bg-tertiary);
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    border: 1px solid var(--border-subtle);
  }

  .names h4 {
    font-size: 1rem;
    margin-bottom: 0.1rem;
  }

  .names p {
    font-size: 0.75rem;
    color: var(--text-muted);
  }

  .status-indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-top: 5px;
  }

  .card-body {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .metric {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .metric .label {
    font-size: 0.7rem;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .metric .value {
    font-size: 0.9rem;
    font-weight: 600;
  }

  .card-footer {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding-top: 1rem;
    border-top: 1px solid var(--border-subtle);
  }

  .health-bar-container {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .health-label {
    display: flex;
    justify-content: space-between;
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--text-secondary);
  }

  .health-bar {
    height: 4px;
    background: var(--bg-tertiary);
    border-radius: 2px;
    overflow: hidden;
  }

  .health-fill {
    height: 100%;
    transition: width 0.5s ease;
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
  }

  .btn-icon {
    background: var(--bg-tertiary);
    border: 1px solid var(--border-subtle);
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: var(--transition-fast);
    font-size: 0.9rem;
  }

  .btn-icon:hover {
    background: rgba(0, 0, 0, 0.05);
  }

  .btn-icon.danger:hover {
    background: rgba(255, 50, 50, 0.1);
    border-color: rgba(255, 50, 50, 0.2);
  }
</style>
