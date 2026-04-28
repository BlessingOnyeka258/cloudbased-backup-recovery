<header class="header glass">
  <div class="search-bar">
    <span class="icon">🔍</span>
    <input type="text" placeholder="Search devices, backups, or logs..." />
  </div>

  <div class="header-actions">
    <div class="system-status">
      <div class="status-dot"></div>
      Cloud System: <span class="status-text">Operational</span>
    </div>
    
    <button class="icon-btn">
      <span class="icon">🔔</span>
      <span class="notification-badge">3</span>
    </button>
    
    <button class="btn btn-primary">
      <span class="icon">⚡</span>
      Quick Sync
    </button>
  </div>
</header>

<style>
  .header {
    height: 70px;
    margin: 1rem 1rem 1rem 300px;
    padding: 0 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    z-index: 90;
  }

  .search-bar {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    background: var(--bg-tertiary);
    padding: 0.6rem 1.25rem;
    border-radius: 12px;
    width: 400px;
    border: 1px solid var(--border-subtle);
  }

  .search-bar input {
    background: transparent;
    border: none;
    color: var(--text-primary);
    width: 100%;
    outline: none;
    font-size: 0.9rem;
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 2rem;
  }

  .system-status {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.85rem;
    color: var(--text-secondary);
  }

  .status-dot {
    width: 8px;
    height: 8px;
    background: var(--accent-emerald);
    border-radius: 50%;
    box-shadow: 0 0 10px var(--accent-emerald);
  }

  .status-text {
    color: var(--accent-emerald);
    font-weight: 600;
  }

  .icon-btn {
    background: var(--bg-tertiary);
    border: 1px solid var(--border-subtle);
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    position: relative;
    transition: var(--transition-fast);
  }

  .icon-btn:hover {
    background: rgba(0, 0, 0, 0.03);
  }

  .notification-badge {
    position: absolute;
    top: -5px;
    right: -5px;
    background: var(--accent-purple);
    color: white;
    font-size: 0.65rem;
    padding: 2px 6px;
    border-radius: 10px;
    font-weight: 700;
    border: 2px solid var(--bg-secondary);
  }
</style>
