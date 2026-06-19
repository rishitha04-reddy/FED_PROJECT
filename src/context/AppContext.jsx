// React Context Provider mapping to CO4: State Architecture, Context API & Lifting State
// Demonstrates global state design patterns, custom hooks, and state reducer patterns.

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [claims, setClaims] = useState([]);
  const [loadingClaims, setLoadingClaims] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  // Toggle Theme
  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const nextTheme = prev === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', nextTheme);
      localStorage.setItem('theme', nextTheme);
      return nextTheme;
    });
  }, []);

  // Initialize theme on mount
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Toast notifications
  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  // Fetch claims using API service
  const fetchClaims = useCallback(async () => {
    setLoadingClaims(true);
    try {
      const fetched = await api.fetchClaims();
      setClaims(fetched);
    } catch (err) {
      console.error(err);
      addToast('Failed to load claims list.', 'danger');
    } finally {
      setLoadingClaims(false);
    }
  }, [addToast]);

  // Initialize claims on mount
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchClaims();
  }, [fetchClaims]);

  // Submit Claim handler
  const submitClaim = useCallback(async (claimData) => {
    try {
      const newClaim = await api.submitClaim(claimData);
      setClaims((prev) => [newClaim, ...prev]);
      addToast(`Claim ${newClaim.id} filed successfully!`, 'success');
      return newClaim.id;
    } catch (err) {
      console.error(err);
      addToast('Failed to submit claim.', 'danger');
      throw err;
    }
  }, [addToast]);

  // Update claim status (Admin action)
  const updateClaimStatus = useCallback(async (claimId, newStatus, commentText) => {
    try {
      const updatedClaim = await api.updateClaimStatus(claimId, newStatus, commentText);
      if (updatedClaim) {
        setClaims((prev) =>
          prev.map((c) => (c.id === claimId ? updatedClaim : c))
        );
        addToast(`Simulated Email Sent: Claim ${claimId} status is now ${newStatus}.`, 'info');
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to update claim status.', 'danger');
    }
  }, [addToast]);

  // Auth: Login
  const login = useCallback(async (email, password) => {
    try {
      const user = await api.login(email, password);
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      addToast('Logged in successfully!', 'success');
    } catch (err) {
      console.error(err);
      addToast(err.message || 'Login failed.', 'warning');
      throw err;
    }
  }, [addToast]);

  // Auth: Logout
  const logout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    addToast('Logged out successfully.', 'info');
  }, [addToast]);

  const value = {
    claims,
    loadingClaims,
    toasts,
    setToasts,
    theme,
    currentUser,
    setCurrentUser,
    fetchClaims,
    submitClaim,
    updateClaimStatus,
    login,
    logout,
    addToast,
    toggleTheme
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
