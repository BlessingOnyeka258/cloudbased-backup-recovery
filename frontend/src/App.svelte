<script>
  import './app.css';
  import { onMount } from 'svelte';
  import Sidebar from './lib/components/Sidebar.svelte';
  import Header from './lib/components/Header.svelte';
  import DeviceCard from './lib/components/DeviceCard.svelte';
  import Login from './lib/components/Login.svelte';
  import AddDeviceModal from './lib/components/AddDeviceModal.svelte';
  import BackupHistory from './lib/components/BackupHistory.svelte';
  import AuditLogs from './lib/components/AuditLogs.svelte';
  import { devices, fetchDevices, syncDevice, triggerRecovery, fetchBackups, fetchLogs } from './lib/store/DeviceStore';
  import { user } from './lib/store/UserStore';
  
  let activeTab = 'dashboard';
  let showAddModal = false;
  let selectedDeviceIds = new Set();

  onMount(() => {
    fetchDevices();
    fetchBackups();
    fetchLogs();
  });

  function handleToggleSelect(event) {
    const id = event.detail;
    if (selectedDeviceIds.has(id)) {
      selectedDeviceIds.delete(id);
    } else {
      selectedDeviceIds.add(id);
    }
    selectedDeviceIds = selectedDeviceIds; // trigger reactivity
  }

  function handleSelectAll() {
    if (selectedDeviceIds.size === $devices.length) {
      selectedDeviceIds = new Set();
    } else {
      selectedDeviceIds = new Set($devices.map(d => d.id));
    }
  }

  function bulkBackup() {
    selectedDeviceIds.forEach(id => syncDevice(id));
    selectedDeviceIds = new Set();
  }
</script>

