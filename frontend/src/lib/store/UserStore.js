import { writable } from 'svelte/store';

const STORAGE_KEY = 'cloud_recover_user';

const initialUser = {
  isLoggedIn: false,
  username: '',
  role: ''
};

// Load from localStorage if available
const savedUser = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
const userState = savedUser ? JSON.parse(savedUser) : initialUser;

export const user = writable(userState);

// Sync to localStorage on changes
if (typeof window !== 'undefined') {
  user.subscribe(value => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  });
}

export const login = (username, password) => {
  // Simulate login
  if (username && password) {
    user.set({
      isLoggedIn: true,
      username: username,
      role: 'System Admin'
    });
    return true;
  }
  return false;
};

export const logout = () => {
  user.set(initialUser);
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
};
