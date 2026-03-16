import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';
import { REFRESH_INTERVAL } from '../utils/constants';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [theme, setTheme] = useState('dark');
  const [globalTension, setGlobalTension] = useState(null);

  const fetchDashboard = useCallback(async () => {
    try {
      setError(null);
      const data = await apiService.getDashboard();
      setDashboardData(data);
      setGlobalTension(data.global_tension_index);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
    const interval = setInterval(fetchDashboard, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchDashboard]);

  const value = {
    dashboardData,
    loading,
    error,
    lastUpdated,
    selectedCountry,
    setSelectedCountry,
    theme,
    setTheme,
    globalTension,
    refresh: fetchDashboard,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export default AppContext;