{#if !$user.isLoggedIn}
  <Login />
{:else}
<main class="app-layout">
  <Sidebar bind:activeTab />
  
  <div class="main-content">
    <Header />
    
    <section class="content-area animate-fade-in">
      {#if activeTab === 'dashboard'}
        <div class="dashboard-grid">
          <div class="welcome-banner glass">
            <h2>Welcome back, Abduljelil</h2>
            <p>Your endpoint recovery system is monitoring {$devices.length} active devices. No threats detected in the last 24 hours.</p>
          </div>

          <div class="stats-overview grid-auto">
            <div class="stat-card glass glass-hover">
              <span class="label">Total Endpoints</span>
              <span class="value">{$devices.length}</span>
              <span class="trend up">Active monitoring</span>
            </div>
            <div class="stat-card glass glass-hover">
              <span class="label">Storage Used</span>
              <span class="value">1.2 TB</span>
              <span class="trend">85% of quota</span>
            </div>
            <div class="stat-card glass glass-hover">
              <span class="label">Recent Backups</span>
              <span class="value">158</span>
              <span class="trend up">All successful</span>
            </div>
          </div>

          <div class="section-header">
            <h3>Critical Endpoints</h3>
            <button class="btn-text" on:click={() => activeTab = 'devices'}>View All Devices →</button>
          </div>

          <div class="grid-auto">
            {#each $devices.slice(0, 3) as device}
              <DeviceCard 
                {device} 
                selected={selectedDeviceIds.has(device.id)} 
                on:toggleSelect={handleToggleSelect} 
              />
            {/each}
          </div>

          <div class="recent-activity glass">
            <h3>Recent System Activity</h3>
            <div class="activity-list">
              <div class="activity-item">
                <div class="dot info"></div>
                <div class="details">
                  <p class="title">Automated Backup Completed</p>
                  <p class="time">2 mins ago • Endpoint-X1</p>
                </div>
              </div>
              <div class="activity-item">
                <div class="dot success"></div>
                <div class="details">
                  <p class="title">System Integrity Check</p>
                  <p class="time">1 hour ago • All nodes</p>
                </div>
              </div>
              <div class="activity-item">
                <div class="dot warning"></div>
                <div class="details">
                  <p class="title">New Device Registered</p>
                  <p class="time">3 hours ago • Laptop-Sales-04</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      {:else}
        <div class="tab-content">
          <div class="section-header">
            <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
            {#if activeTab === 'devices'}
              <button class="btn btn-primary" on:click={() => showAddModal = true}>
                <span>➕</span> Add New Device
              </button>
            {/if}
          </div>

          {#if activeTab === 'devices'}
            <div class="tab-controls">
               <button class="btn btn-outline btn-sm" on:click={handleSelectAll}>
                 {selectedDeviceIds.size === $devices.length ? 'Deselect All' : 'Select All'}
               </button>
            </div>
            <div class="grid-auto">
              {#each $devices as device}
                <DeviceCard 
                  {device} 
                  selected={selectedDeviceIds.has(device.id)} 
                  on:toggleSelect={handleToggleSelect} 
                />
              {/each}
            </div>
          {:else if activeTab === 'backups'}
            <BackupHistory />
          {:else if activeTab === 'security'}
            <AuditLogs />
          {:else}
            <div class="placeholder flex-center glass">
              <p>Section: {activeTab} is currently under development.</p>
            </div>
          {/if}
        </div>
      {/if}
    </section>
  </div>
</main>

{#if showAddModal}
  <AddDeviceModal on:close={() => showAddModal = false} />
{/if}

{#if selectedDeviceIds.size > 0}
  <div class="bulk-action-bar glass animate-fade-in">
    <div class="selection-info">
      <span class="count">{selectedDeviceIds.size}</span> devices selected
    </div>
    <div class="bulk-actions">
      <button class="btn btn-outline" on:click={() => selectedDeviceIds = new Set()}>Cancel</button>
      <button class="btn btn-primary" on:click={bulkBackup}>
        <span>⚡</span> Bulk Backup
      </button>
      <button class="btn btn-outline" style="color: #ff3232; border-color: rgba(255,50,50,0.2)" on:click={() => {
        selectedDeviceIds.forEach(id => triggerRecovery(id));
        selectedDeviceIds = new Set();
      }}>
        <span>🔄</span> Bulk Recover
      </button>
    </div>
  </div>
{/if}
{/if}

<style>
  .bulk-action-bar {
    position: fixed;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    width: 650px;
    padding: 1.25rem 2.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 1000;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    border: 1px solid var(--border-subtle);
    border-radius: 20px;
    background: var(--bg-secondary);
  }

  .selection-info {
    font-weight: 500;
    color: var(--text-secondary);
  }

  .selection-info .count {
    color: var(--accent-cyan);
    font-size: 1.2rem;
    font-weight: 700;
    margin-right: 4px;
  }

  .bulk-actions {
    display: flex;
    gap: 1rem;
  }

  .tab-controls {
    margin-bottom: 1.5rem;
    display: flex;
    justify-content: flex-end;
  }

  .btn-sm {
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
  }

  .app-layout {
    display: flex;
    min-height: 100vh;
  }

  .main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .content-area {
    margin-left: 300px;
    padding: 1rem 2rem 2rem 1rem;
  }

  .dashboard-grid {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .tab-content {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .section-header h2 {
    font-size: 1.75rem;
  }

  .btn-text {
    background: transparent;
    border: none;
    color: var(--accent-cyan);
    font-weight: 600;
    cursor: pointer;
    font-size: 0.9rem;
  }

  .welcome-banner {
    padding: 2.5rem;
    background: linear-gradient(135deg, rgba(139, 92, 246, 0.05), rgba(14, 165, 233, 0.05));
    border: 1px solid var(--border-subtle);
  }

  .welcome-banner h2 {
    font-size: 2rem;
    margin-bottom: 0.5rem;
    background: linear-gradient(135deg, var(--text-primary), var(--text-secondary));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .welcome-banner p {
    color: var(--text-secondary);
    font-size: 1.1rem;
    max-width: 600px;
  }

  .stat-card {
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .stat-card .label {
    color: var(--text-muted);
    font-size: 0.9rem;
    font-weight: 500;
  }

  .stat-card .value {
    font-size: 2.5rem;
    font-weight: 700;
    font-family: 'Outfit', sans-serif;
  }

  .stat-card .trend {
    font-size: 0.8rem;
    font-weight: 600;
  }

  .trend.up { color: var(--accent-emerald); }

  .recent-activity {
    padding: 2rem;
  }

  .recent-activity h3 {
    margin-bottom: 1.5rem;
  }

  .activity-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .activity-item {
    display: flex;
    gap: 1.25rem;
    align-items: center;
  }

  .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
  }

  .dot.info { background: var(--accent-cyan); box-shadow: 0 0 8px var(--accent-cyan); }
  .dot.success { background: var(--accent-emerald); box-shadow: 0 0 8px var(--accent-emerald); }
  .dot.warning { background: var(--accent-orange); box-shadow: 0 0 8px var(--accent-orange); }

  .activity-item .title {
    font-size: 0.95rem;
    font-weight: 500;
  }

  .activity-item .time {
    font-size: 0.8rem;
    color: var(--text-muted);
  }

  .placeholder {
    height: 60vh;
    font-size: 1.2rem;
    color: var(--text-muted);
  }
</style>

