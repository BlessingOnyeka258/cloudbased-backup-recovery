<script>
  import { login } from '../store/UserStore';
  
  let username = '';
  let password = '';
  let error = '';
  let loading = false;

  const handleLogin = async () => {
    loading = true;
    error = '';
    
    // Artificial delay for premium feel
    setTimeout(() => {
      const success = login(username, password);
      if (!success) {
        error = 'Invalid credentials. Please try again.';
      }
      loading = false;
    }, 1500);
  };
</script>

<div class="login-page">
  <div class="login-card glass animate-fade-in">
    <div class="logo-area flex-center">
      <div class="logo-icon"></div>
      <h1>CloudRecover</h1>
    </div>

    <div class="login-header">
      <h2>Secure Access</h2>
      <p>Enter your credentials to access the recovery dashboard.</p>
    </div>

    <form on:submit|preventDefault={handleLogin}>
      <div class="form-group">
        <label for="username">Username</label>
        <input 
          type="text" 
          id="username" 
          bind:value={username} 
          placeholder="admin@cloudrecover.com" 
          required
        />
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input 
          type="password" 
          id="password" 
          bind:value={password} 
          placeholder="••••••••" 
          required
        />
      </div>

      {#if error}
        <p class="error-msg">{error}</p>
      {/if}

      <button type="submit" class="btn btn-primary login-btn" disabled={loading}>
        {#if loading}
          <span class="spinner"></span>
          Authenticating...
        {:else}
          Sign In
        {/if}
      </button>
    </form>

    <div class="login-footer">
      <p>Forgot password? <a href="/">Contact Support</a></p>
    </div>
  </div>
</div>

<style>
  .login-page {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: radial-gradient(circle at top left, #f1f5f9, #f8fafc);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .login-card {
    width: 440px;
    padding: 3rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .logo-area {
    gap: 0.75rem;
    justify-content: center;
  }

  .logo-icon {
    width: 36px;
    height: 36px;
    background: linear-gradient(135deg, var(--accent-cyan), var(--accent-purple));
    border-radius: 10px;
    box-shadow: 0 0 20px rgba(14, 165, 233, 0.2);
  }

  .login-header {
    text-align: center;
  }

  .login-header h2 {
    font-size: 1.75rem;
    margin-bottom: 0.5rem;
  }

  .login-header p {
    color: var(--text-secondary);
    font-size: 0.9rem;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  label {
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--text-secondary);
  }

  input {
    background: var(--bg-tertiary);
    border: 1px solid var(--border-subtle);
    padding: 0.9rem 1.25rem;
    border-radius: 12px;
    color: var(--text-primary);
    font-size: 1rem;
    outline: none;
    transition: var(--transition-fast);
  }

  input:focus {
    border-color: var(--accent-cyan);
    background: white;
    box-shadow: 0 0 10px rgba(14, 165, 233, 0.05);
  }

  .login-btn {
    margin-top: 1rem;
    width: 100%;
    justify-content: center;
    height: 52px;
  }

  .error-msg {
    color: #ff3232;
    font-size: 0.85rem;
    text-align: center;
    font-weight: 500;
  }

  .login-footer {
    text-align: center;
    font-size: 0.85rem;
    color: var(--text-muted);
  }

  .login-footer a {
    color: var(--accent-cyan);
    text-decoration: none;
    font-weight: 600;
  }

  .spinner {
    width: 18px;
    height: 18px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin-right: 0.5rem;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
</style>
