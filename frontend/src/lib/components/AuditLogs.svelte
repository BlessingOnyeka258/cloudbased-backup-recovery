<script>
  import { logs, fetchLogs } from '../store/DeviceStore';
  import { onMount } from 'svelte';

  onMount(() => {
    fetchLogs();
  });

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString();
  };

  const getActionClass = (action) => {
    if (action.includes('CREATED') || action.includes('ADDED')) return 'action-success';
    if (action.includes('TRIGGERED') || action.includes('INITIATED')) return 'action-info';
    if (action.includes('FAILED') || action.includes('ERROR')) return 'action-danger';
    return '';
  };
</script>

<div class="audit-logs animate-fade-in">
  <div class="logs-container glass">
    <div class="logs-header">
      <h3>System Event Audit Trail</h3>
      <button class="btn-text" on:click={fetchLogs}>Refresh Logs</button>
    </div>
    
    <div class="logs-list">
      {#if $logs.length === 0}
        <div class="no-logs">No system events logged.</div>
      {:else}
        {#each $logs as log}
          <div class="log-item">
            <div class="log-marker {getActionClass(log.action)}"></div>
            <div class="log-content">
              <div class="log-top">
                <span class="action-tag">{log.action}</span>
                <span class="log-time">{formatDate(log.timestamp)}</span>
              </div>
              <p class="log-details">{log.details}</p>
              <div class="log-footer">
                <span class="user-tag">User: {log.user}</span>
                <span class="id-tag">ID: {log.id.substring(0, 8)}</span>
              </div>
            </div>
          </div>
        {/each}
      {/if}
    </div>
  </div>
</div>

<style>
  .audit-logs {
    display: flex;
    flex-direction: column;
  }

  .logs-container {
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .logs-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--border-subtle);
    padding-bottom: 1rem;
  }

  .logs-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-height: 600px;
    overflow-y: auto;
    padding-right: 0.5rem;
  }

  .log-item {
    display: flex;
    gap: 1.25rem;
    padding: 1.25rem;
    background: rgba(0, 0, 0, 0.02);
    border: 1px solid var(--border-subtle);
    border-radius: 12px;
    transition: var(--transition-fast);
  }

  .log-item:hover {
    background: rgba(0, 0, 0, 0.04);
    border-color: var(--text-muted);
  }

  .log-marker {
    width: 4px;
    border-radius: 2px;
    background: var(--text-muted);
    flex-shrink: 0;
  }

  .action-success { background: var(--accent-emerald); }
  .action-info { background: var(--accent-cyan); }
  .action-danger { background: #ef4444; }

  .log-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .log-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .action-tag {
    font-size: 0.7rem;
    font-weight: 700;
    color: var(--text-primary);
    background: var(--bg-tertiary);
    padding: 0.2rem 0.6rem;
    border-radius: 4px;
    letter-spacing: 0.5px;
  }

  .log-time {
    font-size: 0.8rem;
    color: var(--text-muted);
  }

  .log-details {
    font-size: 0.95rem;
    color: var(--text-secondary);
    line-height: 1.4;
  }

  .log-footer {
    display: flex;
    gap: 1.5rem;
    font-size: 0.75rem;
    color: var(--text-muted);
    margin-top: 0.25rem;
  }

  .btn-text {
    background: transparent;
    border: none;
    color: var(--accent-cyan);
    font-weight: 600;
    cursor: pointer;
    font-size: 0.9rem;
  }

  .no-logs {
    text-align: center;
    padding: 3rem;
    color: var(--text-muted);
  }
</style>
