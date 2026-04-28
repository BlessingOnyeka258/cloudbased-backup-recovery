<script>
  import { backups, fetchBackups } from '../store/DeviceStore';
  import { onMount } from 'svelte';

  onMount(() => {
    fetchBackups();
  });

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString();
  };
</script>

<div class="backup-history animate-fade-in">
  <div class="table-container glass">
    <table class="history-table">
      <thead>
        <tr>
          <th>Snapshot ID</th>
          <th>Endpoint Device</th>
          <th>Status</th>
          <th>Size</th>
          <th>Health</th>
          <th>Timestamp</th>
        </tr>
      </thead>
      <tbody>
        {#if $backups.length === 0}
          <tr>
            <td colspan="6" class="no-data">No backup snapshots found.</td>
          </tr>
        {:else}
          {#each $backups as backup}
            <tr>
              <td class="id-cell">{backup.id.substring(0, 8)}...</td>
              <td class="device-cell">
                <span class="icon">💻</span>
                {backup.device?.name || 'Unknown'}
              </td>
              <td>
                <span class="badge {backup.status === 'successful' ? 'badge-success' : 'badge-danger'}">
                  {backup.status}
                </span>
              </td>
              <td class="size-cell">{backup.size}</td>
              <td>
                <div class="health-mini">
                  <div class="health-dot" style="background: {backup.health > 90 ? 'var(--accent-emerald)' : 'var(--accent-orange)'}"></div>
                  {backup.health}%
                </div>
              </td>
              <td class="time-cell">{formatDate(backup.timestamp)}</td>
            </tr>
          {/each}
        {/if}
      </tbody>
    </table>
  </div>
</div>

<style>
  .backup-history {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .table-container {
    padding: 1rem;
    overflow-x: auto;
  }

  .history-table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
    font-size: 0.9rem;
  }

  th {
    padding: 1rem;
    color: var(--text-muted);
    font-weight: 500;
    border-bottom: 1px solid var(--border-subtle);
    text-transform: uppercase;
    font-size: 0.75rem;
    letter-spacing: 0.5px;
  }

  td {
    padding: 1.25rem 1rem;
    border-bottom: 1px solid var(--border-subtle);
    color: var(--text-primary);
  }

  tr:last-child td {
    border-bottom: none;
  }

  .id-cell {
    font-family: monospace;
    color: var(--text-muted);
  }

  .device-cell {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-weight: 500;
  }

  .no-data {
    text-align: center;
    padding: 4rem;
    color: var(--text-muted);
  }

  .health-mini {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
  }

  .health-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }

  .size-cell {
    font-weight: 600;
    color: var(--accent-cyan);
  }

  .time-cell {
    color: var(--text-secondary);
    font-size: 0.85rem;
  }
</style>
