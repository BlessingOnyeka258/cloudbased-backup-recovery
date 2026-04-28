<script>
  import { createEventDispatcher } from 'svelte';
  import { addDeviceToDB } from '../store/DeviceStore';

  const dispatch = createEventDispatcher();
  
  let name = '';
  let type = 'Workstation';
  let storage = '0';
  let error = '';

  const addDevice = async () => {
    if (!name || !storage) {
      error = 'Please fill in all fields.';
      return;
    }

    await addDeviceToDB({
      name,
      type,
      storage: storage + ' GB'
    });

    dispatch('close');
  };
</script>

<div class="modal-overlay" on:click|self={() => dispatch('close')}>
  <div class="modal-card glass animate-fade-in">
    <div class="modal-header">
      <h2>Register New Endpoint</h2>
      <button class="close-btn" on:click={() => dispatch('close')}>&times;</button>
    </div>

    <div class="modal-body">
      <div class="form-group">
        <label for="device-name">Device Name</label>
        <input type="text" id="device-name" bind:value={name} placeholder="e.g. Sales-Laptop-01" />
      </div>

      <div class="form-group">
        <label for="device-type">Device Type</label>
        <select id="device-type" bind:value={type}>
          <option>Workstation</option>
          <option>Laptop</option>
          <option>Server</option>
          <option>Mobile</option>
          <option>IoT Device</option>
        </select>
      </div>

      <div class="form-group">
        <label for="storage">Initial Storage Usage (GB)</label>
        <input type="number" id="storage" bind:value={storage} placeholder="e.g. 50" />
      </div>

      {#if error}
        <p class="error-msg">{error}</p>
      {/if}
    </div>

    <div class="modal-footer">
      <button class="btn btn-outline" on:click={() => dispatch('close')}>Cancel</button>
      <button class="btn btn-primary" on:click={addDevice}>Register Device</button>
    </div>
  </div>
</div>

<style>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(15, 23, 42, 0.4);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal-card {
    width: 500px;
    padding: 2.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    border: 1px solid var(--glass-border);
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .close-btn {
    background: transparent;
    border: none;
    color: var(--text-muted);
    font-size: 1.5rem;
    cursor: pointer;
  }

  .modal-body {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  label {
    font-size: 0.85rem;
    color: var(--text-secondary);
  }

  input, select {
    background: var(--bg-tertiary);
    border: 1px solid var(--border-subtle);
    padding: 0.75rem 1rem;
    border-radius: 10px;
    color: var(--text-primary);
    outline: none;
  }

  select option {
    background: var(--bg-tertiary);
    color: var(--text-primary);
  }

  .error-msg {
    color: #ff3232;
    font-size: 0.8rem;
    font-weight: 500;
  }

  .modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 1rem;
  }
</style>
