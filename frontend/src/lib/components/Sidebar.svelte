<script>
  import { logout } from '../store/UserStore';
  export let activeTab = 'dashboard';
</script>

<aside class="sidebar glass">
  <div class="logo-area flex-center">
    <div class="logo-icon"></div>
    <h1>CloudRecover</h1>
  </div>

  <nav class="nav-links">
    <button 
      class="nav-item {activeTab === 'dashboard' ? 'active' : ''}" 
      on:click={() => activeTab = 'dashboard'}
    >
      <span class="icon">📊</span>
      Dashboard
    </button>
    <button 
      class="nav-item {activeTab === 'devices' ? 'active' : ''}" 
      on:click={() => activeTab = 'devices'}
    >
      <span class="icon">💻</span>
      Endpoint Devices
    </button>
    <button 
      class="nav-item {activeTab === 'backups' ? 'active' : ''}" 
      on:click={() => activeTab = 'backups'}
    >
      <span class="icon">☁️</span>
      Backup History
    </button>
    <button 
      class="nav-item {activeTab === 'security' ? 'active' : ''}" 
      on:click={() => activeTab = 'security'}
    >
      <span class="icon">🛡️</span>
      Security & Audit
    </button>
    <button 
      class="nav-item {activeTab === 'settings' ? 'active' : ''}" 
      on:click={() => activeTab = 'settings'}
    >
      <span class="icon">⚙️</span>
      Settings
    </button>
  </nav>

  <div class="sidebar-footer">
    <div class="user-profile">
      <div class="avatar">AJ</div>
      <div class="user-info">
        <p class="name">Abduljelil</p>
        <p class="role">System Admin</p>
      </div>
      <button class="logout-btn" on:click={logout} title="Sign Out">
        🚪
      </button>
    </div>
  </div>
</aside>

<style>
  .sidebar {
    width: 280px;
    height: calc(100vh - 2rem);
    margin: 1rem;
    padding: 2rem 1.5rem;
    display: flex;
    flex-direction: column;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 100;
  }

  .logo-area {
    gap: 0.75rem;
    margin-bottom: 3rem;
    justify-content: flex-start;
  }

  .logo-icon {
    width: 32px;
    height: 32px;
    background: linear-gradient(135deg, var(--accent-cyan), var(--accent-purple));
    border-radius: 8px;
    box-shadow: 0 0 15px rgba(14, 165, 233, 0.2);
  }

  h1 {
    font-size: 1.25rem;
    letter-spacing: -0.5px;
  }

  .nav-links {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    flex: 1;
  }

  .nav-item {
    background: transparent;
    border: none;
    color: var(--text-secondary);
    padding: 1rem 1.25rem;
    border-radius: 12px;
    text-align: left;
    display: flex;
    align-items: center;
    gap: 1rem;
    font-family: 'Inter', sans-serif;
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition-fast);
  }

  .nav-item:hover {
    background: rgba(0, 0, 0, 0.03);
    color: var(--text-primary);
  }

  .nav-item.active {
    background: rgba(14, 165, 233, 0.08);
    color: var(--accent-cyan);
    border: 1px solid rgba(14, 165, 233, 0.15);
  }

  .icon {
    font-size: 1.25rem;
  }

  .sidebar-footer {
    margin-top: auto;
    padding-top: 2rem;
    border-top: 1px solid var(--border-subtle);
  }

  .user-profile {
    display: flex;
    align-items: center;
    gap: 1rem;
    position: relative;
  }

  .avatar {
    width: 40px;
    height: 40px;
    background: var(--bg-primary);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    color: var(--accent-purple);
    border: 1px solid var(--border-subtle);
    flex-shrink: 0;
  }

  .user-info {
    flex: 1;
  }

  .user-info .name {
    font-size: 0.9rem;
    font-weight: 600;
  }

  .user-info .role {
    font-size: 0.75rem;
    color: var(--text-muted);
  }

  .logout-btn {
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: 1.2rem;
    opacity: 0.6;
    transition: var(--transition-fast);
  }

  .logout-btn:hover {
    opacity: 1;
    transform: scale(1.1);
  }
</style>

